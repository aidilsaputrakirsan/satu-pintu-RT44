// ============================================
// PROFIL.JS - Profil & Upload Functions
// ============================================

const Profil = {
  
  uploadedKTP: [],
  uploadedKK: [],
  uploadedKIA: [],
  dataAnak: [],
  
  // Load profil form
  async load() {
    Utils.showLoading();
    
    const user = Utils.getCurrentUser();
    const result = await API.getProfil(user.username);
    
    Utils.hideLoading();
    
    if (result.success && result.data) {
      this.uploadedKTP = result.data.files_ktp || [];
      this.uploadedKK = result.data.files_kk || [];
      this.uploadedKIA = result.data.files_kia || [];
      this.dataAnak = result.data.data_anak || [];
      this.render(result.data);
    } else {
      this.render(null);
    }
  },
  
  // Render profil form
  render(data = null) {
    const user = Utils.getCurrentUser();
    const content = document.getElementById('contentArea');
    
    const statusHunian = data?.status_hunian || '';
    const alamatKTP = data?.alamat_ktp || '';
    
    content.innerHTML = `
      <h4 class="mb-4">
        <i class="bi bi-person-fill"></i> ${data ? 'Edit' : 'Lengkapi'} Profil Warga
      </h4>
      
      ${user.status_profil === 'belum_lengkap' ? `
      <div class="alert alert-warning">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <strong>Penting!</strong> Anda harus melengkapi profil terlebih dahulu sebelum dapat mengajukan surat.
      </div>
      ` : ''}
      
      <form id="formProfil">
        <!-- Status Hunian -->
        <div class="card mb-3">
          <div class="card-header bg-primary text-white">
            <strong>A. Status Kepemilikan/Hunian</strong>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Status Hunian <span class="text-danger">*</span></label>
              <select class="form-select" id="statusHunian" required>
                <option value="">Pilih Status</option>
                <option value="pemilik" ${statusHunian === 'pemilik' ? 'selected' : ''}>Pemilik Rumah (KTP di RT 44)</option>
                <option value="kontrak_rt44" ${statusHunian === 'kontrak_rt44' ? 'selected' : ''}>Warga Kontrak - KTP di RT 44</option>
                <option value="kontrak_luar" ${statusHunian === 'kontrak_luar' ? 'selected' : ''}>Warga Kontrak - KTP di Luar RT 44</option>
              </select>
            </div>
            
            <div id="peringatanKontrakLuar" class="alert alert-danger d-none">
              <i class="bi bi-x-circle-fill"></i>
              <strong>Perhatian!</strong> Warga dengan KTP di luar RT 44 <strong>tidak dapat mengajukan surat</strong>. 
              Silakan urus perpindahan domisili terlebih dahulu ke RT 44.
            </div>
          </div>
        </div>
        
        <!-- Data KK -->
        <div class="card mb-3">
          <div class="card-header bg-primary text-white">
            <strong>B. Data Kepala Keluarga</strong>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Lengkap <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="namaKK" value="${data?.nama_kk || ''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">NIK <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="nikKK" value="${data?.nik_kk || ''}" maxlength="16" required>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Tempat Lahir <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="tempatLahir" value="${data?.tempat_lahir || ''}" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Tanggal Lahir <span class="text-danger">*</span></label>
                <input type="date" class="form-control" id="tanggalLahir" value="${data?.tanggal_lahir || ''}" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Jenis Kelamin <span class="text-danger">*</span></label>
                <select class="form-select" id="jenisKelamin" required>
                  <option value="">Pilih</option>
                  <option value="Laki-laki" ${data?.jenis_kelamin === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
                  <option value="Perempuan" ${data?.jenis_kelamin === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
                </select>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Agama <span class="text-danger">*</span></label>
                <select class="form-select" id="agama" required>
                  <option value="">Pilih</option>
                  <option value="Islam" ${data?.agama === 'Islam' ? 'selected' : ''}>Islam</option>
                  <option value="Kristen" ${data?.agama === 'Kristen' ? 'selected' : ''}>Kristen</option>
                  <option value="Katolik" ${data?.agama === 'Katolik' ? 'selected' : ''}>Katolik</option>
                  <option value="Hindu" ${data?.agama === 'Hindu' ? 'selected' : ''}>Hindu</option>
                  <option value="Buddha" ${data?.agama === 'Buddha' ? 'selected' : ''}>Buddha</option>
                  <option value="Konghucu" ${data?.agama === 'Konghucu' ? 'selected' : ''}>Konghucu</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Pekerjaan <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="pekerjaan" value="${data?.pekerjaan || ''}" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">No. HP <span class="text-danger">*</span></label>
                <input type="tel" class="form-control" id="noHP" value="${data?.no_hp || ''}" required>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Alamat -->
        <div class="card mb-3">
          <div class="card-header bg-primary text-white">
            <strong>C. Alamat</strong>
          </div>
          <div class="card-body">
            <div id="alamatKTPContainer" class="mb-3 d-none">
              <label class="form-label">Alamat KTP (Lengkap) <span class="text-danger">*</span></label>
              <textarea class="form-control" id="alamatKTP" rows="3" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota">${alamatKTP}</textarea>
              <small class="text-muted">Untuk warga kontrak dengan KTP di luar RT 44</small>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Alamat Domisili (Otomatis)</label>
              <input type="text" class="form-control" id="alamatDomisili" 
                value="${Utils.generateAlamatDomisili(user.username)}" readonly>
            </div>
          </div>
        </div>
        
        <!-- Data Istri -->
        <div class="card mb-3">
          <div class="card-header bg-secondary text-white">
            <strong>D. Data Istri (Opsional)</strong>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Lengkap</label>
                <input type="text" class="form-control" id="namaIstri" value="${data?.nama_istri || ''}">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">NIK</label>
                <input type="text" class="form-control" id="nikIstri" value="${data?.nik_istri || ''}" maxlength="16">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Tempat/Tanggal Lahir</label>
                <input type="text" class="form-control" id="ttlIstri" value="${data?.ttl_istri || ''}" placeholder="Jakarta, 01-01-1990">
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Pekerjaan</label>
                <input type="text" class="form-control" id="pekerjaanIstri" value="${data?.pekerjaan_istri || ''}">
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label">Agama</label>
                <select class="form-select" id="agamaIstri">
                  <option value="">Pilih</option>
                  <option value="Islam" ${data?.agama_istri === 'Islam' ? 'selected' : ''}>Islam</option>
                  <option value="Kristen" ${data?.agama_istri === 'Kristen' ? 'selected' : ''}>Kristen</option>
                  <option value="Katolik" ${data?.agama_istri === 'Katolik' ? 'selected' : ''}>Katolik</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- TO BE CONTINUED IN PART 2 -->
      </form>
    `;
    
    // Event listeners
    document.getElementById('statusHunian').addEventListener('change', () => this.handleStatusHunian());
    this.handleStatusHunian();
    
    // Continue rendering in initUploadAndSubmit()
    this.initUploadAndSubmit();
  },
  
// ============================================
// PROFIL.JS - PART 2 (Complete)
// Gabungkan dengan PART 1
// ============================================

// Lanjutan dari Profil object...

  initUploadAndSubmit() {
    // Add upload section and submit button to form
    const form = document.getElementById('formProfil');
    
    form.insertAdjacentHTML('beforeend', `
      <!-- Data Anak -->
      <div class="card mb-3">
        <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
          <strong>E. Data Anak (Opsional)</strong>
          <button type="button" class="btn btn-light btn-sm" onclick="Profil.tambahAnak()">
            <i class="bi bi-plus-circle"></i> Tambah Anak
          </button>
        </div>
        <div class="card-body">
          <div id="daftarAnak">
            <p class="text-muted">Belum ada data anak</p>
          </div>
        </div>
      </div>
      
      <!-- Upload Dokumen -->
      <div class="card mb-3">
        <div class="card-header bg-success text-white">
          <strong>F. Upload Dokumen <span class="text-warning">* Minimal 1 KTP + 1 KK</span></strong>
        </div>
        <div class="card-body">
          <!-- Upload KTP -->
          <div class="mb-4">
            <label class="form-label fw-bold">Upload KTP (bisa lebih dari 1)</label>
            <div class="upload-area" onclick="document.getElementById('fileKTP').click()">
              <i class="bi bi-cloud-upload"></i>
              <p class="mb-0 mt-2">Klik untuk upload KTP</p>
              <small class="text-muted">JPG, PNG, PDF (Max 5MB)</small>
            </div>
            <input type="file" id="fileKTP" accept="image/*,.pdf" multiple class="d-none">
            <div id="previewKTP" class="mt-3"></div>
          </div>
          
          <!-- Upload KK -->
          <div class="mb-4">
            <label class="form-label fw-bold">Upload KK (bisa lebih dari 1)</label>
            <div class="upload-area" onclick="document.getElementById('fileKK').click()">
              <i class="bi bi-cloud-upload"></i>
              <p class="mb-0 mt-2">Klik untuk upload KK</p>
              <small class="text-muted">JPG, PNG, PDF (Max 5MB)</small>
            </div>
            <input type="file" id="fileKK" accept="image/*,.pdf" multiple class="d-none">
            <div id="previewKK" class="mt-3"></div>
          </div>
          
          <!-- Upload KIA -->
          <div class="mb-4">
            <label class="form-label fw-bold">Upload KIA/Akta (Opsional)</label>
            <div class="upload-area" onclick="document.getElementById('fileKIA').click()">
              <i class="bi bi-cloud-upload"></i>
              <p class="mb-0 mt-2">Klik untuk upload KIA</p>
              <small class="text-muted">JPG, PNG, PDF (Max 5MB)</small>
            </div>
            <input type="file" id="fileKIA" accept="image/*,.pdf" multiple class="d-none">
            <div id="previewKIA" class="mt-3"></div>
          </div>
        </div>
      </div>
      
      <!-- Submit -->
      <div class="text-end">
        <button type="submit" class="btn btn-primary btn-lg">
          <i class="bi bi-save"></i> Simpan Profil
        </button>
      </div>
    `);
    
    // File upload handlers
    document.getElementById('fileKTP').addEventListener('change', (e) => this.handleFileUpload(e, 'ktp'));
    document.getElementById('fileKK').addEventListener('change', (e) => this.handleFileUpload(e, 'kk'));
    document.getElementById('fileKIA').addEventListener('change', (e) => this.handleFileUpload(e, 'kia'));
    
    // Form submit
    form.addEventListener('submit', (e) => this.submit(e));
    
    // Render existing data
    this.renderDaftarAnak();
    this.renderFilePreview('ktp');
    this.renderFilePreview('kk');
    this.renderFilePreview('kia');
  },
  
  handleStatusHunian() {
    const status = document.getElementById('statusHunian').value;
    const peringatan = document.getElementById('peringatanKontrakLuar');
    const alamatKTPContainer = document.getElementById('alamatKTPContainer');
    const alamatKTP = document.getElementById('alamatKTP');
    
    if (status === 'kontrak_luar') {
      peringatan.classList.remove('d-none');
      alamatKTPContainer.classList.remove('d-none');
      alamatKTP.required = true;
    } else {
      peringatan.classList.add('d-none');
      alamatKTPContainer.classList.add('d-none');
      alamatKTP.required = false;
      
      if (status === 'pemilik' || status === 'kontrak_rt44') {
        const user = Utils.getCurrentUser();
        alamatKTP.value = Utils.generateAlamatDomisili(user.username);
      }
    }
  },
  
  async handleFileUpload(event, type) {
    const files = event.target.files;
    
    for (let file of files) {
      const validation = Utils.validateFile(file);
      if (!validation.valid) {
        Utils.showAlert(validation.message, 'danger');
        continue;
      }
      
      const base64 = await Utils.fileToBase64(file);
      const fileData = {
        name: file.name,
        data: base64,
        type: file.type,
        uploaded: false
      };
      
      if (type === 'ktp') this.uploadedKTP.push(fileData);
      else if (type === 'kk') this.uploadedKK.push(fileData);
      else if (type === 'kia') this.uploadedKIA.push(fileData);
      
      this.renderFilePreview(type);
    }
    
    event.target.value = '';
  },
  
  renderFilePreview(type) {
    let files, container;
    
    if (type === 'ktp') {
      files = this.uploadedKTP;
      container = document.getElementById('previewKTP');
    } else if (type === 'kk') {
      files = this.uploadedKK;
      container = document.getElementById('previewKK');
    } else {
      files = this.uploadedKIA;
      container = document.getElementById('previewKIA');
    }
    
    container.innerHTML = files.map((file, index) => `
      <div class="file-preview">
        <img src="${file.fileUrl || file.data}" alt="${file.fileName || file.name}">
        <button type="button" class="remove-btn" onclick="Profil.removeFile('${type}', ${index})">
          <i class="bi bi-x"></i>
        </button>
      </div>
    `).join('');
  },
  
  removeFile(type, index) {
    if (type === 'ktp') this.uploadedKTP.splice(index, 1);
    else if (type === 'kk') this.uploadedKK.splice(index, 1);
    else this.uploadedKIA.splice(index, 1);
    
    this.renderFilePreview(type);
  },
  
  tambahAnak() {
    this.dataAnak.push({
      nama: '',
      nik: '',
      ttl: '',
      jenis_kelamin: '',
      status: 'Anak Kandung'
    });
    this.renderDaftarAnak();
  },
  
  renderDaftarAnak() {
    const container = document.getElementById('daftarAnak');
    
    if (this.dataAnak.length === 0) {
      container.innerHTML = '<p class="text-muted">Belum ada data anak</p>';
      return;
    }
    
    container.innerHTML = this.dataAnak.map((anak, i) => `
      <div class="card mb-2">
        <div class="card-body">
          <div class="d-flex justify-content-between mb-2">
            <strong>Anak ke-${i + 1}</strong>
            <button type="button" class="btn btn-sm btn-danger" onclick="Profil.hapusAnak(${i})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="row">
            <div class="col-md-4 mb-2">
              <input type="text" class="form-control form-control-sm" placeholder="Nama" 
                value="${anak.nama}" onchange="Profil.dataAnak[${i}].nama = this.value">
            </div>
            <div class="col-md-3 mb-2">
              <input type="text" class="form-control form-control-sm" placeholder="NIK" 
                value="${anak.nik}" onchange="Profil.dataAnak[${i}].nik = this.value">
            </div>
            <div class="col-md-3 mb-2">
              <input type="text" class="form-control form-control-sm" placeholder="TTL" 
                value="${anak.ttl}" onchange="Profil.dataAnak[${i}].ttl = this.value">
            </div>
            <div class="col-md-2 mb-2">
              <select class="form-select form-select-sm" onchange="Profil.dataAnak[${i}].jenis_kelamin = this.value">
                <option value="">JK</option>
                <option value="L" ${anak.jenis_kelamin === 'L' ? 'selected' : ''}>L</option>
                <option value="P" ${anak.jenis_kelamin === 'P' ? 'selected' : ''}>P</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },
  
  hapusAnak(index) {
    this.dataAnak.splice(index, 1);
    this.renderDaftarAnak();
  },
  
  async submit(e) {
    e.preventDefault();
    
    // Validate
    if (this.uploadedKTP.length === 0 || this.uploadedKK.length === 0) {
      Utils.showAlert('Minimal harus upload 1 KTP dan 1 KK!', 'danger');
      return;
    }
    
    Utils.showLoading();
    
    // Upload files first
    const ktpUploaded = await this.uploadFiles(this.uploadedKTP);
    const kkUploaded = await this.uploadFiles(this.uploadedKK);
    const kiaUploaded = await this.uploadFiles(this.uploadedKIA);
    
    const user = Utils.getCurrentUser();
    const alamatKTP = document.getElementById('alamatKTP').value || document.getElementById('alamatDomisili').value;
    
    const profilData = {
      status_hunian: document.getElementById('statusHunian').value,
      nama_kk: document.getElementById('namaKK').value,
      nik_kk: document.getElementById('nikKK').value,
      tempat_lahir: document.getElementById('tempatLahir').value,
      tanggal_lahir: document.getElementById('tanggalLahir').value,
      jenis_kelamin: document.getElementById('jenisKelamin').value,
      agama: document.getElementById('agama').value,
      pekerjaan: document.getElementById('pekerjaan').value,
      no_hp: document.getElementById('noHP').value,
      alamat_ktp: alamatKTP,
      nama_istri: document.getElementById('namaIstri').value,
      nik_istri: document.getElementById('nikIstri').value,
      ttl_istri: document.getElementById('ttlIstri').value,
      pekerjaan_istri: document.getElementById('pekerjaanIstri').value,
      agama_istri: document.getElementById('agamaIstri').value,
      data_anak: this.dataAnak,
      files_ktp: ktpUploaded,
      files_kk: kkUploaded,
      files_kia: kiaUploaded,
      is_complete: true
    };
    
    const result = await API.saveProfil(user.username, profilData);
    
    Utils.hideLoading();
    
    if (result.success) {
      user.status_profil = 'lengkap';
      Utils.saveUser(user);
      Utils.showAlert('Profil berhasil disimpan!', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } else {
      Utils.showAlert('Gagal: ' + result.message, 'danger');
    }
  },
  
  async uploadFiles(files) {
    const user = Utils.getCurrentUser();
    const uploaded = [];
    
    for (let file of files) {
      if (file.uploaded) {
        uploaded.push(file);
        continue;
      }
      
      const result = await API.uploadFile(
        user.username,
        file.data,
        file.name,
        file.type
      );
      
      if (result.success) {
        uploaded.push({
          fileId: result.fileId,
          fileUrl: result.fileUrl,
          fileName: result.fileName,
          uploaded: true
        });
      }
    }
    
    return uploaded;
  }
};