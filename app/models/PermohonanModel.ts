import env from '#start/env'

import { belongsTo, column, computed } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import SoftDeleteModel from '#models/anchor/SoftDeleteModel'
import UserPegawaiModel from '#models/UserPegawaiModel'
import User from '#models/core/user'

export default class PermohonanModel extends SoftDeleteModel {
    static table = 'permohonans'

    static $visible = [
        'file_pendukung_url'
    ]

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare pegawai_id: number

    @column()
    declare verifikator_id?: number

    @column()
    declare tipe: 'Izin' | 'Sakit' | 'Cuti'

    @column.dateTime({ autoCreate: false, autoUpdate: false })
    declare tanggal_pengajuan: DateTime

    @column()
    declare keterangan_pengajuan?: string

    @column()
    declare file_pendukung?: string | null

    @computed()
    public get file_pendukung_url(): string | null {
        if (!this.file_pendukung) return null

        const baseUrl = env.get('APP_URL') || 'http://localhost:3333'
        return `${baseUrl}/api/file/permohonan/${this.file_pendukung}`
    }

    @column()
    declare status: 'pending' | 'diterima' | 'ditolak' | 'batal'

    @column.dateTime({ autoCreate: false, autoUpdate: false })
    declare tanggal_verifikator?: DateTime

    @column()
    declare keterangan_verifikator?: string

    // @ts-ignore
    @belongsTo(() => UserPegawaiModel, { foreignKey: 'pegawai_id' })
    // @ts-ignore
    declare pegawai: BelongsTo<typeof UserPegawaiModel>

    // @ts-ignore
    @belongsTo(() => User, { foreignKey: 'verifikator_id' })
    // @ts-ignore
    declare verifikator: BelongsTo<typeof User>
}
