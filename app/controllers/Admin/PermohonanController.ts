import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import PermohonanService from '#IServices/Admin/PermohonanService'
import BaseController from '#controllers/core/BaseController'

@inject()
export default class PermohonanController extends BaseController<PermohonanService> {
    constructor(service: PermohonanService) {
        super(service)
    }

    // override di sini jika mau custom atau menambahkan method
    async index({ request, response }: HttpContext) {
        try {
            const data      =   await (this.service as any).index(request.qs())

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async verify({ params, request, response }: HttpContext) {
        try {
            const id        =   Number(params.id)
            const data      =   await (this.service as any).verify(id, request.body())

            return ResponseHelper.success(response, 'Berhasil Memverifikasi Permohonan', data)
        } catch (error: any) {
            if ( error?.code == 409 ) {
                return ResponseHelper.error(response, 409, error.message)
            }

            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
