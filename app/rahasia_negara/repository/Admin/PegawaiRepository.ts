import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'

import BaseRepository from '#IRepositories/core/BaseRepository'
import PegawaiInterface from '#IInterfaces/Admin/PegawaiInterface'

import PegawaiModel from '#models/UserPegawaiModel'
import User from '#models/core/user'
import KantorModel from '#models/KantorModel'

@inject()
export default class PegawaiRepository extends BaseRepository<PegawaiModel & LucidRow> implements Exact<PegawaiInterface, PegawaiRepository> {
	constructor() {
		super(PegawaiModel)
	}

	// Disini Wajib Menyesuaikan PegawaiInterface
	async indexData(search: string, type: string, page: number, per_page: number): Promise<any> {
		const query = this.model.query()

		if (search) {
			query.where((q: any) => {
				q.where('nama', 'like', `%${search}%`)
				.orWhere('check_radius', 'like', `%${search}%`)
				.orWhereHas('user', (relQuery: any) => {
					relQuery.where('email', 'like', `%${search}%`)
							.orWhere('username', 'like', `%${search}%`)
							.orWhere('no_hp', 'like', `%${search}%`)
				})
			})
		}

		if (type) query.whereHas('tipePegawai', (relQuery: any) => relQuery.where('nama', type))

		return query.paginate(page, per_page)
	}

	async allData(): Promise<PegawaiModel[]> {
		return this.model.query()
	}

	async createData(dataUser: Partial<any>, dataPegawai: Partial<any>): Promise<PegawaiModel> {
		const DBTransaction				=	await db.transaction()

		try {
			// @ts-ignore
			const cUser					=	await User.create(dataUser, { client: DBTransaction })

			const cPegawai				=	await this.model.create({
				user_id: cUser.id,
				...dataPegawai,
			}, { client: DBTransaction })

			await cUser.related('roles').sync([2], DBTransaction)

			if (dataPegawai.kantor_id && dataPegawai.check_radius !== 'YA') {
				// @ts-ignore
				const newKantor			=	await KantorModel.query({ client: DBTransaction }).where('id', dataPegawai.kantor_id).forUpdate().first()

				if (!newKantor) throw new Error('Kantor tidak ditemukan')

				newKantor.except_user	=	[...(newKantor.except_user || []), cPegawai.id]
				await newKantor.save({ client: DBTransaction })
			}

			await DBTransaction.commit()

			return cPegawai
		} catch (error) {
			await DBTransaction.rollback()
			throw { message: error.message, code: 500 }
		}
	}

	async updateData(id: number, dataUser: Partial<any>, dataPegawai: Partial<any>): Promise<PegawaiModel> {
		const DBTransaction						=	await db.transaction()

		try {
			const { kantor_id, check_radius }	=	dataPegawai
			const pegawai						=	await this.model.find(id)

			if (!pegawai) throw new Error('Data tidak ditemukan')

			await pegawai.load('user')
			await pegawai.load('kantor')

			const oldKantor		=	pegawai.kantor
			const KantorModel	=	oldKantor.constructor

			pegawai.merge(dataPegawai)
			pegawai.user.merge(dataUser)

			if (kantor_id && oldKantor.id !== kantor_id) {
				oldKantor.except_user		=	(oldKantor.except_user || []).filter((uid: any) => uid !== pegawai.id)
				await oldKantor.save({ client: DBTransaction })

				const newKantor				=	await KantorModel.find(kantor_id)
				if (!newKantor) throw new Error('Kantor baru tidak ditemukan')

				if (check_radius !== 'YA') {
					newKantor.except_user	=	[...(newKantor.except_user || []), pegawai.id]
					await newKantor.save({ client: DBTransaction })
				}
			} else {
				const currentExcept			=	oldKantor.except_user || []

				if (check_radius === 'YA') {
					oldKantor.except_user	=	currentExcept.filter((uid: any) => uid !== pegawai.id)
				} else if (!currentExcept.includes(pegawai.id)) {
					oldKantor.except_user	=	[...currentExcept, pegawai.id]
				}

				await oldKantor.save({ client: DBTransaction })
			}

			await pegawai.save({ client: DBTransaction })
			await pegawai.user.save({ client: DBTransaction })

			await DBTransaction.commit()
			return pegawai
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

			await data.load('user')

			await data.user.delete({ client: DBTransaction })
			await data.delete({ client: DBTransaction })

			await DBTransaction.commit()
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code : 500 }
		}
	}
}
