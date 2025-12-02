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

export const createProfileValidator = vine.compile(
	vine.object({
		// Kosongkan saja, karena tidak digunakan dan diperlukan untuk inheritance service
	})
)

export const updateFaceIdValidator = vine.compile(
	vine.object({
		user_id: vine.number().exists({
			table: 'users',
			column: 'id'
    	}),

		image: vine.file({
			extnames: ['jpg', 'jpeg', 'png']
		})
	})
)

export const checkFaceIdValidator = vine.compile(
	vine.object({
		user_id: vine.number().exists({
			table: 'users',
			column: 'id'
    	})
	})
)

export const updateProfileValidator = vine.compile(
	vine.object({
		user_id: vine.number().exists({
			table: 'users',
			column: 'id'
    	}),

		nama: vine.string().trim().minLength(1).maxLength(255).optional(),
		email: vine.string().trim().email().use(uniqueEmailExceptRule()),
		username: vine.string().trim().minLength(3).maxLength(255).use(uniqueUsernameExceptRule()),
		no_hp: vine.string().trim().minLength(1).maxLength(255),
  	})
)

export const updatePasswordValidator = vine.compile(
	vine.object({
		user_id: vine.number().exists({
			table: 'users',
			column: 'id'
    	}),

		old_password: vine.string().trim().minLength(6),
		password: vine.string().trim().minLength(6).maxLength(255).confirmed()
  	})
)
