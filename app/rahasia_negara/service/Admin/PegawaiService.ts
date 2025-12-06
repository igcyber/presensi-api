import { inject } from '@adonisjs/core'

import BaseService from '#IServices/core/BaseService'
import PegawaiRepository from '#IRepositories/Admin/PegawaiRepository'
import { createPegawaiValidator, updatePegawaiValidator } from '#IValidations/Admin/PegawaiValidation'

@inject()
export default class PegawaiService extends BaseService<
    typeof createPegawaiValidator,
    typeof updatePegawaiValidator,
    // @ts-ignore
    PegawaiRepository
> { 
    constructor(repository: PegawaiRepository) {
        super(repository, createPegawaiValidator, updatePegawaiValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async index(request: any): Promise<any> {
        const { search = null, type = null, page = 1, per_page = 10 } = request || {}

		return this.repository.indexData(search, type, page, per_page)
	}

    async allData(request: any): Promise<any> {
        const { search = null } = request || {}

		return this.repository.allData(search)
	}

    async create(data: any): Promise<any> {
        const validated     = await this.createValidator.validate(data)

        const dataPegawai   = {
            tipe_pegawai_id: validated.tipe_pegawai_id,
            kantor_id: validated.kantor_id,
            nama: validated.nama,
            check_radius: validated.check_radius,
            lat: validated.lat,
            long: validated.long
        }

        const dataUser      = {
            no_hp: validated.no_hp,
            email: validated.email,
            username: validated.username,
            password: validated.password
        }

		return this.repository.createData(dataUser, dataPegawai)
	}

    async update(id: number, data: any): Promise<any> {
        const validated = await this.updateValidator.validate({
            ...data,
            id: id
        })

        const dataPegawai   = {
            tipe_pegawai_id: validated.tipe_pegawai_id,
            kantor_id: validated.kantor_id,
            nama: validated.nama,
            check_radius: validated.check_radius,
            lat: validated.lat,
            long: validated.long
        }

        const dataUser      = {
            no_hp: validated.no_hp,
            email: validated.email,
            username: validated.username,
        }

		return this.repository.updateData(id, dataUser, dataPegawai)
	}

    async destroy(id: number): Promise<void> {
		return this.repository.destroyData(id)
	}
}
