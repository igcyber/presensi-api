import { inject } from '@adonisjs/core'
// Jika Custom Nyalakan Ini
// import type { HttpContext } from '@adonisjs/core/http'

import BaseService from '#IServices/core/BaseService'
import DashboardRepository from '#IRepositories/Admin/DashboardRepository'
import { createDashboardValidator, updateDashboardValidator } from '#IValidations/Admin/DashboardValidation'

@inject()
export default class DashboardService extends BaseService<
    typeof createDashboardValidator,
    typeof updateDashboardValidator,
    // @ts-ignore
    DashboardRepository
> { 
    constructor(repository: DashboardRepository) {
        super(repository, createDashboardValidator, updateDashboardValidator)
    }

    dateToMillisLocal (dateString: string) {
        const [year, month, day] = dateString.split('-').map(Number)

        return new Date(year, month - 1, day, 0, 0, 0, 0).getTime()
    }

    isWeekend(tanggal: string) {
        const d = new Date(tanggal).getDay()
        return d === 0 || d === 6
    }

    selisihHari(getData: any) {
        const selisihHari   =   Math.abs(
            this.dateToMillisLocal(String(getData.data.awal.split(' ')[0]))
            -
            this.dateToMillisLocal(String(getData.data.akhir.split(' ')[0]))
        )

        const jumlahHari    =   selisihHari / (1000 * 60 * 60 * 24)

        return jumlahHari
    }

    async getData(type: string | null) {
        const sekarang                  =   new Date()
        let awal: any, akhir: any       =   null

        if (type == 'monthly') {
            awal    = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1)
            akhir   = new Date(sekarang.getFullYear(), sekarang.getMonth() + 1, 0)

            awal    = awal.toLocaleDateString('sv-SE') + " 00:00:00"
            akhir   = akhir.toLocaleDateString('sv-SE') + " 23:59:59"
        } else {
            if (type == 'weekly') {
                akhir           =   sekarang.toLocaleDateString('sv-SE') + " 23:59:59"
                const tanggal   =   sekarang.setDate(sekarang.getDate() - 7)
                awal            =   new Date(tanggal).toLocaleDateString('sv-SE') + " 00:00:00"
            } else {
                awal    = sekarang.toLocaleDateString('sv-SE') + " 00:00:00"
                akhir   = sekarang.toLocaleDateString('sv-SE') + " 23:59:59"
            }
        }

        const data: Record<string, any>	=	{
            awal,
            akhir
        }

        const result            =   await this.repository.summary(data)
        const absen             =   await result.absen
        const pegawai           =   await result.pegawai

        delete data.dAwal
        delete data.dAkhir

        return {
            data,
            absen,
            pegawai
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
    async summary(request: any): Promise<any> {
        const { type = 'daily' } = request || {}

        const getData       =   await this.getData(type)
        const pluckPegawai  =   getData.pegawai.map((p: any) => p.id)

        const groupResult   =   this.mapAbsen(getData.absen)
        let   jumlahHari    =   this.selisihHari(getData)
        jumlahHari          =   jumlahHari == 0 ? 1 : jumlahHari

		const selesai: Record<string, any> = {}

        const tanggalAwal       = new Date(getData.data.awal.split(' ')[0])
        let totalAbsenMasuk     = 0
        let totalAbsenPulang    = 0
        let uniqueHadir         = new Set()

        for (let i = 0; i <= jumlahHari; i++) {
            const tanggalSekarang = new Date(tanggalAwal)
            tanggalSekarang.setDate(tanggalAwal.getDate() + i)

            const key       = tanggalSekarang.toISOString().split('T')[0]
            const dataAbsen = groupResult[key] ?? []

            if (this.isWeekend(key)) continue

            const pegawaiHadir = [...new Set(
                dataAbsen.filter(
                a => ["MASUK", "PULANG"].includes(
                    a.tipe.toUpperCase().trim()
                )).map(a => Number(a.pegawai_id))
            )]

            const pegawaiTidakHadir =   pluckPegawai.map(Number).filter((id: any) => !pegawaiHadir.includes(id))

            totalAbsenMasuk         += dataAbsen.filter(a => a.tipe === "MASUK").length
            totalAbsenPulang        += dataAbsen.filter(a => a.tipe === "PULANG").length

            pegawaiHadir.forEach(id => uniqueHadir.add(id))

            selesai[key] = {
                pegawaiHadir: pegawaiHadir.length,
                pegawaiTidakHadir: pegawaiTidakHadir.length,
                totalAbsenMasuk: dataAbsen.filter(a => a.tipe === "MASUK").length,
                totalAbsenPulang: dataAbsen.filter(a => a.tipe === "PULANG").length
            }
        }

        const uniqueTidakHadir = pluckPegawai.filter((id: any) => !uniqueHadir.has(id))

        return {
            overview: {
                total_pegawai: pluckPegawai.length,
                total_absen_masuk: totalAbsenMasuk,
                total_absen_pulang: totalAbsenPulang,
                unique_pegawai_hadir: uniqueHadir.size,
                unique_pegawai_tidak_hadir: uniqueTidakHadir.length
            },
            daily_breakdown: Object.keys(selesai).length === 0 ? {
                pegawaiHadir: 0,
                pegawaiTidakHadir: 0,
                totalAbsenMasuk: 0,
                totalAbsenPulang: 0
            } : selesai,
        }
	}

    async chart(request: any): Promise<any> {
        const { type = 'daily' } = request || {}

        const getData       =   await this.getData(type)

        const groupResult   =   this.mapAbsen(getData.absen)
        let   jumlahHari    =   this.selisihHari(getData)
        jumlahHari          =   jumlahHari == 0 ? 1 : jumlahHari

		const selesai: Record<string, any> = {}
        const tanggalAwal   =   new Date(getData.data.awal.split(' ')[0])

        for (let i = 0; i <= jumlahHari; i++) {
            const tanggalSekarang = new Date(tanggalAwal)
            tanggalSekarang.setDate(tanggalAwal.getDate() + i)

            const key       = tanggalSekarang.toISOString().split('T')[0]
            const dataAbsen = groupResult[key] ?? []

            if (this.isWeekend(key)) continue

            const masuk  = dataAbsen.filter(a => a.tipe === "MASUK").length
            const pulang = dataAbsen.filter(a => a.tipe === "PULANG").length

            const total  = masuk + pulang

            selesai[i] = {
                label: key,
                masuk,
                pulang,
                total
            }
        }

        return {
            chart_data: Object.keys(selesai).length === 0 ? {
                label: getData.data.awal.split(' ')[0],
                masuk: 0,
                pulang: 0,
                total: 0
            } : selesai,
            type
        }
	}

    async daily(): Promise<any> {
        const getData       =   await this.getData('daily')
        const pluckPegawai  =   getData.pegawai.map((p: any) => p.id)

		const groupResult   =   this.mapAbsen(getData.absen)
        let   jumlahHari    =   this.selisihHari(getData)
        jumlahHari          =   jumlahHari == 0 ? 1 : jumlahHari

        const selesai: Record<string, any> = {}

        const tanggalAwal       = new Date(getData.data.awal.split(' ')[0])
        let totalAbsenMasuk     = 0
        let totalAbsenPulang    = 0
        let uniqueHadir         = new Set()

        for (let i = 0; i <= jumlahHari; i++) {
            const tanggalSekarang = new Date(tanggalAwal)
            tanggalSekarang.setDate(tanggalAwal.getDate() + i)

            const key       = tanggalSekarang.toISOString().split('T')[0]
            const dataAbsen = groupResult[key] ?? []

            if (this.isWeekend(key)) continue

            const pegawaiHadir = [...new Set(
                dataAbsen.filter(
                a => ["MASUK", "PULANG"].includes(
                    a.tipe.toUpperCase().trim()
                )).map(a => Number(a.pegawai_id))
            )]

            const pegawaiTidakHadir =   pluckPegawai.map(Number).filter((id: any) => !pegawaiHadir.includes(id))

            totalAbsenMasuk         += dataAbsen.filter(a => a.tipe === "MASUK").length
            totalAbsenPulang        += dataAbsen.filter(a => a.tipe === "PULANG").length

            pegawaiHadir.forEach(id => uniqueHadir.add(id))

            selesai[key] = {
                pegawaiHadir: pegawaiHadir.length,
                pegawaiTidakHadir: pegawaiTidakHadir.length,
                totalAbsenMasuk: dataAbsen.filter(a => a.tipe === "MASUK").length,
                totalAbsenPulang: dataAbsen.filter(a => a.tipe === "PULANG").length
            }
        }

        return {
            total_pegawai: getData.pegawai.length,
            pegawai_hadir: uniqueHadir?.size ?? 0,
            pegawai_tidak_hadir: (getData.pegawai?.length ?? 0) - (uniqueHadir?.size ?? 0), 
            total_absen_masuk: totalAbsenMasuk,
            total_absen_pulang: totalAbsenPulang,
        }
	}
}
