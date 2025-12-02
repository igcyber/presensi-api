import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import RekapAbsenService from '#IServices/Admin/RekapAbsenService'
import BaseController from '#controllers/core/BaseController'

@inject()
export default class RekapAbsenController extends BaseController<RekapAbsenService> {
    constructor(service: RekapAbsenService) {
        super(service)
    }
    
    // override di sini jika mau custom atau menambahkan method
    async rekapData({ request, response }: HttpContext) {
        try {
            const data      =   await (this.service as any).rekapData(request.qs())

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
