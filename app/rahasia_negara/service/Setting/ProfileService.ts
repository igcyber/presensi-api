import { inject } from '@adonisjs/core'
import fs from 'fs'
import * as path from 'path'
import app from '@adonisjs/core/services/app'

import BaseService from '#IServices/core/BaseService'
import ProfileRepository from '#IRepositories/Setting/ProfileRepository'

import { checkFaceIdValidator, createProfileValidator, updateFaceIdValidator, updatePasswordValidator, updateProfileValidator } from '#IValidations/Setting/ProfileValidation'
import { UserContext } from '#helpers/UserContext'
import { FileHelper } from '#helpers/FileHelpers'
import { FaceApiHelpers } from '#helpers/FaceApiHelpers'

@inject()
export default class ProfileService extends BaseService<
    typeof createProfileValidator,
    typeof updateProfileValidator,
    // @ts-ignore
    ProfileRepository
> { 
    constructor(repository: ProfileRepository) {
        super(repository, createProfileValidator, updateProfileValidator)
    }

    // Disini Bisa Menambahkan Fungsi atau Men-Override Fungsi Pada BaseService
    async indexData(): Promise<any> {
		return this.repository.indexData(UserContext.get().id)
	}

    async updateProfile(data: any): Promise<any> {
        const validated = await this.updateValidator.validate({
            ...data,
            user_id: UserContext.get().id
        })

        const dataPegawai   = {
            nama: validated.nama
        }

        const dataUser      = {
            no_hp: validated.no_hp,
            email: validated.email,
            username: validated.username,
        }

		return this.repository.updateProfile(validated.user_id, dataUser, dataPegawai)
	}

    async updatePassword(data: any): Promise<any> {
        const validated     = await updatePasswordValidator.validate({
            ...data,
            user_id: UserContext.get().id
        })

        const dataPassword  = {
            old_password: validated.old_password,
            password: validated.password
        }

		return this.repository.updatePassword(validated.user_id, dataPassword)
	}

    async updateFaceId(data: any): Promise<any> {
        const folderName    =   'faceregister'
        const user          =   await UserContext.get()
        const validated     =   await updateFaceIdValidator.validate({
            ...data,
            user_id: user.id
        })

        const image                 =   validated.image
        const fileName              =   `${user.id}_${Date.now()}.${image.extname}`

        try {
            if (!image.tmpPath) throw {
                code: 500,
                message: "File upload tidak memiliki path"
            }

            const imageBuffer       =   await fs.promises.readFile(image.tmpPath)
            const savedPathRelative =   await FileHelper.putFile(
                folderName,
                fileName,
                imageBuffer,
                0o755
            )

            const savedPathAbsolute =   path.join(app.makePath('storage'), savedPathRelative)
            const descriptor        =   await FaceApiHelpers.detectFace(savedPathAbsolute)

            if (!descriptor) throw {
                code: 404,
                message: "Wajah Kurang Jelas, Silahkan Coba Lagi"
            }

            const dataFace: Partial<Record<string, any>> = {
                pegawai_id: user.pegawai_id,
                descriptor: JSON.stringify(descriptor),
                filename: fileName
            }

            const checkData: any    =   await this.repository.checkFaceId(user.pegawai_id)

            if (checkData) {
                dataFace.id         =   checkData.id
                const checkFoto     =   await FileHelper.fileExists(folderName, checkData.filename)

                if (checkFoto) await FileHelper.deleteFile(folderName, checkData.filename)
            }

            return this.repository.updateFaceId(dataFace)
        } catch (error) {
            try {
                const exists    =   await FileHelper.fileExists(folderName, fileName)

                if (exists) await FileHelper.deleteFile(folderName, fileName)
            } catch (e) {}

            throw {
                message: error.message
            }
        }
    }

    async checkFaceId(): Promise<any> {
        const user              =   UserContext.get()

        await checkFaceIdValidator.validate({user_id: user.id})

        const checkData: any    =   await this.repository.checkFaceId(user.pegawai_id)

        return {
            is_registered: checkData ? true : false,
            createdAt: checkData ? checkData.created_at : null
        }
    }
}
