import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'

import BaseRepository from '#IRepositories/core/BaseRepository'
import DashboardInterface from '#IInterfaces/Admin/DashboardInterface'
import AbsenModel from '#models/AbsenModel'
import UserPegawaiModel from '#models/UserPegawaiModel'

@inject()
export default class DashboardRepository extends BaseRepository<AbsenModel & LucidRow> implements Exact<DashboardInterface, DashboardRepository> {
	constructor() {
		super(AbsenModel)
	}

	// Disini Wajib Menyesuaikan DashboardInteface
	async summary(data: any): Promise<any | null> {
		const absen = await this.model.query().select('id', 'pegawai_id', 'foto', 'tipe', 'tanggal_absen', 'lat', 'long', 'akurasi')
		.whereBetween('tanggal_absen', [data.awal, data.akhir]).exec()

		// @ts-ignore
		const pegawai = await UserPegawaiModel.query().select('id', 'nama', 'tipe_pegawai_id')
		.preload('tipePegawai', (qp: any) => qp.select('nama')).exec()

		return {
			absen,
			pegawai
		}
	}
}
