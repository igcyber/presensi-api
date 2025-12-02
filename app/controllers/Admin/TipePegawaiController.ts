import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import BaseController from '#controllers/core/BaseController'
import TipePegawaiService from '#IServices/Admin/TipePegawaiService'

@inject()
export default class TipePegawaiController extends BaseController<TipePegawaiService> {
    constructor(service: TipePegawaiService) {
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
