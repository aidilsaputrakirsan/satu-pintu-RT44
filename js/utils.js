// ============================================
// UTILS.JS - Utility Functions
// ============================================

const Utils = {
  
  // Show loading overlay
  showLoading() {
    document.getElementById('loadingOverlay')?.classList.remove('d-none');
  },
  
  // Hide loading overlay
  hideLoading() {
    document.getElementById('loadingOverlay')?.classList.add('d-none');
  },
  
  // Show alert
  showAlert(message, type = 'info') {
    const alertHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    const container = document.getElementById('alertContainer');
    if (container) {
      container.innerHTML = alertHTML;
      setTimeout(() => {
        container.innerHTML = '';
      }, 5000);
    }
  },
  
  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  },
  
  // Validate file
  validateFile(file) {
    // Check file size
    if (file.size > API_CONFIG.MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `File terlalu besar. Maksimal ${API_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`
      };
    }
    
    // Check file type
    if (!API_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        message: 'Format file tidak didukung. Gunakan JPG, PNG, atau PDF'
      };
    }
    
    return { valid: true };
  },
  
  // Convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
  
  // Generate alamat domisili
  generateAlamatDomisili(nomorRumah) {
    return `${API_CONFIG.ALAMAT_RT} Blok ${nomorRumah}, Kelurahan ${API_CONFIG.KELURAHAN}, Kecamatan ${API_CONFIG.KECAMATAN}, Kota ${API_CONFIG.KOTA}`;
  },
  
  // Get status badge class
  getStatusClass(status) {
    const statusMap = {
      'Diproses': 'warning',
      'Diterima': 'success',
      'Ditolak': 'danger'
    };
    return statusMap[status] || 'secondary';
  },
  
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Sanitize input
  sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },
  
  // Check if user is logged in
  isLoggedIn() {
    return localStorage.getItem(API_CONFIG.STORAGE_KEY.USER) !== null;
  },
  
  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem(API_CONFIG.STORAGE_KEY.USER);
    return user ? JSON.parse(user) : null;
  },
  
  // Save user to local storage
  saveUser(user) {
    localStorage.setItem(API_CONFIG.STORAGE_KEY.USER, JSON.stringify(user));
  },
  
  // Logout
  logout() {
    localStorage.removeItem(API_CONFIG.STORAGE_KEY.USER);
    window.location.href = 'login.html';
  },
  
  // Redirect if not logged in
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },
  
  // Redirect if not admin
  requireAdmin() {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'admin') {
      window.location.href = 'dashboard.html';
      return false;
    }
    return true;
  }
};