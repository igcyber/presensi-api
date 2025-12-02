import { inject } from '@adonisjs/core'

import BaseService from '#IServices/core/BaseService'
import PwaVersionRepository from '#IRepositories/Admin/PwaVersionRepository'
import { createPwaVersionValidator, updatePwaVersionValidator } from '#IValidations/Admin/PwaVersionValidation'

@inject()
export default class PwaVersionService extends BaseService<
    typeof createPwaVersionValidator,
    typeof updatePwaVersionValidator,
    // @ts-ignore
    PwaVersionRepository
> { 
    constructor(repository: PwaVersionRepository) {
        super(repository, createPwaVersionValidator, updatePwaVersionValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async index( search: string | null = null, searchableColumns: string[] = [], page: number = 1, per_page: number = 10
	): Promise<any> {
		return this.repository.index(search, searchableColumns, page, per_page)
	}

    async latest(): Promise<any> {
        const data          =   await this.repository.latest()

        return data ? {
            version: data?.version,
            key: data?.key,
        } : null
	}

    async create(data: any): Promise<any> {
        const validated     =   await this.createValidator.validate(data)

        const random        =   Math.random().toString(36).substring(2, 10)
        const timestamp     =   Date.now()

		return this.repository.create({
            ...validated,
            key: `${random}-${timestamp}`
        })
	}
}
