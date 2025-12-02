import { inject } from '@adonisjs/core'

// Jika Custom Nyalakan Ini
import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import BaseController from '#controllers/core/BaseController'
import PwaVersionService from '#IServices/Admin/PwaVersionService'

@inject()
export default class PwaVersionController extends BaseController<PwaVersionService> {
    constructor(service: PwaVersionService) {
        super(service)
    }

    // override di sini jika mau custom atau menambahkan method
    async index({ request, response }: HttpContext) {
        try {
            const { search = null, page = 1, per_page = 10 } =   request.qs()
            const data  =   await (this.service as any).index(search, [ 'version', 'key' ], page, per_page)

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async latest({ response }: HttpContext) {
        try {
            const data      =   await (this.service as any).latest()

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data Terakhir', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
