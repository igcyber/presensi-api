import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

export const registerValidator = vine.compile(
	vine.object({
		name: vine.string().trim().optional(),
		username: vine.string().trim().minLength(4).unique({
			table: 'users',
			column: 'username'
		}),
		email: vine.string().trim().email().unique({
			table: 'users',
			column: 'email'
		}),
		password: vine.string().minLength(8).confirmed(),
		nip: vine.string().trim().optional(),
	})
)

export const loginValidator = vine.compile(
	vine.object({
		username: vine.string(),
		password: vine.string(),
	})
)

export const refreshTokenAndLogoutValidator = vine.compile(
	vine.object({
		refresh_token: vine.string()
	})
)
