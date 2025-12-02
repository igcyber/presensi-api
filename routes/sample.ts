import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { wrapRoute } from '#helpers/WrapRouter'

import SampleController from '#controllers/sample/SampleController'
import SampleJobController from '#controllers/sample/SampleJobController'

const wrap = await wrapRoute([
	SampleController,
])

router.group(() => {
	router.get('/', wrap.SampleController.index)
	router.post('/', wrap.SampleController.store)
	router.put('/:id', wrap.SampleController.update)
	router.delete('/:id', wrap.SampleController.destroy)
}).prefix('/samples')
// .use([middleware.auth(), middleware.hasRole(['admin'])]) // Ini Kalau Mau Menggunakan User Auth Dengan Role Admin
.use([middleware.auth()])

router.group(() => {
	router.post('/single', [ SampleJobController, 'single'])
	router.post('/multiple', [ SampleJobController, 'multiple'])
}).prefix('/api/samples-job')
