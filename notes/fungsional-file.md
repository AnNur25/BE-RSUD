# Catatan Ngoding

## Fungsi folder utils/kegunaan

Fungsi umum yang reusable di banyak tempat

## Fungsi folder Helpers/bantuan

Membantu logika bisnis/fungsi spesifik. response masuk ke helpers karena formatnya tergantung project, bekerja langsung dengan objek res dari Express.js, yang merupakan bagian dari logika HTTP aplikasi.

## Fungsi folder controllers

Menghandle proses request client dan response

## Fungsi folder services

Menghandle logika bisnis dan manipulasi data

## Fungsi folder routes

Untuk route endpoint API

## Fungsi folder prisma

untuk scema database / model database

## Fungsi folder configs

untuk configurasi umum seperti env config, dan configurasi swagger dan passport. agar jika service atau file yang lain membuthkan env tidak langsung process dari env, melainkan dari folder configs

## Fungsi folder cron

untuk menjalankan fungsi cron dengan interval tertentu

## Fungsi folder test

untuk testing api unit test atau integrasi tes

## Fungsi folder middleware

untuk autentifikasi atau proses sebelum di handle sepenuhnya oleh controller/service
