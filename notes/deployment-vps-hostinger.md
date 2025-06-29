# set up vps dan deployment

## Membuat SSH Key di Git Bash (Agar Lebih Secure)

- Login dengan SSH sebagai root. (pastikan sudah klik add di ssh key dan copas text yg diberikan dan ganti dengan gmail yg anda)
- Masukkan passphrase (bebas, ini untuk login selanjutnya).

## Langkah selanjut untuk menginstall di vps anda dan deploy back end

- sudo apt update
- sudo apt upgrade
- apt install nodejs
- apt install npm
- install postgres (sudo apt install postgresql postgresql-contrib)
- Buat user dan database (jalankan perintah berikut sebagai user `postgres`):

  - `sudo -u postgres psql`

  - Di dalam prompt `psql`, jalankan perintah-perintah ini:

  - Membuat database:

    - `CREATE DATABASE rsud;`

  - Membuat user baru:

    - `CREATE USER rsud_user WITH PASSWORD '12345';`

  - Ganti pemilik schema jadi `rsud_user`:

    - `ALTER SCHEMA public OWNER TO rsud_user;`

  - Pastikan `rsud_user` boleh membuat tabel:

    - `GRANT USAGE, CREATE ON SCHEMA public TO rsud_user;`

  - Grant penuh hak atas semua entitas di schema public

    - `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rsud_user;`
    - `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rsud_user;`
    - `GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO rsud_user;`

  - Pastikan default privileges juga dikasih untuk ke depannya

    - `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO rsud_user;`
    - `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO rsud_user;`
    - `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO rsud_user;`

  - Pastikan db memiliki atribut Superuser agar bisa membuat schema baru secara default

    - `ALTER USER rsud_user WITH SUPERUSER;`

  - Keluar dari `psql`:

    - `\q`
    - Y
    - enter

  - jika diperlukan restart postgreSQL

    - `sudo systemctl restart postgresql`

  - bisa di tes jika berhasil create tabel maka terjamin sukses dan bisa dilakukan migrate dev
    - `psql -U rsud_user -d rsud -h localhost`
    - `CREATE TABLE tes_prisma (
   id SERIAL PRIMARY KEY,
   nama TEXT
 );`

- Deploy dengan `git clone` ke proyek GitHub Anda.
- Jalankan `npx prisma migrate reset` untuk membersihkan data yang ada sebelum deploy data
- Jalankankan `npx prisma migrate deploy`

- Masuk ke direktori proyek dan pastikan file `app.js` (atau file utama) mendengarkan di `0.0.0.0`, seperti berikut:

  ```js
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
  });
  ```

- Pastikan juga port mendukung 3000 (jika pakek ubuntu UFW aktif) `sudo ufw allow 3000`
- pastikan proyek diberikan file .env, dengan cara `nano env` dan tambahkan environment yang dibutuhkan
- setelah itu bisa masuk ke src atau path penyimpanan prisma anda untuk npx prisma migrate dev
- selanjut install PM2 global `npm i -g pm2`
- cara running app `pm2 start app.js --name be-rsud`
- cara melihat aktivitas `pm2 logs`
- cara restart app `pm2 restart app.js --name be-rsud`
- cara cek status server `pm2 list`
- cara stop `pm2 stop all`
- cara delete `pm2 delete all`

## set up ssl untuk proyek lebih secure

- sudo apt update
- sudo apt install nginx certbot python3-certbot-nginx-y
- pastikan memiliki domain, dan domainnya mengarah ke IP vps. bisa di pastikan dengann `ping rs.newshub.store` dan pastikan tipe CNAME ada dan diberikan Nama `www`
- selanjutnya buat config Nginx `sudo nano /etc/nginx/sites-available/rs.newshub.store`
- Isi dengan konfigurasi berikut:

  ```nginx
  server {
      listen 80;
      server_name newshub.store;

      location / {
          proxy_pass http://localhost:3000;  # Ganti port jika bukan 3000
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }

  ```

- aktifkan config `sudo ln -s /etc/nginx/sites-available/rs.newshub.store /etc/nginx/sites-enabled/`, `sudo nginx -t`, `sudo systemctl reload nginx`

- pastikan certbot sudah diinstall dan dapatkan ssl dengan perintah ini `sudo apt install certbot python3-certbot-nginx -y`, dapatkan ssl `sudo certbot --nginx -d rs.newshub.store`

- pastikan ssl otomatis perpanjangan `sudo crontab -e`, tambahkan di line paling bawah `0 3 * * * /usr/bin/certbot renew --quiet`

- selesai bisa di cek situsnya misalkan `https://rs.newshub.store`

## set up dan deploy frontend

- git clone repo frontend
- npm i --legacy-peer-deps (untuk memaksa versi tetap ke instal meskipun tidak kompatibel)
- tambah .env dengan `nano .env` misalkan isi `VITE_API_URL=https://www.newshub.store`
- Masuk ke /root/rsdbalung. Jalankan `cd /root/rsdbalung`
- build proyek `npm run build`
- config nginx `sudo nano /etc/nginx/sites-available/rs.newshub.store`
- Isi dengan konfigurasi berikut:

  ```nginx
  server {
    listen 80;
    server_name rs.newshub.store;

    # ========= Frontend React =======
    # Proxy semua request ke React Router SSR server
    location / {
        proxy_pass http://localhost:3001;  # Port dari PM2 logs
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
     # Static Files - TAMBAHKAN INI
    location /api/uploads {
        # Rewrite /api/uploads menjadi /uploads
        rewrite ^/api/uploads/(.*)$ /uploads/$1 break;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }


    location /api {
        proxy_pass http://localhost:3000;  # Ganti port jika bukan 3000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 20M;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/rs.newshub.store/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/rs.newshub.store/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  }

  server {
    if ($host = rs.newshub.store) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name rs.newshub.store;
    return 404; # managed by Certbot
  }


  ```

- aktifkan config dan reload `sudo nginx -t`, `sudo systemctl restart nginx`
- pasang ssl pada frontend, pilih 1 reisntal `sudo certbot --nginx -d rs.newshub.store`
- tambah script atau ubah script di package json menjadi `"start": "PORT=3001 react-router-serve ./build/server/index.js"`
- karena package sudah ditambah script jadi running jalankan berikut `pm2 restart frontend`
- jalankan ini kalau tidak ada script di package json running apps `pm2 start npx --name frontend -- react-router-serve ./build/server/index.js`
- jika error cek running di berapa frontend `sudo lsof -i -P -n | grep LISTEN`
- jika berbeda seperti di config nginx, bisa disesuikan dan reload nginx
- kemudian jika ada pembaruan code tinggal jalankan `npm run build` setalah itu `pm2 restart frontend`
