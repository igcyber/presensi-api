import { Exact } from '#utils/exact'
import { LucidRow } from '@adonisjs/lucid/types/model'
import { inject } from '@adonisjs/core'

import BaseRepository from '#IRepositories/core/BaseRepository'
import PwaVersionInterface from '#IInterfaces/Admin/PwaVersionInterface'
import PwaVersionModel from '#models/PwaVersionModel'

@inject()
export default class PwaVersionRepository extends BaseRepository<PwaVersionModel & LucidRow> implements Exact<PwaVersionInterface, PwaVersionRepository> {
	constructor() {
		super(PwaVersionModel)
	}

	// Disini Wajib Menyesuaikan PwaVersionInteface
	async index( search: string | null = null, searchableColumns: string[] = [], page: number = 1, per_page: number = 10 ) {
		const query = this.model.query().orderBy('created_at', 'desc')

		if (search && searchableColumns.length > 0) {
			query.where( (q: any) => searchableColumns.forEach(
				(col) => q.orWhere(col, 'like', `%${search}%`)
			))
		}

		return query.paginate(page, per_page)
	}

	async latest(): Promise<PwaVersionModel | null>
	{
		return this.model.query().orderBy('id', 'desc').first()
	}
}
