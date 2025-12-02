import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

const uniqueEmailExceptRule		=	vine.createRule( async (value: unknown, _, field) => {
	if (typeof value !== 'string') return

	const userId	=	field.parent.user_id as number
	const query		=	db.from('users').where('email', value)

	if (userId) query.whereNot('id', userId)

	const row		=	await query.first()

	if (row) field.report('Email sudah digunakan oleh user lain.', 'database.uniqueEmailExcept', field)
})

const uniqueUsernameExceptRule	=	vine.createRule(async (value: unknown, _, field) => {
	if (typeof value !== 'string' || !field.parent.user_id) return

	const userId	=	field.parent.user_id as number

	const row		=	await db.from('users').where('username', value).whereNot('id', userId).first()

	if (row) field.report('Username sudah digunakan oleh user lain.', 'database.uniqueUsernameExcept', field)
})

export const createPegawaiValidator = vine.compile(
	vine.object({
		tipe_pegawai_id: vine.number().exists({
			table: 'tipe_pegawais',
			column: 'id'
    	}),

		kantor_id: vine.number().exists({
			table: 'kantors',
			column: 'id'
    	}),

		nama: vine.string().trim().minLength(1).maxLength(255),

		check_radius: vine.enum(['YA', 'TIDAK'] as const),
    
		lat: vine.string(),

		long: vine.string(),

		no_hp: vine.string().trim().minLength(1).maxLength(255),

		email: vine.string().trim().email().unique({
			table: 'users',
			column: 'email'
		}),

		username: vine.string().trim().minLength(1).maxLength(255).unique({
			table: 'users',
			column: 'username'
		}),

		password: vine.string().trim().minLength(6).maxLength(255).confirmed(),
	})
)

export const updatePegawaiValidator = vine.compile(
	vine.object({
		id: vine.number().exists({
			table: 'user_pegawais',
			column: 'id'
    	}),

		tipe_pegawai_id: vine.number().exists({
			table: 'tipe_pegawais',
			column: 'id'
    	}).optional(),

		kantor_id: vine.number().exists({
			table: 'kantors',
			column: 'id'
    	}).optional(),

		nama: vine.string().trim().minLength(1).maxLength(255).optional(),

		check_radius: vine.enum(['YA', 'TIDAK'] as const).optional(),
    
		lat: vine.string().optional(),

		long: vine.string().optional(),

		email: vine.string().trim().email().optional().use(uniqueEmailExceptRule()),
		username: vine.string().trim().minLength(3).maxLength(255).optional().use(uniqueUsernameExceptRule()),
		no_hp: vine.string().trim().minLength(1).maxLength(255).optional(),
	})
)
