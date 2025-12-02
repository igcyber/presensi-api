import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'

import BaseRepository from '#IRepositories/core/BaseRepository'
import RekapAbsenInterface from '#IInterfaces/Pegawai/RekapAbsenInterface'
import AbsenModel from '#models/AbsenModel'

@inject()
export default class RekapAbsenRepository extends BaseRepository<AbsenModel & LucidRow> implements Exact<RekapAbsenInterface, RekapAbsenRepository> {
	constructor() {
		super(AbsenModel)
	}

	// Disini Wajib Menyesuaikan RekapAbsenInteface
	async rekapData(pegawai: number, data: Partial<any>): Promise<any>{
		return this.model.query().select(
			'id', 'pegawai_id', 'foto', 'tipe', 'tanggal_absen', 'lat', 'long', 'akurasi'
		).where('pegawai_id', pegawai).whereBetween('tanggal_absen', [data.awal, data.akhir]).exec()
	}
}
