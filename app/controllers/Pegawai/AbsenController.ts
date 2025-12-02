import { inject } from '@adonisjs/core'

import BaseController from '#controllers/core/BaseController'
import AbsenService from '#IServices/Pegawai/AbsenService'

@inject()
export default class AbsenController extends BaseController<AbsenService> {
    constructor(service: AbsenService) {
        super(service)
    }

    // override di sini jika mau custom atau menambahkan method
}
