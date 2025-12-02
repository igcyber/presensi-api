import { inject } from '@adonisjs/core'

import BaseService from '#IServices/core/BaseService'
import PermohonanRepository from '#IRepositories/Admin/PermohonanRepository'
import { createPermohonanValidator, updatePermohonanValidator, verifyPermohonanValidator } from '#IValidations/Admin/PermohonanValidation'
import { UserContext } from '#helpers/UserContext'

@inject()
export default class PermohonanService extends BaseService<
    typeof createPermohonanValidator,
    typeof updatePermohonanValidator,
    // @ts-ignore
    PermohonanRepository
> { 
    constructor(repository: PermohonanRepository) {
        super(repository, createPermohonanValidator, updatePermohonanValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async index(request: any): Promise<any> {
        const { search = null, tipe = null, status = null, date = null, page = 1, per_page = 10 } = request || {}

		return this.repository.indexData(search, tipe, status, date, page, per_page)
	}

    async findById(id: number): Promise<any | null> {
        return this.repository.findById(id)
	}

    async verify(id: number, data: Partial<any>): Promise<any | null> {
        const validated: any = {
            ...(await verifyPermohonanValidator.validate(data)),
            tanggal_verifikator: new Date().toLocaleString('sv-SE'),
            verifikator_id: UserContext.get().id
        }

        return this.repository.verify(id, validated)
	}
}
