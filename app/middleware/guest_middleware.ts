import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

export default class GuestMiddleware {
	async handle({ auth, response }: HttpContext, next: NextFn) {
		try {
			const isLoggedIn	=	await auth.authenticateUsing(['api'])

			if (isLoggedIn) return ResponseHelper.forbidden(response, 'Anda sudah login.')
		} catch {
			// Invalid Dianggap Guest ajalah
		}

		return next()
	}
}
