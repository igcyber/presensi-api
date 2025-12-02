import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import BaseModel from '#models/anchor/BaseModel'

// @ts-ignore
export default class SoftDeleteModel extends compose(BaseModel, SoftDeletes) {
	static softDeleteColumn = 'deleted_at'
}
