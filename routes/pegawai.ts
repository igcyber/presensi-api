import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { wrapRoute } from '#helpers/WrapRouter'

import AbsenController from '#controllers/Pegawai/AbsenController'
import RekapAbsenController from '#controllers/Pegawai/RekapAbsenController'
import RiwayatAbsenController from '#controllers/Pegawai/RiwayatAbsenController'
import PermohonanController from '#controllers/Pegawai/PermohonanController'

const wrap = await wrapRoute([
	AbsenController,
	RekapAbsenController,
	RiwayatAbsenController,
	PermohonanController
])

router.group(() => {
	// Absen
    router.group(() => {
        router.get('/', wrap.AbsenController.index)
        router.post('/', wrap.AbsenController.store)
    }).prefix('/absen')

	// Rekap Absen
    router.group(() => {
        router.get('/', wrap.RekapAbsenController.rekapData)
    }).prefix('/rekap-absen')

	// Riwayat Absen
	router.group(() => {
        router.get('/', wrap.RiwayatAbsenController.index)
    }).prefix('/riwayat-absen')

	// Pengajuan Tidak Hadir
	router.group(() => {
        router.get('/', wrap.PermohonanController.index)
		router.get('/status-permohonan', wrap.PermohonanController.statusPermohonan)
		router.post('/', wrap.PermohonanController.store)
		router.put('/:id/batal', wrap.PermohonanController.update)
    }).prefix('/pengajuan-tidak-hadir')

}).prefix('/api/pegawai').use([middleware.auth(), middleware.hasRole(['pegawai'])])
