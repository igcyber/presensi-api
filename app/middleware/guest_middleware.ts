import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

export default class GuestMiddleware {
	async handle({ auth, response, request }: HttpContext, next: NextFn) {
		try {
			const authHeader	=	request.header('authorization')
            if (!authHeader) return next()

            const token			=	authHeader.replace('Bearer ', '').trim()
            if (!token) return next()

            // @ts-ignore
            const user			=	await auth.use('api').authenticate()

			if ( user ) return ResponseHelper.forbidden(response, 'Anda sudah login.')			
		} catch (error) {
			// Invalid Dianggap Guest ajalah
		}

		return next()
	}
}
