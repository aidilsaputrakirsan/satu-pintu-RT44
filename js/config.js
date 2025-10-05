// ============================================
// CONFIG.JS - API Configuration
// ============================================

// GANTI DENGAN WEB APP URL ANDA SETELAH DEPLOY
const API_CONFIG = {
  // Web App URL dari Google Apps Script
  // Format: https://script.google.com/macros/s/[SCRIPT_ID]/exec
  BASE_URL: 'https://script.google.com/macros/s/AKfycbxF9I68WR2zXIkDuUPtZH76y3_Pbdf9rvdQhTVDZyOkU8Ni72sBENl61GtTD6uFChF-Yg/exec',
  
  // PENTING: Ganti YOUR_SCRIPT_ID_HERE dengan Script ID yang benar!
  // Cara dapat Script ID:
  // 1. Buka Apps Script project
  // 2. Deploy → Manage deployments
  // 3. Copy Web app URL
  // 4. Paste di sini
  
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