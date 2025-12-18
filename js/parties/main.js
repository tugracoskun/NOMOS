// PARTİLER MODÜLÜ ANA DOSYASI
import { renderDashboard } from './dashboard.js';
import { renderCreateView } from './create.js';
import { openPartyModal, setupModal } from './modal.js';
import { partiesData } from './data.js';

export function renderPartiesPage(container, viewMode = null, id = null) {
    if (viewMode === 'create') {
        renderCreateView(container);
    } else {
        renderDashboard(container);
        
        // Detay modu varsa modalı aç
        if (viewMode === 'detail' && id) {
            const party = partiesData.find(p => p.id == id);
            if (party) {
                // DOM'un render edilmesi için minik bir gecikme
                setTimeout(() => openPartyModal(party), 50);
            }
        }
    }
}