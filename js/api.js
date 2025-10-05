// ============================================
// API.JS - API Service Layer (FIXED)
// ============================================

const API = {
  
  // Call API using JSONP (script tag injection)
  async call(action, data = {}) {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonpCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Create callback function
      window[callbackName] = function(response) {
        delete window[callbackName];
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
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
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
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
    return new Promise((resolve, reject) => {
      // Create hidden iframe
      const iframeName = 'save_iframe_' + Date.now();
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = iframeName;
      document.body.appendChild(iframe);
      
      // Create form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = API_CONFIG.BASE_URL;
      form.target = iframeName;
      form.style.display = 'none';
      
      // Prepare payload
      const payload = {
        action: 'saveProfil',
        username: username,
        data: data
      };
      
      // Add as textarea (better for large data)
      const input = document.createElement('textarea');
      input.name = 'data';
      input.value = JSON.stringify(payload);
      form.appendChild(input);
      
      document.body.appendChild(form);
      
      let responded = false;
      let checkCount = 0;
      const maxChecks = 30;
      
      // Check iframe content periodically
      const checkResponse = () => {
        checkCount++;
        
        try {
          const iframeDoc = iframe.contentWindow.document;
          const response = iframeDoc.body.textContent;
          
          if (response && response.trim()) {
            responded = true;
            const result = JSON.parse(response);
            cleanup();
            resolve(result);
          } else if (checkCount < maxChecks) {
            setTimeout(checkResponse, 1000);
          } else {
            cleanup();
            reject(new Error('Save timeout'));
          }
        } catch (error) {
          if (checkCount < maxChecks) {
            setTimeout(checkResponse, 1000);
          } else {
            cleanup();
            reject(error);
          }
        }
      };
      
      const cleanup = () => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      
      // Submit form
      form.submit();
      
      // Start checking after 2 seconds
      setTimeout(checkResponse, 2000);
    });
  },
  
  // ============================================
  // FILE UPLOAD WITH POLLING MECHANISM
  // ============================================
  
  async uploadFile(username, fileData, fileName, fileType, onProgress) {
    return new Promise(async (resolve, reject) => {
      try {
        // Generate unique upload ID
        const uploadId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        console.log('Starting upload:', uploadId, fileName);
        
        // Start upload (fire and forget)
        this._startUpload(uploadId, username, fileData, fileName, fileType);
        
        // Poll for status
        const maxAttempts = 60; // 60 attempts = 60 seconds max
        let attempts = 0;
        let lastProgress = 0;
        
        const checkStatus = async () => {
          attempts++;
          
          try {
            const status = await this.call('getUploadStatus', { uploadId });
            
            console.log('Upload status check #' + attempts + ':', status);
            
            if (status.success) {
              // Update progress callback
              if (onProgress && status.progress !== undefined) {
                if (status.progress !== lastProgress) {
                  onProgress(status.progress, status.message || '');
                  lastProgress = status.progress;
                }
              }
              
              if (status.status === 'completed') {
                // Upload success
                console.log('Upload completed:', status.result);
                resolve(status.result);
              } else if (status.status === 'error') {
                // Upload error
                console.error('Upload error:', status.message);
                reject(new Error(status.message));
              } else if (status.status === 'processing') {
                // Still processing, check again
                if (attempts < maxAttempts) {
                  setTimeout(checkStatus, 1000); // Check every 1 second
                } else {
                  reject(new Error('Upload timeout after ' + maxAttempts + ' seconds'));
                }
              }
            } else {
              // Status check failed
              console.warn('Status check failed, retrying...', status);
              if (attempts < maxAttempts) {
                setTimeout(checkStatus, 1500);
              } else {
                reject(new Error('Upload status not found or timeout'));
              }
            }
          } catch (error) {
            console.error('Status check error:', error);
            if (attempts < maxAttempts) {
              setTimeout(checkStatus, 1500);
            } else {
              reject(error);
            }
          }
        };
        
        // Start checking status after 2 seconds (give time for backend to initialize)
        setTimeout(checkStatus, 2000);
        
      } catch (error) {
        console.error('Upload initiation error:', error);
        reject(error);
      }
    });
  },
  
  // Private: Start upload via POST
  _startUpload(uploadId, username, fileData, fileName, fileType) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = API_CONFIG.BASE_URL;
    form.target = '_blank'; // Open in new window to prevent navigation
    form.style.display = 'none';
    
    const payload = {
      action: 'uploadFile',
      uploadId: uploadId,
      username: username,
      fileData: fileData,
      fileName: fileName,
      fileType: fileType
    };
    
    // Use textarea for large data
    const input = document.createElement('textarea');
    input.name = 'data';
    input.value = JSON.stringify(payload);
    form.appendChild(input);
    
    document.body.appendChild(form);
    
    console.log('Submitting upload form for:', uploadId);
    form.submit();
    
    // Clean up form after submit
    setTimeout(() => {
      if (document.body.contains(form)) {
        document.body.removeChild(form);
      }
    }, 2000);
  },
  
  async deleteFile(fileId) {
    return this.call('deleteFile', { fileId });
  },

  async moveFile(username, fileId, fileName) {
    return new Promise((resolve, reject) => {
      const iframeName = 'move_iframe_' + Date.now();
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = iframeName;
      document.body.appendChild(iframe);
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = API_CONFIG.BASE_URL;
      form.target = iframeName;
      form.style.display = 'none';
      
      const payload = {
        action: 'moveFile',
        username: username,
        fileId: fileId,
        fileName: fileName
      };
      
      const input = document.createElement('textarea');
      input.name = 'data';
      input.value = JSON.stringify(payload);
      form.appendChild(input);
      
      document.body.appendChild(form);
      
      let responded = false;
      let checkCount = 0;
      const maxChecks = 20;
      
      const checkResponse = () => {
        checkCount++;
        
        try {
          const iframeDoc = iframe.contentWindow.document;
          const response = iframeDoc.body.textContent;
          
          if (response && response.trim()) {
            responded = true;
            const result = JSON.parse(response);
            cleanup();
            resolve(result);
          } else if (checkCount < maxChecks) {
            setTimeout(checkResponse, 1000);
          } else {
            cleanup();
            reject(new Error('Move file timeout'));
          }
        } catch (error) {
          if (checkCount < maxChecks) {
            setTimeout(checkResponse, 1000);
          } else {
            cleanup();
            reject(error);
          }
        }
      };
      
      const cleanup = () => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      
      form.submit();
      setTimeout(checkResponse, 2000);
    });
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

// Export for debugging
window.API = API;
console.log('✅ API module loaded successfully');