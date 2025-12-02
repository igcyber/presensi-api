import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import Role from '#models/core/role'
import User from '#models/core/user'

export default class Permission extends BaseModel {
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

	@manyToMany(() => Role, { pivotTable: 'role_permissions' })
	declare roles: ManyToMany<typeof Role>

	// @ts-ignore
	@manyToMany(() => User, { pivotTable: 'user_permissions' })
	// @ts-ignore
	declare users: ManyToMany<typeof User>
}
