// ============================================
// API.JS - API Service Layer (JSONP)
// ============================================

const API = {
  
  // Call API using JSONP (script tag injection)
  async call(action, data = {}) {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonpCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Create callback function
      window[callbackName] = function(response) {
        delete window[callbackName];
        document.body.removeChild(script);
        resolve(response);
      };
      
      // Build URL with parameters
      const params = new URLSearchParams({
        action: action,
        data: JSON.stringify(data),
        callback: callbackName
      });
      
      // Create script tag
      const script = document.createElement('script');
      script.src = `${API_CONFIG.BASE_URL}?${params}`;
      script.onerror = () => {
        delete window[callbackName];
        document.body.removeChild(script);
        reject(new Error('API call failed'));
      };
      
      document.body.appendChild(script);
    });
  },
  
  // AUTH APIs
  async login(username, password) {
    return this.call('login', { username, password });
  },
  
  async changePassword(username, oldPassword, newPassword) {
    return this.call('changePassword', { 
      username, oldPassword, newPassword 
    });
  },
  
  // PROFIL APIs
  async getProfil(username) {
    return this.call('getProfil', { username });
  },
  
  async saveProfil(username, data) {
    return this.call('saveProfil', { username, data });
  },
  
  // FILE APIs
  async uploadFile(username, fileData, fileName, fileType) {
    return this.call('uploadFile', { 
      username, fileData, fileName, fileType 
    });
  },
  
  async deleteFile(fileId) {
    return this.call('deleteFile', { fileId });
  },
  
  // SURAT APIs
  async getMasterSurat() {
    return this.call('getMasterSurat');
  },
  
  async submitSurat(username, data) {
    return this.call('submitSurat', { username, data });
  },
  
  async getRiwayatSurat(username) {
    return this.call('getRiwayatSurat', { username });
  },
  
  // ADMIN APIs
  async getAllPengajuan(status = null) {
    return this.call('getAllPengajuan', { status });
  },
  
  async updateStatusSurat(id, status, catatan, adminUsername) {
    return this.call('updateStatusSurat', { 
      id, status, catatan, adminUsername 
    });
  },
  
  async getAllWarga() {
    return this.call('getAllWarga');
  }
};