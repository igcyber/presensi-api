import PublicController from '#controllers/PublicController'
import router from '@adonisjs/core/services/router'

router.group(() => {
	router.get('/file/*', [ PublicController, 'getFile' ])
}).prefix('/api')