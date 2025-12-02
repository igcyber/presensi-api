import { column } from '@adonisjs/lucid/orm'

import SoftDeleteModel from '#models/anchor/SoftDeleteModel'

export default class TipePegawaiModel extends SoftDeleteModel {
    static table = 'tipe_pegawais'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare nama: string
}
