import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { wrapRoute } from '#helpers/WrapRouter'

import DashboardController from '#controllers/Admin/DashboardController'
import KantorController from '#controllers/Admin/KantorController'
import TipePegawaiController from '#controllers/Admin/TipePegawaiController'
import PegawaiController from '#controllers/Admin/PegawaiController'
import PermohonanController from '#controllers/Admin/PermohonanController'
import HariLiburController from '#controllers/Admin/HariLiburController'
import RekapAbsenController from '#controllers/Admin/RekapAbsenController'
import PwaVersionController from '#controllers/Admin/PwaVersionController'

const wrap = await wrapRoute([
    DashboardController,
    KantorController,
	TipePegawaiController,
    PegawaiController,
    PermohonanController,
    HariLiburController,
    RekapAbsenController,
    PwaVersionController
])

router.group(() => {
    // Dashboard
    router.group(() => {
        router.get('/summary', wrap.DashboardController.summary)
        router.get('/chart', wrap.DashboardController.chart)
        router.get('/daily', wrap.DashboardController.daily)
    }).prefix('/dashboard')

    // Kantor
    router.group(() => {
        router.get('/', wrap.KantorController.index)
        router.get('/:id', wrap.KantorController.findById)
        router.post('/', wrap.KantorController.store)
        router.put('/:id', wrap.KantorController.update)
        router.delete('/:id', wrap.KantorController.destroy)
    }).prefix('/kantor')

    // Tipe Pegawai
    router.group(() => {
        router.get('/', wrap.TipePegawaiController.index)
        router.get('/list-tipe-pegawai', wrap.TipePegawaiController.allData)
        router.get('/:id', wrap.TipePegawaiController.findById)
        router.post('/', wrap.TipePegawaiController.store)
        router.put('/:id', wrap.TipePegawaiController.update)
        router.delete('/:id', wrap.TipePegawaiController.destroy)
    }).prefix('/tipe-pegawai')

    // Pegawai
    router.group(() => {
        router.get('/', wrap.PegawaiController.index)
        router.get('/list-pegawai', wrap.PegawaiController.allData)
        router.get('/:id', wrap.PegawaiController.findById)
        router.post('/', wrap.PegawaiController.store)
        router.put('/:id', wrap.PegawaiController.update)
        router.delete('/:id', wrap.PegawaiController.destroy)
    }).prefix('/pegawai')

    // Permohonan
    router.group(() => {
        router.get('/', wrap.PermohonanController.index)
        router.get('/:id', wrap.PermohonanController.findById)
        router.post('/:id/verify', wrap.PermohonanController.verify)
    }).prefix('/permohonan')

    // Hari Libur
    router.group(() => {
        router.get('/', wrap.HariLiburController.index)
        router.get('/:id', wrap.HariLiburController.findById)
        router.post('/', wrap.HariLiburController.store)
        router.put('/:id', wrap.HariLiburController.update)
        router.delete('/:id', wrap.HariLiburController.destroy)
    }).prefix('/hari-libur')

    // Rekap Absen
    router.group(() => {
        router.get('/', wrap.RekapAbsenController.rekapData)
    }).prefix('/rekap-absen')

    // PWA Versioning
    router.group(() => {
        router.get('/', wrap.PwaVersionController.index)
        router.post('/', wrap.PwaVersionController.store)
        router.get('/latest', wrap.PwaVersionController.latest)
    }).prefix('/pwa-version')
}).prefix('/api/admin').use([middleware.auth(), middleware.hasRole(['admin'])])
