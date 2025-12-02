import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import SoftDeleteModel from '#models/anchor/SoftDeleteModel'
import UserPegawaiModel from '#models/UserPegawaiModel'

export default class FaceDescriptorModel extends SoftDeleteModel {
    static table = 'face_descriptors'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare pegawai_id: number

    @column()
    declare descriptor: string

    @column()
    declare filename?: string

    // @ts-ignore
    @belongsTo(() => UserPegawaiModel, { foreignKey: 'pegawai_id' })
    // @ts-ignore
    declare pegawai: BelongsTo<typeof UserPegawaiModel>
}
