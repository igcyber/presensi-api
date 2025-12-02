import { JwtGuard } from '#config/jwt'
import { tokensUserProvider } from '@adonisjs/auth/access_tokens'
import env from '#start/env'
import { HttpContext } from '@adonisjs/core/http'

import hash from '@adonisjs/core/services/hash'

import type { HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'

import { compose } from '@adonisjs/core/helpers'
import { column, hasOne, manyToMany } from '@adonisjs/lucid/orm'

import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

import SoftDeleteModel from '#models/anchor/SoftDeleteModel'

import Role from '#models/core/role'
import Permission from '#models/core/permission'
import UserPegawai from '#models/UserPegawaiModel'

const AuthFinder = withAuthFinder(() => hash.use('bcrypt'), {
	uids: ['email', 'username'],
	passwordColumnName: 'password',
})

const jwtConfig = {
	secret: env.get('APP_KEY')
}

const apiUserProvider = tokensUserProvider({
	tokens: 'accessTokens',
	// @ts-ignore
	model: () => import('#models/core/user'),
})

// @ts-ignore
export default class User extends compose(SoftDeleteModel, AuthFinder) {
  	static table = 'users'

	/**
	 * Instance getter version of accessTokens
	 * Untuk Memanggil: user.accessTokens.generate(user)
	 */
	get accessTokens() {
		const ctx = HttpContext.get()!

		return new JwtGuard(ctx, apiUserProvider, jwtConfig)
	}

	@column({ isPrimary: true })
	declare id: number

	@column()
	declare username: string

	@column()
	declare email: string

	@column({ serializeAs: null })
	declare password: string

	@column()
	declare no_hp?: string

	// @ts-ignore
	@hasOne(() => UserPegawai, {
		localKey: 'id',
		foreignKey: 'user_id'
	})
	// @ts-ignore
	declare userPegawai: HasOne<typeof UserPegawai>

	@manyToMany(() => Role, { pivotTable: 'user_roles' })
	declare roles: ManyToMany<typeof Role>

	@manyToMany(() => Permission, { pivotTable: 'user_permissions' })
	declare permissions: ManyToMany<typeof Permission>

	async hasRole(slug: string) {
		// @ts-ignore
		const roles = await this.related('roles' as any).query()

		return roles.some((r: any) => r.slug === slug)
	}

	async hasPermission(slug: string) {
		// @ts-ignore
		const direct	=	(await this.related('permissions' as any).query()).some((p: any) => p.slug === slug)
		if (direct) return true

		// @ts-ignore
		const roles		=	await this.related('roles' as any).query().preload('permissions')

		return roles.some((r: any) => r.permissions.some((p: any) => p.slug === slug))
	}
}
