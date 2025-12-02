import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { wrapRoute } from '#helpers/WrapRouter'

import ProfileController from '#controllers/Setting/ProfileController'

const wrap = await wrapRoute([
    ProfileController
])

router.group(() => {
    // Profile
    router.group(() => {
        router.get('/', wrap.ProfileController.index)
        router.put('/update-profile', wrap.ProfileController.updateProfile)
        router.put('/update-password', wrap.ProfileController.updatePassword)
        router.post('/face-id', wrap.ProfileController.updateFaceId)
        router.get('/check-face-id', wrap.ProfileController.checkFaceId)
    }).prefix('/profile')
}).prefix('/api/setting').use([middleware.auth()])
