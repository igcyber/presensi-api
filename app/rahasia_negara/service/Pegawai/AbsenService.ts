import { inject } from '@adonisjs/core'
import fs from 'fs'

import { createAbsenValidator, updateAbsenValidator } from '#IValidations/Pegawai/AbsenValidation'
import { UserContext } from '#helpers/UserContext'
import { getDays, getTanggalFormatTimeStamp, isWeekend } from '#helpers/GlobalHelper'
import { FaceApiHelpers } from '#helpers/FaceApiHelpers'
import { FileHelper } from '#helpers/FileHelpers'

import BaseService from '#IServices/core/BaseService'
import AbsenRepository from '#IRepositories/Pegawai/AbsenRepository'

@inject()
export default class AbsenService extends BaseService<
    typeof createAbsenValidator,
    typeof updateAbsenValidator,
    // @ts-ignore
    AbsenRepository
> { 
    constructor(repository: AbsenRepository) {
        super(repository, createAbsenValidator, updateAbsenValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    // @ts-ignore
    async index(request: any): Promise<any> {
        const user          =   UserContext.get()

        const data          =   {
            pegawai_id: user.pegawai_id,
            awal: getDays().awal,
            akhir: getDays().akhir
        }

        const kantor        =   await this.repository.getKantor(user.kantor_id)

        return {
            riwayat: await this.repository.indexData(data),
            kantor: kantor ? {
                id: kantor.id,
                nama: kantor.nama,
                alamat: kantor.alamat,
                lat: kantor.lat,
                long: kantor.long,
                deskripsi: kantor.deskripsi,
                radius_limit: kantor.radius_limit,
                except_user: kantor.except_user.includes( user.pegawai_id ),
                jam_masuk: kantor.jam_masuk,
                jam_pulang: kantor.jam_pulang
            } : null
        }
	}

    async create(data: any): Promise<any> {
        const folderName    =   'absensi'
        const user          =   UserContext.get()

        await this.createValidator.validate({
            ...data,
            pegawai_id: user.pegawai_id
        })

        if ( isWeekend() ) {
            data.tipe   =   data.tipe === 'MASUK' ? 'MASUK_LEMBUR' : ( data.tipe === 'PULANG' ? 'PULANG_LEMBUR' : data.tipe)
        }

        const dataItem      =   {
            pegawai_id: user.pegawai_id,
            awal: getDays().awal,
            akhir: getDays().akhir
        }

        const permohonan        =   await this.repository.getPermohonan(user.pegawai_id)
        const riwayat           =   await this.repository.indexData(dataItem)
        const kantor            =   await this.repository.getKantor(user.kantor_id)

        const dataPermohonan    =   permohonan.find(
            (ps: any) => ps.status === 'pending' && getTanggalFormatTimeStamp(ps.tanggal_pengajuan, false) === getTanggalFormatTimeStamp(dataItem.awal, false)
        )

        if ( dataPermohonan && ['diterima','ditolak'].includes(dataPermohonan.status) ) {
            throw {
                code: 'E_VALIDATION_ERROR',
                message: 'Pegawai Tidak Dapat Absen Karena Permohonan Sudah Diverifikasi'
            }
        }

        if (!kantor) {
            throw {
                code: 'E_VALIDATION_ERROR',
                message: 'Pegawai Tidak Terdaftar Pada Kantor Manapun'
            }
        }

        const checkTipe     =   ['IZIN', 'SAKIT', 'CUTI', 'LIBUR']
        const tipeKetemu    =   riwayat.find((rw: any) => checkTipe.includes(rw.tipe))

        if (tipeKetemu) {
            throw {
                code: 'E_VALIDATION_ERROR',
                message: `Pegawai tidak dapat melakukan absensi karena status hari ini adalah: ${tipeKetemu.tipe}`
            }
        }

        if ( (data.tipe === 'PULANG' || data.tipe === 'PULANG_LEMBUR') && !riwayat.some((rw: any) => rw.tipe === 'MASUK' || rw.tipe === 'MASUK_LEMBUR') ) {
            throw {
                code: 'E_VALIDATION_ERROR',
                message: `Pegawai belum melakukan absensi MASUK`
            }
        }

        if ( riwayat.some((item: any) => item.tipe === data.tipe) ) {
            throw {
                code: 'E_VALIDATION_ERROR',
                message: `Pegawai Sudah Melakukan Absensi ${data.tipe}`
            }
        }

        if ( kantor.except_user.includes( dataItem.pegawai_id ) === false ) {
            if (data.jarak > kantor.radius_limit) {
                throw {
                    code: 'E_VALIDATION_ERROR',
                    message: `Jarak Pegawai Melebihi Radius Kantor : ${kantor.radius_limit} meter`
                }
            }
        }

        const fotoPegawai   =   await this.repository.checkFaceId(user.pegawai_id)

        if (!fotoPegawai) {
            throw {
                code: 403,
                message: 'Pegawai Belum Mendaftarkan Face ID'
            }
        }

        const imageBuffer   =   await fs.promises.readFile(data.image.tmpPath)
        const safeBuffer    =   Buffer.from(imageBuffer)

        const hasil         =   await FaceApiHelpers.matchSavedDescriptor(
            JSON.parse(fotoPegawai.descriptor),
            // @ts-ignore
            safeBuffer,
            0.48
        )

        if (hasil && hasil.matched) {
            const fileName      =   `${user.id}_${Date.now()}.${data.image.extname}`

            const imageBuffer       =   await fs.promises.readFile(data.image.tmpPath)

            await FileHelper.putFile(
                folderName,
                fileName,
                imageBuffer,
                0o755
            )

            try {
                const sendData  =   {
                ...data,
                    pegawai_id: user.pegawai_id,
                    foto: fileName || null,
                    tanggal_absen: new Date().toLocaleString('sv-SE'),
                    akurasi: data.jarak
                }
        
                delete sendData.jarak
                delete sendData.image

                return this.repository.createData(sendData, dataPermohonan)
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

        throw {
            code: 500,
            message: 'Foto Wajah Tidak Sesuai'
        }
	}
}
