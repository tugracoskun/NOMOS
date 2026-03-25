/**
 * NOMOS Vergi ve Rejim Sistemi Konfigürasyonu
 */

export const governmentTaxes = {
    'Parlementer Monarşi': {
        name: 'Parlementer Monarşi',
        vat: 0.18, // KDV %18
        incomeTax: 0.22, // Gelir Vergisi %22
        luxuryTax: 0.35, // Lüks Tüketim %35
        description: 'Dengeli vergi yükü, kamu hizmetleri için düzenli kesinti.'
    },
    'Başkanlık Cumhuriyeti': {
        name: 'Başkanlık Cumhuriyeti',
        vat: 0.20, // KDV %20
        incomeTax: 0.25, // Gelir Vergisi %25
        luxuryTax: 0.30, // Lüks Tüketim %30
        description: 'Serbest piyasa odaklı, yüksek işlem vergileri.'
    },
    'Komünizm': {
        name: 'Komünizm',
        vat: 0.05, // KDV %5 (Temel ihtiyaçlar çok ucuz)
        incomeTax: 0.45, // Gelir Vergisi %45 (Devlet payı çok yüksek)
        luxuryTax: 0.80, // Lüks Tüketim %80 (Burjuvazi kısıtlaması)
        description: 'Düşük tüketim vergisi, çok yüksek gelir transferi ve devlet kontrolü.'
    },
    'Monarşi': {
        name: 'Monarşi',
        vat: 0.15, // KDV %15
        incomeTax: 0.20, // Gelir Vergisi %20
        luxuryTax: 0.50, // Lüks Tüketim %50 (Kraliyet fonu)
        description: 'Orta seviye vergi, soylu sınıfı ve saray harcamaları öncelikli.'
    },
    'Diktatörlük': {
        name: 'Diktatörlük',
        vat: 0.25, // KDV %25
        incomeTax: 0.35, // Gelir Vergisi %35
        luxuryTax: 0.70, // Lüks Tüketim %70
        description: 'Keyfi ve yüksek vergiler, askeri harcamalar için yoğun kesinti.'
    }
};

/**
 * Ülkenin yönetim biçimine göre vergi miktarını hesaplar
 * @param {string} governmentType Yönetim biçimi
 * @param {number} amount Ana tutar
 * @param {string} taxType 'vat', 'income' veya 'luxury'
 */
export function calculateTax(governmentType, amount, taxType = 'vat') {
    const regime = governmentTaxes[governmentType] || governmentTaxes['Başkanlık Cumhuriyeti'];
    const rate = regime[taxType] || 0.20;
    return Math.round(amount * rate);
}
