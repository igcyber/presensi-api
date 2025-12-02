import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Jobs extends BaseSchema {
	protected tableName = 'jobs'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')
			table.string('type')
			table.json('payload')
			table.integer('attempts').defaultTo(0)
			table.integer('max_attempts').defaultTo(3)
			table.timestamp('available_at')
			table.timestamp('created_at')
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
