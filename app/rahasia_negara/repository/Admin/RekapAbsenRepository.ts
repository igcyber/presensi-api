import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'

import BaseRepository from '#IRepositories/core/BaseRepository'
import RekapAbsenInterface from '#IInterfaces/Admin/RekapAbsenInterface'
import AbsenModel from '#models/AbsenModel'
import UserPegawaiModel from '#models/UserPegawaiModel'

@inject()
export default class RekapAbsenRepository extends BaseRepository<AbsenModel & LucidRow> implements Exact<RekapAbsenInterface, RekapAbsenRepository> {
	constructor() {
		super(AbsenModel)
	}

	// Disini Wajib Menyesuaikan RekapAbsenInteface
	async rekapData(data: Partial<any>): Promise<any>{
		const absen		=	this.model.query().select(
			'id', 'hari_libur_id', 'permohonan_id', 'pegawai_id', 'foto', 'tipe', 'tanggal_absen', 'lat', 'long', 'akurasi'
		).preload('hariLibur', (qhl: any) => qhl.select('keterangan') )
		.preload('permohonan', (qpm: any) => qpm.select('tipe', 'keterangan_pengajuan') )
		.where('pegawai_id', data.pegawai_id)
		.whereBetween('tanggal_absen', [data.awal, data.akhir]).exec()

		// @ts-ignore
		const pegawai	=	UserPegawaiModel.query().select(
			'id', 'nama', 'tipe_pegawai_id'
		).preload('tipePegawai', (qp: any) => qp.select('nama') )
		.where('id', data.pegawai_id).first()

		return {
			absen,
			pegawai
		}
	}
}
