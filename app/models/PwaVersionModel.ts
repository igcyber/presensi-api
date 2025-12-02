import { column } from '@adonisjs/lucid/orm'

import SoftDeleteModel from '#models/anchor/SoftDeleteModel'

export default class PwaVersionModel extends SoftDeleteModel {
	static table = '_pwa_versions'

	@column({ isPrimary: true })
	declare id: number

    @column()
	declare version: string

	@column()
	declare key: string
}
