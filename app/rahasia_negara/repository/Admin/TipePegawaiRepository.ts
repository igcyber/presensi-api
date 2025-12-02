import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'

import BaseRepository from '#IRepositories/core/BaseRepository'
import TipePegawaiInterface from '#IInterfaces/Admin/TipePegawaiInterface'
import TipePegawaiModel from '#models/TipePegawaiModel'

@inject()
export default class TipePegawaiRepository extends BaseRepository<TipePegawaiModel & LucidRow> implements Exact<TipePegawaiInterface, TipePegawaiRepository> {
	constructor() {
		super(TipePegawaiModel)
	}

	// Disini Wajib Menyesuaikan TipePegawaiInterface
	async allData(): Promise<TipePegawaiModel[]> {
		return this.model.query()
	}
}
