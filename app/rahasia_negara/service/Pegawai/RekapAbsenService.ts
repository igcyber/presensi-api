import { inject } from '@adonisjs/core'

import BaseService from '#IServices/core/BaseService'
import RekapAbsenRepository from '#IRepositories/Pegawai/RekapAbsenRepository'
import { createRekapAbsenValidator, updateRekapAbsenValidator } from '#IValidations/Pegawai/RekapAbsenValidation'

import { isWeekend, selisihHari } from '#helpers/GlobalHelper'
import { UserContext } from '#helpers/UserContext'

@inject()
export default class RekapAbsenService extends BaseService<
    typeof createRekapAbsenValidator,
    typeof updateRekapAbsenValidator,
    // @ts-ignore
    RekapAbsenRepository
> { 
    constructor(repository: RekapAbsenRepository) {
        super(repository, createRekapAbsenValidator, updateRekapAbsenValidator)
    }

    async getData(pegawai_id: number, item: any) {
        let awal: any, akhir: any       =   null

        if (item.tipe == 'bulanan') {
            const sekarang  =   new Date(`${item.year}-${item.month}-01`)
            awal            =   new Date(sekarang.getFullYear(), sekarang.getMonth(), 1)
            akhir           =   new Date(sekarang.getFullYear(), sekarang.getMonth() + 1, 0)
        } else {
            awal    =   new Date(item.start_date)
            akhir   =   new Date(item.end_date)
        }

        awal    = awal.toLocaleDateString('sv-SE') + " 00:00:00"
        akhir   = akhir.toLocaleDateString('sv-SE') + " 23:59:59"

        const data: Record<string, any>	=	{
            awal,
            akhir
        }

        const result            =   await this.repository.rekapData(pegawai_id, data)

        delete data.dAwal
        delete data.dAkhir

        return {
            data,
            absen: result
        }
    }

    mapAbsen(absen: any) {
        const groupResult: Record<string, any[]>	=	{}
		for (const dQuery of absen) {
			const splitTanggal	=	String(dQuery.tanggal_absen).split('T')
			const tanggal		=	splitTanggal[0]

			if (!groupResult[tanggal]) groupResult[tanggal] = []

			let jam				=	String(splitTanggal[1]).split('.')[0]

			groupResult[tanggal].push({
                pegawai_id: dQuery.pegawai_id,
				foto: dQuery.foto,
                foto_url: dQuery.foto_url,
				tipe: dQuery.tipe,
				jam: jam,
				lat: dQuery.lat,
				long: dQuery.long,
				akurasi: dQuery.akurasi
			})
		}

        return groupResult
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async rekapData(data: any): Promise<any> {
        const user          =   UserContext.get()
        const validated     =   await this.createValidator.validate({
            ...data,
            pegawai_id: user.pegawai_id
        })

        const getData       =   await this.getData(user.pegawai_id, validated)

        const groupResult   =   this.mapAbsen(getData.absen)

        let   jumlahHari    =   selisihHari(getData)
        jumlahHari          =   jumlahHari == 0 ? 1 : (jumlahHari + 1)

		const selesai: Record<string, any> = {}
        const tanggalAwal       = new Date(getData.data.awal.split(' ')[0])

        for (let i = 0; i < jumlahHari; i++) {
            const tanggalSekarang   =   new Date(tanggalAwal)
            tanggalSekarang.setDate(tanggalAwal.getDate() + i)

            const key               =   tanggalSekarang.toISOString().split('T')[0]
            const dataAbsen         =   groupResult[key] ?? []

            let status              =   isWeekend(key) ? "Tanggal Merah" : "Tanpa Keterangan"

            if (dataAbsen.length) {
                const hasMasuk      =   dataAbsen.some(a => a.tipe === "MASUK" || a.tipe === "MASUK_LEMBUR")
                const hasIzin       =   dataAbsen.some(a => a.tipe === "IZIN")
                const hasLibur      =   dataAbsen.some(a => a.tipe === "LIBUR")

                if (hasMasuk) status        = isWeekend(key) ? "Lembur" : "Hadir"
                else if (hasIzin) status    = "Izin"
                else if (hasLibur) status   = "Libur"
            }

            selesai[i] = {
                tanggal: key,
                status,
                data_absen: dataAbsen,
            }
        }

        return {
            pegawai: {
                nama: user.nama,
                tipe_pegawai: user.tipe_pegawai
            },
            periode: getData.data,
            detail: selesai
        }
	}
}
