// ============================================
// API.JS - API Service Layer (UPDATED)
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
  
  // ============================================
  // NEW: FILE UPLOAD WITH POLLING MECHANISM
  // ============================================
  
  async uploadFile(username, fileData, fileName, fileType, onProgress) {
    return new Promise(async (resolve, reject) => {
      try {
        // Generate unique upload ID
        const uploadId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Start upload (fire and forget)
        this._startUpload(uploadId, username, fileData, fileName, fileType);
        
        // Poll for status
        const maxAttempts = 60; // 60 attempts = 60 seconds max
        let attempts = 0;
        
        const checkStatus = async () => {
          attempts++;
          
          try {
            const status = await this.call('getUploadStatus', { uploadId });
            
            if (status.success) {
              // Update progress callback
              if (onProgress && status.progress) {
                onProgress(status.progress, status.message);
              }
              
              if (status.status === 'completed') {
                // Upload success
                resolve(status.result);
              } else if (status.status === 'error') {
                // Upload error
                reject(new Error(status.message));
              } else if (status.status === 'processing') {
                // Still processing, check again
                if (attempts < maxAttempts) {
                  setTimeout(checkStatus, 1000); // Check every 1 second
                } else {
                  reject(new Error('Upload timeout'));
                }
              }
            } else {
              // Status check failed
              if (attempts < maxAttempts) {
                setTimeout(checkStatus, 1000);
              } else {
                reject(new Error('Upload timeout or not found'));
              }
            }
          } catch (error) {
            if (attempts < maxAttempts) {
              setTimeout(checkStatus, 1000);
            } else {
              reject(error);
            }
          }
        };
        
        // Start checking status after 2 seconds
        setTimeout(checkStatus, 2000);
        
      } catch (error) {
        reject(error);
      }
    });
  },
  
  // Private: Start upload via POST (fire and forget)
  _startUpload(uploadId, username, fileData, fileName, fileType) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = API_CONFIG.BASE_URL;
    form.style.display = 'none';
    
    const payload = {
      action: 'uploadFile',
      uploadId: uploadId,
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
    form.submit();
    
    // Clean up form after submit
    setTimeout(() => {
      if (document.body.contains(form)) {
        document.body.removeChild(form);
      }
    }, 1000);
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