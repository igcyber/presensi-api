import { column, BaseModel } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Job extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare type: string

    @column()
    declare payload: string

    @column()
    declare attempts: number

    @column()
    declare max_attempts: number

    @column.dateTime({ autoCreate: false, autoUpdate: false })
    declare available_at: DateTime

    @column.dateTime({ autoCreate: true })
    declare created_at: DateTime
}
