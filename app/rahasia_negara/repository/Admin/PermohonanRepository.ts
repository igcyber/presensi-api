import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'

import BaseRepository from '#IRepositories/core/BaseRepository'
import PermohonanInterface from '#IInterfaces/Admin/PermohonanInterface'
import PermohonanModel from '#models/PermohonanModel'
import AbsenModel from '#models/AbsenModel'

@inject()
export default class PermohonanRepository extends BaseRepository<PermohonanModel & LucidRow> implements Exact<PermohonanInterface, PermohonanRepository> {
	constructor() {
		super(PermohonanModel)
	}

	// Disini Wajib Menyesuaikan PermohonanInterface
	async indexData(search: string, tipe: string, status: string, date: string, page: number, per_page: number): Promise<any> {
		const query			=	this.model.query().select(
			'id', 'pegawai_id', 'verifikator_id', 'tipe', 'tanggal_pengajuan', 'keterangan_pengajuan',
			'file_pendukung', 'status', 'tanggal_verifikator', 'keterangan_verifikator'
		).preload('pegawai', (qp: any) => qp.select('nama')).preload('verifikator', (qv: any) => qv.select('username'))

		if (search) {
			query.where((q: any) => {
				q.whereHas('pegawai', (qp: any) => {
					qp.where('nama', 'like', `%${search}%`).orWhereHas(
						'user', (qu: any) => qu.where('username', 'like', `%${search}%`)
					)
				})
			})
		}

		if (tipe) query.where('tipe', tipe)

		if (status) query.where('status', status)

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

		query.whereBetween('tanggal_pengajuan', [awal, akhir])

		const result		=	await query.paginate(page, per_page)

		return {
			meta: result.getMeta(),
			data: result.rows.map((data: any) => {
				return {
					id: data.id,
					tipe: data.tipe,
					tanggal_pengajuan: new Date(data.tanggal_pengajuan).toLocaleString('sv-SE'),
					keterangan_pengajuan: data.keterangan_pengajuan,
					file_pendukung: data.file_pendukung,
					file_pendukung_url: data.file_pendukung_url,
					status: data.status,
					pegawai: data.pegawai?.nama ?? null,
					verifikator: data.verifikator?.username ?? null,
					tanggal_verifikator: new Date(data.tanggal_verifikator).toLocaleString('sv-SE'),
					keterangan_verifikator: data.keterangan_verifikator
				}
			})
		}
	}

	async findById(id: number): Promise<any | null> {
		try {
			const data		=	await this.model.find(id)

			if (!data) throw new Error('Data tidak ditemukan')

			await data.load('pegawai')
			await data.load('verifikator')

			return {
				id: data.id,
				tipe: data.tipe,
				tanggal_pengajuan: new Date(data.tanggal_pengajuan).toLocaleString('sv-SE'),
				keterangan_pengajuan: data.keterangan_pengajuan,
				file_pendukung: data.file_pendukung,
				file_pendukung_url: data.file_pendukung_url,
				status: data.status,
				pegawai: data.pegawai?.nama ?? null,
				verifikator: data.verifikator?.username ?? null,
				tanggal_verifikator: new Date(data.tanggal_verifikator).toLocaleString('sv-SE'),
				keterangan_verifikator: data.keterangan_verifikator
			}
		} catch (error) {
			throw { message: error.message, code : 500 }
		}
	}

	async verify(id: number, data: Partial<any>): Promise<any | null> {
		const DBTransaction		=	await db.transaction()

		try {
			const vPermohonan	=	await this.model.find(id)

			if (!vPermohonan) throw new Error('Data tidak ditemukan')

			if (vPermohonan.status !== 'pending') throw new Error('Data Sudah Di-Verifikasi')

			vPermohonan.merge(data)

			await vPermohonan.save({ client: DBTransaction })

			if (vPermohonan.status === 'diterima') {
				// @ts-ignore
				const cAbsen	=	await AbsenModel.create({
					pegawai_id: vPermohonan.pegawai_id,
					tanggal_absen: new Date(vPermohonan.tanggal_pengajuan).toLocaleString('sv-SE'),
					tipe: vPermohonan.tipe.toUpperCase(),
				}, { client: DBTransaction })
			}

			await DBTransaction.commit()

			return vPermohonan
		} catch (error) {
			await DBTransaction.rollback()


			throw { message: error.message, code : error.message == 'Data Sudah Di-Verifikasi' ? 409 : 500 }
		}
	}
}
