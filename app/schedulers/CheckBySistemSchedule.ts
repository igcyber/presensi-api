import fs from 'fs'
import path from 'path'

import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'

import { getDays, getTanggalFormatTimeStamp, isWeekend } from "#helpers/GlobalHelper"
import { FileHelper } from '#helpers/FileHelpers'

import AbsenModel from "#models/AbsenModel"
import PermohonanModel from "#models/PermohonanModel"
import UserPegawaiModel from "#models/UserPegawaiModel"

const haversine = (lat1: any, long1: any, lat2: any, long2: any) => {
    lat1        =   parseFloat(lat1)
    long1       =   parseFloat(long1)
    lat2        =   parseFloat(lat2)
    long2       =   parseFloat(long2)

    if ([lat1, long1, lat2, long2].some(isNaN)) return 0.5

    const R     =   6371000
    const toRad = (x: number) => (x * Math.PI) / 180

    const dLat  =   toRad(lat2 - lat1)
    const dLong =   toRad(long2 - long1)

    const a     =   Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLong / 2) ** 2

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const toNumber = (val: any) => {
    if (val === null || val === undefined) return NaN

    if (typeof val === 'string') {
        val = val.trim()

        if (val === '') return NaN
    }

    return Number(val)
}

const randomNearbyCoordinate = (lat: any, long: any, maxMeters = 10) => {
    lat                     =   toNumber(lat)
    long                    =   toNumber(long)

    if (isNaN(lat) || isNaN(long)) {
        return { lat: 0, long: 0 }
    }

    const metersPerDegree   =   111320
    const radiusInDegrees   =   maxMeters / metersPerDegree

    const angle             =   Math.random() * 2 * Math.PI
    const distance          =   Math.random() * radiusInDegrees

    const deltaLat          =   distance * Math.cos(angle)
    const cosLat            =   Math.cos(lat * Math.PI / 180) || 1
    const deltaLong         =   distance * Math.sin(angle) / cosLat

    return {
        lat: lat + deltaLat,
        long: long + deltaLong
    }
}

const randomTime = (start: string, end: string) => {
    const [h1, m1, s1]  =   start.split(':').map(Number)
    const [h2, m2, s2]  =   end.split(':').map(Number)

    const startSeconds  =   h1 * 3600 + m1 * 60 + s1
    const endSeconds    =   h2 * 3600 + m2 * 60 + s2
    const randomSeconds =   startSeconds + Math.random() * (endSeconds - startSeconds)

    const h = String(Math.floor(randomSeconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((randomSeconds % 3600) / 60)).padStart(2, '0')
    const s = String(Math.floor(randomSeconds % 60)).padStart(2, '0')

    return `${h}:${m}:${s}`
}

const getRandomFoto = (pegawaiId: number): string | null => {
    const basePath      =   path.join(process.cwd(), 'storage/system', String(pegawaiId))

    if (!fs.existsSync(basePath)) return null

    const files         =   fs.readdirSync(basePath).filter(file    => {
        const ext       =   path.extname(file).toLowerCase()

        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
    })    

    if (files.length === 0) return null

    const randomFile    =   files[Math.floor(Math.random() * files.length)]

    return path.join('storage/system', String(pegawaiId), randomFile)
}

const randomFileName = (originalName: string) => {
  const ext         =   originalName.split('.').pop() || 'jpg'
  const rand        =   Math.random().toString(36).substring(2, 10)
  const timestamp   =   Date.now()

  return `${timestamp}_${rand}.${ext}`
}

export const handleCheckBySistemSchedule = async () => {
    const hariIni   =   getDays()
    const awal      =   hariIni.awal
    const akhir     =   hariIni.akhir

    // @ts-ignore
    const pegawai   =   await UserPegawaiModel.query()
    .preload('user', (qp: any) => qp.select('id'))
    .preload('kantor', (qp: any) => qp.select('id', 'lat', 'long', 'except_user', 'radius_limit'))
    .whereIn('id', [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
    ]).exec()

    if ( !isWeekend() ) {
        for (const p of pegawai) {
            const DBTransaction         =	await db.transaction()
    
            try {
                // @ts-ignore
                const permohonan        =   await PermohonanModel.query().select(
                    'id', 'tanggal_pengajuan', 'tipe', 'status', 'file_pendukung'
                ).where('pegawai_id', p.id).exec()
    
                // @ts-ignore
                const riwayat           =   await AbsenModel.query().select(
                    'id', 'pegawai_id', 'hari_libur_id', 'tanggal_absen', 
                    'tipe', 'foto', 'lat', 'long', 'akurasi'
                ).where('pegawai_id', p.id).whereBetween('tanggal_absen', [awal, akhir]).exec()
    
                // @ts-ignore
                const kantor            =   p.kantor
                const user              =   p.user
                
                const dataPermohonan    =   permohonan.find(
                    (ps: any) => ps.status === 'pending' && getTanggalFormatTimeStamp(ps.tanggal_pengajuan, false) === getTanggalFormatTimeStamp(awal, false)
                )
    
                if (
                    dataPermohonan &&
                    ['diterima','ditolak'].includes(dataPermohonan.status)
                ) {
                    await DBTransaction.rollback()
    
                    continue
                }
    
                if (!kantor) {
                    await DBTransaction.rollback()
    
                    continue
                }
    
                const checkTipe     =   ['IZIN', 'SAKIT', 'CUTI', 'LIBUR']
                const tipeKetemu    =   riwayat.find((rw: any) => checkTipe.includes(rw.tipe))
    
                if (tipeKetemu) {
                    await DBTransaction.rollback()
    
                    continue
                }
    
                if ( riwayat.some((item: any) => item.tipe === 'MASUK') ) {
                    await DBTransaction.rollback()
    
                    continue
                }
    
                if (dataPermohonan) {
                    // @ts-ignore
                    const uPermohonan	= await PermohonanModel.find(dataPermohonan.id)
    
                    if (!uPermohonan) {
                        await DBTransaction.rollback()
    
                        continue
                    }
    
                    if ( uPermohonan.status == 'pending' ) {
                        uPermohonan.merge({ status: 'batal' })
    
                        await uPermohonan.save({ client: DBTransaction })
                    }
                }
    
                let dataKoordinat   =   {
                    lat: p.lat,
                    long: p.long,
                    akurasi: haversine(kantor.lat, kantor.long, p.lat, p.long),
                }
    
                if (p.id == 11) {
                    const koordinat =   randomNearbyCoordinate(kantor.lat, kantor.long, kantor.radius_limit)
    
                    dataKoordinat   =   {
                        ...koordinat,
                        akurasi: haversine(kantor.lat, kantor.long, koordinat.lat, koordinat.long)
                    }
                }
    
                const foto          =   getRandomFoto(p.id)
                let   realFoto      =   foto ? randomFileName(path.basename(foto)) : null
    
                if ( foto && realFoto ) {
                    const fullOldPath   =   app.makePath(foto)
                    const buffer        =   fs.readFileSync(fullOldPath)
    
                    await FileHelper.putFile(
                        'absensi',
                        realFoto,
                        buffer
                    )
                }
    
                const tanggal       =   new Date().toLocaleDateString('sv-SE') + ' ' + randomTime("07:00:00", "07:50:00")
    
                const data: any     =   {
                    pegawai_id: p.id,
                    foto: realFoto,
                    tanggal_absen: tanggal,
                    tipe: "MASUK",
                    ...dataKoordinat,
                    created_by: user.id,
                    created_at: tanggal,
                    updated_at: tanggal
                }
    
                // @ts-ignore
                await AbsenModel.create(data)
    
                await DBTransaction.commit()
            } catch (error) {
                await DBTransaction.rollback()
    
                continue
            }
        }
    }
}