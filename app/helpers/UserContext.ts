import { AsyncLocalStorage } from 'async_hooks'

const als = new AsyncLocalStorage<any>()

export const UserContext = {
    async run(dataUser: any, callback: any) {
        await dataUser.load('userPegawai', (q: any) => q.preload('tipePegawai'))

        let user = {
            id: dataUser.id,
            email: dataUser.email,
            username: dataUser.username,
            noHp: dataUser.no_hp,
            pegawai_id: dataUser.userPegawai?.id ?? null,
            tipe_pegawai_id: dataUser.userPegawai?.tipe_pegawai_id ?? null,
            tipe_pegawai: dataUser.userPegawai?.tipePegawai?.nama,
            kantor_id: dataUser.userPegawai?.kantor_id ?? null,
            nama: dataUser.userPegawai?.nama ?? null,
            check_radius: dataUser.userPegawai?.check_radius ?? null,
            lat: dataUser.userPegawai?.lat ?? null,
            long: dataUser.userPegawai?.long ?? null
        }

        return als.run({ user }, callback)
    },

    get() {
        return als.getStore()?.user ?? null
    }
}