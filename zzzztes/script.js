/* ===================================
   JAVASCRIPT - SATU PINTU RT 44
   ================================== */

// Konfigurasi endpoint Google Apps Script
// GANTI URL INI DENGAN URL GOOGLE APPS SCRIPT ANDA
const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbymwTPSsWB1m_KfBxeAPOS_sludcKm9-qB1DIzM5xJ_Dfq3fmzWq0QUh8MH7ySo07YKtA/exec';

// Ukuran maksimal file (5MB dalam bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Format file yang diperbolehkan
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

/**
 * Fungsi untuk menampilkan pesan
 */
function showMessage(type, message, containerId = null) {
    const alertSuccess = document.getElementById('alertSuccess');
    const alertError = document.getElementById('alertError');
    
    // Sembunyikan semua alert
    alertSuccess.style.display = 'none';
    alertError.style.display = 'none';
    
    // Tampilkan alert sesuai type
    if (type === 'success') {
        alertSuccess.style.display = 'block';
        alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (type === 'error') {
        alertError.style.display = 'block';
        if (message) {
            alertError.innerHTML = `
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>❌ Terjadi kesalahan!</strong> ${message}
            `;
        }
        alertError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Fungsi untuk menampilkan/menyembunyikan loading spinner
 */
function toggleLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const submitBtn = document.getElementById('submitBtn');
    
    if (show) {
        loadingSpinner.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
    } else {
        loadingSpinner.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
    }
}

/**
 * Fungsi untuk validasi file
 */
function validateFile(file, fieldName) {
    if (!file) {
        return `File ${fieldName} wajib diupload`;
    }
    
    // Cek ukuran file
    if (file.size > MAX_FILE_SIZE) {
        return `Ukuran file ${fieldName} terlalu besar. Maksimal 5MB`;
    }
    
    // Cek tipe file
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `Format file ${fieldName} tidak didukung. Gunakan JPG, PNG, atau PDF`;
    }
    
    return null;
}

/**
 * Fungsi untuk validasi form
 */
function validateForm(formData, requiredFiles) {
    const errors = [];
    
    // Validasi field wajib
    const requiredFields = ['namaLengkap', 'nomorRumah'];
    
    requiredFields.forEach(field => {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            errors.push(`Field ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} wajib diisi`);
        }
    });
    
    // Validasi file
    requiredFiles.forEach(fileField => {
        const file = formData.get(fileField);
        const error = validateFile(file, fileField);
        if (error) {
            errors.push(error);
        }
    });
    
    return errors;
}

/**
 * Fungsi untuk mengirim data ke Google Apps Script
 */
async function submitToGAS(formData, formType) {
    try {
        // Tambahkan form type ke data
        formData.append('formType', formType);
        formData.append('timestamp', new Date().toISOString());
        
        const response = await fetch(GAS_ENDPOINT, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message || 'Terjadi kesalahan tidak diketahui' };
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        return { 
            success: false, 
            message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.' 
        };
    }
}

/**
 * Handler untuk form Surat Pengantar
 */
function handleFormSurat() {
    const form = document.getElementById('formSurat');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Tampilkan loading
        toggleLoading(true);
        showMessage('', ''); // Clear messages
        
        try {
            // Ambil data form
            const formData = new FormData(form);
            
            console.log('=== FORM SUBMISSION DEBUG ===');
            console.log('GAS_ENDPOINT:', GAS_ENDPOINT);
            console.log('Form data entries:');
            for (let pair of formData.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`${pair[0]}: FILE - ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`);
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
            }
            
            // Validasi form
            const requiredFiles = ['uploadKTP', 'uploadKK'];
            const errors = validateForm(formData, requiredFiles);
            
            // Validasi field khusus form surat
            if (!formData.get('jenisSurat')) {
                errors.push('Jenis surat wajib dipilih');
            }
            
            if (!formData.get('maksudTujuan') || formData.get('maksudTujuan').trim() === '') {
                errors.push('Maksud/tujuan wajib diisi');
            }
            
            if (errors.length > 0) {
                console.log('Validation errors:', errors);
                showMessage('error', errors.join('<br>'));
                toggleLoading(false);
                return;
            }
            
            console.log('Validation passed, sending to GAS...');
            
            // Kirim ke GAS
            const result = await submitToGAS(formData, 'surat_pengantar');
            
            console.log('GAS response:', result);
            
            if (result.success) {
                showMessage('success');
                form.reset(); // Reset form setelah berhasil
            } else {
                showMessage('error', result.message);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('error', 'Terjadi kesalahan sistem: ' + error.message);
        } finally {
            toggleLoading(false);
        }
    });
}

/**
 * Handler untuk form Blangko Pernyataan
 */
function handleFormPernyataan() {
    const form = document.getElementById('formPernyataan');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Tampilkan loading
        toggleLoading(true);
        showMessage('', ''); // Clear messages
        
        try {
            // Ambil data form
            const formData = new FormData(form);
            
            // Validasi form
            const requiredFiles = ['uploadKTP', 'uploadKK'];
            const errors = validateForm(formData, requiredFiles);
            
            // Validasi field khusus form pernyataan
            if (!formData.get('jenisPernyataan')) {
                errors.push('Jenis pernyataan wajib dipilih');
            }
            
            if (!formData.get('isiPernyataan') || formData.get('isiPernyataan').trim() === '') {
                errors.push('Isi pernyataan wajib diisi');
            }
            
            // Validasi checkbox materai
            const checkboxMaterai = document.getElementById('pernyataanMaterai');
            if (!checkboxMaterai.checked) {
                errors.push('Anda harus menyetujui untuk menyediakan materai');
            }
            
            if (errors.length > 0) {
                showMessage('error', errors.join('<br>'));
                toggleLoading(false);
                return;
            }
            
            // Kirim ke GAS
            const result = await submitToGAS(formData, 'blangko_pernyataan');
            
            if (result.success) {
                showMessage('success');
                form.reset(); // Reset form setelah berhasil
            } else {
                showMessage('error', result.message);
            }
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'Terjadi kesalahan sistem. Silakan coba lagi.');
        } finally {
            toggleLoading(false);
        }
    });
}

/**
 * Handler untuk form Lainnya
 */
function handleFormLain() {
    const form = document.getElementById('formLain');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Tampilkan loading
        toggleLoading(true);
        showMessage('', ''); // Clear messages
        
        try {
            // Ambil data form
            const formData = new FormData(form);
            
            // Validasi form (TEMPORARY: skip file validation for testing)
            // const requiredFiles = ['uploadKTP'];
            // const errors = validateForm(formData, requiredFiles);
            const errors = []; // Skip file validation temporarily
            
            // Validasi field khusus form lain
            if (!formData.get('jenisKeperluan')) {
                errors.push('Jenis keperluan wajib dipilih');
            }
            
            if (!formData.get('keterangan') || formData.get('keterangan').trim() === '') {
                errors.push('Keterangan wajib diisi');
            }
            
            if (!formData.get('nomorTelepon') || formData.get('nomorTelepon').trim() === '') {
                errors.push('Nomor telepon wajib diisi');
            }
            
            // TEMPORARY: Remove file data for testing
            formData.delete('uploadKTP');
            formData.delete('uploadDokumen');
            
            // Validasi dokumen pendukung jika ada (SKIP FOR NOW)
            /*
            const dokumenPendukung = formData.get('uploadDokumen');
            if (dokumenPendukung && dokumenPendukung.size > 0) {
                const error = validateFile(dokumenPendukung, 'dokumen pendukung');
                if (error) {
                    errors.push(error);
                }
            }
            */
            
            if (errors.length > 0) {
                showMessage('error', errors.join('<br>'));
                toggleLoading(false);
                return;
            }
            
            // Kirim ke GAS
            const result = await submitToGAS(formData, 'layanan_lain');
            
            if (result.success) {
                showMessage('success');
                form.reset(); // Reset form setelah berhasil
            } else {
                showMessage('error', result.message);
            }
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'Terjadi kesalahan sistem. Silakan coba lagi.');
        } finally {
            toggleLoading(false);
        }
    });
}

/**
 * Fungsi untuk preview file yang diupload
 */
function setupFilePreview() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const fieldName = this.getAttribute('name');
            
            if (file) {
                // Validasi file
                const error = validateFile(file, fieldName);
                if (error) {
                    alert(error);
                    this.value = ''; // Clear input
                    return;
                }
                
                // Tampilkan nama file dan ukuran
                const fileInfo = document.createElement('small');
                fileInfo.className = 'text-success d-block mt-1';
                fileInfo.innerHTML = `
                    <i class="bi bi-check-circle me-1"></i>
                    ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
                `;
                
                // Hapus info file sebelumnya
                const existingInfo = this.parentNode.querySelector('.text-success');
                if (existingInfo) {
                    existingInfo.remove();
                }
                
                // Tambahkan info file baru
                this.parentNode.appendChild(fileInfo);
            }
        });
    });
}

/**
 * Fungsi untuk animasi smooth scroll
 */
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Fungsi untuk validasi real-time pada input
 */
function setupRealTimeValidation() {
    // Validasi nomor telepon
    const teleponInputs = document.querySelectorAll('input[name="nomorTelepon"]');
    teleponInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Hapus non-digit
            
            // Format nomor telepon Indonesia
            if (value.startsWith('62')) {
                value = '0' + value.substring(2);
            }
            
            e.target.value = value;
        });
    });
    
    // Validasi nama (hanya huruf dan spasi)
    const namaInputs = document.querySelectorAll('input[name="namaLengkap"]');
    namaInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        });
    });
}

/**
 * Inisialisasi aplikasi
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Satu Pintu RT 44 - Aplikasi dimuat');
    
    // Setup handlers berdasarkan halaman
    handleFormSurat();
    handleFormPernyataan();
    handleFormLain();
    
    // Setup fitur tambahan
    setupFilePreview();
    setupSmoothScroll();
    setupRealTimeValidation();
    
    // Pesan selamat datang di console
    console.log('%c🏠 Selamat datang di Satu Pintu RT 44! 🏠', 'color: #0d6efd; font-size: 16px; font-weight: bold;');
    console.log('Aplikasi layanan digital administrasi warga RT 44');
    
    // Warning untuk developer
    if (GAS_ENDPOINT.includes('YOUR_SCRIPT_ID')) {
        console.warn('⚠️ PERINGATAN: Harap ganti GAS_ENDPOINT dengan URL Google Apps Script yang benar!');
    }
});

/**
 * Error handling global
 */
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    // Tampilkan pesan error user-friendly
    const alertContainer = document.querySelector('.container');
    if (alertContainer && !document.getElementById('globalErrorAlert')) {
        const errorAlert = document.createElement('div');
        errorAlert.id = 'globalErrorAlert';
        errorAlert.className = 'alert alert-warning alert-dismissible fade show mt-3';
        errorAlert.innerHTML = `
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Terjadi kesalahan!</strong> Silakan refresh halaman atau hubungi admin jika masalah berlanjut.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        alertContainer.insertBefore(errorAlert, alertContainer.firstChild);
    }
});

/**
 * Service Worker registration (opsional untuk PWA)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment jika ingin menggunakan service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     })
        //     .catch(function(err) {
        //         console.log('ServiceWorker registration failed: ', err);
        //     });
    });
}