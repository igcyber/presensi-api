# 🚀 AdonisJS 6 Base

    Command CLI untuk membuat struktur CRUD secara cepat dan terorganisir
    pada **AdonisJS 6 (API Only)**.\
    Mendukung pembuatan: **Model, Controller, Service, Repository,
    Interface, Validation**, atau semuanya sekaligus.

## 📌 Fitur Utama

    -   Generate CRUD lengkap dengan satu perintah
    -   Mendukung pembuatan file parsial:
        -   Model
        -   Controller
        -   Service
        -   Repository
        -   Interface
        -   Validation
    -   Struktural, konsisten, dan mengikuti pola arsitektur *Service &
        Repository Pattern*
    -   Command memiliki **help command** bawaan

## 📦 Instalasi

1. Menjalankan Perintah Untuk Mendownload/Menginstall Kebutuhan Aplikasi

    ```bash
    npm install
    ```

2. Generate application secret key digunakan untuk beberapa hal penting dalam security aplikasi.

    ```bash
    npm run key:generate
    ```

3. Selanjutnya Menyesuaikan Kebutuhan Environtment pada file .env

    ```bash
    cp .env.example .env
    ```

4. Menjalankan Migration Pada Folder database/migrations

    ```bash
    npm run migrate:run
    ```

5. Menjalankan Semua Seeder Yang Didaftarkan Pada database/seeders/main/index_seeder.ts

    ```bash
    npm run db:seed
    ```

6. Atau Jika Memerlukan Seed Partial Dapat Menggunakan Perintah

    ```bash
    node ace db:seed --files database/seeders/user_seeder.ts
    ```

7. Menjalankan Aplikasi Secara Development

    ```bash
    npm run dev
    ```

### Generate CRUD lengkap

    node ace make:crud Product

### Generate file spesifik

    node ace make:crud Product -M     (Model saja)
    node ace make:crud Product -C     (Controller saja)
    node ace make:crud Product -S     (Service saja)
    node ace make:crud Product -R     (Repository saja)
    node ace make:crud Product -I     (Interface saja)
    node ace make:crud Product -V     (Validation saja)

## 📘 Menampilkan Help

    node ace make:crud --help

## 📂 Struktur Folder yang Dihasilkan

    app/
    ├─ Models/
    │   └─ Product.ts
    ├─ Controllers/
    │   └─ Http/
    │       └─ ProductController.ts
    └─ rahasia_negara/
        ├─ Services/
        │   └─ ProductService.ts
        ├─ Repositories/
        │   └─ ProductRepository.ts
        ├─ Interfaces/
        │   └─ ProductInterface.ts
        └─ Validations/
            └─ ProductValidation.ts

## 📜 Lisensi

[![license-image]][license-url]

Proyek ini dirilis menggunakan **MIT License**.

[license-image]: https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge
[license-url]: LICENSE.md