import BaseService from '#IServices/core/BaseService'
import SampleRepository from '#IRepositories/sample/SampleRepository'

import { inject } from '@adonisjs/core'
// @ts-ignore
import type { HttpContext } from '@adonisjs/core/http'

import { createSampleValidator, updateSampleValidator } from '#IValidations/sample/SampleValidation'

@inject()
export default class SampleService extends BaseService<
    typeof createSampleValidator,
    typeof updateSampleValidator,
    SampleRepository
> {
    constructor(repository: SampleRepository) {
        super(repository, createSampleValidator, updateSampleValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService

    // Contoh Fungsi Baru
    // public async listAllSample(): Promise<Sample[]> {
    //     return this.repository.getAll()
    // }

    // Contoh Override Fungsi Pada BaseService
    // public async create(data: HttpContext['request']): Promise<Sample> {
    //     const payload   =   await data.validateUsing(createSampleValidator)
    //     return this.repository.create(payload);
    // }
}
