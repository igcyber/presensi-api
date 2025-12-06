import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

export default class HasPermissionMiddleware {
    async handle({ auth, response }: HttpContext, next: () => Promise<void>, permissions: string[]) {
        const user      =	await auth.use('api').authenticate()

        if (!user) return ResponseHelper.unauthorized(response,'Unauthorized Access')

        // @ts-ignore
        for (const permission of permissions) { if (await user.hasPermission(permission)) return next() }

        return ResponseHelper.forbidden(response, 'Forbidden: Anda Tidak Memiliki Akses')
    }
}
