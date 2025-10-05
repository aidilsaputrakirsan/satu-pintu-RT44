# 🏘️ Sistem Administrasi RT 44

Sistem administrasi berbasis web untuk pengelolaan data warga dan pengajuan surat RT 44.

## 📋 Fitur

### Untuk Warga:
- ✅ Login dengan nomor rumah
- ✅ Kelengkapan profil (data KK, istri, anak)
- ✅ Upload dokumen (KTP, KK, KIA) - unlimited
- ✅ Ajukan surat pengantar dan pernyataan (8 jenis)
- ✅ Tracking status pengajuan surat
- ✅ Download PDF surat yang sudah disetujui
- ✅ Ganti password

### Untuk Admin:
- ✅ Dashboard statistik
- ✅ Review dan approve/reject pengajuan surat
- ✅ Lihat data semua warga
- ✅ Monitor status profil warga

## 🚀 Setup

### 1. Deploy Google Apps Script (Backend)

1. Buka Google Apps Script: https://script.google.com
2. Buat project baru
3. Copy kode dari `backend/Code.gs` ke file Code.gs
4. **Ganti ID Spreadsheet dan Folder:**
   ```javascript
   var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
   var FOLDER_ID = 'YOUR_FOLDER_ID';
   ```
5. **Run Setup:**
   - Pilih function: `setupInitialStructure`
   - Klik Run
   - Izinkan permissions
6. **Deploy as Web App:**
   - Klik Deploy → New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Deploy
   - **Copy Web App URL**

### 2. Setup Frontend (GitHub)

1. Clone repo ini
2. Edit `js/config.js`:
   ```javascript
   const API_CONFIG = {
     BASE_URL: 'YOUR_WEB_APP_URL_HERE'
   };
   ```
3. Deploy ke GitHub Pages / Netlify / Vercel

## 📁 Struktur Folder

```
rt44-admin-system/
├── index.html              # Landing page (redirect ke login)
├── login.html              # Halaman login
├── dashboard.html          # Main dashboard
│
├── css/
│   └── style.css           # Custom styles
│
├── js/
│   ├── config.js           # API configuration
│   ├── api.js              # API service layer
│   ├── auth.js             # Authentication
│   ├── utils.js            # Utility functions
│   ├── profil.js           # Profil & upload
│   ├── surat.js            # Surat functions
│   └── admin.js            # Admin panel
│
└── README.md
```

## 🔐 Login Credentials

### Admin
- Username: `admin`
- Password: `rt44`

### Warga (134 akun)
- Username: Nomor rumah (G1/1, G1/2, ..., H5/6)
- Password: `rt44` (bisa diganti)

## 📊 Database (Google Sheets)

### Sheet: USER_ACCOUNTS
- Username, password, role, status_profil, folder_id

### Sheet: DATA_WARGA
- Data lengkap profil warga + link file upload

### Sheet: PENGAJUAN_SURAT
- ID, username, jenis_surat, status, catatan

### Sheet: MASTER_SURAT
- 8 jenis surat (1 pengantar + 7 pernyataan)

## 🎯 Business Rules

### Status Hunian:
1. **Pemilik** (KTP di RT 44) → ✅ Bisa ajukan surat
2. **Kontrak RT44** (KTP di RT 44) → ✅ Bisa ajukan surat
3. **Kontrak Luar** (KTP di luar) → ❌ Tidak bisa ajukan surat

### Validasi Upload:
- Minimal: 1 KTP + 1 KK
- Format: JPG, PNG, PDF
- Max size: 5MB per file

### Status Surat:
- **Diproses** → Menunggu admin
- **Diterima** → Approved
- **Ditolak** → Rejected dengan catatan

## 🔧 Development

### Local Development
1. Install live server (VSCode extension atau `npx serve`)
2. Buka `login.html` di browser
3. Update `API_CONFIG.BASE_URL` sesuai Apps Script URL

### Testing
1. Test login admin
2. Test login warga
3. Test isi profil + upload file
4. Test ajukan surat
5. Test approve/reject (admin)

## 📝 Jenis Surat

1. **Surat Pengantar RT**
2. Surat Pernyataan Kelengkapan KPR
3. Surat Pernyataan Pengurusan Cerai (Ghoib sebagai Istri)
4. Surat Pernyataan Pengurusan Cerai (Ghoib)
5. Surat Pernyataan Satu Nama Sama Beda Nama
6. Surat Pernyataan untuk Daftar Kuliah/Sekolah
7. Surat Pernyataan untuk Pengantar Nikah
8. Surat Pernyataan Persyaratan Nikah/Keterangan Janda/Melamar Pekerjaan

## 🐛 Troubleshooting

### CORS Error
- Pastikan Web App deployed dengan "Who has access: Anyone"
- Gunakan `no-cors` mode di fetch API

### Upload File Gagal
- Cek folder_id terisi di sheet USER_ACCOUNTS
- Pastikan folder Drive bisa di-edit

### Login Gagal
- Cek username/password di sheet USER_ACCOUNTS
- Pastikan kolom `aktif` = TRUE

## 📞 Support

Jika ada masalah:
1. Cek Console browser (F12)
2. Lihat Execution log di Apps Script
3. Cek data di Spreadsheet

## 📄 License

MIT License

---

**Dibuat untuk RT 44 - Sistem Administrasi Warga**