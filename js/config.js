// ============================================
// CONFIG.JS - API Configuration
// ============================================

// GANTI DENGAN WEB APP URL ANDA SETELAH DEPLOY
const API_CONFIG = {
  // Web App URL dari Google Apps Script
  // Format: https://script.google.com/macros/s/[SCRIPT_ID]/exec
  BASE_URL: 'https://script.google.com/macros/s/AKfycbwNkMiJ1lucpl9_pxBUuNtTv5zUywBrqqcOeRCogykpSxqvmWAEriDlpx_PFDC8QvkpAQ/exec',
  
  // App Settings
  APP_NAME: 'Sistem Administrasi RT 44',
  APP_VERSION: '1.0.0',
  
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