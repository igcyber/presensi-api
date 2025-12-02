import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'user_pegawais'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()

			table.integer('user_id').unsigned().references('id').inTable('users').onDelete('RESTRICT').onUpdate('CASCADE')
			table.integer('tipe_pegawai_id').unsigned().references('id').inTable('tipe_pegawais').onDelete('RESTRICT').onUpdate('CASCADE')
			table.integer('kantor_id').unsigned().references('id').inTable('kantors').onDelete('RESTRICT').onUpdate('CASCADE')

			table.string('nama').notNullable()
			table.enum('check_radius', ['YA', 'TIDAK']).defaultTo('TIDAK').notNullable()
			table.string('lat', 191).nullable()
			table.string('long', 191).nullable()

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