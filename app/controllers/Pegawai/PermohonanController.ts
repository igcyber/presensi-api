import { inject } from '@adonisjs/core'

// Jika Custom Nyalakan Ini
import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import BaseController from '#controllers/core/BaseController'
import PermohonanService from '#IServices/Pegawai/PermohonanService'

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

    async statusPermohonan({ request, response }: HttpContext) {
        try {
            const data      =   await (this.service as any).statusPermohonan(request.qs())

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
