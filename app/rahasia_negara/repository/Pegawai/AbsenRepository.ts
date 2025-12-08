import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'

import BaseRepository from '#IRepositories/core/BaseRepository'
import AbsenInterface from '#IInterfaces/Pegawai/AbsenInterface'
import AbsenModel from '#models/AbsenModel'
import KantorModel from '#models/KantorModel'
import PermohonanModel from '#models/PermohonanModel'
import FaceDescriptorModel from '#models/FaceDescriptorModel'

@inject()
export default class AbsenRepository extends BaseRepository<AbsenModel & LucidRow> implements Exact<AbsenInterface, AbsenRepository> {
	constructor() {
		super(AbsenModel)
	}

	// Disini Wajib Menyesuaikan AbsenInteface
	async indexData(data: any): Promise<any> {
		return this.model.query().select(
			'id', 'pegawai_id', 'hari_libur_id', 'tipe', 'foto',
			'tanggal_absen', 'lat', 'long', 'akurasi'
		).where('pegawai_id', data.pegawai_id)
		.whereBetween('tanggal_absen', [data.awal, data.akhir]).exec()
	}

	async getKantor(kantorId: number): Promise<KantorModel | null> {
		// @ts-ignore
		return KantorModel.query().select(
			'id', 'nama', 'alamat', 'lat', 'long',
			'deskripsi', 'radius_limit', 'except_user',
			'jam_masuk', 'jam_pulang'
		).where('id', kantorId).first()
	}

	async getPermohonan(pegawai: any): Promise<PermohonanModel[]> {
		// @ts-ignore
		return PermohonanModel.query().select(
			'id', 'tanggal_pengajuan', 'tipe', 'status', 'file_pendukung'
		).where('pegawai_id', pegawai).exec()
	}

	async checkFaceId(pegawai: number): Promise<FaceDescriptorModel>{
		// @ts-ignore
		return await FaceDescriptorModel.query().where('pegawai_id', pegawai).first()
	}

	async createData(dataAbsen: any, dataPermohonan: any): Promise<AbsenModel> {
		const DBTransaction	=	await db.transaction()

		try {
			if (dataPermohonan) {
				// @ts-ignore
				const uPermohonan	= await PermohonanModel.find(dataPermohonan.id)

				if ( uPermohonan?.status == 'pending' ) {
					uPermohonan.merge({ status: 'batal' })

					await uPermohonan.save({ client: DBTransaction })
				}
			}

			const cAbsen	=	await this.model.create(dataAbsen)

			await DBTransaction.commit()

			return cAbsen as any
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code : 500 }
		}
	}
}
