import SoftDeleteModel from '#models/anchor/SoftDeleteModel'
import { column } from '@adonisjs/lucid/orm'

export default class Sample extends SoftDeleteModel {
    static table = '_samples'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare nama: string

    @column()
    declare judul: string
}
