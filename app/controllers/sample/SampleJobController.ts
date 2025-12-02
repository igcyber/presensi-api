import { dispatch } from '#queues/support/Dispatch'
import { Bus } from '#queues/support/Bus'

import type { HttpContext } from '@adonisjs/core/http'
import * as ResponseHelper from '#helpers/ResponseHelper'

import CreateSample from '#jobs/sample/CreateSample'
import { createSampleValidator } from '#IValidations/sample/SampleValidation'

export default class SampleJobController {
    async single({ response, request }: HttpContext) {
        try {
            const data   =   await request.validateUsing(createSampleValidator)

            await dispatch(
                new CreateSample(data)
            ).delay(60).dispatch()

            return ResponseHelper.success(response, 'Berhasil Membuat Job')
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }

    async multiple({ response }: HttpContext) {
        try {
            const samples = [
                { nama: 'Sample 1', judul: 'Judul 1' },
                { nama: 'Sample 2', judul: 'Judul 2' },
                { nama: 'Sample 3', judul: 'Judul 3' },
            ]

            const jobs = samples.map( (item: any) => new CreateSample(item) )

            await Bus.batch(jobs).dispatch()

            return {
                message: 'Batch job berhasil dikirim ke queue',
                total: jobs.length,
            }
        } catch (error: any) {
            return ResponseHelper.badRequest(response, error.message, error)
        }
    }
}
