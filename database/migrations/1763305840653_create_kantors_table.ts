import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'kantors'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()

			table.string('nama', 191).notNullable()
			table.text('alamat').nullable()
			table.string('lat', 191).nullable()
			table.string('long', 191).nullable()
			table.text('deskripsi').nullable()
			table.double('radius_limit').defaultTo(0.5)
			table.json('except_user').nullable()
			table.time('jam_masuk').defaultTo('07:30:00')
			table.time('jam_pulang').defaultTo('16:30:00')

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