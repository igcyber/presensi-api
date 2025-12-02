import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

export const createTipePegawaiValidator = vine.compile(
	vine.object({
		nama: vine.string().trim().minLength(1).maxLength(255),
	})
)

export const updateTipePegawaiValidator = vine.compile(
	vine.object({
		nama: vine.string().trim().minLength(1).maxLength(255).optional()
	})
)