import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'absens'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()

			table.integer('hari_libur_id').unsigned().references('id').inTable('hari_liburs').onDelete('CASCADE').onUpdate('CASCADE')
			table.integer('permohonan_id').unsigned().references('id').inTable('hari_liburs').onDelete('CASCADE').onUpdate('CASCADE')
			table.integer('pegawai_id').unsigned().references('id').inTable('user_pegawais').onDelete('CASCADE').onUpdate('CASCADE').notNullable()
			table.string('foto', 191).nullable()

			table.timestamp('tanggal_absen', { useTz: true, precision: 3 }).notNullable()
			table.enum('tipe', ['MASUK', 'PULANG', 'MASUK_LEMBUR', 'PULANG_LEMBUR', 'IZIN', 'SAKIT', 'CUTI', 'LIBUR']).notNullable()
			table.string('lat', 191).nullable()
			table.string('long', 191).nullable()
			table.double('akurasi').nullable()

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