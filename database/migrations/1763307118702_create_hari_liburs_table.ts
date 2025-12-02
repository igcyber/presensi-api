import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'hari_liburs'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()
			table.timestamp('tanggal', { useTz: true, precision: 3 }).notNullable().unique()
			table.string('keterangan', 191).nullable()

			table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()
			table.integer('updated_by').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()

			table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
			table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
			table.timestamp('deleted_at', { useTz: true }).nullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}