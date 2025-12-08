import type { ModelAttributes } from '@adonisjs/lucid/types/model'
import db from '@adonisjs/lucid/services/db'

export default abstract class BaseRepository<Row = any> {
	protected model: any

	protected constructor(model: any) {
		this.model	=	model
	}

	async index(
		search: string | null = null,
		searchableColumns: string[] = [],
		page: number = 1,
		per_page: number = 10,
	) {
		const query = this.model.query()

		if (search && searchableColumns.length > 0) {
			query.where( (q: any) => searchableColumns.forEach(
				(col) => q.orWhere(col, 'like', `%${search}%`)
			))
		}

		return query.paginate(page, per_page)
	}

	async findById(id: number): Promise<Row | null> {
		return await this.model.find(id)
	}

	async create(data: Partial<Row>): Promise<Row> {
		const DBTransaction 	= await db.transaction()

		try {
			const createdData 	= await this.model.create(
				data as Partial<ModelAttributes<any>>,
				{ client: DBTransaction }
			)

			await DBTransaction.commit()

			return createdData as Row
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code : 500 }
		}
	}

	async update(id: number, data: Partial<Row>) {
		const DBTransaction	= await db.transaction()

		try {
			const row		= await this.model.find(id)

			if (!row) throw new Error('Data tidak ditemukan')

			row.merge(data)

			await row.save({ client: DBTransaction })

			await DBTransaction.commit()

			return row as Row
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code : 500 }
		}
	}

	async destroy(id: number): Promise<void> {
		const DBTransaction	= await db.transaction()

		try {
			const row		= await this.model.find(id)

			if (!row) throw new Error('Data tidak ditemukan')

			await row.delete({ client: DBTransaction })

			await DBTransaction.commit()
		} catch (error) {
			await DBTransaction.rollback()

			throw { message: error.message, code : 500 }
		}
	}
}
