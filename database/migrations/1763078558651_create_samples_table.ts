import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Samples extends BaseSchema {
	protected tableName = '_samples'

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()

      		table.string('nama')

			table.string('judul')

			table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()
			table.integer('updated_by').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()

			table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
			table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
			table.timestamp('deleted_at', { useTz: true }).nullable()
		})
	}

	public async down() {
		this.schema.dropTable(this.tableName)
	}
}
