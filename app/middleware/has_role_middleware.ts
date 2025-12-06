import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

export default class HasRoleMiddleware {
    async handle({ auth, response }: HttpContext, next: () => Promise<void>, roles: string[]) {
        const user      =	await auth.use('api').authenticate()

        if (!user) return ResponseHelper.unauthorized(response,'Unauthorized Access')

        // @ts-ignore
        for (const role of roles) { if (await user.hasRole(role)) return next() }

        return ResponseHelper.forbidden(response, 'Forbidden: Anda Tidak Memiliki Akses')
    }
}
