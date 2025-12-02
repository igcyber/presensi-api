import { inject } from '@adonisjs/core'

import BaseService from '#IServices/core/BaseService'
import RiwayatAbsenRepository from '#IRepositories/Pegawai/RiwayatAbsenRepository'

import { createRiwayatAbsenValidator, updateRiwayatAbsenValidator } from '#IValidations/Pegawai/RiwayatAbsenValidation'
import { getTanggal } from '#helpers/GlobalHelper'
import { UserContext } from '#helpers/UserContext'

@inject()
export default class RiwayatAbsenService extends BaseService<
    typeof createRiwayatAbsenValidator,
    typeof updateRiwayatAbsenValidator,
    // @ts-ignore
    RiwayatAbsenRepository
> { 
    constructor(repository: RiwayatAbsenRepository) {
        super(repository, createRiwayatAbsenValidator, updateRiwayatAbsenValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async index(data: any): Promise<any> {
        const user          =   UserContext.get()
        const validated     =   await this.createValidator.validate({
            ...data,
            pegawai_id: user.pegawai_id
        })

        const tanggal       =   await getTanggal(validated.date)

        return await this.repository.indexData(user.pegawai_id, tanggal)
    }
}
