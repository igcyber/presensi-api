import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import PegawaiService from '#IServices/Admin/PegawaiService'
import BaseController from '#controllers/core/BaseController'

@inject()
export default class PegawaiController extends BaseController<PegawaiService> {
    constructor(service: PegawaiService) {
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

    async allData({ response }: HttpContext) {
        try {
            const data      =   await (this.service as any).allData()

            return ResponseHelper.success(response, 'Berhasil Menampilkan Seluruh Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
