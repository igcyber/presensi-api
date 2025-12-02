import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'roles'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')
			table.string('name').notNullable()
			table.string('slug').unique().notNullable()

			table.integer('created_by').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()
			table.integer('updated_by').unsigned().references('id').inTable('users').onDelete('SET NULL').nullable()

			table.timestamps(true)
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
