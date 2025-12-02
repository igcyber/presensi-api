import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'

import BaseRepository from '#IRepositories/core/BaseRepository'
import KantorInterface from '#IInterfaces/Admin/KantorInterface'
import KantorModel from '#models/KantorModel'

@inject()
export default class KantorRepository extends BaseRepository<KantorModel & LucidRow> implements Exact<KantorInterface, KantorRepository> {
	constructor() {
		super(KantorModel)
	}

	// Disini Wajib Menyesuaikan KantorInterface
	async indexData(search: string | null, page: number, per_page: number): Promise<any> {
		const query		=	this.model.query().select(
			'id', 'nama', 'alamat',
			'lat', 'long', 'deskripsi',
			'radius_limit', 'jam_masuk',
			'jam_pulang'
		).preload('pegawai')

		if (search) query.where((q: any) => {
			q.where('nama', 'like', `%${search}%`)
			.orWhere('alamat', 'like', `%${search}%`)
			.orWhere('deskripsi', 'like', `%${search}%`)
		})

		const result	=	await query.paginate(page, per_page)

		return {
			meta: result.getMeta(),
			data: result.rows.map((data: any) => {
				return {
					id: data.id,
					nama: data.nama,
					alamat: data.alamat,
					lat: data.lat,
					long: data.long,
					deskripsi: data.deskripsi,
					radius_limit: data.radius_limit,
					jam_masuk: data.jam_masuk,
					jam_pulang: data.jam_pulang,
					jumlah_pegawai: data.pegawai.length
				}
			})
		}
	}

	async createData(data: Partial<any>): Promise<KantorModel> {
		const DBTransaction		=	await db.transaction()

		try {
			const cKantor		=	await this.model.create(
				data, { client: DBTransaction }
			)

			await DBTransaction.commit()

			return cKantor
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code: 500 }
		}
	}

	async updateData(id: number, data: Partial<any>): Promise<KantorModel> {
		const DBTransaction	=	await db.transaction()

		try {
			const kantor	=	await this.model.find(id)

			if (!kantor) throw new Error('Data tidak ditemukan')

			kantor.merge(data)
			await kantor.save({ client: DBTransaction })

			await DBTransaction.commit()
			return kantor
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

			await data.load('pegawai')

			if (data.pegawai.length) {
				await DBTransaction.rollback()

				throw { message: 'Data Kantor tidak dapat dihapus karena masih memiliki Pegawai', code : 409 }
			}

			await data.delete({ client: DBTransaction })

			await DBTransaction.commit()
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code : error?.code ?? 500 }
		}
	}
}
