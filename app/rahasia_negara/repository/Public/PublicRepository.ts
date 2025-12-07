import { inject } from '@adonisjs/core'

import PwaVersionModel from '#models/PwaVersionModel'

@inject()
export default class PublicRepository {

    async pwaLatest(): Promise<PwaVersionModel | null>
    {
        // @ts-ignore
        return PwaVersionModel.query().orderBy('id', 'desc').first()
    }
}
