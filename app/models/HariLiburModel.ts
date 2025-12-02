import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import { DateTime } from 'luxon'

import SoftDeleteModel from '#models/anchor/SoftDeleteModel'
import AbsenModel from '#models/AbsenModel'

export default class HariLiburModel extends SoftDeleteModel {
	static table = 'hari_liburs'

	@column({ isPrimary: true })
	declare id: number

	@column.dateTime({ autoCreate: false, autoUpdate: false })
	declare tanggal?: DateTime

    @column()
    declare keterangan?: string

	// @ts-ignore
	@hasMany(() => AbsenModel, {
		foreignKey: 'hari_libur_id',
		localKey: 'id',
	})
	// @ts-ignore
	declare absen: HasMany<typeof AbsenModel>
}
