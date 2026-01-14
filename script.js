let isSidebarOpen = true;

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
    document.getElementById('page-title-display').innerText = displayTitle === 'DASHBOARD' ? 'Dashboard Utama' : displayTitle;

    // Konten dinamis untuk setiap halaman
    const pageContents = {
        'dashboard': `
            <!-- Hero Section -->
            <div class="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-sky-200">
                <div class="relative z-10 max-w-lg">
                    <h3 class="text-2xl font-black mb-2 uppercase tracking-tight">Si PANDU Dashboard</h3>
                    <p class="text-sky-100 text-sm leading-relaxed mb-6 font-medium">Sistem Informasi Penyimpanan Data Terpadu PPS Raharjo Sragen. Akses data internal secara cepat dan efisien.</p>
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
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="text-xl font-black mb-4">Mutasi PM</h3>
                <p class="text-slate-600 mb-4">Konten React dari F_mutasi_pm.html perlu diintegrasi terpisah. Untuk sementara, gunakan iframe:</p>
                <iframe src="F_mutasi_pm.html" width="100%" height="600" frameborder="0"></iframe>
                <p class="text-sm text-slate-500 mt-4">Catatan: File F_mutasi_pm.html adalah kode React. Untuk integrasi penuh, build sebagai aplikasi terpisah atau konversi ke HTML statis.</p>
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
    initIcons();
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    if (window.innerWidth < 1024) {
        isSidebarOpen = false;
        document.getElementById('sidebar').classList.add('collapsed');
        document.getElementById('main-content').classList.remove('lg:ml-72');
    }
});