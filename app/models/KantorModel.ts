import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import SoftDeleteModel from '#models/anchor/SoftDeleteModel'
import UserPegawaiModel from '#models/UserPegawaiModel'

export default class KantorModel extends SoftDeleteModel {
    static table = 'kantors'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare nama: string

    @column()
    declare alamat?: string

    @column()
    declare lat?: string

    @column()
    declare long?: string

    @column()
    declare deskripsi?: string

    @column()
    declare radius_limit: number

    @column({
        consume: (value: string | null) => (value),
        prepare: (value: number[] | null) => (value ? JSON.stringify(value) : '[]'),
    })
    declare except_user: number[]

    @column()
    declare jam_masuk: string

    @column()
    declare jam_pulang: string

    // @ts-ignore
    @hasMany(() => UserPegawaiModel, {
        foreignKey: 'kantor_id',
        localKey: 'id',
    })
    // @ts-ignore
    declare pegawai: HasMany<typeof UserPegawaiModel>
}
