import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

export const createSampleValidator = vine.compile(
	vine.object({
		nama: vine.string().trim().minLength(1).maxLength(255),
		judul: vine.string().trim().minLength(1).maxLength(255),
	})
)

export const updateSampleValidator = vine.compile(
	vine.object({
		nama: vine.string().trim().minLength(1).maxLength(255).optional(),
		judul: vine.string().trim().minLength(1).maxLength(255).optional(),
	})
)
