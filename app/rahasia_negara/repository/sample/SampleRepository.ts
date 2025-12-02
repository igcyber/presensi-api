import Sample from '#models/sample/sample'
import BaseRepository from '#IRepositories/core/BaseRepository'
import SampleInterface from '#IInterfaces/sample/SampleInterface'

import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'

@inject()
export default class SampleRepository extends BaseRepository<Sample & LucidRow> implements Exact<SampleInterface, SampleRepository> {
	constructor() {
		super(Sample)
	}

	// Disini Wajib Menyesuaikan SampleInteface
	async findAll(): Promise<Sample[]> {
		return this.getAll()
	}
}
