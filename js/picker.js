// ============================================
// PICKER.JS - Google Picker API Helper
// ============================================

const PickerHelper = {
  
  pickerApiLoaded: false,
  oauthToken: null,
  
  // Load Google APIs
  async init() {
    return new Promise((resolve, reject) => {
      // Load Google API Client
      if (typeof gapi === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          gapi.load('auth2', () => {
            gapi.load('picker', () => {
              this.pickerApiLoaded = true;
              console.log('✅ Google Picker API loaded');
              resolve();
            });
          });
        };
        script.onerror = () => reject(new Error('Failed to load Google API'));
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  },
  
  // Authenticate user
  async authenticate() {
    return new Promise((resolve, reject) => {
      gapi.auth2.authorize({
        client_id: API_CONFIG.GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file',
        immediate: false
      }, (authResult) => {
        if (authResult && !authResult.error) {
          this.oauthToken = authResult.access_token;
          console.log('✅ Authentication successful');
          resolve(authResult);
        } else {
          console.error('❌ Authentication failed:', authResult);
          reject(new Error('Authentication failed'));
        }
      });
    });
  },
  
  // Open file picker for upload
  async pickFile(accept = 'image/*,application/pdf') {
    return new Promise(async (resolve, reject) => {
      try {
        // Initialize if needed
        if (!this.pickerApiLoaded) {
          await this.init();
        }
        
        // Authenticate if needed
        if (!this.oauthToken) {
          await this.authenticate();
        }
        
        // Create picker
        const picker = new google.picker.PickerBuilder()
          .addView(google.picker.ViewId.DOCS)
          .addView(google.picker.ViewId.DOCS_IMAGES)
          .setOAuthToken(this.oauthToken)
          .setDeveloperKey(API_CONFIG.GOOGLE_API_KEY)
          .setCallback((data) => {
            if (data.action === google.picker.Action.PICKED) {
              const file = data.docs[0];
              resolve({
                id: file.id,
                name: file.name,
                mimeType: file.mimeType,
                url: file.url,
                iconUrl: file.iconUrl,
                sizeBytes: file.sizeBytes
              });
            } else if (data.action === google.picker.Action.CANCEL) {
              resolve(null);
            }
          })
          .build();
        
        picker.setVisible(true);
        
      } catch (error) {
        console.error('Picker error:', error);
        reject(error);
      }
    });
  },
  
  // Upload file (actually just pick from Drive)
  async uploadFile(onProgress) {
    try {
      if (onProgress) onProgress(10, 'Membuka Google Drive...');
      
      const file = await this.pickFile();
      
      if (!file) {
        throw new Error('Upload dibatalkan');
      }
      
      if (onProgress) onProgress(100, 'File dipilih: ' + file.name);
      
      return file;
      
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
};