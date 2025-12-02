import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import ProfileService from '#IServices/Setting/ProfileService'
import BaseController from '#controllers/core/BaseController'

@inject()
export default class ProfileController extends BaseController<ProfileService> {
    constructor(service: ProfileService) {
        super(service)
    }
    
    // override di sini jika mau custom atau menambahkan method
    async index({ response }: HttpContext) {
        try {
            const data      =   await (this.service as any).indexData()

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async updateProfile({ request, response }: HttpContext) {
        try {
            const updated   =   await (this.service as any).updateProfile(request.body())

            return ResponseHelper.success(response, 'Berhasil Merubah Data', updated)
        } catch (error: any) {
            if ( error?.message == 'Data tidak ditemukan' ) {
                return ResponseHelper.notFound(response, 'Data Tidak Ditemukan')
            }

            if ( error?.code == 500 ) {
                return ResponseHelper.error(response, 500, error.message)
            }

            if (error?.code === 'E_VALIDATION_ERROR') {
                return ResponseHelper.error(response, error?.status ?? 422, error.message, error?.messages ?? [])
            }

            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async updatePassword({ request, response }: HttpContext) {
        try {
            const updated   =   await (this.service as any).updatePassword(request.body())

            return ResponseHelper.success(response, 'Berhasil Merubah Data', updated)
        } catch (error: any) {
            if ( error?.message == 'Data tidak ditemukan' ) {
                return ResponseHelper.notFound(response, 'Data Tidak Ditemukan')
            }

            if ( error?.code == 500 ) {
                return ResponseHelper.error(response, 500, error.message)
            }

            if (error?.code === 'E_VALIDATION_ERROR') {
                return ResponseHelper.error(response, error?.status ?? 422, error.message, error?.messages ?? [])
            }

            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async updateFaceId({ request, response }: HttpContext) {
        try {
            const updated   =   await (this.service as any).updateFaceId(request.body())

            return ResponseHelper.success(response, 'Berhasil Mendaftarkan Face ID', updated)
        } catch (error: any) {
            if ( error?.message == 'Data tidak ditemukan' ) {
                return ResponseHelper.notFound(response, 'Data Tidak Ditemukan')
            }

            if ( error?.code == 500 ) {
                return ResponseHelper.error(response, 500, error.message)
            }

            if (error?.code === 'E_VALIDATION_ERROR') {
                return ResponseHelper.error(response, error?.status ?? 422, error.message, error?.messages ?? [])
            }

            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async checkFaceId({ response }: HttpContext) {
        try {
            const updated   =   await (this.service as any).checkFaceId()

            return ResponseHelper.success(response, 'Berhasil Menampilkan Status Face ID', updated)
        } catch (error: any) {
            if ( error?.message == 'Data tidak ditemukan' ) {
                return ResponseHelper.notFound(response, 'Data Tidak Ditemukan')
            }

            if ( error?.code == 500 ) {
                return ResponseHelper.error(response, 500, error.message)
            }

            if (error?.code === 'E_VALIDATION_ERROR') {
                return ResponseHelper.error(response, error?.status ?? 422, error.message, error?.messages ?? [])
            }

            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
