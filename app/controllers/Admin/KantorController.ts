import { inject } from '@adonisjs/core'

import KantorService from '#IServices/Admin/KantorService'
import BaseController from '#controllers/core/BaseController'

@inject()
export default class KantorController extends BaseController<KantorService> {
    constructor(service: KantorService) {
        super(service)
    }

    // override di sini jika mau custom atau menambahkan method
}
