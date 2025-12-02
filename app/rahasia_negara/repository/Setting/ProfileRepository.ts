import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'

import BaseRepository from '#IRepositories/core/BaseRepository'
import ProfileInterface from '#IInterfaces/Setting/ProfileInterface'

import UserModel from '#models/core/user'
import FaceDescriptorModel from '#models/FaceDescriptorModel'

@inject()
export default class ProfileRepository extends BaseRepository<UserModel & LucidRow> implements Exact<ProfileInterface, ProfileRepository> {
	constructor() {
		super(UserModel)
	}

	// Disini Wajib Menyesuaikan ProfileInteface
	async indexData(id: number): Promise<any> {
		try {
			const data		= await this.model.find(id)

			if (!data) throw new Error('Data tidak ditemukan')

			await data.load('userPegawai')

			return data
		} catch (error) {
			throw { message: error.message, code : error?.code ?? 500 }
		}
	}

	async updateProfile(id: number, dataUser: any, dataPegawai: any): Promise<any> {
		const DBTransaction	=	await db.transaction()

		try {
			const user		=	await this.model.find(id)

			if (!user) throw new Error('Data tidak ditemukan')

			await user.load('roles')
			await user.load('userPegawai')

			if ( user.roles.some((r: any) => r.slug === 'pegawai') ) {
				user.userPegawai.merge(dataPegawai)
				await user.userPegawai.save({ client: DBTransaction })
			}

			user.merge(dataUser)

			await user.save({ client: DBTransaction })

			await DBTransaction.commit()
			return user
		} catch (error) {
			await DBTransaction.rollback()
			throw { message: error.message, code: 500 }
		}
	}

	async updatePassword(id: number, data: any): Promise<any> {
		const DBTransaction	=	await db.transaction()

		try {
			const user		=	await this.model.find(id)

			if (!user) throw new Error('Data tidak ditemukan')

			const isValid	=	await hash.verify(user.password, data.old_password)

			if (!isValid) throw { message: "Password tidak sesuai", code : 'E_VALIDATION_ERROR' }
			delete data.old_password

			user.merge(data)

			await user.save({ client: DBTransaction })

			await DBTransaction.commit()

			return user
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code: 500 }
		}
	}

	async updateFaceId(data: any): Promise<FaceDescriptorModel> {
		const trx = await db.transaction()

		try {
			let faceData: FaceDescriptorModel

			if (data.id) {
				// @ts-ignore
				const model	=	await FaceDescriptorModel.find(data.id)

				if (!model) throw { message: 'Data tidak ditemukan', code: 404 }

				model.merge(data)

				await model.useTransaction(trx).save()

				faceData = model
			} else {
				// @ts-ignore
				faceData = await FaceDescriptorModel.create(data, { client: trx })
			}

			await trx.commit()
			return faceData
		} catch (error: any) {
			await trx.rollback()
			throw {
				message: error?.message ?? 'Internal Server Error',
				code: error?.code ?? 500,
			}
		}
	}

	async checkFaceId(pegawai: number): Promise<FaceDescriptorModel>{
		// @ts-ignore
		return await FaceDescriptorModel.query().where('pegawai_id', pegawai).first()
	}
}
