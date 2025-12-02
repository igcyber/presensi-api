import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth/AuthController'

router.group(() => {
	router.post('/login', [AuthController, 'login']).use([middleware.guest()])
	router.post('/refresh-token', [AuthController, 'refreshToken']).use([middleware.guest()])
	router.post('/logout', [AuthController, 'logout']).use([middleware.auth()])
}).prefix('/api/auth')