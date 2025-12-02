import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'

import BaseRepository from '#IRepositories/core/BaseRepository'
import RiwayatAbsenInterface from '#IInterfaces/Pegawai/RiwayatAbsenInterface'
import AbsenModel from '#models/AbsenModel'

@inject()
export default class RiwayatAbsenRepository extends BaseRepository<AbsenModel & LucidRow> implements Exact<RiwayatAbsenInterface, RiwayatAbsenRepository> {
	constructor() {
		super(AbsenModel)
	}

	// Disini Wajib Menyesuaikan RiwayatAbsenInteface
	async indexData(pegawai: number, data: any): Promise<AbsenModel[]>{
		return this.model.query().select(
			'id', 'pegawai_id', 'foto', 'tipe', 'tanggal_absen', 'lat', 'long', 'akurasi'
		).where('pegawai_id', pegawai).whereBetween('tanggal_absen', [data.awal, data.akhir]).exec()
	}
}
