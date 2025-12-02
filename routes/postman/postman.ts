import env from '#start/env'
import router from '@adonisjs/core/services/router'
import app from '@adonisjs/core/services/app'
import { readFile } from 'node:fs/promises'
import { renderDocs } from '#helpers/ForPostmanGenerate'


if (env.get('NODE_ENV') !== 'production') {
    router.group(() => {
        router.get('/rahasia', async ({ response }) => {
            const filePath      =   app.makePath('routes/postman/postman_collection.json')
            const file          =   await readFile(filePath, 'utf8')
            const collection    =   JSON.parse(file)
    
            const html          =   renderDocs(collection)
    
            return response.type('html').send(html)
        })
    }).prefix('/kang-pos')
}