let isSidebarOpen = true;

// Supabase client (optional). If configured via window.SUPABASE_URL and window.SUPABASE_ANON_KEY,
// we will use Supabase (DB + Storage) so it works fully online without hosting a custom backend.
let supa = null;
function initSupabaseClient() {
    try {
        if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
            supa = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
            console.log('[SIPANDU] Supabase client initialized');
        }
    } catch (e) {
        console.warn('[SIPANDU] Supabase not available:', e);
    }
}

// Penyimpanan sementara (simulasi database) untuk halaman Mutasi PM.
let mutasiDataList = [];

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('sidebar-overlay');
    
    isSidebarOpen = !isSidebarOpen;

    if (isSidebarOpen) {
        sidebar.classList.remove('collapsed');
        if (window.innerWidth >= 1024) mainContent.classList.add('lg:ml-72');
        else overlay.classList.add('active');
    } else {
        sidebar.classList.add('collapsed');
        mainContent.classList.remove('lg:ml-72');
        overlay.classList.remove('active');
    }
}

function toggleSubmenu(id, btn) {
    const submenu = document.getElementById(id);
    const chevron = btn.querySelector('.chevron-icon');
    
    // Tutup semua submenu lainnya (Opsional, jika ingin perilaku akordion)
    /*
    document.querySelectorAll('.submenu-container').forEach(sub => {
        if(sub.id !== id) {
            sub.classList.remove('open');
            const otherBtn = sub.previousElementSibling;
            if(otherBtn) otherBtn.querySelector('.chevron-icon').classList.remove('rotate');
        }
    });
    */

    submenu.classList.toggle('open');
    chevron.classList.toggle('rotate');
}

function showPage(pageId) {
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active-menu'));
    const activeBtn = document.getElementById('menu-' + pageId);
    if (activeBtn) activeBtn.classList.add('active-menu');
    
    const displayTitle = pageId.replace(/-/g, ' ').toUpperCase();
    document.getElementById('page-title-display').innerText = displayTitle === 'DASHBOARD' ? 'Dashboard' : displayTitle;

    // Konten dinamis untuk setiap halaman
    const pageContents = {
        'dashboard': `
            <!-- Hero Section -->
            <div class="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-sky-200">
                <div class="relative z-10 max-w-lg">
                    <h3 class="text-2xl font-black mb-2 uppercase tracking-tight">Si PANDU</h3>
                    <p class="text-sky-100 text-sm leading-relaxed mb-6 font-medium">Sistem Informasi Penyimpanan Data Terpadu PPS Raharjo Sragen. <br>
                    Akses data internal secara cepat dan efisien.</p>
                    <div class="flex space-x-3">
                        <div class="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">Status: Aktif</div>
                    </div>
                </div>
                <i data-lucide="database" class="absolute -right-8 -bottom-8 w-64 h-64 text-white/10 rotate-12"></i>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><i data-lucide="users" class="w-5 h-5"></i></div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Pegawai</h4>
                    <p class="text-3xl font-black text-slate-800">45</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div class="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4"><i data-lucide="user-check" class="w-5 h-5"></i></div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">PM Aktif</h4>
                    <p class="text-3xl font-black text-slate-800">120</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4"><i data-lucide="mail" class="w-5 h-5"></i></div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Surat Masuk</h4>
                    <p class="text-3xl font-black text-slate-800">12</p>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><i data-lucide="check-circle" class="w-5 h-5"></i></div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capaian Laporan</h4>
                    <p class="text-3xl font-black text-slate-800">100<span class="text-sm">%</span></p>
                </div>
            </div>

            <!-- Info Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div class="flex items-center space-x-3 mb-2">
                        <i data-lucide="mouse-pointer-click" class="w-5 h-5 text-sky-500"></i>
                        <h4 class="font-black text-sm uppercase tracking-wider">Navigasi Dropdown</h4>
                    </div>
                    <p class="text-sm text-slate-500 leading-relaxed">Klik pada nama kelompok kerja di sidebar untuk membuka sub-menu dan mengakses data spesifik yang Anda butuhkan.</p>
                </div>
                <div class="bg-sky-50 p-8 rounded-3xl border border-sky-100 shadow-sm space-y-4">
                    <div class="flex items-center space-x-3 mb-2">
                        <i data-lucide="info" class="w-5 h-5 text-sky-600"></i>
                        <h4 class="font-black text-sm uppercase tracking-wider text-sky-800">Satu Pintu</h4>
                    </div>
                    <p class="text-sm text-sky-700/70 leading-relaxed">Seluruh laporan dan data transaksi belanja kini terintegrasi dalam satu sistem untuk memudahkan monitoring pimpinan.</p>
                </div>
            </div>
        `,
        'pengumuman': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Pengumuman</h3>
                <p class="text-slate-600">Halaman pengumuman akan segera tersedia.</p>
            </div>
        `,
        'pegawai': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Data Pegawai</h3>
                <p class="text-slate-600">Halaman data pegawai akan segera tersedia.</p>
            </div>
        `,
        'surat-masuk': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Surat Masuk</h3>
                <p class="text-slate-600">Halaman surat masuk akan segera tersedia.</p>
            </div>
        `,
        'surat-keluar': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Surat Keluar</h3>
                <p class="text-slate-600">Halaman surat keluar akan segera tersedia.</p>
            </div>
        `,
        'absensi-pm': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Absensi PM</h3>
                <p class="text-slate-600">Halaman absensi PM akan segera tersedia.</p>
            </div>
        `,
        'mutasi-pm': `
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                         <i data-lucide="shuffle" class="w-5 h-5 text-indigo-500"></i>
                        <h3 class="text-xl font-black text-slate-800">Mutasi PM</h3>
                    </div>
                    <div class="flex gap-2">
                        <button id="mutasiTabInputBtn" class="px-3 py-1.5 bg-violet-500 text-white text-xs rounded-lg hover:bg-violet-600">Input Baru</button>
                        <button id="mutasiTabHistoryBtn" class="px-3 py-1.5 bg-slate-500 text-white text-xs rounded-lg hover:bg-slate-600">Data Cloud</button>
                    </div>
                </div>

                <div id="mutasiInputTab" class="bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <form id="mutasiForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Unit Pelayanan</label>
                                <select name="unitPelayanan" class="w-full p-3.5 bg-white border-2 border-violet-100 focus:border-violet-300 rounded-2xl font-bold text-sm outline-none transition-all" required>
                                    <option value="">Pilih Unit</option>
                                    <option value="PPSDI Raharjo Sragen">PPSDI Raharjo Sragen</option>
                                    <option value="RPSLU Mojomulyo Sragen">RPSLU Mojomulyo Sragen</option>
                                    <option value="RPSA Pamardi Siwi Sragen">RPSA Pamardi Siwi Sragen</option>
                                    <option value="RPS PMKS Gondang">RPS PMKS Gondang</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Periode Laporan</label>
                                <input type="month" name="bulanTahun" class="w-full p-3.5 bg-white border-2 border-sky-100 focus:border-sky-300 rounded-2xl font-bold text-sm outline-none transition-all" required />
                            </div>
                        </div>

                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-[2rem] border-2 border-slate-100/70">
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-slate-500 block text-center mb-2">PM Awal</label>
                                <input type="number" name="jumlahAwal" placeholder="0" class="w-full p-3 bg-white border border-slate-200 shadow-sm rounded-xl text-center font-black text-base outline-none focus:ring-2 ring-sky-400/20 transition-all" min="0" required />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-emerald-600 block text-center mb-2">Masuk</label>
                                <input type="number" name="pmMasuk" placeholder="0" class="w-full p-3 bg-white border border-emerald-200 shadow-sm rounded-xl text-center font-black text-base outline-none focus:ring-2 ring-emerald-400/20 transition-all" min="0" required />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-rose-600 block text-center mb-2">Keluar</label>
                                <input type="number" name="pmKeluar" placeholder="0" class="w-full p-3 bg-white border border-rose-200 shadow-sm rounded-xl text-center font-black text-base outline-none focus:ring-2 ring-rose-400/20 transition-all" min="0" required />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-slate-900 block text-center mb-2">Sisa Akhir</label>
                                <input type="number" id="mutasiJumlahAkhir" name="jumlahAkhir" class="w-full p-3 bg-slate-900 text-white rounded-xl text-center font-black text-base shadow-lg shadow-slate-200" readonly />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Upload PDF (Opsional)</label>
                                <input type="file" name="pdfFile" accept="application/pdf,.pdf" class="w-full p-3.5 bg-white border-2 border-slate-200 focus:border-slate-300 rounded-2xl font-bold text-sm outline-none transition-all" />
                                <p class="text-[10px] text-slate-400 font-bold mt-1">Maks 5MB</p>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Catatan</label>
                                <input name="catatan" placeholder="Tambahkan catatan jika diperlukan" class="w-full p-3.5 bg-white border-2 border-slate-200 focus:border-slate-300 rounded-2xl font-bold text-sm outline-none transition-all" />
                            </div>
                        </div>

                        <div class="flex gap-4 pt-2">
                            <button type="reset" class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all">Reset</button>
                            <button type="submit" class="px-6 py-3 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 hover:bg-indigo-700 hover:shadow-indigo-200 flex items-center gap-2">
                                <i data-lucide="save" class="w-4 h-4 text-white"></i>
                                Simpan (Simulasi)
                            </button>
                        </div>
                    </form>
                </div>

                <div id="mutasiHistoryTab" class="hidden bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="flex-1 relative">
                            <i data-lucide="search" class="w-4 h-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2"></i>
                            <input id="mutasiSearch" type="text" placeholder="Cari unit atau periode..." class="w-full pl-10 pr-4 py-3 bg-sky-50 border-2 border-transparent focus:border-sky-200 rounded-2xl text-xs font-bold outline-none transition-all" />
                        </div>
                        <div class="lg:w-60">
                            <select id="mutasiFilterUnit" class="w-full p-3.5 bg-violet-50 border-2 border-transparent focus:border-violet-200 rounded-2xl text-xs font-black uppercase outline-none cursor-pointer">
                                <option value="Semua">Semua Unit</option>
                                <option value="PPSDI Raharjo Sragen">PPSDI Raharjo Sragen</option>
                                <option value="RPSLU Mojomulyo Sragen">RPSLU Mojomulyo Sragen</option>
                                <option value="RPSA Pamardi Siwi Sragen">RPSA Pamardi Siwi Sragen</option>
                                <option value="RPS PMKS Gondang">RPS PMKS Gondang</option>
                            </select>
                        </div>
                        <div class="flex items-end gap-3">
                            <div>
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Periode Dari</label>
                                <input id="mutasiFilterStart" type="month" class="w-full p-3.5 bg-emerald-50 border-2 border-transparent focus:border-emerald-200 rounded-2xl text-xs font-bold outline-none transition-all" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sampai</label>
                                <input id="mutasiFilterEnd" type="month" class="w-full p-3.5 bg-emerald-50 border-2 border-transparent focus:border-emerald-200 rounded-2xl text-xs font-bold outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[980px]">
                            <thead>
                                <tr class="bg-slate-50/80 border-b text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th class="p-4 pl-6 text-left">Unit Pelayanan</th>
                                    <th class="p-4 text-center">Periode</th>
                                    <th class="p-4 text-center">Data Mutasi (A-M-K)</th>
                                    <th class="p-4 text-center">Sisa Akhir</th>
                                    <th class="p-4 text-center">Catatan</th>
                                    <th class="p-4 text-right pr-6">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="mutasiTableBody" class="divide-y divide-slate-50">
                                <tr><td colspan="6" class="p-10 text-center text-slate-500">Belum ada data.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,
        'belanja-sosh': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Belanja SOSH</h3>
                <p class="text-slate-600">Halaman belanja SOSH akan segera tersedia.</p>
            </div>
        `,
        'belanja-pakaian': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Belanja Pakaian</h3>
                <p class="text-slate-600">Halaman belanja pakaian akan segera tersedia.</p>
            </div>
        `,
        'belanja-umum': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Belanja Umum</h3>
                <p class="text-slate-600">Halaman belanja umum akan segera tersedia.</p>
            </div>
        `,
        'belanja-modal': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Belanja Modal</h3>
                <p class="text-slate-600">Halaman belanja modal akan segera tersedia.</p>
            </div>
        `,
        'laporan-unit': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Laporan Unit Kerja</h3>
                <p class="text-slate-600">Halaman laporan unit kerja akan segera tersedia.</p>
            </div>
        `,
        'laporan-kegiatan': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Laporan Kegiatan</h3>
                <p class="text-slate-600">Halaman laporan kegiatan akan segera tersedia.</p>
            </div>
        `,
        'laporan-ikm': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Laporan IKM</h3>
                <p class="text-slate-600">Halaman laporan IKM akan segera tersedia.</p>
            </div>
        `,
        'laporan-spm': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Laporan SPM</h3>
                <p class="text-slate-600">Halaman laporan SPM akan segera tersedia.</p>
            </div>
        `,
        'laporan-pekpp': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Laporan E-PEKPP</h3>
                <p class="text-slate-600">Halaman laporan E-PEKPP akan segera tersedia.</p>
            </div>
        `,
        'laporan-bmd': `
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Laporan BMD</h3>
                <p class="text-slate-600">Halaman laporan BMD akan segera tersedia.</p>
            </div>
        `
    };

    const content = pageContents[pageId] || '<div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"><h3 class="text-xl font-black mb-4">Halaman Tidak Ditemukan</h3><p class="text-slate-600">Konten untuk halaman ini belum tersedia.</p></div>';
    document.getElementById('page-content').innerHTML = content;

    if (window.innerWidth < 1024) toggleSidebar();
    initIcons();
    if (pageId === 'mutasi-pm') initMutasiForm();
}

function initMutasiForm() {
    const form = document.getElementById('mutasiForm');
    const tabInput = document.getElementById('mutasiInputTab');
    const tabHistory = document.getElementById('mutasiHistoryTab');
    const btnInput = document.getElementById('mutasiTabInputBtn');
    const btnHistory = document.getElementById('mutasiTabHistoryBtn');
    const tableBody = document.getElementById('mutasiTableBody');
    const searchEl = document.getElementById('mutasiSearch');
    const filterEl = document.getElementById('mutasiFilterUnit');
    const filterStartEl = document.getElementById('mutasiFilterStart');
    const filterEndEl = document.getElementById('mutasiFilterEnd');
    let editingId = null;
    const useDB = !!supa; // switch to online DB mode if Supabase configured

    if (!form || !tabInput || !tabHistory) return;

    const switchTab = (tab) => {
        const isInput = tab === 'input';
        tabInput.classList.toggle('hidden', !isInput);
        tabHistory.classList.toggle('hidden', isInput);
        if (btnInput && btnHistory) {
            btnInput.classList.toggle('bg-emerald-500', isInput);
            btnInput.classList.toggle('bg-slate-500', !isInput);
            btnHistory.classList.toggle('bg-emerald-500', !isInput);
            btnHistory.classList.toggle('bg-slate-500', isInput);
        }
        initIcons();
    };

    if (btnInput) btnInput.addEventListener('click', () => switchTab('input'));
    if (btnHistory) btnHistory.addEventListener('click', () => switchTab('history'));

    ['jumlahAwal', 'pmMasuk', 'pmKeluar'].forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) input.addEventListener('input', calculateMutasiAkhir);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());
        data.jumlahAwal = Number(data.jumlahAwal) || 0;
        data.pmMasuk = Number(data.pmMasuk) || 0;
        data.pmKeluar = Number(data.pmKeluar) || 0;
        data.jumlahAkhir = (data.jumlahAwal + data.pmMasuk) - data.pmKeluar;

        const pdfFile = fd.get('pdfFile');

        if (useDB) {
            try {
                // Upload PDF ke Supabase Storage (opsional)
                let pdfUrl = '';
                let pdfName = '';
                if (pdfFile && pdfFile.name) {
                    if (pdfFile.type !== 'application/pdf') {
                        alert('File harus berupa PDF');
                        return;
                    }
                    if (pdfFile.size > 5 * 1024 * 1024) {
                        alert('Ukuran PDF maksimal 5MB');
                        return;
                    }
                    const bucket = window.SUPABASE_BUCKET || 'pdf';
                    const safe = pdfFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
                    const filePath = `mutasi_pm/${Date.now()}_${safe}`;
                    const upRes = await supa.storage.from(bucket).upload(filePath, pdfFile, { contentType: 'application/pdf', upsert: true });
                    if (upRes.error) throw upRes.error;
                    const pub = supa.storage.from(bucket).getPublicUrl(filePath);
                    pdfUrl = (pub && pub.data && pub.data.publicUrl) ? pub.data.publicUrl : '';
                    pdfName = pdfFile.name;
                }

                const payload = {
                    unitPelayanan: data.unitPelayanan || '',
                    bulanTahun: data.bulanTahun || '',
                    jumlahAwal: data.jumlahAwal,
                    pmMasuk: data.pmMasuk,
                    pmKeluar: data.pmKeluar,
                    jumlahAkhir: data.jumlahAkhir,
                    catatan: data.catatan || '',
                    pdfUrl,
                    pdfName,
                    updatedAt: new Date().toISOString()
                };

                if (editingId) {
                    const up = await supa.from('mutasi_pm').update(payload).eq('id', editingId).select().single();
                    if (up.error) throw up.error;
                    editingId = null;
                } else {
                    payload.createdAt = new Date().toISOString();
                    const ins = await supa.from('mutasi_pm').insert([payload]).select().single();
                    if (ins.error) throw ins.error;
                }

                form.reset();
                calculateMutasiAkhir();
                if (typeof fetchData === 'function') await fetchData();
                switchTab('history');
                return;
            } catch (err) {
                console.error('Supabase error:', err);
                alert('Gagal menyimpan ke database online');
                return;
            }
        }

        // Fallback lokal (simulasi) jika Supabase belum dikonfigurasi
        if (pdfFile && pdfFile.name) {
            if (pdfFile.type !== 'application/pdf') {
                alert('File harus berupa PDF');
                return;
            }
            if (pdfFile.size > 5 * 1024 * 1024) {
                alert('Ukuran PDF maksimal 5MB');
                return;
            }
            data.pdfName = pdfFile.name;
            data.pdfUrl = URL.createObjectURL(pdfFile);
        } else {
            data.pdfName = '';
            data.pdfUrl = '';
        }

        if (editingId) {
            const idx = mutasiDataList.findIndex(x => x.id === editingId);
            if (idx !== -1) mutasiDataList[idx] = { ...mutasiDataList[idx], ...data };
            editingId = null;
        } else {
            data.id = Date.now().toString();
            mutasiDataList.unshift(data);
        }

        form.reset();
        calculateMutasiAkhir();
        renderTable();
        switchTab('history');
    });

    form.addEventListener('reset', () => {
        setTimeout(calculateMutasiAkhir, 0);
    });

    function matchFilter(item) {
        const q = ((searchEl && searchEl.value) ? searchEl.value : '').toLowerCase();
        const unit = (item.unitPelayanan || '').toLowerCase();
        const periode = (item.bulanTahun || '');
        const unitFilter = (filterEl && filterEl.value) ? filterEl.value : 'Semua';
        const start = (filterStartEl && filterStartEl.value) ? filterStartEl.value : '';
        const end = (filterEndEl && filterEndEl.value) ? filterEndEl.value : '';

        const searchOk = unit.includes(q) || periode.toLowerCase().includes(q);
        const unitOk = unitFilter === 'Semua' || item.unitPelayanan === unitFilter;

        let periodOk = true;
        if (start && end) {
            periodOk = (periode >= start && periode <= end);
        } else if (start) {
            periodOk = (periode === start);
        } else if (end) {
            periodOk = (periode === end);
        }

        return searchOk && unitOk && periodOk;
    }

    // Fetch data from Supabase if configured
    async function fetchData() {
        if (!useDB) { renderTable(); return; }
        try {
            const q = (searchEl && searchEl.value) ? searchEl.value : '';
            const unit = (filterEl && filterEl.value) ? filterEl.value : 'Semua';
            const start = (filterStartEl && filterStartEl.value) ? filterStartEl.value : '';
            const end = (filterEndEl && filterEndEl.value) ? filterEndEl.value : '';

            let query = supa.from('mutasi_pm').select('*').order('updatedAt', { ascending: false });
            if (unit && unit !== 'Semua') query = query.eq('unitPelayanan', unit);
            if (start && end) query = query.gte('bulanTahun', start).lte('bulanTahun', end);
            else if (start) query = query.eq('bulanTahun', start);
            else if (end) query = query.eq('bulanTahun', end);
            if (q) query = query.or(`unitPelayanan.ilike.%${q}%,bulanTahun.ilike.%${q}%`);

            const { data, error } = await query;
            if (error) throw error;
            mutasiDataList = data || [];
            renderTable();
        } catch (err) {
            console.error('Supabase fetch error:', err);
            alert('Gagal mengambil data dari database online');
        }
    }

    function renderTable() {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        const rows = mutasiDataList.filter(matchFilter);
        if (rows.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="p-10 text-center text-slate-500">Belum ada data.</td></tr>';
            return;
        }
        rows.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50/80 transition-all group';
            tr.innerHTML = `
                <td class="p-4 pl-6">
                    <div class="flex flex-col">
                        <span class="font-black text-sm text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">${item.unitPelayanan}</span>
                        <span class="text-[9px] font-bold text-slate-400 mt-1 uppercase">ID: ${item.id.slice(-8)}</span>
                    </div>
                </td>
                <td class="p-4 text-center">
                    <span class="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider">${item.bulanTahun || '-'}</span>
                </td>
                <td class="p-4">
                    <div class="flex items-center justify-center gap-4">
                        <div class="text-center">
                            <p class="text-[8px] font-black text-slate-300 uppercase">Awal</p>
                            <p class="font-bold text-slate-600">${item.jumlahAwal}</p>
                        </div>
                        <div class="w-px h-6 bg-slate-100"></div>
                        <div class="text-center">
                            <p class="text-[8px] font-black text-emerald-400 uppercase">Masuk</p>
                            <p class="font-bold text-emerald-600">+${item.pmMasuk}</p>
                        </div>
                        <div class="w-px h-6 bg-slate-100"></div>
                        <div class="text-center">
                            <p class="text-[8px] font-black text-rose-400 uppercase">Keluar</p>
                            <p class="font-bold text-rose-600">-${item.pmKeluar}</p>
                        </div>
                    </div>
                </td>
                <td class="p-4 text-center">
                    <div class="inline-block bg-slate-900 text-white px-4 py-2 rounded-2xl text-sm font-black shadow">${item.jumlahAkhir}</div>
                </td>
                <td class="p-4 text-center">
                    <span class="text-slate-600 text-sm">${item.catatan || '-'}</span>
                </td>
                <td class="p-4 pr-6">
                    <div class="flex items-center justify-end gap-3">
                        ${item.pdfUrl ? `<a href="${item.pdfUrl}" target="_blank" class="px-3 py-2 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black hover:bg-amber-100" title="Lihat PDF">PDF</a>` : ''}
                        <button data-action="edit" data-id="${item.id}" class="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="Edit Data">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button data-action="delete" data-id="${item.id}" class="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-600 hover:text-white transition-all" title="Hapus Data">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>`;
            tableBody.appendChild(tr);
        });

        // Delegasi event untuk tombol aksi
        tableBody.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const action = btn.getAttribute('data-action');
                if (action === 'delete') {
                    if (confirm('Hapus data ini?')) {
                        if (useDB) {
                            const del = await supa.from('mutasi_pm').delete().eq('id', id);
                            if (del.error) { alert('Gagal menghapus data online'); return; }
                            await fetchData();
                        } else {
                            mutasiDataList = mutasiDataList.filter(x => x.id !== id);
                            renderTable();
                        }
                    }
                } else if (action === 'edit') {
                    const item = mutasiDataList.find(x => x.id === id);
                    if (!item) return;
                    // Isi form
                    Object.entries(item).forEach(([k, v]) => {
                        const input = form.querySelector(`[name="${k}"]`);
                        if (input && input.type !== 'file') input.value = v;
                    });
                    editingId = id;
                    calculateMutasiAkhir();
                    if (btnInput) btnInput.click();
                }
            });
        });

        initIcons();
    }

    if (searchEl) searchEl.addEventListener('input', () => { useDB ? fetchData() : renderTable(); });
    if (filterEl) filterEl.addEventListener('change', () => { useDB ? fetchData() : renderTable(); });
    if (filterStartEl) filterStartEl.addEventListener('change', () => { useDB ? fetchData() : renderTable(); });
    if (filterEndEl) filterEndEl.addEventListener('change', () => { useDB ? fetchData() : renderTable(); });

    calculateMutasiAkhir();
    if (useDB) { fetchData(); } else { renderTable(); }
}

function calculateMutasiAkhir() {
    const form = document.getElementById('mutasiForm');
    if (!form) return;

    const awal = parseInt(form.querySelector('[name="jumlahAwal"]').value) || 0;
    const masuk = parseInt(form.querySelector('[name="pmMasuk"]').value) || 0;
    const keluar = parseInt(form.querySelector('[name="pmKeluar"]').value) || 0;
    const akhir = (awal + masuk) - keluar;
    const out = document.getElementById('mutasiJumlahAkhir');
    if (out) out.value = akhir;
}

// Render file form eksternal (F_*.html) ke dalam frame konten utama
function loadFormInFrame(src, title) {
    const pageTitleEl = document.getElementById('page-title-display');
    if (pageTitleEl) pageTitleEl.innerText = (title || src || '').toUpperCase();
    const container = document.getElementById('page-content');
    if (!container) return;

    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <i data-lucide="file-text" class="w-5 h-5 text-sky-600"></i>
                <h3 class="text-xl font-black text-slate-800">${title || 'Form'}</h3>
            </div>
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <iframe src="${src}" class="w-full min-h-[72vh]" style="border:0;" loading="lazy"></iframe>
            </div>
        </div>
    `;

    if (window.innerWidth < 1024) {
        // tutup sidebar di mobile agar fokus ke konten
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.add('collapsed');
        mainContent.classList.remove('lg:ml-72');
        overlay.classList.remove('active');
        isSidebarOpen = false;
    }
    initIcons();
}

window.addEventListener('resize', () => {
    const mainContent = document.getElementById('main-content');
    if (window.innerWidth < 1024) {
        isSidebarOpen = false;
        document.getElementById('sidebar').classList.add('collapsed');
        mainContent.classList.remove('lg:ml-72');
    } else {
        isSidebarOpen = true;
        document.getElementById('sidebar').classList.remove('collapsed');
        mainContent.classList.add('lg:ml-72');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initSupabaseClient();
    initIcons();
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    if (window.innerWidth < 1024) {
        isSidebarOpen = false;
        document.getElementById('sidebar').classList.add('collapsed');
        document.getElementById('main-content').classList.remove('lg:ml-72');
    }

    // Intersep klik tautan form di sidebar agar tampil di frame
    const nav = document.querySelector('nav');
    if (nav) {
        nav.addEventListener('click', (e) => {
            const a = e.target.closest('a[href]');
            if (!a) return;
            const href = a.getAttribute('href');
            if (!href) return;
            // Cegah pindah halaman untuk file form lokal
            const isLocalForm = href.startsWith('F_') || href === 'form_mutasi_static.html';
            if (isLocalForm) {
                e.preventDefault();
                const title = (a.textContent || href).trim();
                loadFormInFrame(href, title);
            }
        });
    }

    // Tampilkan Dashboard secara otomatis saat load awal
    showPage('dashboard');
});
