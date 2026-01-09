import { getNationData } from '../data/nations.js';

export function renderCountryPage(container, countryName) {
    // İsim boşsa hata vermesin
    if (!countryName) return;

    const nation = getNationData(countryName);

    // CSS Yükle (Eğer yoksa)
    if (!document.getElementById('country-page-style')) {
        const link = document.createElement('link');
        link.id = 'country-page-style';
        link.rel = 'stylesheet';
        link.href = 'css/country.css';
        document.head.appendChild(link);
    }

    // Basit bir layout
    container.innerHTML = `
        <div class="country-page-wrapper">
            <!-- Arkaplan Efekti -->
            <div class="country-bg-glow" style="background: radial-gradient(circle at 50% 0%, ${nation.color}40 0%, transparent 70%);"></div>

            <!-- Header -->
            <div class="country-header-compact">
                <div class="flag-wrapper-compact">
                    <img src="${nation.flag}" alt="${nation.name}">
                </div>
                <div class="header-info">
                    <h1 class="country-main-title">
                        ${nation.name} 
                        <span class="country-id-badge">ID: ${nation.id.toUpperCase()}</span>
                    </h1>
                    <h2 class="country-sub-title">${nation.government} | Başkent: ${nation.capital || 'Bilinmiyor'}</h2>
                </div>
            </div>

            <div class="country-grid-compact">
                <!-- 1. Hükümet & Lider -->
                <div class="country-card-compact">
                    <div class="card-header-small"><i class="fa-solid fa-landmark"></i> Hükümet & Liderlik</div>
                    
                    <div class="leader-row">
                        <div class="leader-avatar-small" style="border-color: ${nation.color};">
                           <i class="fa-solid fa-user"></i>
                        </div>
                        <div>
                            <div class="role">${nation.leaderTitle}</div>
                            <div class="name-highlight">${nation.leader}</div>
                        </div>
                    </div>

                    <div class="minister-list">
                        ${(nation.ministers || []).map(m => `
                            <div class="minister-item">
                                <span class="m-title">${m.title}</span>
                                <span class="m-name">${m.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 2. Ekonomi & İstatistik -->
                <div class="country-card-compact">
                    <div class="card-header-small"><i class="fa-solid fa-chart-line"></i> Ekonomi & İstatistik</div>
                    <div class="stats-grid-small">
                        <div class="stat-box">
                            <i class="fa-solid fa-coins text-gold"></i>
                            <div class="s-val">${nation.gdp}</div>
                            <div class="s-label">GSYİH</div>
                        </div>
                        <div class="stat-box">
                            <i class="fa-solid fa-users text-green"></i>
                            <div class="s-val">${nation.population}</div>
                            <div class="s-label">Nüfus</div>
                        </div>
                        <div class="stat-box">
                            <i class="fa-solid fa-industry text-blue"></i>
                            <div class="s-val">${nation.mainResource}</div>
                            <div class="s-label">Ana Kaynak</div>
                        </div>
                         <div class="stat-box">
                            <i class="fa-solid fa-ranking-star text-purple"></i>
                            <div class="s-val">#${nation.ranking || '?'}</div>
                            <div class="s-label">Dünya Sıralaması</div>
                        </div>
                    </div>
                     <div class="stat-row-long">
                        <span><i class="fa-solid fa-flask"></i> Teknoloji Seviyesi</span>
                        <div class="progress-bar-thin">
                            <div class="fill" style="width: ${(nation.tech || 0.5) * 100}%; background: ${nation.color};"></div>
                        </div>
                    </div>
                </div>

                <!-- 3. Diplomasi & İttifaklar -->
                <div class="country-card-compact">
                    <div class="card-header-small"><i class="fa-solid fa-globe"></i> Uluslararası İlişkiler</div>
                    <div class="diplomacy-content">
                        <div class="stat-row">
                            <span>Başkent</span>
                            <span class="text-white">${nation.capital || 'Bilinmiyor'}</span>
                        </div>
                        <div class="stat-row">
                            <span>Yönetim Biçimi</span>
                            <span class="text-white">${nation.government}</span>
                        </div>
                        <div style="margin-top:15px; font-size:0.85rem; color:#94a3b8; margin-bottom:5px;">Üye Olunan Kuruluşlar</div>
                        <div class="alliance-tags-compact">
                            ${(nation.alliances || []).map(a => `
                                <div class="alliance-pill-small">
                                    <i class="fa-solid ${a.icon}"></i> ${a.name}
                                </div>
                            `).join('') || '<div style="opacity:0.5; font-size:0.8rem;">Tam Bağımsız</div>'}
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top:20px; text-align:center; font-size:0.8rem; color:rgba(255,255,255,0.2);">
                NOMOS Global Intelligence Agency v2.1
            </div>
        </div>
    `;
}
