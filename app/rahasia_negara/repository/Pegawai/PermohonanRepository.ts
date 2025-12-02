import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'

import BaseRepository from '#IRepositories/core/BaseRepository'
import PermohonanInterface from '#IInterfaces/Pegawai/PermohonanInterface'
import PermohonanModel from '#models/PermohonanModel'

@inject()
export default class PermohonanRepository extends BaseRepository<PermohonanModel & LucidRow> implements Exact<PermohonanInterface, PermohonanRepository> {
	constructor() {
		super(PermohonanModel)
	}

	// Disini Wajib Menyesuaikan PermohonanInteface
	async indexData(data: Partial<any>, page: number, per_page: number): Promise<PermohonanModel[]> {
		const query	=	this.model.query().select(
			'id', 'pegawai_id', 'tipe', 'tanggal_pengajuan', 'keterangan_pengajuan',
			'file_pendukung', 'verifikator_id', 'tanggal_verifikator', 'keterangan_verifikator'
		).preload('pegawai', (qP: any) => qP.select('id', 'nama') )
		.preload('verifikator', (qP: any) => qP.select('id', 'username') )
		.where('pegawai_id', data.pegawai_id)

		if ( data.search ) {
			query.where( (q: any) => {
				q.where('keterangan_pengajuan', 'like', `%${data.search}%`)
				.orWhere('keterangan_verifikator', 'like', `%${data.search}%`)
				.orWhereHas('verifikator', (vQ: any) => vQ.where('username', 'like', `%${data.search}%`))
			})
		}

		if ( data.tipe !== 'Semua Tipe' ) query.where('tipe', data.tipe)
		if ( data.status !== 'Semua Status' ) query.where('status', data.status)
		if ( data.awal && data.akhir ) query.whereBetween('tanggal_pengajuan', [data.awal, data.akhir])

		return query.paginate(page, per_page)
	}

	async checkData(data: Partial<any>, withTanggal: Boolean = true): Promise<PermohonanModel[]> {
		const query	=	this.model.query().select(
			'id', 'pegawai_id', 'tanggal_pengajuan'
		).where('pegawai_id', data.pegawai_id)

		if (withTanggal) query.whereBetween('tanggal_pengajuan', [data.awal, data.akhir])

		return query.exec()
	}

	async createData(data: Partial<any>): Promise<PermohonanModel> {
		const DBTransaction 	= await db.transaction()

		try {
			const cPermohonan	=	await this.model.create(
				data,
			{ client: DBTransaction })

			await DBTransaction.commit()

			return cPermohonan
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code : 500 }
		}
	}
}
