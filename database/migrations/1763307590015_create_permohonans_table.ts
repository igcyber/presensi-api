import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'permohonans'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()

			table.integer('pegawai_id').unsigned().references('id').inTable('user_pegawais').onDelete('CASCADE').onUpdate('CASCADE').notNullable()
			table.integer('verifikator_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')

			table.enum('tipe', ['Izin', 'Sakit', 'Cuti']).notNullable()
			table.timestamp('tanggal_pengajuan', { useTz: true, precision: 3 }).notNullable()
			table.string('keterangan_pengajuan', 191).nullable()
			table.string('file_pendukung').nullable()
			table.enum('status', ['pending', 'diterima', 'ditolak', 'batal']).defaultTo('pending').notNullable()

			table.timestamp('tanggal_verifikator', { useTz: true, precision: 3 }).nullable()
			table.string('keterangan_verifikator', 191).nullable()

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