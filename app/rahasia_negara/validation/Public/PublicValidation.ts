import vine from '@vinejs/vine'

import { messageProvider } from '#appProviders/MessageProvider'

vine.messagesProvider = messageProvider

export const createPublicValidator = vine.compile(
	vine.object({
		// 
	})
)

export const updatePublicValidator = vine.compile(
	vine.object({
		// 
	})
)
