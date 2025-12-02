import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import DashboardService from '#IServices/Admin/DashboardService'
import BaseController from '#controllers/core/BaseController'

@inject()
export default class DashboardController extends BaseController<DashboardService> {
    constructor(service: DashboardService) {
        super(service)
    }

    // override di sini jika mau custom atau menambahkan method
    async summary({ request, response }: HttpContext) {
        try {
            const data  =   await (this.service as any).summary(request.qs())

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async chart({ request, response }: HttpContext) {
        try {
            const data  =   await (this.service as any).chart(request.qs())

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async daily({ request, response }: HttpContext) {
        try {
            const data  =   await (this.service as any).daily(request.qs())

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
