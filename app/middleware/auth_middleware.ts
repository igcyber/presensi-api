import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

import hash from '@adonisjs/core/services/hash'
import * as ResponseHelper from '#helpers/ResponseHelper'

import AccessToken from '#models/core/access_token'
import { UserContext } from '#helpers/UserContext'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
	/**
	 * The URL to redirect to, when authentication fails
	 */
	redirectTo = '/login'

	async handle(
		{ auth, response, request }: HttpContext,
		next: NextFn
	) {
		await auth.authenticateUsing(['api'])

		const bearer	=	request.header('authorization')
		const token		=	bearer?.replace('Bearer ', '').trim()

		if (!token) return ResponseHelper.unauthorized(response, 'Penggunaan Token Tidak Valid')

		const user		=	auth.user!
		
		if (!user) return ResponseHelper.unauthorized(response, 'User Tidak Terdeteksi')

		// @ts-ignore
		const tokens	=	await AccessToken.query().where('tokenableId', user.id).where('type', 'refresh')

		let valid		=	false

		for (const t of tokens) {
			if (await hash.verify(t.hash, token)) {
				valid = true

				break
			}
		}

		if (!valid) return ResponseHelper.error(response, 401, 'Token Telah Kadaluarsa', {
			redirect: 'api/auth/refresh-token'
		})

		return UserContext.run(user, () => next())
	}
}