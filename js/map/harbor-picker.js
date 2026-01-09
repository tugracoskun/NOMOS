// LİMAN SEÇİM MODALİ
// Oyuncunun ülkesindeki kıyı şehirlerinden birini seçerek liman inşa etmesini sağlar

import { getCountryCoastalCities, countryHasHarbor, buildHarborInCity } from '../data/coastal-regions.js';
import { buildingTypes } from '../data/city-stats.js';
import { updateGold } from '../data/state.js';

// Modal'ı aç
export function openHarborPicker(countryName) {
    // Zaten liman var mı?
    if (countryHasHarbor(countryName)) {
        alert('Bu ülkede zaten bir liman mevcut! Her ülke yalnızca 1 liman inşa edebilir.');
        return;
    }

    // Kıyı şehirlerini al
    const coastalCities = getCountryCoastalCities(countryName);

    if (coastalCities.length === 0) {
        alert('Bu ülkede kıyı şehri bulunmuyor. Liman inşa edilemez.');
        return;
    }

    // Modal oluştur
    showPickerModal(countryName, coastalCities);
}

function showPickerModal(countryName, cities) {
    // Varsa kaldır
    closePickerModal();

    const harborCost = buildingTypes.port?.cost || 75000;

    const modal = document.createElement('div');
    modal.id = 'harbor-picker-modal';
    modal.className = 'harbor-picker-overlay';
    modal.innerHTML = `
        <div class="harbor-picker-content">
            <div class="hp-header">
                <h3><i class="fa-solid fa-anchor"></i> Liman İnşa Et</h3>
                <button class="hp-close" onclick="document.getElementById('harbor-picker-modal').remove()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            
            <div class="hp-info">
                <p><strong>${countryName}</strong> için liman inşa edilecek şehri seçin.</p>
                <p class="hp-cost"><i class="fa-solid fa-coins"></i> Maliyet: <span>${harborCost.toLocaleString()}</span> Altın</p>
                <p class="hp-note"><i class="fa-solid fa-circle-info"></i> Her ülke yalnızca 1 liman inşa edebilir.</p>
            </div>

            <div class="hp-city-list">
                ${cities.map(city => `
                    <button class="hp-city-btn" data-region="${city.id}" ${city.hasHarbor ? 'disabled' : ''}>
                        <div class="city-icon">
                            <i class="fa-solid fa-city"></i>
                        </div>
                        <div class="city-details">
                            <span class="city-name">${city.name}</span>
                            <span class="city-id">${city.id}</span>
                        </div>
                        ${city.hasHarbor ? '<span class="has-harbor"><i class="fa-solid fa-ship"></i> Liman Var</span>' : ''}
                    </button>
                `).join('')}
            </div>

            <div class="hp-footer">
                <button class="hp-cancel" onclick="document.getElementById('harbor-picker-modal').remove()">
                    İptal
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Şehir seçim event'leri
    modal.querySelectorAll('.hp-city-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            const regionId = btn.dataset.region;
            const cityName = btn.querySelector('.city-name').textContent;
            confirmAndBuild(regionId, cityName, harborCost, countryName);
        });
    });
}

function confirmAndBuild(regionId, cityName, cost, countryName) {
    if (!confirm(`${cityName} şehrine ${cost.toLocaleString()} Altın karşılığında Liman inşa etmek istiyor musunuz?`)) {
        return;
    }

    // Altın kontrolü
    const goldSuccess = updateGold(-cost);
    if (!goldSuccess) {
        alert('Yetersiz altın!');
        return;
    }

    // Liman inşa et
    const result = buildHarborInCity(regionId);

    if (result.success) {
        alert(`🚢 Liman başarıyla inşa edildi!\n\n${cityName} artık deniz ticareti yapabilir.`);
        closePickerModal();

        // Sayfayı yenile (eğer ülke sayfasındaysak)
        if (window.location.hash.includes('country')) {
            location.reload();
        }
    } else {
        // Altını geri ver
        updateGold(cost);
        alert('Hata: ' + result.error);
    }
}

function closePickerModal() {
    const modal = document.getElementById('harbor-picker-modal');
    if (modal) modal.remove();
}

// Global erişim
window.openHarborPicker = openHarborPicker;

// CSS Stilleri
const style = document.createElement('style');
style.textContent = `
.harbor-picker-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.harbor-picker-content {
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    border: 1px solid rgba(14, 165, 233, 0.3);
    border-radius: 16px;
    width: 90%;
    max-width: 450px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(14, 165, 233, 0.1);
}

.hp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(90deg, rgba(14, 165, 233, 0.2), transparent);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hp-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #0ea5e9;
    display: flex;
    align-items: center;
    gap: 10px;
}

.hp-close {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 4px 8px;
    transition: color 0.2s;
}

.hp-close:hover {
    color: white;
}

.hp-info {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.hp-info p {
    margin: 0 0 8px 0;
    font-size: 0.85rem;
    color: #94a3b8;
}

.hp-cost {
    color: #fbbf24 !important;
    font-weight: 600;
}

.hp-cost span {
    color: white;
}

.hp-note {
    font-size: 0.75rem !important;
    color: #64748b !important;
}

.hp-city-list {
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
}

.hp-city-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    margin-bottom: 8px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
}

.hp-city-btn:hover:not([disabled]) {
    background: rgba(14, 165, 233, 0.1);
    border-color: rgba(14, 165, 233, 0.3);
    transform: translateX(4px);
}

.hp-city-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.city-icon {
    width: 40px;
    height: 40px;
    background: rgba(14, 165, 233, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0ea5e9;
}

.city-details {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.city-name {
    font-size: 0.9rem;
    color: white;
    font-weight: 600;
}

.city-id {
    font-size: 0.65rem;
    color: #64748b;
    font-family: monospace;
}

.has-harbor {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
}

.hp-footer {
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: flex-end;
}

.hp-cancel {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #f87171;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
}

.hp-cancel:hover {
    background: rgba(239, 68, 68, 0.2);
}
`;
document.head.appendChild(style);
