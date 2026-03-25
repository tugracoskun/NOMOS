// MESAJLAR - ANA MODÜL
// Gelen kutusu, mesaj detay ve yeni mesaj oluşturma

import { mockMessages, getCategoriesWithCounts, getMessagesByCategory } from './data.js';

let currentCategory = 'all';
let currentMessage = null;

export function renderMessagesPage(container) {
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease';

    loadMessagesStyles(() => {
        const categories = getCategoriesWithCounts();
        
        container.innerHTML = `
            <div class="msg-wrapper">
                <aside class="msg-sidebar">
                    <div class="msg-sidebar-header">
                        <h2><i class="fa-solid fa-inbox"></i> Gelen Kutusu</h2>
                    </div>

                    <div class="msg-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="msg-search-input" placeholder="Mesaj ara...">
                    </div>

                    <!-- Mesaj Listesi -->
                    <div class="msg-list" id="msg-list">
                        ${renderMessageList(currentCategory)}
                    </div>

                    <button class="msg-compose-btn" id="msg-compose-btn">
                        <i class="fa-solid fa-pen-to-square"></i> Yeni Mesaj
                    </button>
                </aside>

                <main class="msg-main-area">
                    <!-- ÜST FİLTRE BARI (SAĞ ÜST) -->
                    <nav class="msg-top-filters" id="msg-top-filters">
                        ${renderFilters(categories)}
                    </nav>

                    <div class="msg-detail" id="msg-detail">
                        ${renderEmptyState()}
                    </div>
                </main>
            </div>
        `;

        setupMessageEvents(container);

        requestAnimationFrame(() => {
            container.style.opacity = '1';
        });
    });
}

function renderFilters(categories) {
    return categories.map(cat => `
        <button class="msg-filter-btn ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
            <i class="fa-solid ${cat.icon}"></i>
            <span>${cat.label}</span>
            ${cat.count > 0 ? `<span class="msg-filter-count">${cat.count}</span>` : ''}
        </button>
    `).join('');
}

function renderMessageList(category) {
    const messages = getMessagesByCategory(category);
    if (messages.length === 0) {
        return `<div class="msg-empty-list"><i class="fa-solid fa-envelope-open"></i><span>Bu kategoride mesaj yok</span></div>`;
    }

    return messages.map(msg => {
        const flagSrc = msg.from.flag ? `https://flagcdn.com/w40/${msg.from.flag}.png` : null;
        
        return `
            <div class="msg-item ${!msg.read ? 'unread' : ''} ${currentMessage?.id === msg.id ? 'active' : ''}" data-id="${msg.id}">
                <div class="msg-item-left">
                    ${flagSrc ? `<img src="${flagSrc}" class="msg-item-flag">` : `<div class="msg-item-flag-system"><i class="fa-solid fa-robot"></i></div>`}
                </div>
                <div class="msg-item-content">
                    <div class="msg-item-top">
                        <span class="msg-item-from">${msg.from.name}</span>
                        <span class="msg-item-date">${msg.date}</span>
                    </div>
                    <div class="msg-item-subject">${msg.subject}</div>
                    <div class="msg-item-preview">${msg.preview}</div>
                </div>
                <div class="msg-item-right">
                    ${msg.starred ? '<i class="fa-solid fa-star msg-star active"></i>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderMessageDetail(msg) {
    if (!msg) return renderEmptyState();

    const flagHtml = msg.from.flag
        ? `<img src="https://flagcdn.com/w80/${msg.from.flag}.png" alt="" class="msg-detail-flag">`
        : `<div class="msg-detail-flag msg-detail-flag-system"><i class="fa-solid fa-robot"></i></div>`;

    const actionsHtml = (msg.actions || []).map(action => {
        const actionMap = {
            'accept': { label: 'Kabul Et', icon: 'fa-check', cls: 'msg-action-accept' },
            'reject': { label: 'Reddet', icon: 'fa-xmark', cls: 'msg-action-reject' },
            'negotiate': { label: 'Müzakere', icon: 'fa-comments', cls: 'msg-action-negotiate' },
            'acknowledge': { label: 'Onayla', icon: 'fa-thumbs-up', cls: 'msg-action-accept' },
            'reply': { label: 'Yanıtla', icon: 'fa-reply', cls: 'msg-action-negotiate' },
            'view-market': { label: 'Piyasaya Git', icon: 'fa-chart-line', cls: 'msg-action-negotiate' },
            'pay-tax': { label: 'Vergiyi Öde', icon: 'fa-money-bill-transfer', cls: 'msg-action-pay-tax' },
            'pay-bill': { label: 'Faturayı Öde', icon: 'fa-file-invoice-dollar', cls: 'msg-action-pay-bill' },
        };
        const a = actionMap[action] || { label: action, icon: 'fa-circle', cls: '' };
        return `<button class="msg-action-btn ${a.cls}" data-action="${action}"><i class="fa-solid ${a.icon}"></i> ${a.label}</button>`;
    }).join('');

    return `
        <div class="msg-detail-header">
            <button class="msg-back-btn" id="msg-back-btn"><i class="fa-solid fa-arrow-left"></i></button>
            <div class="msg-detail-meta">
                ${flagHtml}
                <div>
                    <div class="msg-detail-from">${msg.from.name} <span class="msg-detail-title">${msg.from.title}</span></div>
                    <div class="msg-detail-date"><i class="fa-regular fa-clock"></i> ${msg.date}</div>
                </div>
            </div>
            <div class="msg-detail-actions-top">
                <button class="msg-top-btn msg-top-star ${msg.starred ? 'active' : ''}" title="Yıldızla">
                    <i class="${msg.starred ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                </button>
                <button class="msg-top-btn msg-top-archive" title="Arşivle">
                    <i class="fa-solid fa-box-archive"></i>
                </button>
                <button class="msg-top-btn msg-top-delete" title="Sil">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
        <div class="msg-detail-subject-bar"><h2>${msg.subject}</h2></div>
        <div class="msg-detail-body"><pre>${msg.body}</pre></div>
        
        <footer class="msg-detail-footer">
            ${actionsHtml ? `<div class="msg-detail-actions">${actionsHtml}</div>` : ''}
            <div class="msg-quick-reply">
                <div class="msg-reply-box">
                    <input type="text" placeholder="Yanıtınızı yazın..." class="msg-reply-input">
                    <button class="msg-reply-send" title="Gönder"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </footer>
    `;
}

function renderEmptyState() {
    return `
        <div class="msg-empty-state">
            <div class="msg-empty-icon"><i class="fa-solid fa-envelope-open-text"></i></div>
            <h3>Mesaj Seçin</h3>
            <p>Okumak istediğiniz mesajı soldan seçin</p>
        </div>
    `;
}

function setupMessageEvents(container) {
    // Filtre Tıklama (Event Delegation)
    const filtersBar = document.getElementById('msg-top-filters');
    filtersBar?.addEventListener('click', (e) => {
        const btn = e.target.closest('.msg-filter-btn');
        if (!btn) return;
        
        currentCategory = btn.dataset.category;
        currentMessage = null;
        refreshUI(container);
    });

    // Mesaj Listesi Tıklama (Event Delegation - BUG KESİN ÇÖZÜM)
    const listEl = document.getElementById('msg-list');
    listEl?.addEventListener('click', (e) => {
        const item = e.target.closest('.msg-item');
        if (!item) return;

        const msgId = item.dataset.id;
        const msg = mockMessages.find(m => m.id === msgId);
        if (!msg) return;

        msg.read = true;
        currentMessage = msg;
        refreshUI(container);
    });

    // Arama
    const searchInput = document.getElementById('msg-search-input');
    searchInput?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const fullMsgs = getMessagesByCategory(currentCategory);
        const filteredMsgs = fullMsgs.filter(m => 
            m.subject.toLowerCase().includes(q) || m.from.name.toLowerCase().includes(q)
        );
        
        const listEl = document.getElementById('msg-list');
        if (listEl) {
            if (filteredMsgs.length === 0) {
                listEl.innerHTML = `<div class="msg-empty-list"><i class="fa-solid fa-magnifying-glass"></i><span>Sonuç bulunamadı</span></div>`;
            } else {
                listEl.innerHTML = filteredMsgs.map(m => {
                    const flagSrc = m.from.flag ? `https://flagcdn.com/w40/${m.from.flag}.png` : null;
                    return `
                        <div class="msg-item ${!m.read ? 'unread' : ''} ${currentMessage?.id === m.id ? 'active' : ''}" data-id="${m.id}">
                            <div class="msg-item-left">
                                ${flagSrc ? `<img src="${flagSrc}" class="msg-item-flag">` : `<div class="msg-item-flag-system"><i class="fa-solid fa-robot"></i></div>`}
                            </div>
                            <div class="msg-item-content">
                                <div class="msg-item-top"><span class="msg-item-from">${m.from.name}</span><span class="msg-item-date">${m.date}</span></div>
                                <div class="msg-item-subject">${m.subject}</div>
                                <div class="msg-item-preview">${m.preview}</div>
                            </div>
                            <div class="msg-item-right">${m.starred ? '<i class="fa-solid fa-star msg-star active"></i>' : ''}</div>
                        </div>`;
                }).join('');
            }
        }
    });

    // Yeni Mesaj
    document.getElementById('msg-compose-btn')?.addEventListener('click', () => {
        const detailEl = document.getElementById('msg-detail');
        if (detailEl) {
            detailEl.innerHTML = renderComposeView();
            setupComposeEvents(container);
        }
    });
}

function setupDetailEvents(container) {
    if (!currentMessage) return;

    // Ödeme Butonları (Vergi & Fatura)
    container.querySelectorAll('.msg-action-pay-tax, .msg-action-pay-bill').forEach(btn => {
        btn.addEventListener('click', async () => {
            const amount = currentMessage.amount || 0;
            const desc = btn.classList.contains('msg-action-pay-tax') ? 'Vergi Ödemesi' : 'Fatura Ödemesi';
            
            // updateGold import edilmesi gerekiyor, data.js'den değil state.js'den gelmeli
            const { updateGold } = await import('../data/state.js');
            
            const success = updateGold(-amount, desc);
            
            if (success) {
                // Mesaj içeriğini ve butonları güncelle
                currentMessage.body += `\n\n✅ BU İŞLEM BAŞARIYLA ÖDENMİŞTİR.\nÖdeme Tarihi: ${new Date().toLocaleString('tr-TR')}\nMakbuz No: NOM-${Math.floor(Math.random()*900000 + 100000)}`;
                currentMessage.actions = currentMessage.actions.filter(a => a !== 'pay-tax' && a !== 'pay-bill');
                showUndoToast(container, `${desc} Başarılı! (-${amount.toLocaleString()} ₳)`, () => {});
                refreshUI(container);
            } else {
                showUndoToast(container, `Yetersiz Bakiye!`, () => {});
            }
        });
    });

    // Yıldız
    container.querySelector('.msg-top-star')?.addEventListener('click', () => {
        currentMessage.starred = !currentMessage.starred;
        refreshUI(container);
    });

    // Arşiv
    container.querySelector('.msg-top-archive')?.addEventListener('click', () => {
        const msg = currentMessage;
        msg.archived = !msg.archived;
        showUndoToast(container, msg.archived ? 'Arşivlendi' : 'Arşivden çıkarıldı', () => {
            msg.archived = !msg.archived;
            refreshUI(container);
        });
        currentMessage = null;
        refreshUI(container);
    });

    // Sil
    container.querySelector('.msg-top-delete')?.addEventListener('click', () => {
        const msg = currentMessage;
        msg.deleted = true;
        showUndoToast(container, 'Mesaj silindi', () => {
            msg.deleted = false;
            refreshUI(container);
        });
        currentMessage = null;
        refreshUI(container);
    });

    // Yanıt
    const replyInput = container.querySelector('.msg-reply-input');
    const sendBtn = container.querySelector('.msg-reply-send');
    const doReply = () => {
        const text = replyInput.value.trim();
        if (!text) return;
        currentMessage.body += `\n\n── Yanıtınız ──\n${text}`;
        refreshUI(container);
    };
    sendBtn?.addEventListener('click', doReply);
    replyInput?.addEventListener('keypress', e => e.key === 'Enter' && doReply());
}

function refreshUI(container) {
    // Listeyi yenile
    const listEl = document.getElementById('msg-list');
    if (listEl) listEl.innerHTML = renderMessageList(currentCategory);
    
    // Filtreleri yenile
    const filtersBar = document.getElementById('msg-top-filters');
    if (filtersBar) filtersBar.innerHTML = renderFilters(getCategoriesWithCounts());

    // Detayı yenile
    const detailEl = document.getElementById('msg-detail');
    if (detailEl) {
        detailEl.innerHTML = currentMessage ? renderMessageDetail(currentMessage) : renderEmptyState();
        if (currentMessage) setupDetailEvents(container);
    }
}

function showUndoToast(container, text, undoCallback, duration = 5000) {
    document.querySelector('.msg-undo-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'msg-undo-toast';
    toast.innerHTML = `
        <div class="msg-undo-content"><span class="msg-undo-text">${text}</span><div class="msg-undo-timer" style="animation-duration: ${duration}ms"></div></div>
        <button class="msg-undo-btn">GERİ AL</button>
    `;
    document.body.appendChild(toast);
    let undone = false;
    const to = setTimeout(() => { if (!undone) toast.remove(); }, duration);
    toast.querySelector('.msg-undo-btn').addEventListener('click', () => {
        undone = true; clearTimeout(to); undoCallback(); toast.remove();
    });
}

function renderComposeView() {
    return `
        <div class="msg-compose">
            <div class="msg-compose-header"><h3>Yeni Mesaj</h3><button class="msg-top-btn" id="msg-compose-close">X</button></div>
            <div class="msg-compose-form">
                <input type="text" placeholder="Kime" id="msg-compose-to">
                <input type="text" placeholder="Konu" id="msg-compose-subject">
                <textarea placeholder="Mesajınız" id="msg-compose-body" rows="8"></textarea>
                <button class="msg-compose-send-btn" id="msg-compose-send">GÖNDER</button>
            </div>
        </div>
    `;
}

function setupComposeEvents(container) {
    document.getElementById('msg-compose-close')?.addEventListener('click', () => {
        currentMessage = null; refreshUI(container);
    });
    document.getElementById('msg-compose-send')?.addEventListener('click', () => {
        const to = document.getElementById('msg-compose-to').value;
        const subject = document.getElementById('msg-compose-subject').value;
        const body = document.getElementById('msg-compose-body').value;
        if (!to || !subject || !body) return;
        
        const newMsg = {
            id: 'm' + Date.now(), category: 'social', from: { name: 'Sen', flag: 'tr', title: 'Lider' },
            subject, body, date: 'Şimdi', read: true, archived: false, deleted: false, starred: false, actions: []
        };
        mockMessages.unshift(newMsg);
        currentMessage = newMsg;
        refreshUI(container);
    });
}

function loadMessagesStyles(callback) {
    if (document.getElementById('messages-page-style')) return callback();
    const link = document.createElement('link');
    link.id = 'messages-page-style'; link.rel = 'stylesheet'; link.href = 'css/messages.css';
    link.onload = callback; document.head.appendChild(link);
}
