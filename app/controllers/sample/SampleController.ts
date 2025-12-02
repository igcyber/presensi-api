import { inject } from '@adonisjs/core'
import SampleService from '#IServices/sample/SampleService'
import BaseController from '#controllers/core/BaseController'

@inject()
export default class SampleController extends BaseController<SampleService> {
    constructor(sampleService: SampleService) {
        super(sampleService)
    }

    // override di sini jika mau custom method
}
