// ============================================
// CONFIG.JS - API Configuration
// ============================================

const API_CONFIG = {
  // GANTI dengan Web App URL Anda yang BARU setelah deploy
  BASE_URL: 'https://script.google.com/macros/s/AKfycbzCzXEHPeZ4W7Bgl51XvRMwwO568LGdjP_gOBJ1NjQd6CC4DMb3_cexXhtr9NUDv4tKyA/exec',
  
  // GOOGLE PICKER API - GANTI dengan credentials Anda
  GOOGLE_API_KEY: 'AIzaSyB4gNsY74lh2g3kYFi_9YhARVkYeG8xw_A', // ← Paste API Key dari Step 1
  GOOGLE_CLIENT_ID: '324059435791-rttlua6s1ia7pen2thg3c5i2g2n883le.apps.googleusercontent.com', // ← Paste Client ID dari Step 1
  
  // Google Drive Folder untuk upload
  // Ini adalah FOLDER_ID dari Apps Script (parent folder Data Warga)
  DRIVE_PARENT_FOLDER: '1snNDfiMlbmsRuc17jumBch_7P47n3dRr',
  
  // App Settings
  APP_NAME: 'Sistem Administrasi RT 44',
  APP_VERSION: '2.0.0',
  
  // Local Storage Keys
  STORAGE_KEY: {
    USER: 'rt44_user',
    TOKEN: 'rt44_token'
  },
  
  // File Upload Settings
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  
  // Alamat RT
  ALAMAT_RT: 'Jl. Syarifoedin Yoes, Perumahan Sepinggan Pratama',
  KELURAHAN: 'Sepinggan Baru',
  KECAMATAN: 'Balikpapan Selatan',
  KOTA: 'Balikpapan'
};