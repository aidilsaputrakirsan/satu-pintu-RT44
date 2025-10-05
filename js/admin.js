// ============================================
// ADMIN.JS - Admin Panel Functions
// ============================================

const Admin = {
  
  // Load pengajuan surat
  async loadPengajuan() {
    Utils.showLoading();
    
    const result = await API.getAllPengajuan('Diproses');
    
    Utils.hideLoading();
    
    if (result.success) {
      this.renderPengajuan(result.data);
    }
  },
  
  renderPengajuan(pengajuan) {
    const content = document.getElementById('contentArea');
    
    content.innerHTML = `
      <h4 class="mb-4"><i class="bi bi-envelope-fill"></i> Pengajuan Surat (Diproses)</h4>
      
      ${pengajuan.length === 0 ? `
        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i> Tidak ada pengajuan surat yang perlu diproses.
        </div>
      ` : `
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nomor Rumah</th>
                    <th>Nama</th>
                    <th>Jenis Surat</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${pengajuan.map(p => `
                    <tr>
                      <td>${p.id}</td>
                      <td>${p.username}</td>
                      <td>${p.nama}</td>
                      <td>${p.jenis_surat}</td>
                      <td>${Utils.formatDate(p.tanggal_ajuan)}</td>
                      <td>
                        <button class="btn btn-sm btn-info" onclick="Admin.lihatDetail('${p.id}')">
                          <i class="bi bi-eye"></i> Detail
                        </button>
                        <button class="btn btn-sm btn-success" onclick="Admin.terima('${p.id}')">
                          <i class="bi bi-check"></i> Terima
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="Admin.tolak('${p.id}')">
                          <i class="bi bi-x"></i> Tolak
                        </button>
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
  },
  
  async lihatDetail(id) {
    Utils.showLoading();
    
    const result = await API.getAllPengajuan();
    
    Utils.hideLoading();
    
    if (result.success) {
      const surat = result.data.find(s => s.id === id);
      if (surat) {
        const detail = `
Detail Surat:
ID: ${surat.id}
Nama: ${surat.nama}
Jenis: ${surat.jenis_surat}
Keperluan: ${surat.keperluan}
Data Tambahan: ${JSON.stringify(surat.data_tambahan, null, 2)}
        `;
        alert(detail);
      }
    }
  },
  
  async terima(id) {
    if (!confirm('Terima pengajuan surat ini?')) return;
    
    Utils.showLoading();
    
    const user = Utils.getCurrentUser();
    const result = await API.updateStatusSurat(id, 'Diterima', 'Disetujui oleh admin', user.username);
    
    Utils.hideLoading();
    
    if (result.success) {
      Utils.showAlert('Surat berhasil diterima', 'success');
      this.loadPengajuan();
    } else {
      Utils.showAlert('Gagal: ' + result.message, 'danger');
    }
  },
  
  async tolak(id) {
    const catatan = prompt('Alasan penolakan:');
    if (!catatan) return;
    
    Utils.showLoading();
    
    const user = Utils.getCurrentUser();
    const result = await API.updateStatusSurat(id, 'Ditolak', catatan, user.username);
    
    Utils.hideLoading();
    
    if (result.success) {
      Utils.showAlert('Surat berhasil ditolak', 'success');
      this.loadPengajuan();
    } else {
      Utils.showAlert('Gagal: ' + result.message, 'danger');
    }
  },
  
  async loadWarga() {
    Utils.showLoading();
    
    const result = await API.getAllWarga();
    
    Utils.hideLoading();
    
    if (result.success) {
      this.renderWarga(result.data);
    }
  },
  
  renderWarga(warga) {
    const content = document.getElementById('contentArea');
    
    // Count stats
    const lengkap = warga.filter(w => w.is_complete).length;
    const belumLengkap = warga.length - lengkap;
    
    content.innerHTML = `
      <h4 class="mb-4"><i class="bi bi-people-fill"></i> Daftar Warga RT 44</h4>
      
      <div class="row mb-3">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h6>Total Warga</h6>
              <h3>${warga.length}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card">
            <div class="card-body">
              <h6>Profil Lengkap</h6>
              <h3 class="text-success">${lengkap}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card">
            <div class="card-body">
              <h6>Belum Lengkap</h6>
              <h3 class="text-warning">${belumLengkap}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Nomor Rumah</th>
                  <th>Nama KK</th>
                  <th>Status Hunian</th>
                  <th>No. HP</th>
                  <th>Status Profil</th>
                </tr>
              </thead>
              <tbody>
                ${warga.map(w => `
                  <tr>
                    <td>${w.username}</td>
                    <td>${w.nama_kk || '-'}</td>
                    <td>${w.status_hunian || '-'}</td>
                    <td>${w.no_hp || '-'}</td>
                    <td>
                      ${w.is_complete ? 
                        '<span class="badge bg-success">Lengkap</span>' : 
                        '<span class="badge bg-warning">Belum Lengkap</span>'
                      }
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
};