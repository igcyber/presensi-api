import { inject } from '@adonisjs/core'
import fs from 'fs'

import { dateToMillisLocal, getDays, getTanggal, getTanggalFormatTimeStamp } from '#helpers/GlobalHelper'

import BaseService from '#IServices/core/BaseService'
import PermohonanRepository from '#IRepositories/Pegawai/PermohonanRepository'
import { createPermohonanValidator, filterPermohonanValidator, updatePermohonanValidator } from '#IValidations/Pegawai/PermohonanValidation'

import { UserContext } from '#helpers/UserContext'
import { FileHelper } from '#helpers/FileHelpers'

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
        const {
            search = null,
            status = 'Semua Status',
            tipe = 'Semua Tipe',
            date = null,
            page = 1,
            per_page = 20
        } : {
            search: string | null
            status: string
            tipe: string
            date: string | null
            page: number
            per_page: number
        } = request

        let tanggal        =   null

        if ( date) tanggal = getTanggal(date) 
        else tanggal = getDays('monthly')

        const user          =   UserContext.get()

        const validated: any =   await filterPermohonanValidator.validate({
            search,
            status,
            tipe,
            date: tanggal.awal,
            pegawai_id: user.pegawai_id
        })

        delete validated.date

        return await this.repository.indexData({
            ...validated,
            awal: tanggal.awal,
            akhir: tanggal.akhir,
        }, page, per_page)
    }

    async statusPermohonan(): Promise<any> {
        const user          =   UserContext.get()
        const tanggal       =   await getTanggal()

        const lPermohonan   =   await this.repository.checkData({
            pegawai_id: user.pegawai_id,
            awal: tanggal.awal,
            akhir: tanggal.akhir
        }, false)

        const fPermohonan   =   lPermohonan.filter(
            (item: any) => dateToMillisLocal(
                getTanggalFormatTimeStamp(item.tanggal_pengajuan)
            ) >= dateToMillisLocal(tanggal.akhir)
        )

        return fPermohonan[0] || null
    }

    async create(data: any): Promise<any> {
        const folderName    =   'permohonan'
        const user          =   UserContext.get()

        await this.createValidator.validate({
            ...data,
            pegawai_id: user.pegawai_id
        })

        const vData: any = {
            pegawai_id: user.pegawai_id,
            tipe: data.tipe,
            tanggal_pengajuan: getTanggalFormatTimeStamp(data.tanggal_pengajuan),
            keterangan_pengajuan: data.keterangan_pengajuan,
            file_pendukung: data.file_pendukung
        }

        const tanggal           =   await getTanggal(data.tanggal_pengajuan)
        const checkPermohonan   =   await this.repository.checkData({
            pegawai_id: vData.pegawai_id,
            awal: tanggal.awal,
            akhir: tanggal.akhir
        })

        if ( checkPermohonan.length ) {
            throw {
                code: 'E_VALIDATION_ERROR',
                message: `Pegawai sudah pernah melakukan pengajuan permohonan tidak hadir pada tanggal : ${data.tanggal_pengajuan}`
            }
        }

        const fileName              =   `${user.id}_${Date.now()}.${vData.file_pendukung.extname}`

        try {
            const imageBuffer       =   await fs.promises.readFile(data.file_pendukung.tmpPath)
            vData.file_pendukung    =   fileName

            await FileHelper.putFile(
                folderName,
                fileName,
                imageBuffer,
                0o755
            )

            return this.repository.createData(vData)
        } catch (error) {
            try {
                const exists    =   await FileHelper.fileExists(folderName, fileName)

                if (exists) await FileHelper.deleteFile(folderName, fileName)
            } catch (e) {}

            throw {
                message: error.message
            }
        }
    }
}
