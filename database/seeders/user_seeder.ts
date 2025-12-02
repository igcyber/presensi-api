import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Role from '#models/core/role'
import User from '#models/core/user'
import UserPegawaiModel from '#models/UserPegawaiModel'

import KantorModel from '#models/KantorModel'
import TipePegawaiModel from '#models/TipePegawaiModel'

export default class UserSeeder extends BaseSeeder {
    public async run() {
        const DBTransaction = await db.transaction()

        try {
            const roleAdmin     = await Role.findBy('slug', 'admin')
            const rolePegawai   = await Role.findBy('slug', 'pegawai')

            if (!roleAdmin || !rolePegawai) {
                console.log('Role Tidak Ditemukan, Seeder User Dilewati.')

                await DBTransaction.rollback()
                return
            }

            // @ts-ignore
            const tipePegawai       = await TipePegawaiModel.findBy('nama', 'TA')

            if (!tipePegawai) {
                console.log('Tipe Pegawai Tidak Ditemukan, Seeder User Dilewati.')

                await DBTransaction.rollback()
                return
            }

            // @ts-ignore
            const kantor            = await KantorModel.findBy('nama', 'Dinas Komunikasi dan Informatika Kabupaten Kutai Kartanegara')

            if (!kantor) {
                console.log('Kantor Tidak Ditemukan, Seeder User Dilewati.')

                await DBTransaction.rollback()
                return
            }

            // @ts-ignore
            const adminUser = await User.updateOrCreate(
                { email: 'admin@example.com', username: 'admin' },
                { password: 'penjagaAbsen', no_hp: null },
                { client: DBTransaction }
            )

            await adminUser.related('roles').sync([roleAdmin.id], DBTransaction)

            const dataPegawai = [
                {
                    nama: "Rizki Padhil",
                    username: "rizkipadhil",
                    no_hp: "6285245450253",
                    email: "rizkipadhil@kukarkab.go.id",
                    lat: "-0.42308170957630714",
                    long: "117.16865038004761",
                }, {
                    nama: "Irfan",
                    username: "irfan",
                    no_hp: "6285250483492",
                    email: "irfan@kukarkab.go.id",
                    lat: "-0.473324",
                    long: "117.187945",
                }, {
                    nama: "Daffa",
                    username: "daffa",
                    no_hp: "6282154182032",
                    email: "daffa@kukarkab.go.id",
                    lat: "-0.4941327197157056",
                    long: "117.18280835462808",
                }, {
                    nama: "Naldy",
                    username: "naldy",
                    no_hp: "6285250194555",
                    email: "naldy@kukarkab.go.id",
                    lat: "-0.5142448263728594",
                    long: "117.17648409915094",
                }, {
                    nama: "Indra",
                    username: "indra",
                    no_hp: "6285821559461",
                    email: "indra@kukarkab.go.id",
                    lat: "-0.4569545",
                    long: "117.0018211",
                }, {
                    nama: "Aldi",
                    username: "aldi",
                    no_hp: "6282239808869",
                    email: "aldi@kukarkab.go.id",
                    lat: "-0.456964",
                    long: "117.001810",
                }, {
                    nama: "Prama",
                    username: "prama",
                    no_hp: "6285250194555",
                    email: "prama@kukarkab.go.id",
                    lat: "-0.4191422207962125",
                    long: "117.16900524248992",
                }, {
                    nama: "Dani",
                    username: "dani",
                    no_hp: "6282156471103",
                    email: "dani@kukarkab.go.id",
                    lat: "-0.5186430",
                    long: "117.1285982",
                }, {
                    nama: "Harrys",
                    username: "harrys",
                    no_hp: "6288245658868",
                    email: "harrys@kukarkab.go.id",
                    lat: "-0.4440208",
                    long: "117.1536320",
                }, {
                    nama: "Aji",
                    username: "aji",
                    no_hp: "6285389360934",
                    email: "aji@kukarkab.go.id",
                    lat: "-0.5298684032353964",
                    long: "117.16324565287573",
                }, {
                    nama: "Endah",
                    username: "endah",
                    no_hp: "6282253262645",
                    email: "endah@kukarkab.go.id",
                    lat: "-0.4569646",
                    long: "117.0018312",
                }
            ]

            for (const data of dataPegawai) {
                // @ts-ignore
                const userPegawai = await User.updateOrCreate(
                    { email: data.email, username: data.username },
                    { password: 'prama123', no_hp: data.no_hp },
                    { client: DBTransaction }
                )

                // @ts-ignore
                await UserPegawaiModel.updateOrCreate(
                    { user_id: userPegawai.id },
                    {
                        tipe_pegawai_id: tipePegawai.id,
                        kantor_id: kantor.id,
                        nama: data.nama,
                        check_radius: 'TIDAK',
                        lat: data.lat,
                        long: data.long,
                    },
                    { client: DBTransaction }
                )

                await userPegawai.related('roles').sync([rolePegawai.id], DBTransaction)
            }

            await DBTransaction.commit()
        } catch (error) {
            await DBTransaction.rollback()

            throw error
        }
    }
}
