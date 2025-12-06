import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

import hash from '@adonisjs/core/services/hash'
import * as ResponseHelper from '#helpers/ResponseHelper'

import AccessToken from '#models/core/access_token'
import { UserContext } from '#helpers/UserContext'

export default class AuthMiddleware {
    async handle(
		{ auth, response, request }: HttpContext,
		next: NextFn
	) {
        try {
            const user      =	await auth.use('api').authenticate()

            const bearer	=	request.header('authorization')
			const token		=	bearer?.replace('Bearer ', '').trim()
            
            if (!token) return ResponseHelper.unauthorized(response, 'Unauthorized Access')

            if (!user) return ResponseHelper.unauthorized(response, 'Token Tidak Valid')

			// @ts-ignore
            const tokens	=	await AccessToken.query().where('tokenableId', user.id).where('type', 'access')

            let valid		=	false
            for (const t of tokens) {
                if (await hash.verify(t.hash, token)) {
                    valid	=	true

                    break
                }
            }            

            if (!valid) return ResponseHelper.error(response, 401, 'Token Telah Kadaluarsa / di-revoke', {
				redirect: 'api/auth/refresh-token'
			})

            return UserContext.run(user, () => next())
        } catch (err: any) {
            return ResponseHelper.unauthorized(response, 'Unauthorized Access')
        }
    }
}