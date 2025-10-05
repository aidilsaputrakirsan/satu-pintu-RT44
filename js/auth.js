// ============================================
// AUTH.JS - Authentication Functions
// ============================================

const Auth = {
  
  // Handle login
  async login(username, password) {
    try {
      Utils.showLoading();
      
      const result = await API.login(username, password);
      
      Utils.hideLoading();
      
      if (result.success) {
        // Save user to local storage
        Utils.saveUser(result.user);
        
        // Redirect based on role
        if (result.user.role === 'admin') {
          window.location.href = 'dashboard.html';
        } else {
          // Check if profil lengkap
          if (result.user.status_profil === 'belum_lengkap') {
            window.location.href = 'pages/profil.html';
          } else {
            window.location.href = 'dashboard.html';
          }
        }
      } else {
        Utils.showAlert(result.message, 'danger');
      }
    } catch (error) {
      Utils.hideLoading();
      Utils.showAlert('Error: ' + error.message, 'danger');
    }
  },
  
  // Handle logout
  logout() {
    if (confirm('Yakin ingin logout?')) {
      Utils.logout();
    }
  },
  
  // Handle change password
  async changePassword(oldPassword, newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
      Utils.showAlert('Password baru tidak cocok!', 'danger');
      return;
    }
    
    if (newPassword.length < 4) {
      Utils.showAlert('Password minimal 4 karakter', 'danger');
      return;
    }
    
    try {
      Utils.showLoading();
      
      const user = Utils.getCurrentUser();
      const result = await API.changePassword(user.username, oldPassword, newPassword);
      
      Utils.hideLoading();
      
      if (result.success) {
        Utils.showAlert('Password berhasil diubah!', 'success');
        
        // Clear form
        document.getElementById('formGantiPassword')?.reset();
      } else {
        Utils.showAlert(result.message, 'danger');
      }
    } catch (error) {
      Utils.hideLoading();
      Utils.showAlert('Error: ' + error.message, 'danger');
    }
  },
  
  // Initialize auth state on page load
  init() {
    // Check if on login page
    const isLoginPage = window.location.pathname.includes('login.html');
    const isIndexPage = window.location.pathname.endsWith('/') || window.location.pathname.includes('index.html');
    
    if (isLoginPage || isIndexPage) {
      // If already logged in, redirect to dashboard
      if (Utils.isLoggedIn()) {
        window.location.href = 'dashboard.html';
      }
    } else {
      // Protected pages - require auth
      if (!Utils.requireAuth()) {
        return;
      }
      
      // Update navbar with user info
      this.updateNavbar();
    }
  },
  
  // Update navbar with user info
  updateNavbar() {
    const user = Utils.getCurrentUser();
    if (!user) return;
    
    const usernameEl = document.getElementById('navUsername');
    if (usernameEl) {
      usernameEl.textContent = user.username;
    }
    
    const roleEl = document.getElementById('navRole');
    if (roleEl) {
      roleEl.textContent = user.role === 'admin' ? 'Admin' : 'Warga';
    }
  }
};