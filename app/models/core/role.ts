import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import Permission from '#models/core/permission'
import User from '#models/core/user'

export default class Role extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare name: string

	@column()
	declare slug: string

	@column.dateTime({ autoCreate: true })
	declare created_at: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updated_at: DateTime | null

	@column()
	declare created_by?: number | null

	@column()
	declare updated_by?: number | null

	@manyToMany(() => Permission, { pivotTable: 'role_permissions' })
	declare permissions: ManyToMany<typeof Permission>

	// @ts-ignore
	@manyToMany(() => User, { pivotTable: 'user_roles' })
	// @ts-ignore
	declare users: ManyToMany<typeof User>
}
