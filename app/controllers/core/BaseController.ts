import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

export default abstract class BaseController<Service> {
    constructor(protected service: Service) {}

    async index({ request, response }: HttpContext) {
        try {
            const { search = null, page = 1, per_page = 10 } =   request.qs()
            const data  =   await (this.service as any).index(search, [], page, per_page)

            return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async findById({ params, response }: HttpContext) {
		try {
            const id    =   Number(params.id)

            if ( Number.isNaN(id) ) {
                return ResponseHelper.badRequest(response, 'Data Tidak Ditemukan')
            }

            const data  =   await (this.service as any).findById(id)

            if ( data ) return ResponseHelper.success(response, 'Berhasil Menampilkan Data', data)

            return ResponseHelper.notFound(response, 'Data Tidak Ditemukan')
        } catch (error: any) {
            if ( error?.code == 404 ) {
                return ResponseHelper.error(response, error.code, error.message)
            }

            return ResponseHelper.badRequest(response, error.message, error)
        }
	}

    async store({ request, response }: HttpContext) {
        try {
            const data      =   await (this.service as any).create(request.body())

            return ResponseHelper.success(response, 'Berhasil Menambahkan Data', data)
        } catch (error: any) {
            if ( error?.code == 500 ) {
                return ResponseHelper.error(response, 500, error.message)
            }

            if (error?.code === 'E_VALIDATION_ERROR') {
                return ResponseHelper.error(response, error?.status ?? 422, error.message, error?.messages ?? [])
            }

            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async update({ params, request, response }: HttpContext) {
        try {
            const id        =   Number(params.id)
            const updated   =   await (this.service as any).update(id, request.body())

            return ResponseHelper.success(response, 'Berhasil Merubah Data', updated)
        } catch (error: any) {
            if ( error?.message == 'Data tidak ditemukan' ) {
                return ResponseHelper.notFound(response, 'Data Tidak Ditemukan')
            }

            if ( error?.code == 500 || error?.code == 412 ) {
                return ResponseHelper.error(response, error.code, error.message)
            }

            if (error?.code === 'E_VALIDATION_ERROR') {
                return ResponseHelper.error(response, error?.status ?? 422, error.message, error?.messages ?? [])
            }

            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async destroy({ params, response }: HttpContext) {
        try {
            const id        =   Number(params.id)

            await (this.service as any).destroy(id)

            return ResponseHelper.success(response, 'Berhasil Menghapus Data')
        } catch (error: any) {
            if ( error.message == 'Data tidak ditemukan' ) {
                return ResponseHelper.notFound(response, 'Data Tidak Ditemukan')
            }

            if ( error?.code == 500 ) {
                return ResponseHelper.error(response, 500, error.message)
            }

            if ( error?.code == 409 ) {
                return ResponseHelper.error(response, 409, error.message)
            }

            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
