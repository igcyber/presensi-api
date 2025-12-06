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

			const { refresh_token } =	request.only(['refresh_token'])

			if (!refresh_token) return ResponseHelper.badRequest(response, 'refresh_token dibutuhkan')

			let payload: any
			try {
				payload				=	jwt.verify(refresh_token, env.get('APP_KEY'))
			} catch (e) {
				return ResponseHelper.unauthorized(response, 'Refresh token tidak valid atau sudah expired')
			}

			if (typeof payload !== 'object' || !('id' in payload) || !('jti' in payload)) {
				return ResponseHelper.unauthorized(response, 'Payload refresh token tidak valid')
			}

			const tokens			=	await AccessToken.query().where('type', 'refresh')
			.where('tokenableId', payload.id).where('key', payload.jti)
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
			const user				=	await User.find(tokenRecord.tokenableId)
			if (!user || user.deleted_at) return ResponseHelper.unauthorized(response, 'User tidak aktif')

			await AccessToken.query().where('tokenableId', user.id)
			.where('key', tokenRecord.key).delete()

			const token				=	await user.accessTokens.generate(user)

			return ResponseHelper.success(response, 'Token refreshed', token)
		} catch (error: any) {
			return ResponseHelper.serverError(response, error.message || 'Proses refresh token gagal')
		}
	}

	public async logout({ request, response }: HttpContext) {
		try {
			await request.validateUsing(refreshTokenAndLogoutValidator)

			const { refresh_token }	=	request.only(['refresh_token'])

			if (!refresh_token) return ResponseHelper.badRequest(response, 'Refresh token dibutuhkan')

			let payload: any

			try {
				payload		=	jwt.verify(refresh_token, env.get('APP_KEY'))
			} catch {
				return ResponseHelper.badRequest(response, 'Invalid refresh token')
			}

			if (!payload || typeof payload !== 'object' || !('id' in payload) || !('jti' in payload)) {
				return ResponseHelper.error(response, 401, 'Refresh Token Tidak Valid', {
					redirect: 'api/auth/login'
				})
			}

			await AccessToken.query().where('tokenableId', payload.id)
			.where('key', payload.jti).delete()

			return ResponseHelper.success(response, 'Proses Logout Berhasil Dilakukan')
		} catch (err: any) {
			return ResponseHelper.serverError(response, err.message || 'Proses Logout Gagal Dilakukan')
		}
	}
}
