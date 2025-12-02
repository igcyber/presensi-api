import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'users'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()

			table.string('email', 254).notNullable().unique()
			table.string('username', 254).notNullable().unique()
			table.string('password').notNullable()
			table.string('no_hp').nullable()

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