import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'

import BaseRepository from '#IRepositories/core/BaseRepository'
import AbsenModel from '#models/AbsenModel'
import HariLiburInterface from '#IInterfaces/Admin/HariLiburInterface'
import HariLiburModel from '#models/HariLiburModel'
import UserPegawaiModel from '#models/UserPegawaiModel'

@inject()
export default class HariLiburRepository extends BaseRepository<HariLiburModel & LucidRow> implements Exact<HariLiburInterface, HariLiburRepository> {
	constructor() {
		super(HariLiburModel)
	}

	// Disini Wajib Menyesuaikan HariLiburInterface
	async indexData(search: string, date: string, page: number, per_page: number): Promise<any> {
		const query			=	this.model.query().select(
			'id', 'keterangan', 'tanggal'
		)

		if (search) query.where('keterangan', 'like', `%${search}%`)

		if (date) {
			var awal		=	new Date(date + 'T00:00:00').toLocaleString('sv-SE').replace('T', ' ')
			var akhir		=	new Date(date + 'T23:59:59').toLocaleString('sv-SE').replace('T', ' ')
		} else {
			const now		=	new Date()
			const firstDay	=	new Date(now.getFullYear(), now.getMonth(), 1)
			const lastDay	=	new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

			var awal		=	firstDay.toLocaleString('sv-SE').replace('T', ' ')
			var akhir		=	lastDay.toLocaleString('sv-SE').replace('T', ' ')
		}

		query.whereBetween('tanggal', [awal, akhir])

		const result		=	await query.paginate(page, per_page)

		return {
			meta: result.getMeta(),
			data: result.rows.map((data: any) => {
				return {
					id: data.id,
					tanggal: new Date(data.tanggal).toLocaleString('sv-SE'),
					keterangan: data.keterangan,
				}
			})
		}
	}

	async findById(id: number): Promise<any | null> {
		try {
			const data		=	await this.model.find(id)

			if (!data) throw new Error('Data tidak ditemukan')

			return {
				id: data.id,
				tanggal: new Date(data.tanggal).toLocaleString('sv-SE'),
				keterangan: data.keterangan
			}
		} catch (error) {
			throw { message: error.message, code : 500 }
		}
	}

	async createData(data: Partial<any>): Promise<HariLiburModel> {
		const DBTransaction		=	await db.transaction()

		try {
			const cHariLibur	=	await this.model.create(
				data, { client: DBTransaction }
			)

			// @ts-ignore
			const dPegawai		=	(await UserPegawaiModel.query().select('id')).map( (dP: any) => dP.id )

			for (const pegawaiId of dPegawai) {
				// @ts-ignore
				await AbsenModel.create({
					hari_libur_id: cHariLibur.id,
					pegawai_id: pegawaiId,
					tanggal_absen: new Date(cHariLibur.tanggal).toLocaleString('sv-SE'),
					tipe: "LIBUR",
				}, { client: DBTransaction })
			}

			await DBTransaction.commit()

			return cHariLibur
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code: 500 }
		}
	}

	async updateData(id: number, data: Partial<any>): Promise<any> {
		const DBTransaction		=	await db.transaction()

		try {
			const uHariLibur	=	await this.model.find(id)

			if (!uHariLibur) throw new Error('Data tidak ditemukan')

			await uHariLibur.load('absen')

			delete data.hari_libur_id

			uHariLibur.merge(data)
			await uHariLibur.save({ client: DBTransaction })

			const tanggalLibur	=	new Date(uHariLibur.tanggal).toLocaleString('sv-SE')
			for (const absen of uHariLibur.absen) {
				absen.merge({ tanggal_absen: tanggalLibur})

				await absen.save({ client: DBTransaction })
			}

			await DBTransaction.commit()

			return {
				id: uHariLibur.id,
				tanggal: new Date(uHariLibur.tanggal).toLocaleString('sv-SE'),
				keterangan: uHariLibur.keterangan,
			}
		} catch (error) {
			await DBTransaction.rollback()
			throw { message: error.message, code: 500 }
		}
	}

	async destroyData(id: number): Promise<void> {
		const DBTransaction	= await db.transaction()

		try {
			const data		= await this.model.find(id)

			if (!data) throw new Error('Data tidak ditemukan')

			await data.load('absen')

			await Promise.all(data.absen.map((a: any) => a.forceDelete({ client: DBTransaction })))

			await data.forceDelete({ client: DBTransaction })

			await DBTransaction.commit()
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code : error?.code ?? 500 }
		}
	}
}
