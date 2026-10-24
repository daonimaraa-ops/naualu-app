NAUALU APP — STARTER PWA
========================

Isi:
- index.html: tampilan aplikasi
- styles.css: desain responsif
- app.js: membaca feed publik Blogger
- manifest.webmanifest: metadata instalasi PWA
- sw.js: cache dasar untuk aset aplikasi
- icons/: ikon/placeholder

SUMBER BERITA
Aplikasi membaca artikel publik dari:
https://www.naualu.my.id/feeds/posts/default?alt=json-in-script

PENTING
1. Ini adalah starter/prototipe, belum menjadi aplikasi yang dipasang di website publik.
2. Agar instalasi PWA berfungsi, semua file harus di-host di alamat HTTPS dan service worker harus bisa diakses dari scope yang benar.
3. Blogger tidak mengizinkan pemasangan file sw.js di root domain blog secara langsung. Karena itu, aplikasi ini perlu di-host pada hosting statis HTTPS yang mendukung file statis (misalnya GitHub Pages), atau memakai hosting/domain yang kamu kendalikan.
4. Sebelum rilis, uji feed Blogger, tautan artikel, gambar, navigasi, dan tampilan di beberapa HP.
5. APK Android belum dibangun oleh file ini. Setelah PWA di-host dan stabil, APK dapat dibuat melalui Trusted Web Activity atau pembungkus Android yang sesuai.
6. Tombol NAUALU TV saat ini membuka website NAUALU. Integrasi kanal TV perlu ditambahkan setelah URL player/halaman TV ditentukan.
7. Font Inter memakai Google Fonts; jika offline, font sistem akan digunakan.

CARA UJI LOKAL
Membuka index.html langsung sebagai file lokal tidak akan menguji PWA/service worker dengan benar. Uji setelah mengunggah ke hosting HTTPS.

LANGKAH SELANJUTNYA
Unggah folder ini ke hosting statis HTTPS. Jika memilih GitHub Pages, buat repositori baru lalu unggah semua file/folder ini, aktifkan Pages, dan buka alamat Pages yang diberikan. Jangan mengubah atau mengganti template Blogger NAUALU yang sekarang.
