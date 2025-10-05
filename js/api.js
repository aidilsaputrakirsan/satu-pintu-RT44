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
    // Use POST for saveProfil (data bisa besar)
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'save_iframe_' + Date.now();
      document.body.appendChild(iframe);
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = API_CONFIG.BASE_URL;
      form.target = iframe.name;
      form.style.display = 'none';
      
      const payload = {
        action: 'saveProfil',
        username: username,
        data: data
      };
      
      const input = document.createElement('textarea');
      input.name = 'data';
      input.value = JSON.stringify(payload);
      form.appendChild(input);
      
      document.body.appendChild(form);
      
      let responded = false;
      iframe.onload = () => {
        if (responded) return;
        responded = true;
        
        try {
          const response = iframe.contentWindow.document.body.textContent;
          const result = JSON.parse(response);
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          resolve(result);
        } catch (error) {
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          reject(error);
        }
      };
      
      setTimeout(() => {
        if (!responded) {
          responded = true;
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          reject(new Error('Save timeout'));
        }
      }, 30000);
      
      form.submit();
    });
  },
  
  // FILE APIs - Use POST for file upload (large data)
  async uploadFile(username, fileData, fileName, fileType) {
    return new Promise((resolve, reject) => {
      // Create hidden iframe for POST
      let iframe = document.getElementById('upload_iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'upload_iframe';
        iframe.name = 'upload_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }
      
      // Create form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = API_CONFIG.BASE_URL;
      form.target = 'upload_iframe';
      form.style.display = 'none';
      
      // Add data as hidden inputs
      const payload = {
        action: 'uploadFile',
        username: username,
        fileData: fileData,
        fileName: fileName,
        fileType: fileType
      };
      
      const input = document.createElement('textarea');
      input.name = 'data';
      input.value = JSON.stringify(payload);
      form.appendChild(input);
      
      document.body.appendChild(form);
      
      // Handle response
      let responded = false;
      iframe.onload = () => {
        if (responded) return;
        responded = true;
        
        try {
          const response = iframe.contentWindow.document.body.textContent;
          const data = JSON.parse(response);
          document.body.removeChild(form);
          resolve(data);
        } catch (error) {
          document.body.removeChild(form);
          reject(error);
        }
      };
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (!responded) {
          responded = true;
          document.body.removeChild(form);
          reject(new Error('Upload timeout'));
        }
      }, 30000);
      
      form.submit();
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