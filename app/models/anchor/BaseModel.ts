import { column, beforeCreate, beforeUpdate, BaseModel as LucidBaseModel, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { UserContext } from '#helpers/UserContext'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// @ts-ignore
type UserClass = Awaited<typeof import('#models/core/user')>['default']

export default class BaseModel extends LucidBaseModel {
	@column.dateTime({ autoCreate: true })
	declare created_at: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updated_at: DateTime | null

	@column()
	declare created_by?: number | null

	@column()
	declare updated_by?: number | null

	private static formatTimestamp(): string {
		return new Date().toLocaleString('sv-SE').replace('T', ' ')
	}

	@beforeCreate()
	static setCreatedAt(model: BaseModel) {
		// @ts-ignore
		model.created_at = this.formatTimestamp()
		// @ts-ignore
		model.updated_at = this.formatTimestamp()
	}

	@beforeUpdate()
	static setUpdatedAt(model: BaseModel) {
		// @ts-ignore
		model.updated_at = this.formatTimestamp()
	}

	@beforeCreate()
	static setCreatedBy(model: BaseModel) {
		const userId = UserContext.get()
		// @ts-ignore
		if (userId) model.created_by = userId.id
	}

	@beforeUpdate()
	static setUpdatedBy(model: BaseModel) {
		const userId = UserContext.get()
		// @ts-ignore
		if (userId) model.updated_by = userId.id
	}

	@belongsTo(
		// @ts-ignore
		() => import('#models/core/user').then((m) => m.default),
		{ foreignKey: 'created_by' }
	)
    // @ts-ignore
	declare created_by_user: BelongsTo<UserClass>

	@belongsTo(
		// @ts-ignore
		() => import('#models/core/user').then((m) => m.default),
		{ foreignKey: 'updated_by' }
	)
	// @ts-ignore
	declare updated_by_user: BelongsTo<UserClass>
}
