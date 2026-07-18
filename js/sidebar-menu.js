// =============================================
// SIDEBAR MENU MODÜLÜ
// Sağ üstten açılan premium hamburger menü
// =============================================

import { openSettingsPanel } from './settings.js';

const tasks = [
    { id: 1, title: 'Günlük Giriş Yap', progress: '1/1', status: 'completed', reward: '10G' },
    { id: 2, title: 'Makale Oyla', progress: '3/5', status: 'ongoing', reward: '50G' },
    { id: 3, title: 'Çalışma Yap', progress: '0/1', status: 'pending', reward: '100 Enerji' }
];

let sidebarOpen = false;
let overlayEl = null;

// =============================================
// INIT
// =============================================
export function initSidebarMenu() {
    const btn = document.getElementById('btn-hamburger');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });

    // ESC ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebarOpen) closeSidebar();
    });
}

// =============================================
// TOGGLE
// =============================================
export function toggleSidebar() {
    sidebarOpen ? closeSidebar() : openSidebar();
}

// =============================================
// OPEN
// =============================================
export function openSidebar() {
    if (sidebarOpen) return;
    sidebarOpen = true;

    const btn = document.getElementById('btn-hamburger');
    if (btn) btn.classList.add('active');

    // Varsa eski overlay kaldır
    const old = document.getElementById('sidebar-overlay');
    if (old) old.remove();

    // Overlay oluştur
    overlayEl = document.createElement('div');
    overlayEl.id = 'sidebar-overlay';
    overlayEl.className = 'sidebar-overlay';

    // Panel HTML
    overlayEl.innerHTML = buildSidebarHTML();

    document.body.appendChild(overlayEl);

    // Event Listeners
    setupSidebarEvents(overlayEl);

    // Overlay tıklaması → kapat
    overlayEl.addEventListener('click', (e) => {
        if (e.target === overlayEl) closeSidebar();
    });

    // Açılma animasyonu
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlayEl.classList.add('open');
        });
    });
}

// =============================================
// CLOSE
// =============================================
export function closeSidebar() {
    if (!sidebarOpen || !overlayEl) return;

    const btn = document.getElementById('btn-hamburger');
    if (btn) btn.classList.remove('active');

    overlayEl.classList.remove('open');

    setTimeout(() => {
        if (overlayEl) {
            overlayEl.remove();
            overlayEl = null;
        }
        sidebarOpen = false;
    }, 450);
}

// =============================================
// HTML BUILDER
// =============================================
function buildSidebarHTML() {
    const goldVal = document.getElementById('global-gold')?.textContent || '50,000';

    return `
        <div class="sidebar-panel">
            <!-- Header -->
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <div class="sidebar-logo-icon">
                        <i class="fa-solid fa-earth-europe"></i>
                    </div>
                    <div class="sidebar-logo-text">
                        <span class="sidebar-logo-name">NOMOS</span>
                        <span class="sidebar-logo-sub">Siyasi Simülasyon</span>
                    </div>
                </div>
                <button class="sidebar-close-btn" id="sidebar-close-btn">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- Profil -->
            <div class="sidebar-profile" data-page="profile">
                <div class="sidebar-avatar">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Avatar">
                    <span class="sidebar-avatar-level">12</span>
                </div>
                <div class="sidebar-user-info">
                    <span class="sidebar-username">Başkan [TR]</span>
                    <span class="sidebar-user-role">Cumhurbaşkanı · Seviye 12</span>
                    <div class="sidebar-energy-row">
                        <div class="sidebar-energy-bar">
                            <div class="sidebar-energy-fill" style="width:85%"></div>
                        </div>
                        <span class="sidebar-energy-val">85 / 100</span>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-right sidebar-profile-arrow"></i>
            </div>

            <!-- Kaynaklar -->
            <div class="sidebar-resources">
                <div class="sidebar-resource-item">
                    <div class="sidebar-resource-icon gold"><i class="fa-solid fa-coins"></i></div>
                    <div class="sidebar-resource-data">
                        <span class="sidebar-resource-val">${goldVal}</span>
                        <span class="sidebar-resource-lbl">Altın</span>
                    </div>
                </div>
                <div class="sidebar-resource-item">
                    <div class="sidebar-resource-icon energy"><i class="fa-solid fa-bolt"></i></div>
                    <div class="sidebar-resource-data">
                        <span class="sidebar-resource-val">85</span>
                        <span class="sidebar-resource-lbl">Enerji</span>
                    </div>
                </div>
                <div class="sidebar-resource-item">
                    <div class="sidebar-resource-icon xp"><i class="fa-solid fa-star"></i></div>
                    <div class="sidebar-resource-data">
                        <span class="sidebar-resource-val">4,820</span>
                        <span class="sidebar-resource-lbl">XP</span>
                    </div>
                </div>
                <div class="sidebar-resource-item">
                    <div class="sidebar-resource-icon pop"><i class="fa-solid fa-users"></i></div>
                    <div class="sidebar-resource-data">
                        <span class="sidebar-resource-val">12.4M</span>
                        <span class="sidebar-resource-lbl">Nüfus</span>
                    </div>
                </div>
            </div>

            <!-- Scrollable Body -->
            <div class="sidebar-body">

                <!-- Görevler -->
                <div class="sidebar-section-label">
                    <i class="fa-solid fa-list-check" style="margin-right:6px; color:#3b82f6;"></i>Günlük Görevler
                </div>
                <div class="sidebar-tasks">
                    ${buildTasksHTML()}
                </div>

                <!-- Hızlı Erişim -->
                <div class="sidebar-section-label" style="margin-top:4px;">
                    <i class="fa-solid fa-grid-2" style="margin-right:6px; color:#8b5cf6;"></i>Hızlı Erişim
                </div>

                <div class="sidebar-menu-item" data-page="home">
                    <div class="sidebar-menu-icon icon-blue"><i class="fa-solid fa-house"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Ana Sayfa</span>
                        <span class="sidebar-menu-desc">Görevler, haberler ve chat</span>
                    </div>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>

                <div class="sidebar-menu-item" data-page="map">
                    <div class="sidebar-menu-icon icon-green"><i class="fa-solid fa-map"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Harita</span>
                        <span class="sidebar-menu-desc">Ülke ve bölge yönetimi</span>
                    </div>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>

                <div class="sidebar-menu-item" data-page="trade">
                    <div class="sidebar-menu-icon icon-yellow"><i class="fa-solid fa-chart-line"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Ticaret</span>
                        <span class="sidebar-menu-desc">Borsa, emtia ve lojistik</span>
                    </div>
                    <span class="sidebar-menu-badge green">+1.24%</span>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>

                <div class="sidebar-menu-item" data-page="wars">
                    <div class="sidebar-menu-icon icon-red"><i class="fa-solid fa-jet-fighter"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Savaşlar</span>
                        <span class="sidebar-menu-desc">Aktif çatışmalar ve diplomasi</span>
                    </div>
                    <span class="sidebar-menu-badge red">2 AKTİF</span>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>

                <div class="sidebar-menu-item" data-page="parties">
                    <div class="sidebar-menu-icon icon-purple"><i class="fa-solid fa-flag"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Partiler</span>
                        <span class="sidebar-menu-desc">Siyasi parti yönetimi</span>
                    </div>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>

                <div class="sidebar-menu-item" data-page="parliament">
                    <div class="sidebar-menu-icon icon-cyan"><i class="fa-solid fa-landmark"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Meclis</span>
                        <span class="sidebar-menu-desc">Meclis dağılımı ve yasalar</span>
                    </div>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>

                <div class="sidebar-menu-item" data-page="hangar">
                    <div class="sidebar-menu-icon icon-orange"><i class="fa-solid fa-warehouse"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Hangar</span>
                        <span class="sidebar-menu-desc">Askeri araçlar ve ekipman</span>
                    </div>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>

                <div class="sidebar-menu-item" data-page="messages">
                    <div class="sidebar-menu-icon icon-blue"><i class="fa-solid fa-envelope"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Mesajlar</span>
                        <span class="sidebar-menu-desc">Gelen kutusu</span>
                    </div>
                    <span class="sidebar-menu-badge blue">3 YENİ</span>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>

                <div class="sidebar-menu-item" data-page="social">
                    <div class="sidebar-menu-icon icon-gray"><i class="fa-brands fa-twitter"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Sosyal Medya</span>
                        <span class="sidebar-menu-desc">Trendler ve paylaşımlar</span>
                    </div>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>

                <div class="sidebar-divider"></div>
            </div>

            <!-- Footer -->
            <div class="sidebar-footer">
                <div class="sidebar-menu-item" id="sidebar-settings-btn">
                    <div class="sidebar-menu-icon icon-gray"><i class="fa-solid fa-gear"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Ayarlar</span>
                        <span class="sidebar-menu-desc">Ses, görünüm, oynanış</span>
                    </div>
                    <i class="fa-solid fa-chevron-right sidebar-menu-arrow"></i>
                </div>
                <div class="sidebar-menu-item" id="sidebar-logout-btn">
                    <div class="sidebar-menu-icon"><i class="fa-solid fa-right-from-bracket"></i></div>
                    <div class="sidebar-menu-text">
                        <span class="sidebar-menu-title">Çıkış Yap</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function buildTasksHTML() {
    return tasks.map(t => {
        const iconMap = {
            completed: { cls: 'completed', icon: 'fa-check' },
            ongoing: { cls: 'ongoing', icon: 'fa-spinner' },
            pending: { cls: 'pending', icon: 'fa-clock' }
        };
        const { cls, icon } = iconMap[t.status] || iconMap.pending;

        return `
            <div class="sidebar-task-item">
                <div class="sidebar-task-icon ${cls}">
                    <i class="fa-solid ${icon}"></i>
                </div>
                <div class="sidebar-task-content">
                    <span class="sidebar-task-title">${t.title}</span>
                    <div class="sidebar-task-meta">
                        <span class="sidebar-task-progress">${t.progress}</span>
                        <span class="sidebar-task-reward">${t.reward}</span>
                    </div>
                </div>
                <div class="sidebar-task-check ${t.status === 'completed' ? 'done' : 'pending'}">
                    ${t.status === 'completed' ? '<i class="fa-solid fa-check"></i>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// =============================================
// EVENT SETUP
// =============================================
function setupSidebarEvents(overlay) {
    // Kapat butonu
    const closeBtn = overlay.querySelector('#sidebar-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    // Ayarlar → mevcut settings panelini aç
    const settingsBtn = overlay.querySelector('#sidebar-settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSidebar();
            setTimeout(() => openSettingsPanel(), 200);
        });
    }

    // Çıkış
    const logoutBtn = overlay.querySelector('#sidebar-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Oyundan çıkmak istediğinize emin misiniz?')) {
                closeSidebar();
            }
        });
    }

    // data-page linkleri: kapat ve navigate et
    overlay.querySelectorAll('[data-page]').forEach(el => {
        // Profil için ayrı işlem
        el.addEventListener('click', (e) => {
            const page = el.getAttribute('data-page');
            if (!page) return;
            // Sidebar'ı kapat, sonra router navigate et
            closeSidebar();
            // main.js body click delegation'ı handle edecek —
            // ama sidebar overlay içindeki tıklamalar oraya ulaşır
            // o yüzden burada da import navigate edelim
            import('./router.js').then(({ navigateTo }) => {
                setTimeout(() => navigateTo(page), 100);
            });
        });
    });
}
