// DÜNYA İSTATİSTİKLERİ PANELİ
// Tüm ülkelerin nüfus, bina, teknoloji, altyapı istatistiklerini gösterir

import { nations } from '../data/nations.js';

// Mock genişletilmiş ülke verileri (mevcut nations verisinden zenginleştirilmiş)
function getAllCountryStats() {
    const baseCountries = [
        { id: 'tr', name: 'Türkiye', flag: '🇹🇷', population: '85M', gdp: '900 Mr $', tech: 0.75, infra: 7, buildings: 12, military: 650000, cities: 81, ranking: 18 },
        { id: 'us', name: 'ABD', flag: '🇺🇸', population: '331M', gdp: '23 Tn $', tech: 0.98, infra: 9, buildings: 48, military: 1400000, cities: 50, ranking: 1 },
        { id: 'ru', name: 'Rusya', flag: '🇷🇺', population: '144M', gdp: '1.7 Tn $', tech: 0.85, infra: 6, buildings: 28, military: 1150000, cities: 85, ranking: 11 },
        { id: 'de', name: 'Almanya', flag: '🇩🇪', population: '83M', gdp: '4.2 Tn $', tech: 0.92, infra: 9, buildings: 35, military: 183000, cities: 16, ranking: 4 },
        { id: 'fr', name: 'Fransa', flag: '🇫🇷', population: '67M', gdp: '2.9 Tn $', tech: 0.88, infra: 8, buildings: 30, military: 205000, cities: 18, ranking: 7 },
        { id: 'cn', name: 'Çin', flag: '🇨🇳', population: '1.4Mr', gdp: '17.7 Tn $', tech: 0.90, infra: 8, buildings: 52, military: 2000000, cities: 340, ranking: 2 },
        { id: 'jp', name: 'Japonya', flag: '🇯🇵', population: '125M', gdp: '4.9 Tn $', tech: 0.95, infra: 10, buildings: 40, military: 247000, cities: 47, ranking: 3 },
        { id: 'gb', name: 'İngiltere', flag: '🇬🇧', population: '67M', gdp: '3.1 Tn $', tech: 0.91, infra: 8, buildings: 32, military: 153000, cities: 48, ranking: 6 },
        { id: 'br', name: 'Brezilya', flag: '🇧🇷', population: '214M', gdp: '1.6 Tn $', tech: 0.60, infra: 5, buildings: 18, military: 360000, cities: 26, ranking: 12 },
        { id: 'in', name: 'Hindistan', flag: '🇮🇳', population: '1.4Mr', gdp: '3.7 Tn $', tech: 0.72, infra: 5, buildings: 22, military: 1455000, cities: 28, ranking: 5 },
        { id: 'kr', name: 'Güney Kore', flag: '🇰🇷', population: '51M', gdp: '1.8 Tn $', tech: 0.94, infra: 9, buildings: 28, military: 555000, cities: 17, ranking: 10 },
        { id: 'it', name: 'İtalya', flag: '🇮🇹', population: '59M', gdp: '2.1 Tn $', tech: 0.82, infra: 7, buildings: 25, military: 165000, cities: 20, ranking: 8 },
        { id: 'au', name: 'Avustralya', flag: '🇦🇺', population: '26M', gdp: '1.5 Tn $', tech: 0.88, infra: 8, buildings: 20, military: 59000, cities: 8, ranking: 13 },
        { id: 'ca', name: 'Kanada', flag: '🇨🇦', population: '38M', gdp: '2.0 Tn $', tech: 0.90, infra: 8, buildings: 22, military: 72000, cities: 13, ranking: 9 },
        { id: 'sa', name: 'Suudi Arabistan', flag: '🇸🇦', population: '35M', gdp: '833 Mr $', tech: 0.70, infra: 8, buildings: 15, military: 257000, cities: 13, ranking: 19 },
        { id: 'eg', name: 'Mısır', flag: '🇪🇬', population: '104M', gdp: '404 Mr $', tech: 0.50, infra: 4, buildings: 10, military: 438000, cities: 27, ranking: 33 },
        { id: 'mx', name: 'Meksika', flag: '🇲🇽', population: '128M', gdp: '1.3 Tn $', tech: 0.62, infra: 5, buildings: 16, military: 277000, cities: 32, ranking: 15 },
        { id: 'id', name: 'Endonezya', flag: '🇮🇩', population: '273M', gdp: '1.2 Tn $', tech: 0.55, infra: 4, buildings: 14, military: 395000, cities: 34, ranking: 16 },
        { id: 'pl', name: 'Polonya', flag: '🇧🇾', population: '38M', gdp: '674 Mr $', tech: 0.78, infra: 7, buildings: 18, military: 114000, cities: 16, ranking: 21 },
        { id: 'za', name: 'Güney Afrika', flag: '🇿🇦', population: '60M', gdp: '405 Mr $', tech: 0.58, infra: 5, buildings: 12, military: 73000, cities: 9, ranking: 32 },
    ];
    return baseCountries.sort((a, b) => a.ranking - b.ranking);
}

function renderOverviewTab() {
    const countries = getAllCountryStats();
    const totalPop = '7.8 Milyar';
    const totalGDP = '105 Trilyon $';
    const avgTech = (countries.reduce((s, c) => s + c.tech, 0) / countries.length * 100).toFixed(0);
    const totalBuildings = countries.reduce((s, c) => s + c.buildings, 0);
    const totalMilitary = countries.reduce((s, c) => s + c.military, 0);

    return `
        <div class="ws-overview">
            <div class="ws-stat-cards">
                <div class="ws-stat-card">
                    <div class="ws-card-icon"><i class="fa-solid fa-users"></i></div>
                    <div class="ws-card-data">
                        <span class="ws-card-value">${totalPop}</span>
                        <span class="ws-card-label">Dünya Nüfusu</span>
                    </div>
                </div>
                <div class="ws-stat-card">
                    <div class="ws-card-icon gold"><i class="fa-solid fa-coins"></i></div>
                    <div class="ws-card-data">
                        <span class="ws-card-value">${totalGDP}</span>
                        <span class="ws-card-label">Toplam GSYİH</span>
                    </div>
                </div>
                <div class="ws-stat-card">
                    <div class="ws-card-icon purple"><i class="fa-solid fa-flask"></i></div>
                    <div class="ws-card-data">
                        <span class="ws-card-value">%${avgTech}</span>
                        <span class="ws-card-label">Ortalama Teknoloji</span>
                    </div>
                </div>
                <div class="ws-stat-card">
                    <div class="ws-card-icon green"><i class="fa-solid fa-city"></i></div>
                    <div class="ws-card-data">
                        <span class="ws-card-value">${totalBuildings.toLocaleString()}</span>
                        <span class="ws-card-label">Toplam Bina</span>
                    </div>
                </div>
                <div class="ws-stat-card">
                    <div class="ws-card-icon red"><i class="fa-solid fa-shield-halved"></i></div>
                    <div class="ws-card-data">
                        <span class="ws-card-value">${(totalMilitary / 1000000).toFixed(1)}M</span>
                        <span class="ws-card-label">Toplam Askeri Güç</span>
                    </div>
                </div>
                <div class="ws-stat-card">
                    <div class="ws-card-icon cyan"><i class="fa-solid fa-globe"></i></div>
                    <div class="ws-card-data">
                        <span class="ws-card-value">${countries.length}</span>
                        <span class="ws-card-label">Aktif Ülke</span>
                    </div>
                </div>
            </div>

            <div class="ws-top-list">
                <h4><i class="fa-solid fa-trophy"></i> En Güçlü 5 Ülke</h4>
                ${countries.slice(0, 5).map((c, i) => `
                    <div class="ws-top-item">
                        <span class="ws-rank">#${i + 1}</span>
                        <span class="ws-flag">${c.flag}</span>
                        <span class="ws-country-name">${c.name}</span>
                        <div class="ws-top-bars">
                            <div class="ws-mini-bar" title="Teknoloji">
                                <div class="ws-bar-fill tech" style="width: ${c.tech * 100}%"></div>
                            </div>
                            <div class="ws-mini-bar" title="Altyapı">
                                <div class="ws-bar-fill infra" style="width: ${c.infra * 10}%"></div>
                            </div>
                        </div>
                        <span class="ws-gdp-tag">${c.gdp}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderCountriesTab() {
    const countries = getAllCountryStats();
    return `
        <div class="ws-countries-table">
            <div class="ws-table-header">
                <span class="ws-th ws-th-rank">#</span>
                <span class="ws-th ws-th-name">Ülke</span>
                <span class="ws-th">Nüfus</span>
                <span class="ws-th">GSYİH</span>
                <span class="ws-th">Teknoloji</span>
                <span class="ws-th">Altyapı</span>
                <span class="ws-th">Bina</span>
                <span class="ws-th">Şehir</span>
            </div>
            ${countries.map((c, i) => `
                <div class="ws-table-row">
                    <span class="ws-td ws-td-rank">${c.ranking}</span>
                    <span class="ws-td ws-td-name">
                        <span class="ws-flag-sm">${c.flag}</span>
                        ${c.name}
                    </span>
                    <span class="ws-td">${c.population}</span>
                    <span class="ws-td ws-td-gdp">${c.gdp}</span>
                    <span class="ws-td">
                        <div class="ws-inline-bar">
                            <div class="ws-bar-fill tech" style="width: ${c.tech * 100}%"></div>
                        </div>
                        <small>${(c.tech * 100).toFixed(0)}%</small>
                    </span>
                    <span class="ws-td">
                        <div class="ws-inline-bar">
                            <div class="ws-bar-fill infra" style="width: ${c.infra * 10}%"></div>
                        </div>
                        <small>${c.infra}/10</small>
                    </span>
                    <span class="ws-td ws-td-num">${c.buildings}</span>
                    <span class="ws-td ws-td-num">${c.cities}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderMilitaryTab() {
    const countries = getAllCountryStats().sort((a, b) => b.military - a.military);
    return `
        <div class="ws-military">
            <div class="ws-mil-header">
                <div class="ws-mil-stat">
                    <i class="fa-solid fa-helmet-safety"></i>
                    <div>
                        <span class="ws-mil-val">${(countries.reduce((s, c) => s + c.military, 0) / 1000000).toFixed(1)}M</span>
                        <span class="ws-mil-label">Toplam Asker</span>
                    </div>
                </div>
                <div class="ws-mil-stat">
                    <i class="fa-solid fa-jet-fighter"></i>
                    <div>
                        <span class="ws-mil-val">3</span>
                        <span class="ws-mil-label">Aktif Çatışma</span>
                    </div>
                </div>
                <div class="ws-mil-stat">
                    <i class="fa-solid fa-handshake"></i>
                    <div>
                        <span class="ws-mil-val">12</span>
                        <span class="ws-mil-label">İttifak</span>
                    </div>
                </div>
            </div>
            <h4><i class="fa-solid fa-ranking-star"></i> Askeri Güç Sıralaması</h4>
            ${countries.slice(0, 10).map((c, i) => `
                <div class="ws-mil-row">
                    <span class="ws-rank">#${i + 1}</span>
                    <span class="ws-flag">${c.flag}</span>
                    <span class="ws-country-name">${c.name}</span>
                    <div class="ws-mil-bar-wrap">
                        <div class="ws-mil-bar" style="width: ${(c.military / countries[0].military * 100).toFixed(0)}%"></div>
                    </div>
                    <span class="ws-mil-count">${(c.military / 1000).toFixed(0)}K</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderEconomyTab() {
    const countries = getAllCountryStats();
    // Parse GDP for sorting
    const parseGDP = (gdp) => {
        if (gdp.includes('Tn')) return parseFloat(gdp) * 1000;
        if (gdp.includes('Mr')) return parseFloat(gdp);
        return parseFloat(gdp);
    };
    const sorted = [...countries].sort((a, b) => parseGDP(b.gdp) - parseGDP(a.gdp));

    return `
        <div class="ws-economy">
            <div class="ws-eco-top-cards">
                <div class="ws-eco-card">
                    <span class="ws-eco-label">Dünya GSYİH</span>
                    <span class="ws-eco-val">105 Tn $</span>
                    <span class="ws-eco-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +2.4%</span>
                </div>
                <div class="ws-eco-card">
                    <span class="ws-eco-label">Ticaret Hacmi</span>
                    <span class="ws-eco-val">32 Tn $</span>
                    <span class="ws-eco-trend up"><i class="fa-solid fa-arrow-trend-up"></i> +1.8%</span>
                </div>
                <div class="ws-eco-card">
                    <span class="ws-eco-label">Enflasyon Ort.</span>
                    <span class="ws-eco-val">%4.2</span>
                    <span class="ws-eco-trend down"><i class="fa-solid fa-arrow-trend-down"></i> -0.6%</span>
                </div>
            </div>
            <h4><i class="fa-solid fa-coins"></i> GSYİH Sıralaması</h4>
            ${sorted.slice(0, 10).map((c, i) => `
                <div class="ws-eco-row">
                    <span class="ws-rank">#${i + 1}</span>
                    <span class="ws-flag">${c.flag}</span>
                    <span class="ws-country-name">${c.name}</span>
                    <span class="ws-eco-gdp">${c.gdp}</span>
                    <div class="ws-eco-bar-wrap">
                        <div class="ws-eco-bar" style="width: ${(parseGDP(c.gdp) / parseGDP(sorted[0].gdp) * 100).toFixed(0)}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

const tabRenderers = {
    overview: renderOverviewTab,
    countries: renderCountriesTab,
    military: renderMilitaryTab,
    economy: renderEconomyTab,
};

export function initWorldStatsPanel() {
    const trigger = document.getElementById('map-stats-trigger');
    const panel = document.getElementById('world-stats-panel');
    const closeBtn = document.getElementById('ws-close');
    const wsBody = document.getElementById('ws-body');
    const tabs = document.querySelectorAll('.ws-tab');

    if (!trigger || !panel) return;

    // Trigger butonuna tıklama
    trigger.addEventListener('click', () => {
        panel.classList.toggle('open');
        if (panel.classList.contains('open') && !wsBody.innerHTML.trim()) {
            wsBody.innerHTML = renderOverviewTab();
        }
    });

    // Kapatma
    closeBtn?.addEventListener('click', () => {
        panel.classList.remove('open');
    });

    // Tab değiştirme
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const renderer = tabRenderers[tab.dataset.wsTab];
            if (renderer && wsBody) {
                wsBody.innerHTML = renderer();
            }
        });
    });
}
