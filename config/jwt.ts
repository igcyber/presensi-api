import * as ResponseHelper from '#helpers/ResponseHelper'

import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'

import { randomUUID } from 'crypto'
import { symbols } from '@adonisjs/auth'
import { AuthClientResponse, GuardContract } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'

import AccessToken from '#models/core/access_token'

export type JwtGuardUser<RealUser> = {
    getId(): string | number | BigInt
    getOriginal(): RealUser
}

export interface JwtUserProviderContract<RealUser> {
    [symbols.PROVIDER_REAL_USER]: RealUser

    createUserForGuard(user: RealUser): Promise<JwtGuardUser<RealUser>>
    findById(identifier: string | number | BigInt): Promise<JwtGuardUser<RealUser> | null>
}

export type JwtGuardOptions = {
    secret: string
}

export class JwtGuard< UserProvider extends JwtUserProviderContract<unknown> > implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
    #ctx: HttpContext
    #userProvider: UserProvider
    #options: JwtGuardOptions

    constructor(ctx: HttpContext, userProvider: UserProvider, options: JwtGuardOptions) {
        this.#ctx = ctx
        this.#userProvider = userProvider
        this.#options = options
    }

    declare [symbols.GUARD_KNOWN_EVENTS]: {}

    driverName: 'jwt' = 'jwt'

    authenticationAttempted = false
    isAuthenticated = false

    user?: UserProvider[typeof symbols.PROVIDER_REAL_USER]

    /**
     * CREATE TOKEN
     */
    async generate(user: UserProvider[typeof symbols.PROVIDER_REAL_USER]) {
        // @ts-ignore
        await user.load('roles', (q: any) => q.preload('permissions'))
        // @ts-ignore
        await user.load('userPegawai', (q: any) => q.preload('kantor'))

        const providerUser: any =   await this.#userProvider.createUserForGuard(user)

        // @ts-ignore
        const roles             =   user.roles.map((r: any) => r.slug)
        // @ts-ignore
        const permissions       =   user.roles.flatMap((r: any) => r.permissions.map((p: any) => p.slug))
        // @ts-ignore
        const userPegawai       =   user.userPegawai

        const payload: any = {
            id: providerUser.getId(),
            // @ts-ignore
            email: user.email,
            // @ts-ignore
            username: user.username,
            // @ts-ignore
            nama: userPegawai?.nama || user.username,
            // @ts-ignore
            no_hp: user.no_hp,
            roles,
            permissions,
            kantor: userPegawai?.kantor?.nama || null,
            kantor_id: userPegawai?.kantor?.id || null,
            jti: randomUUID()
        }

        const accessToken = jwt.sign(payload, this.#options.secret, {
            expiresIn: '1d'
        })

        const refreshToken = jwt.sign(payload, this.#options.secret, {
            expiresIn: '7d'
        })

        await AccessToken.create({
            tokenableId: providerUser.getId(),
            key: payload.jti,
            type: 'access',
            name: 'auth_access_token',
            hash: await hash.make(accessToken),
            abilities: JSON.stringify(permissions),
            expiresAt: DateTime.now().plus({ days: 1 })
        })

        await AccessToken.create({
            tokenableId: providerUser.getId(),
            key: payload.jti,
            type: 'refresh',
            name: 'auth_refresh_token',
            hash: await hash.make(refreshToken),
            abilities: JSON.stringify(permissions),
            expiresAt: DateTime.now().plus({ days: 7 })
        })

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: payload
        }
    }

    /**
     * AUTHENTICATE REQUEST
     */
    async authenticate(): Promise<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {        
        if (this.authenticationAttempted) return this.getUserOrFail()

        this.authenticationAttempted    =   true
        const authHeader                =   this.#ctx.request.header('authorization')

        if (!authHeader) return ResponseHelper.unauthorized(this.#ctx.response, 'Unauthorized access')

        const token                     =   authHeader.replace('Bearer ', '').trim()
        if (!token) return ResponseHelper.unauthorized(this.#ctx.response, 'Unauthorized access')

        let payload: any

        try {
            payload = jwt.verify(token, this.#options.secret)
        } catch (e) {
            return ResponseHelper.unauthorized(this.#ctx.response, 'Token Anda Sudah Expired')
        }

        if (typeof payload !== 'object' || !('id' in payload) || !('jti' in payload)) {
            return ResponseHelper.unauthorized(this.#ctx.response, 'Unauthorized access')
        }

        const providerUser              =   await this.#userProvider.findById(payload.id)
        if (!providerUser) return ResponseHelper.unauthorized(this.#ctx.response, 'Unauthorized access')

        const user                      =   providerUser.getOriginal()

        // @ts-ignore
        const accessTokens = await AccessToken.query().where('tokenableId', user.id)
        .where('type', 'access').where('key', payload.jti)

        let validToken                  =   false
        for (const t of accessTokens) {
            if (await hash.verify(t.hash, token)) {
                validToken = true

                break
            }
        }

        if (!validToken) return ResponseHelper.unauthorized(this.#ctx.response, 'Access token sudah di-revoke / tidak valid')

        this.user                       =   user
        this.isAuthenticated            =   true

        return this.getUserOrFail()
    }

    async check(): Promise<boolean> {
        try {
            await this.authenticate()

            return true
        } catch {
            return false
        }
    }

    getUserOrFail(): UserProvider[typeof symbols.PROVIDER_REAL_USER] {
        if (!this.user) return ResponseHelper.unauthorized(this.#ctx.response, 'Token Anda Sudah Expired')

        return this.user
    }

    async authenticateAsClient(user: UserProvider[typeof symbols.PROVIDER_REAL_USER]): Promise<AuthClientResponse> {
        const token     =   await this.generate(user)

        return {
            headers: {
                authorization: `Bearer ${token.access_token}`
            }
        }
    }
}
