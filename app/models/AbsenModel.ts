import env from '#start/env'

import { belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import SoftDeleteModel from '#models/anchor/SoftDeleteModel'
import UserPegawaiModel from '#models/UserPegawaiModel'

export default class Absen extends SoftDeleteModel {
    static table = 'absens'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare hari_libur_id?: number

    @column()
    declare pegawai_id: number

    @column()
    declare foto?: string

    @computed()
    public get foto_url(): string | null {
        if (!this.foto) return null

        const baseUrl = env.get('APP_URL') || 'http://localhost:3333'
        return `${baseUrl}/api/file/absensi/${this.foto}`
    }

    @column.dateTime({ autoCreate: false, autoUpdate: false })
    declare tanggal_absen: DateTime | null

    @column()
    declare tipe: 'MASUK' | 'PULANG' | 'MASUK_LEMBUR' | 'PULANG_LEMBUR' | 'IZIN' | 'SAKIT' | 'CUTI' | 'LIBUR'

    @column()
    declare lat?: string

    @column()
    declare long?: string

    @column()
    declare akurasi?: number

    // @ts-ignore
    @belongsTo(() => UserPegawaiModel, { foreignKey: 'pegawai_id' })
    // @ts-ignore
    declare pegawai: BelongsTo<typeof UserPegawaiModel>
}
