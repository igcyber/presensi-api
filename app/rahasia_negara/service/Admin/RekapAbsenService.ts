import { inject } from '@adonisjs/core'

import BaseService from '#IServices/core/BaseService'
import RekapAbsenRepository from '#IRepositories/Admin/RekapAbsenRepository'
import { createRekapAbsenValidator, updateRekapAbsenValidator } from '#IValidations/Admin/RekapAbsenValidation'

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

    dateToMillisLocal (dateString: string) {
        const [year, month, day] = dateString.split('-').map(Number)

        return new Date(year, month - 1, day, 0, 0, 0, 0).getTime()
    }

    isWeekend(tanggal: string) {
        const d = new Date(tanggal).getDay()
        return d === 0 || d === 6
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async rekapData(data: any): Promise<any> {
        const validated     = await this.createValidator.validate(data)

        if ( data.tipe == 'bulanan' ) {
			const now		=	new Date(`${data.year}-${data.month}-01`)
			const firstDay	=	new Date(now.getFullYear(), now.getMonth(), 1)
			const lastDay	=	new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

			var awal		=	firstDay.toLocaleString('sv-SE').replace('T', ' ')
			var akhir		=	lastDay.toLocaleString('sv-SE').replace('T', ' ')
		} else {
			var awal		=	new Date(data.start_date + 'T00:00:00').toLocaleString('sv-SE').replace('T', ' ')
			var akhir		=	new Date(data.end_date + 'T23:59:59').toLocaleString('sv-SE').replace('T', ' ')
		}

		const result        =   await this.repository.rekapData({ ...validated, awal, akhir })
        const absen         =   await result.absen
        const pegawai       =   await result.pegawai

        const groupResult: Record<string, any[]>	=	{}
		for (const dQuery of absen) {
			const splitTanggal	=	String(dQuery.tanggal_absen).split('T')
			const tanggal		=	splitTanggal[0]

			if (!groupResult[tanggal]) groupResult[tanggal] = []

			let jam				=	String(splitTanggal[1]).split('.')[0]

            if (dQuery.pegawai_id != data.pegawai_id) continue

			groupResult[tanggal].push({
				foto: dQuery.foto,
                foto_url: dQuery.foto_url,
				tipe: dQuery.tipe,
				jam: jam,
				lat: dQuery.lat,
				long: dQuery.long,
				akurasi: dQuery.akurasi
			})
		}

        const selisihHari   =   Math.abs(this.dateToMillisLocal(String(awal.split(' ')[0])) - this.dateToMillisLocal(String(akhir.split(' ')[0])))
        const jumlahHari    =   selisihHari / (1000 * 60 * 60 * 24)

		const selesai: Record<string, any> = {}
        const tanggalAwal   =   new Date(awal.split(' ')[0])

        for (let i = 0; i <= jumlahHari; i++) {
            const tanggalSekarang   =   new Date(tanggalAwal)
            tanggalSekarang.setDate(tanggalAwal.getDate() + i)

            const key               =   tanggalSekarang.toISOString().split('T')[0]
            const dataAbsen         =   groupResult[key] ?? []

            let status              =   this.isWeekend(key) ? "Tanggal Merah" : "Tanpa Keterangan"

            if (dataAbsen.length) {
                const hasMasuk      =   dataAbsen.some(a => a.tipe === "MASUK" || a.tipe === "MASUK_LEMBUR")
                const hasIzin       =   dataAbsen.some(a => a.tipe === "IZIN")
                const hasLibur      =   dataAbsen.some(a => a.tipe === "LIBUR")

                if (hasMasuk) status        = this.isWeekend(key) ? "Lembur" : "Hadir"
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
                nama: pegawai?.nama,
                tipePegawai: pegawai?.tipePegawai?.nama,
            },
			periode: {
				start_date: awal.split(' ')[0],
				end_date: akhir.split(' ')[0],
				tipe: data.tipe
			},
			detail_harian: selesai
		}
	}
}
