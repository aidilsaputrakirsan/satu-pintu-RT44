// ============================================
// API.JS - API Service Layer
// ============================================

const API = {
  
  // Call Google Apps Script API
  async call(action, data = {}) {
    try {
      const response = await fetch(API_CONFIG.BASE_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for GAS
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: action,
          ...data
        })
      });
      
      // Note: no-cors means we can't read response
      // Workaround: use redirect parameter
      return { success: true };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: error.message };
    }
  },
  
  // Alternative: Using redirect technique for response
  async callWithResponse(action, data = {}) {
    return new Promise((resolve, reject) => {
      const url = API_CONFIG.BASE_URL;
      const payload = {
        action: action,
        ...data
      };
      
      // Use form submit technique
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.target = 'api_iframe';
      form.style.display = 'none';
      
      const input = document.createElement('input');
      input.name = 'payload';
      input.value = JSON.stringify(payload);
      form.appendChild(input);
      
      document.body.appendChild(form);
      
      // Create hidden iframe
      let iframe = document.getElementById('api_iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'api_iframe';
        iframe.name = 'api_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }
      
      iframe.onload = () => {
        try {
          const response = iframe.contentWindow.document.body.textContent;
          const data = JSON.parse(response);
          resolve(data);
        } catch (error) {
          reject(error);
        } finally {
          document.body.removeChild(form);
        }
      };
      
      form.submit();
    });
  },
  
  // AUTH APIs
  login(username, password) {
    return this.callWithResponse('login', { username, password });
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