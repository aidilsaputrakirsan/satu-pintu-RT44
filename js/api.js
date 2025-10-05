// ============================================
// API.JS - API Service Layer (CORS Fixed)
// ============================================

const API = {
  
  // Call API using script tag injection (JSONP-like)
  async call(action, data = {}) {
    return new Promise((resolve, reject) => {
      const callbackName = 'apiCallback_' + Date.now();
      const params = new URLSearchParams({
        action: action,
        data: JSON.stringify(data),
        callback: callbackName
      });
      
      window[callbackName] = function(response) {
        delete window[callbackName];
        document.body.removeChild(script);
        resolve(response);
      };
      
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
  
  changePassword(username, oldPassword, newPassword) {
    return this.callWithResponse('changePassword', { 
      username, oldPassword, newPassword 
    });
  },
  
  // PROFIL APIs
  getProfil(username) {
    return this.callWithResponse('getProfil', { username });
  },
  
  saveProfil(username, data) {
    return this.callWithResponse('saveProfil', { username, data });
  },
  
  // FILE APIs
  uploadFile(username, fileData, fileName, fileType) {
    return this.callWithResponse('uploadFile', { 
      username, fileData, fileName, fileType 
    });
  },
  
  deleteFile(fileId) {
    return this.callWithResponse('deleteFile', { fileId });
  },
  
  // SURAT APIs
  getMasterSurat() {
    return this.callWithResponse('getMasterSurat');
  },
  
  submitSurat(username, data) {
    return this.callWithResponse('submitSurat', { username, data });
  },
  
  getRiwayatSurat(username) {
    return this.callWithResponse('getRiwayatSurat', { username });
  },
  
  // ADMIN APIs
  getAllPengajuan(status = null) {
    return this.callWithResponse('getAllPengajuan', { status });
  },
  
  updateStatusSurat(id, status, catatan, adminUsername) {
    return this.callWithResponse('updateStatusSurat', { 
      id, status, catatan, adminUsername 
    });
  },
  
  getAllWarga() {
    return this.callWithResponse('getAllWarga');
  }
};