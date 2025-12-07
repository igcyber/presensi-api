import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import BaseController from '#controllers/core/BaseController'
import PublicService from '#IServices/Public/PublicService'

@inject()
export default class PublicController extends BaseController<PublicService> {
    constructor(service: PublicService) {
        super(service)
    }

    public async getFile({ params, response }: HttpContext) {
        try {
            const filePath     =  await this.service.getFile(params['*'])

            return response.download(filePath)
        } catch (error) {
            if ( error?.code === 404 ) return ResponseHelper.error(response, error.code, error.message)

            return ResponseHelper.serverError(response, 'Gagal Mendapatkan File')
        }
    }

    async pwaLatest({ response }: HttpContext) {
        try {
            const data      =   await (this.service as any).pwaLatest()

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data Terakhir', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
