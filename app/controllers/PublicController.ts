import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs'
import path from 'path'
import app from '@adonisjs/core/services/app'
import * as ResponseHelper from '#helpers/ResponseHelper'

export default class PublicController {
    public async getFile({ params, response }: HttpContext) {
        try {
            const relativePath =  params['*']
            const filePath     =  path.join(app.makePath('storage'), relativePath.join('/'))

            if (!fs.existsSync(filePath)) return ResponseHelper.notFound(response, 'File Tidak Ditemukan')

            return response.download(filePath)
        } catch (error) {
            return ResponseHelper.serverError(response, 'Gagal Mendapatkan File')
        }
    }
}
