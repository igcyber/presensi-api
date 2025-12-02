import { inject } from '@adonisjs/core'
// Jika Custom Nyalakan Ini
// import type { HttpContext } from '@adonisjs/core/http'

import BaseService from '#IServices/core/BaseService'
import HariLiburRepository from '#IRepositories/Admin/HariLiburRepository'
import { createHariLiburValidator, updateHariLiburValidator } from '#IValidations/Admin/HariLiburValidation'

@inject()
export default class HariLiburService extends BaseService<
    typeof createHariLiburValidator,
    typeof updateHariLiburValidator,
    // @ts-ignore
    HariLiburRepository
> { 
    constructor(repository: HariLiburRepository) {
        super(repository, createHariLiburValidator, updateHariLiburValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async index(request: any): Promise<any> {
        const { search = null, date = null, page = 1, per_page = 10 } = request || {}

		return this.repository.indexData(search, date, page, per_page)
	}

    async create(data: any): Promise<any> {
        const validated     = await this.createValidator.validate(data)

        return this.repository.createData(validated)
	}

    async update(id: number, data: any): Promise<any> {
        const validated = await this.updateValidator.validate({
            ...data,
            hari_libur_id: id
        })

		return this.repository.updateData(id, validated)
	}

    async destroy(id: number): Promise<void> {
		return this.repository.destroyData(id)
	}
}
