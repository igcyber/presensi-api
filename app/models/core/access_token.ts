import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class AccessToken extends BaseModel {
  	public static table = 'auth_access_tokens'

	@column({ isPrimary: true })
	declare id: number

	@column({ columnName: 'tokenable_id' })
	declare tokenableId: number

	@column()
	declare type: string

	@column()
	declare name: string | null

	@column()
	declare hash: string

	@column()
	declare abilities: string

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@column.dateTime()
	declare expiresAt: DateTime | null

	@column.dateTime()
	declare lastUsedAt: DateTime | null
}
