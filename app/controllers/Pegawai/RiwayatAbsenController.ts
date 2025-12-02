import { inject } from '@adonisjs/core'

// Jika Custom Nyalakan Ini
import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import BaseController from '#controllers/core/BaseController'
import RiwayatAbsenService from '#IServices/Pegawai/RiwayatAbsenService'

@inject()
export default class RiwayatAbsenController extends BaseController<RiwayatAbsenService> {
    constructor(service: RiwayatAbsenService) {
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
}
