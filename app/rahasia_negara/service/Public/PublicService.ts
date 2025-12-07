import { inject } from '@adonisjs/core'
import fs from 'fs'
import path from 'path'
import app from '@adonisjs/core/services/app'

import BaseService from '#IServices/core/BaseService'
import PublicRepository from '#IRepositories/Public/PublicRepository'
import { createPublicValidator, updatePublicValidator } from '#IValidations/Public/PublicValidation'

@inject()
export default class PublicService extends BaseService<
    typeof createPublicValidator,
    typeof updatePublicValidator,
    // @ts-ignore
    PublicRepository
> {
    constructor(repository: PublicRepository) {
        super(repository, createPublicValidator, updatePublicValidator)
    }

    public async getFile(params: any) {
        const filePath     =  path.join(app.makePath('storage'), params.join('/'))

        if (!fs.existsSync(filePath)) throw {
            code: 404,
            message: 'File Tidak Ditemukan'
        }

        return filePath
    }

    async pwaLatest(): Promise<any> {
        const data          =   await this.repository.pwaLatest()

        return data ? {
            version: data?.version,
            key: data?.key,
        } : null
    }
}
