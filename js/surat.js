// ============================================
// SURAT.JS - Surat Functions
// ============================================

const Surat = {
  
  masterSurat: [],
  
  // Load ajukan surat
  async loadAjukan() {
    Utils.showLoading();
    
    // Check status hunian first
    const user = Utils.getCurrentUser();
    const profilResult = await API.getProfil(user.username);
    
    if (profilResult.success && profilResult.data) {
      if (profilResult.data.status_hunian === 'kontrak_luar') {
        Utils.hideLoading();
        this.renderBlocked();
        return;
      }
    }
    
    // Load master surat
    const result = await API.getMasterSurat();
    
    Utils.hideLoading();
    
    if (result.success) {
      this.masterSurat = result.data;
      this.renderPilihJenis();
    }
  },
  
  renderBlocked() {
    const content = document.getElementById('contentArea');
          content.innerHTML = `
      <div class="alert alert-danger">
        <i class="bi bi-x-circle-fill"></i>
        <h5>Tidak Dapat Mengajukan Surat</h5>
        <p>Anda terdaftar sebagai warga kontrak dengan KTP di luar RT 44.</p>
        <p><strong>Silakan urus perpindahan domisili terlebih dahulu ke RT 44 untuk dapat mengajukan surat.</strong></p>
        <hr>
        <button class="btn btn-primary" onclick="event.preventDefault(); loadDashboard(); return false;">Kembali ke Dashboard</button>
      </div>
    `;
  },
  
  renderPilihJenis() {
    const content = document.getElementById('contentArea');
    
    const pengantar = this.masterSurat.filter(s => s.kategori === 'pengantar');
    const pernyataan = this.masterSurat.filter(s => s.kategori === 'pernyataan');
    
    content.innerHTML = `
      <h4 class="mb-4"><i class="bi bi-file-earmark-plus"></i> Ajukan Surat</h4>
      
      <div class="card mb-3">
        <div class="card-header bg-primary text-white">
          <strong>Surat Pengantar RT</strong>
        </div>
        <div class="card-body">
          ${pengantar.map(s => `
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <strong>${s.nama_surat}</strong>
              </div>
              <button class="btn btn-primary btn-sm" onclick="event.preventDefault(); Surat.buat('${s.id_surat}'); return false;">
                <i class="bi bi-pencil"></i> Buat
              </button>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header bg-success text-white">
          <strong>Surat Pernyataan</strong>
        </div>
        <div class="card-body">
          ${pernyataan.map(s => `
            <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
              <div>
                <strong>${s.nama_surat.replace('Surat Pernyataan ', '')}</strong>
              </div>
              <button class="btn btn-success btn-sm" onclick="event.preventDefault(); Surat.buat('${s.id_surat}'); return false;">
                <i class="bi bi-pencil"></i> Buat
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  async buat(idSurat) {
    Utils.showLoading();
    
    const surat = this.masterSurat.find(s => s.id_surat === idSurat);
    const user = Utils.getCurrentUser();
    const profilResult = await API.getProfil(user.username);
    
    Utils.hideLoading();
    
    if (profilResult.success) {
      this.renderFormSurat(surat, profilResult.data);
    }
  },
  
  renderFormSurat(surat, profil) {
    const content = document.getElementById('contentArea');
    const fields = surat.fields || {};
    
    content.innerHTML = `
      <div class="mb-3">
        <button class="btn btn-secondary btn-sm" onclick="event.preventDefault(); Surat.loadAjukan(); return false;">
          <i class="bi bi-arrow-left"></i> Kembali
        </button>
      </div>
      
      <h4 class="mb-4">${surat.nama_surat}</h4>
      
      <div class="card mb-3">
        <div class="card-header bg-info text-white">
          <strong>Data Pemohon (Auto-fill dari profil)</strong>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Nama:</strong> ${profil.nama_kk}</p>
              <p><strong>NIK:</strong> ${profil.nik_kk}</p>
              <p><strong>TTL:</strong> ${profil.tempat_lahir}, ${profil.tanggal_lahir}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Pekerjaan:</strong> ${profil.pekerjaan}</p>
              <p><strong>Agama:</strong> ${profil.agama}</p>
              <p><strong>Alamat:</strong> ${profil.alamat_domisili}</p>
            </div>
          </div>
        </div>
      </div>
      
      <form id="formSurat">
        <div class="card mb-3">
          <div class="card-header bg-primary text-white">
            <strong>Informasi Tambahan</strong>
          </div>
          <div class="card-body">
            ${Object.keys(fields).map(key => {
              const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              const type = fields[key];
              
              if (type === 'textarea') {
                return `
                  <div class="mb-3">
                    <label class="form-label">${label} <span class="text-danger">*</span></label>
                    <textarea class="form-control" id="${key}" rows="3" required></textarea>
                  </div>
                `;
              } else if (type === 'date') {
                return `
                  <div class="mb-3">
                    <label class="form-label">${label} <span class="text-danger">*</span></label>
                    <input type="date" class="form-control" id="${key}" required>
                  </div>
                `;
              } else {
                return `
                  <div class="mb-3">
                    <label class="form-label">${label} <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="${key}" required>
                  </div>
                `;
              }
            }).join('')}
          </div>
        </div>
        
        <div class="text-end">
          <button type="submit" class="btn btn-primary btn-lg">
            <i class="bi bi-send"></i> Kirim Pengajuan
          </button>
        </div>
      </form>
    `;
    
    document.getElementById('formSurat').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit(surat, profil);
    });
  },
  
  async submit(surat, profil) {
    const fields = surat.fields || {};
    const dataTambahan = {};
    
    Object.keys(fields).forEach(key => {
      dataTambahan[key] = document.getElementById(key).value;
    });
    
    const suratData = {
      nama: profil.nama_kk,
      jenis_surat: surat.nama_surat,
      keperluan: dataTambahan.keperluan || dataTambahan.keperluan_spesifik || 'Sesuai permohonan',
      data_tambahan: dataTambahan
    };
    
    Utils.showLoading();
    
    const user = Utils.getCurrentUser();
    const result = await API.submitSurat(user.username, suratData);
    
    Utils.hideLoading();
    
    if (result.success) {
      Utils.showAlert('Pengajuan berhasil dikirim! ID: ' + result.id, 'success');
      setTimeout(() => this.loadRiwayat(), 1500);
    } else {
      Utils.showAlert('Gagal: ' + result.message, 'danger');
    }
  },
  
  async loadRiwayat() {
    Utils.showLoading();
    
    const user = Utils.getCurrentUser();
    const result = await API.getRiwayatSurat(user.username);
    
    Utils.hideLoading();
    
    if (result.success) {
      this.renderRiwayat(result.data);
    }
  },
  
  renderRiwayat(riwayat) {
    const content = document.getElementById('contentArea');
    
    content.innerHTML = `
      <h4 class="mb-4"><i class="bi bi-clock-history"></i> Riwayat Pengajuan Surat</h4>
      
      ${riwayat.length === 0 ? `
        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i> Belum ada pengajuan surat.
        </div>
      ` : `
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Jenis Surat</th>
                    <th>Keperluan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${riwayat.map(s => `
                    <tr>
                      <td>${s.id}</td>
                      <td>${s.jenis_surat}</td>
                      <td>${s.keperluan}</td>
                      <td>${Utils.formatDate(s.tanggal_ajuan)}</td>
                      <td>
                        <span class="badge bg-${Utils.getStatusClass(s.status)}">
                          ${s.status}
                        </span>
                      </td>
                      <td>
                        ${s.status === 'Diterima' && s.link_pdf ? `
                          <a href="${s.link_pdf}" target="_blank" class="btn btn-sm btn-primary">
                            <i class="bi bi-download"></i> Download
                          </a>
                        ` : '-'}
                        ${s.catatan_admin ? `
                          <button class="btn btn-sm btn-info" onclick="alert('Catatan Admin: ${s.catatan_admin.replace(/'/g, "\\'")}')">
                            <i class="bi bi-chat-left-text"></i>
                          </button>
                        ` : ''}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `}
    `;
  }
};