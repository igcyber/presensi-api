import { defineConfig } from '@adonisjs/auth'
import type { InferAuthenticators, InferAuthEvents, Authenticators } from '@adonisjs/auth/types'

import env from '#start/env'
import { tokensUserProvider } from '@adonisjs/auth/access_tokens'
import { JwtGuard } from '#config/jwt'

const jwtConfig = {
	secret: env.get('APP_KEY')
}

const authConfig = defineConfig({
	default: 'api',
	guards: {
		api: (ctx) => {
			const apiUserProvider = tokensUserProvider({
				tokens: 'accessTokens',
				// @ts-ignore
				model: () => import('#models/core/user'),
			})

			return new JwtGuard(ctx, apiUserProvider, jwtConfig)
		},
	}
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
	export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}

declare module '@adonisjs/core/types' {
	interface EventsList extends InferAuthEvents<Authenticators> {}
}