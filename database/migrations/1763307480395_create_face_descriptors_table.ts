import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'face_descriptors'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()

			table.integer('pegawai_id').unsigned().references('id').inTable('user_pegawais').onDelete('CASCADE').onUpdate('CASCADE').notNullable()
      		table.text('descriptor').notNullable()
			table.text('filename').notNullable()

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