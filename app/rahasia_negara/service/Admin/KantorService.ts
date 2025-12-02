import { inject } from '@adonisjs/core'

import BaseService from '#IServices/core/BaseService'
import KantorRepository from '#IRepositories/Admin/KantorRepository'
import { createKantorValidator, updateKantorValidator } from '#IValidations/Admin/KantorValidation'

@inject()
export default class KantorService extends BaseService<
    typeof createKantorValidator,
    typeof updateKantorValidator,
    // @ts-ignore
    KantorRepository
> { 
    constructor(repository: KantorRepository) {
        super(repository, createKantorValidator, updateKantorValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async index(request: any): Promise<any> {
        const { search = null, page = 1, per_page = 10 } = request || {}

		return this.repository.indexData(search, page, per_page)
	}

    async create(data: any): Promise<any> {
        const validated     = await this.createValidator.validate(data)

        const dataKantor   = {
            nama: validated.nama,
            alamat: validated.alamat,
            lat: validated.lat,
            long: validated.long,
            deskripsi: validated.deskripsi,
            radius_limit: validated.radius_limit,
            jam_masuk: validated.jam_masuk,
            jam_pulang: validated.jam_pulang,
            except_user: []
        }

		return this.repository.createData(dataKantor)
	}

    async update(id: number, data: any): Promise<any> {
        const validated = await this.updateValidator.validate(data)

        const dataKantor   = {
            nama: validated.nama,
            alamat: validated.alamat,
            lat: validated.lat,
            long: validated.long,
            deskripsi: validated.deskripsi,
            radius_limit: validated.radius_limit,
            jam_masuk: validated.jam_masuk,
            jam_pulang: validated.jam_pulang,
        }

		return this.repository.updateData(id, dataKantor)
	}

    async destroy(id: number): Promise<void> {
		return this.repository.destroyData(id)
	}
}
