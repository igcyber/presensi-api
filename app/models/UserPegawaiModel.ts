import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import SoftDeleteModel from '#models/anchor/SoftDeleteModel'
import User from '#models/core/user'

import TipePegawaiModel from '#models/TipePegawaiModel'
import KantorModel from './KantorModel.js'

export default class UserPegawai extends SoftDeleteModel {
    static table = 'user_pegawais'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare user_id?: number

    @column()
    declare tipe_pegawai_id?: number

    @column()
    declare kantor_id?: number

    @column()
    declare nama: string

    @column()
    declare check_radius: 'YA' | 'TIDAK'

    @column()
    declare lat?: string

    @column()
    declare long?: string

    // @ts-ignore
    @belongsTo( () => User, { foreignKey: 'user_id' })
    // @ts-ignore
    public user: BelongsTo<typeof User>

    // @ts-ignore
    @belongsTo(() => TipePegawaiModel, { foreignKey: 'tipe_pegawai_id' })
    // @ts-ignore
    public tipePegawai: BelongsTo<typeof TipePegawaiModel>

    // @ts-ignore
    @belongsTo(() => KantorModel, { foreignKey: 'kantor_id' })
    // @ts-ignore
    public kantor: BelongsTo<typeof KantorModel>
}
