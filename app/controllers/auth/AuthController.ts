import { HttpContext } from '@adonisjs/core/http'
import { loginValidator, refreshTokenAndLogoutValidator } from '#IValidations/core/auth'
import { DateTime } from 'luxon'

import jwt from 'jsonwebtoken'
import hash from '@adonisjs/core/services/hash'
import env from '#start/env'

import * as ResponseHelper from '#helpers/ResponseHelper'

import User from '#models/core/user'
import AccessToken from '#models/core/access_token'

export default class AuthController {
	public async login({ request, response }: HttpContext) {
		const { username, password } = await request.validateUsing(loginValidator)

		try {
			// @ts-ignore
			const user	=	await User.verifyCredentials(username, password)

			// @ts-ignore
			const token	=	await user.accessTokens.generate(user)

			return response.ok({
				success: true,
				message: 'Login success',
				data: token
			})
		} catch (error) {
			return response.unauthorized({
				success: false,
				message: error.message
			})
		}
	}

	public async refreshToken({ request, response }: HttpContext) {
		try {
			await request.validateUsing(refreshTokenAndLogoutValidator)

			const { refresh_token } = request.only(['refresh_token'])

			if (!refresh_token) return ResponseHelper.badRequest(response, 'refresh_token dibutuhkan')

			const tokens	=	await AccessToken.query().where('type', 'refresh')
			.andWhere('expires_at', '>', DateTime.now().toSQL()).orderBy('id', 'desc')

			let tokenRecord: AccessToken | null = null

			for (const t of tokens) {
				if (await hash.verify(t.hash, refresh_token)) {
					tokenRecord = t

					break
				}
			}

			if (!tokenRecord) return ResponseHelper.error(response, 401, 'Refresh Token Tidak Valid', {
				redirect: 'api/auth/login'
			})

			// @ts-ignore
			const user		=	await User.find(tokenRecord.tokenableId)

			if (!user) return ResponseHelper.unauthorized(response, 'User tidak Ditemukan')

			await tokenRecord.delete()

			const token		=	await user.accessTokens.generate(user)

			return ResponseHelper.success(response, 'Token refreshed', token)
		} catch (error) {
			return response.unauthorized({
				success: false,
				message: error.message
			})
		}
	}

	public async logout({ request, response }: HttpContext) {
		try {
			await request.validateUsing(refreshTokenAndLogoutValidator)

			const { refresh_token }	=	request.only(['refresh_token'])

			if (!refresh_token) return ResponseHelper.badRequest(response, 'refresh token dibutuhkan')

			let payload: any

			try {
				payload		=	jwt.verify(refresh_token, env.get('APP_KEY'))
			} catch {
				return ResponseHelper.badRequest(response, 'Invalid refresh token')
			}

			const tokens	=	await AccessToken.query().where('type', 'refresh')
			.where('tokenable_id', payload.id)

			let revoked		=	false

			for (const t of tokens) {
				if (await hash.verify(t.hash, refresh_token)) {
					await t.delete()

					revoked = true

					break
				}
			}

			if (!revoked) return ResponseHelper.error(response, 401, 'Refresh Token Tidak Valid', {
				redirect: 'api/auth/login'
			})

			return ResponseHelper.success(response, 'Proses Logout Berhasil Dilakukan')
		} catch (err) {
			return ResponseHelper.serverError(response, 'Proses Logout Gagal Dilakukan')
		}
	}
}
