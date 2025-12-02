import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'user_permissions'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')
			table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
			table.integer('permission_id').unsigned().references('permissions.id').onDelete('CASCADE')
			table.unique(['user_id', 'permission_id'])
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
