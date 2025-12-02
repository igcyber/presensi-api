import { inject } from '@adonisjs/core'

import BaseService from '#IServices/core/BaseService'
import TipePegawaiRepository from '#IRepositories/Admin/TipePegawaiRepository'
import { createTipePegawaiValidator, updateTipePegawaiValidator } from '#IValidations/Admin/TipePegawaiValidation'

@inject()
export default class TipePegawaiService extends BaseService<
    typeof createTipePegawaiValidator,
    typeof updateTipePegawaiValidator,
    TipePegawaiRepository
> { 
    constructor(repository: TipePegawaiRepository) {
        super(repository, createTipePegawaiValidator, updateTipePegawaiValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async index(request: any): Promise<any> {
        const { search, page = 1, per_page = 10 } = request || {}

		return this.repository.index(search, [ 'nama' ], page, per_page)
	}

    async allData(): Promise<any> {
		return this.repository.allData()
	}
}
