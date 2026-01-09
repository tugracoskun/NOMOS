import { getProvinceStyle } from '../styles.js';

export function getUniqueKey(feature) {
    if (feature.id) return feature.id;
    const p = feature.properties;
    const rawStr = (p.name || p.NAME || JSON.stringify(p)).replace(/\s/g, '');
    return rawStr;
}

export function guessName(feature) {
    const p = feature.properties;
    return p.name || p.NAME || p.Name || p.NAME_1 || p.VARNAME_1 || p.lektur ||
        p.bulgarian_name || p.NUTS3_NAME || p.province || "Bölge";
}

export function guessCountry(feature) {
    const p = feature.properties;
    return p.ADMIN || p.admin || p.NAME || p.name || p.NAME_TR || p.sovereignt || p.SOVEREIGNT || "Bilinmeyen Ülke";
}

export function flashLayer(layer) {
    const el = layer.getElement();
    if (el) {
        el.style.transition = "fill 0.3s";
        el.style.fill = "white";
        setTimeout(() => {
            layer.setStyle(getProvinceStyle(layer.feature));
        }, 300);
    }
}

export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 99999;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
