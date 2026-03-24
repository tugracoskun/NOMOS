// MESAJLAR - ANA MODÜL
// Gelen kutusu, mesaj detay ve yeni mesaj oluşturma

import { mockMessages, getCategoriesWithCounts, getMessagesByCategory, priorities } from './data.js';

let currentCategory = 'all';
let currentMessage = null;

export function renderMessagesPage(container) {
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease';

    loadMessagesStyles(() => {
        const categories = getCategoriesWithCounts();
        const totalUnread = categories.find(c => c.id === 'all')?.count || 0;

        container.innerHTML = `
            <div class="msg-wrapper">
                <aside class="msg-sidebar">
                    <div class="msg-sidebar-header">
                        <h2><i class="fa-solid fa-inbox"></i> Gelen Kutusu</h2>
                        ${totalUnread > 0 ? `<span class="msg-unread-total">${totalUnread}</span>` : ''}
                    </div>

                    <div class="msg-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="msg-search-input" placeholder="Mesaj ara...">
                    </div>

                    <nav class="msg-categories" id="msg-categories">
                        ${categories.map(cat => `
                            <button class="msg-cat-btn ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
                                <i class="fa-solid ${cat.icon}"></i>
                                <span>${cat.label}</span>
                                ${cat.count > 0 ? `<span class="msg-cat-count">${cat.count}</span>` : ''}
                            </button>
                        `).join('')}
                    </nav>

                    <div class="msg-list" id="msg-list">
                        ${renderMessageList(currentCategory)}
                    </div>

                    <button class="msg-compose-btn" id="msg-compose-btn">
                        <i class="fa-solid fa-pen-to-square"></i> Yeni Mesaj
                    </button>
                </aside>

                <main class="msg-detail" id="msg-detail">
                    ${renderEmptyState()}
                </main>
            </div>
        `;

        setupMessageEvents(container);

        requestAnimationFrame(() => {
            container.style.opacity = '1';
        });
    });
}

// Mesaj listesi
function renderMessageList(category) {
    const messages = getMessagesByCategory(category);

    if (messages.length === 0) {
        return `
            <div class="msg-empty-list">
                <i class="fa-solid fa-envelope-open"></i>
                <span>Bu kategoride mesaj yok</span>
            </div>
        `;
    }

    return messages.map(msg => {
        const flagHtml = msg.from.flag
            ? `<img src="https://flagcdn.com/w40/${msg.from.flag}.png" alt="" class="msg-item-flag">`
            : `<div class="msg-item-flag msg-item-flag-system"><i class="fa-solid fa-robot"></i></div>`;

        return `
            <div class="msg-item ${!msg.read ? 'unread' : ''} ${currentMessage?.id === msg.id ? 'active' : ''}" data-id="${msg.id}">
                <div class="msg-item-left">
                    ${flagHtml}
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
                    ${msg.starred ? '<i class="fa-solid fa-star msg-star active"></i>' : '<i class="fa-regular fa-star msg-star"></i>'}
                </div>
            </div>
        `;
    }).join('');
}

// Mesaj detay
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
        };
        const a = actionMap[action] || { label: action, icon: 'fa-circle', cls: '' };
        return `<button class="msg-action-btn ${a.cls}" data-action="${action}"><i class="fa-solid ${a.icon}"></i> ${a.label}</button>`;
    }).join('');

    return `
        <!-- Detay Header -->
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
                <button class="msg-top-btn msg-top-star ${msg.starred ? 'active' : ''}" title="Favorilere Ekle">
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

        <!-- Konu -->
        <div class="msg-detail-subject-bar">
            <h2>${msg.subject}</h2>
        </div>

        <!-- Mesaj Gövdesi -->
        <div class="msg-detail-body">
            <pre>${msg.body}</pre>
        </div>

        <!-- Eylemler -->
        ${actionsHtml ? `<div class="msg-detail-actions">${actionsHtml}</div>` : ''}

        <!-- Yanıt Alanı -->
        <div class="msg-quick-reply">
            <div class="msg-reply-box">
                <input type="text" placeholder="Yanıtınızı yazın..." class="msg-reply-input">
                <button class="msg-reply-send" title="Gönder">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
}

// Boş durum
function renderEmptyState() {
    return `
        <div class="msg-empty-state">
            <div class="msg-empty-icon">
                <i class="fa-solid fa-envelope-open-text"></i>
            </div>
            <h3>Mesaj Seçin</h3>
            <p>Okumak istediğiniz mesajı soldan seçin</p>
        </div>
    `;
}

// Yeni mesaj (ek paylaşma kaldırıldı)
function renderComposeView() {
    return `
        <div class="msg-compose">
            <div class="msg-compose-header">
                <h3><i class="fa-solid fa-pen-to-square"></i> Yeni Mesaj</h3>
                <button class="msg-top-btn" id="msg-compose-close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="msg-compose-form">
                <div class="msg-compose-field">
                    <label>Kime</label>
                    <input type="text" placeholder="Alıcı adı veya ülke..." id="msg-compose-to">
                </div>
                <div class="msg-compose-field">
                    <label>Konu</label>
                    <input type="text" placeholder="Mesaj konusu..." id="msg-compose-subject">
                </div>
                <div class="msg-compose-field">
                    <label>Kategori</label>
                    <select id="msg-compose-category">
                        <option value="diplomacy">Diplomasi</option>
                        <option value="trade">Ticaret</option>
                        <option value="military">Askeri</option>
                        <option value="social">Sosyal</option>
                    </select>
                </div>
                <div class="msg-compose-field msg-compose-body-field">
                    <label>Mesaj</label>
                    <textarea placeholder="Mesajınızı yazın..." id="msg-compose-body" rows="8"></textarea>
                </div>
                <div class="msg-compose-footer">
                    <div></div>
                    <button class="msg-compose-send-btn" id="msg-compose-send">
                        <i class="fa-solid fa-paper-plane"></i> Gönder
                    </button>
                </div>
            </div>
        </div>
    `;
}

// === EVENT HANDLERS ===

function setupMessageEvents(container) {
    // Kategori tıklama
    container.querySelectorAll('.msg-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            currentMessage = null;
            container.querySelectorAll('.msg-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const listEl = document.getElementById('msg-list');
            if (listEl) listEl.innerHTML = renderMessageList(currentCategory);

            const detailEl = document.getElementById('msg-detail');
            if (detailEl) detailEl.innerHTML = renderEmptyState();

            bindMessageItemEvents(container);
        });
    });

    bindMessageItemEvents(container);

    // Arama
    const searchInput = document.getElementById('msg-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            const listEl = document.getElementById('msg-list');
            const msgs = getMessagesByCategory(currentCategory)
                .filter(m => m.subject.toLowerCase().includes(q) || m.from.name.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q));

            if (msgs.length === 0) {
                listEl.innerHTML = `<div class="msg-empty-list"><i class="fa-solid fa-magnifying-glass"></i><span>Sonuç bulunamadı</span></div>`;
            } else {
                // Sadece listeyi yeniden render et
                const tempCategory = currentCategory;
                currentCategory = '__search__';
                listEl.innerHTML = msgs.map(msg => {
                    const flagHtml = msg.from.flag
                        ? `<img src="https://flagcdn.com/w40/${msg.from.flag}.png" alt="" class="msg-item-flag">`
                        : `<div class="msg-item-flag msg-item-flag-system"><i class="fa-solid fa-robot"></i></div>`;
                    return `
                        <div class="msg-item ${!msg.read ? 'unread' : ''} ${currentMessage?.id === msg.id ? 'active' : ''}" data-id="${msg.id}">
                            <div class="msg-item-left">${flagHtml}</div>
                            <div class="msg-item-content">
                                <div class="msg-item-top">
                                    <span class="msg-item-from">${msg.from.name}</span>
                                    <span class="msg-item-date">${msg.date}</span>
                                </div>
                                <div class="msg-item-subject">${msg.subject}</div>
                                <div class="msg-item-preview">${msg.preview}</div>
                            </div>
                            <div class="msg-item-right">
                                ${msg.starred ? '<i class="fa-solid fa-star msg-star active"></i>' : '<i class="fa-regular fa-star msg-star"></i>'}
                            </div>
                        </div>
                    `;
                }).join('');
                currentCategory = tempCategory;
                bindMessageItemEvents(container);
            }
        });
    }

    // Yeni Mesaj
    const composeBtn = document.getElementById('msg-compose-btn');
    if (composeBtn) {
        composeBtn.addEventListener('click', () => {
            const detailEl = document.getElementById('msg-detail');
            if (detailEl) {
                detailEl.innerHTML = renderComposeView();
                setupComposeEvents(container);
            }
        });
    }
}

function bindMessageItemEvents(container) {
    container.querySelectorAll('.msg-item').forEach(item => {
        item.addEventListener('click', () => {
            const msgId = item.dataset.id;
            const msg = mockMessages.find(m => m.id === msgId);
            if (!msg) return;

            msg.read = true;
            currentMessage = msg;

            container.querySelectorAll('.msg-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            item.classList.remove('unread');

            const detailEl = document.getElementById('msg-detail');
            if (detailEl) {
                detailEl.innerHTML = renderMessageDetail(msg);
                setupDetailEvents(container);
            }

            updateCategoryCounts(container);
        });
    });
}

function setupDetailEvents(container) {
    // Geri butonu
    const backBtn = document.getElementById('msg-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            currentMessage = null;
            const detailEl = document.getElementById('msg-detail');
            if (detailEl) detailEl.innerHTML = renderEmptyState();
        });
    }

    // Hızlı yanıt gönder
    const replyInput = container.querySelector('.msg-reply-input');
    const replySend = container.querySelector('.msg-reply-send');

    function sendReply() {
        if (!replyInput || !currentMessage) return;
        const text = replyInput.value.trim();
        if (!text) return;

        // Yanıtı mesaj body'sine ekle
        currentMessage.body += `\n\n── Yanıtınız ──\n${text}`;
        replyInput.value = '';

        // Detayı güncelle
        const detailEl = document.getElementById('msg-detail');
        if (detailEl) {
            detailEl.innerHTML = renderMessageDetail(currentMessage);
            setupDetailEvents(container);
            // Scroll en alta
            detailEl.scrollTop = detailEl.scrollHeight;
        }
    }

    if (replySend) {
        replySend.addEventListener('click', sendReply);
    }
    if (replyInput) {
        replyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendReply();
        });
    }
}

function updateCategoryCounts(container) {
    const categories = getCategoriesWithCounts();
    categories.forEach(cat => {
        const btn = container.querySelector(`.msg-cat-btn[data-category="${cat.id}"]`);
        if (btn) {
            const countEl = btn.querySelector('.msg-cat-count');
            if (cat.count > 0) {
                if (countEl) countEl.textContent = cat.count;
                else btn.insertAdjacentHTML('beforeend', `<span class="msg-cat-count">${cat.count}</span>`);
            } else if (countEl) {
                countEl.remove();
            }
        }
    });

    const totalUnread = categories.find(c => c.id === 'all')?.count || 0;
    const totalBadge = container.querySelector('.msg-unread-total');
    if (totalBadge) {
        if (totalUnread > 0) totalBadge.textContent = totalUnread;
        else totalBadge.remove();
    }
}

function setupComposeEvents(container) {
    const closeBtn = document.getElementById('msg-compose-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const detailEl = document.getElementById('msg-detail');
            if (detailEl) detailEl.innerHTML = renderEmptyState();
        });
    }

    const sendBtn = document.getElementById('msg-compose-send');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const to = document.getElementById('msg-compose-to')?.value.trim();
            const subject = document.getElementById('msg-compose-subject')?.value.trim();
            const category = document.getElementById('msg-compose-category')?.value;
            const body = document.getElementById('msg-compose-body')?.value.trim();

            if (!to || !subject || !body) {
                // Boş alanları kırmızı yap
                if (!to) document.getElementById('msg-compose-to').style.borderColor = '#ef4444';
                if (!subject) document.getElementById('msg-compose-subject').style.borderColor = '#ef4444';
                if (!body) document.getElementById('msg-compose-body').style.borderColor = '#ef4444';
                return;
            }

            // Yeni mesaj oluştur
            const newMsg = {
                id: 'm' + Date.now(),
                category: category || 'social',
                from: { name: 'Sen', flag: 'tr', title: 'Lider' },
                subject: subject,
                preview: body.substring(0, 80) + (body.length > 80 ? '...' : ''),
                body: `Kime: ${to}\n\n${body}`,
                date: 'Şimdi',
                timestamp: Date.now(),
                read: true,
                starred: false,
                priority: 'normal',
                attachments: [],
                actions: []
            };

            // Listeye ekle
            mockMessages.unshift(newMsg);

            // Listeyi güncelle
            const listEl = document.getElementById('msg-list');
            if (listEl) listEl.innerHTML = renderMessageList(currentCategory);
            bindMessageItemEvents(container);
            updateCategoryCounts(container);

            // Başarı göster
            const detailEl = document.getElementById('msg-detail');
            if (detailEl) {
                detailEl.innerHTML = `
                    <div class="msg-empty-state">
                        <div class="msg-empty-icon" style="color: #22c55e;">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h3>Mesaj Gönderildi!</h3>
                        <p>"${subject}" konulu mesajınız ${to} adresine iletildi.</p>
                    </div>
                `;
            }
        });
    }
}

// CSS yükleme
function loadMessagesStyles(callback) {
    if (document.getElementById('messages-page-style')) {
        callback();
        return;
    }
    const link = document.createElement('link');
    link.id = 'messages-page-style';
    link.rel = 'stylesheet';
    link.href = 'css/messages.css';
    link.onload = callback;
    link.onerror = callback;
    document.head.appendChild(link);
}
