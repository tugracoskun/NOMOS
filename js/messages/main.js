// MESAJLAR - ANA MODÜL
// Gelen kutusu, mesaj detay ve yeni mesaj oluşturma

import { mockMessages, getCategoriesWithCounts, getMessagesByCategory, priorities } from './data.js';

let currentCategory = 'all';
let currentMessage = null;
let messagesState = [...mockMessages]; // Mutable kopyası

export function renderMessagesPage(container) {
    // Gizle, CSS yüklenince göster
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease';

    loadMessagesStyles(() => {
        const categories = getCategoriesWithCounts();
        const totalUnread = categories.find(c => c.id === 'all')?.count || 0;

        container.innerHTML = `
            <div class="msg-wrapper">
                <!-- SOL PANEL: Kategori + Mesaj Listesi -->
                <aside class="msg-sidebar">
                    <!-- Başlık -->
                    <div class="msg-sidebar-header">
                        <h2><i class="fa-solid fa-inbox"></i> Gelen Kutusu</h2>
                        ${totalUnread > 0 ? `<span class="msg-unread-total">${totalUnread}</span>` : ''}
                    </div>

                    <!-- Arama -->
                    <div class="msg-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="msg-search-input" placeholder="Mesaj ara...">
                    </div>

                    <!-- Kategoriler -->
                    <nav class="msg-categories" id="msg-categories">
                        ${categories.map(cat => `
                            <button class="msg-cat-btn ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
                                <i class="fa-solid ${cat.icon}"></i>
                                <span>${cat.label}</span>
                                ${cat.count > 0 ? `<span class="msg-cat-count">${cat.count}</span>` : ''}
                            </button>
                        `).join('')}
                    </nav>

                    <!-- Mesaj Listesi -->
                    <div class="msg-list" id="msg-list">
                        ${renderMessageList(currentCategory)}
                    </div>

                    <!-- Yeni Mesaj Butonu -->
                    <button class="msg-compose-btn" id="msg-compose-btn">
                        <i class="fa-solid fa-pen-to-square"></i> Yeni Mesaj
                    </button>
                </aside>

                <!-- SAĞ PANEL: Mesaj Detay -->
                <main class="msg-detail" id="msg-detail">
                    ${renderEmptyState()}
                </main>
            </div>
        `;

        // Event'leri bağla
        setupMessageEvents(container);

        // Fade-in
        requestAnimationFrame(() => {
            container.style.opacity = '1';
        });
    });
}

// Mesaj listesini render et
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
        const pri = priorities[msg.priority] || priorities.normal;
        const flagHtml = msg.from.flag
            ? `<img src="https://flagcdn.com/w40/${msg.from.flag}.png" alt="" class="msg-item-flag">`
            : `<div class="msg-item-flag msg-item-flag-system"><i class="fa-solid fa-robot"></i></div>`;

        return `
            <div class="msg-item ${!msg.read ? 'unread' : ''} ${currentMessage?.id === msg.id ? 'active' : ''}" data-id="${msg.id}">
                <div class="msg-item-left">
                    ${flagHtml}
                    <div class="msg-item-priority" style="background: ${pri.color}" title="${pri.label}"></div>
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
                    ${msg.attachments.length > 0 ? '<i class="fa-solid fa-paperclip msg-attach-icon"></i>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Mesaj detay görünümü
function renderMessageDetail(msg) {
    if (!msg) return renderEmptyState();

    const pri = priorities[msg.priority] || priorities.normal;
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

    const attachmentsHtml = (msg.attachments || []).length > 0
        ? `<div class="msg-attachments">
                <div class="msg-attachments-title"><i class="fa-solid fa-paperclip"></i> Ekler (${msg.attachments.length})</div>
                ${msg.attachments.map(att => `
                    <div class="msg-attachment-item">
                        <i class="fa-solid fa-file-pdf"></i>
                        <span>${att.name}</span>
                        <span class="msg-att-size">${att.size}</span>
                    </div>
                `).join('')}
           </div>`
        : '';

    return `
        <!-- Detay Header -->
        <div class="msg-detail-header">
            <button class="msg-back-btn" id="msg-back-btn"><i class="fa-solid fa-arrow-left"></i></button>
            <div class="msg-detail-meta">
                ${flagHtml}
                <div>
                    <div class="msg-detail-from">${msg.from.name} <span class="msg-detail-title">${msg.from.title}</span></div>
                    <div class="msg-detail-date">${msg.date}</div>
                </div>
            </div>
            <div class="msg-detail-actions-top">
                <button class="msg-icon-btn" title="Yıldızla"><i class="${msg.starred ? 'fa-solid' : 'fa-regular'} fa-star"></i></button>
                <button class="msg-icon-btn" title="Arşivle"><i class="fa-solid fa-box-archive"></i></button>
                <button class="msg-icon-btn msg-icon-btn-danger" title="Sil"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>

        <!-- Konu -->
        <div class="msg-detail-subject-bar">
            <h2>${msg.subject}</h2>
            <span class="msg-priority-badge" style="background: ${pri.color}20; color: ${pri.color}; border: 1px solid ${pri.color}40;">
                <i class="fa-solid ${pri.icon}"></i> ${pri.label}
            </span>
        </div>

        <!-- Mesaj Gövdesi -->
        <div class="msg-detail-body">
            <pre>${msg.body}</pre>
        </div>

        <!-- Ekler -->
        ${attachmentsHtml}

        <!-- Eylemler -->
        ${actionsHtml ? `<div class="msg-detail-actions">${actionsHtml}</div>` : ''}

        <!-- Hızlı Yanıt -->
        <div class="msg-quick-reply">
            <input type="text" placeholder="Hızlı yanıt yaz..." class="msg-reply-input">
            <button class="msg-reply-send"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
    `;
}

// Boş durum
function renderEmptyState() {
    return `
        <div class="msg-empty-state">
            <i class="fa-solid fa-envelope-open-text"></i>
            <h3>Mesaj Seçin</h3>
            <p>Okumak istediğiniz mesajı soldan seçin</p>
        </div>
    `;
}

// Event'ler
function setupMessageEvents(container) {
    // Kategori tıklama
    container.querySelectorAll('.msg-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            currentMessage = null;

            // Active class güncelle
            container.querySelectorAll('.msg-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Listeyi güncelle
            const listEl = document.getElementById('msg-list');
            if (listEl) listEl.innerHTML = renderMessageList(currentCategory);

            // Detayı sıfırla
            const detailEl = document.getElementById('msg-detail');
            if (detailEl) detailEl.innerHTML = renderEmptyState();

            // Yeni listedeki item'lara event bağla
            bindMessageItemEvents(container);
        });
    });

    // Mesaj item'larına event
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
                listEl.innerHTML = msgs.map(msg => {
                    const pri = priorities[msg.priority] || priorities.normal;
                    const flagHtml = msg.from.flag
                        ? `<img src="https://flagcdn.com/w40/${msg.from.flag}.png" alt="" class="msg-item-flag">`
                        : `<div class="msg-item-flag msg-item-flag-system"><i class="fa-solid fa-robot"></i></div>`;
                    return `
                        <div class="msg-item ${!msg.read ? 'unread' : ''} ${currentMessage?.id === msg.id ? 'active' : ''}" data-id="${msg.id}">
                            <div class="msg-item-left">
                                ${flagHtml}
                                <div class="msg-item-priority" style="background: ${pri.color}"></div>
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
                                ${msg.attachments.length > 0 ? '<i class="fa-solid fa-paperclip msg-attach-icon"></i>' : ''}
                            </div>
                        </div>
                    `;
                }).join('');
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

            // Okundu yap
            msg.read = true;
            currentMessage = msg;

            // Active class
            container.querySelectorAll('.msg-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            item.classList.remove('unread');

            // Detayı göster
            const detailEl = document.getElementById('msg-detail');
            if (detailEl) {
                detailEl.innerHTML = renderMessageDetail(msg);
                setupDetailEvents(container);
            }

            // Kategori sayaçlarını güncelle
            updateCategoryCounts(container);
        });
    });
}

function setupDetailEvents(container) {
    // Geri butonu (mobil)
    const backBtn = document.getElementById('msg-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            currentMessage = null;
            const detailEl = document.getElementById('msg-detail');
            if (detailEl) detailEl.innerHTML = renderEmptyState();
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
                if (countEl) {
                    countEl.textContent = cat.count;
                } else {
                    btn.insertAdjacentHTML('beforeend', `<span class="msg-cat-count">${cat.count}</span>`);
                }
            } else if (countEl) {
                countEl.remove();
            }
        }
    });

    // Total unread
    const totalUnread = categories.find(c => c.id === 'all')?.count || 0;
    const totalBadge = container.querySelector('.msg-unread-total');
    if (totalBadge) {
        if (totalUnread > 0) {
            totalBadge.textContent = totalUnread;
        } else {
            totalBadge.remove();
        }
    }
}

// Yeni mesaj oluşturma formu
function renderComposeView() {
    return `
        <div class="msg-compose">
            <div class="msg-compose-header">
                <h3><i class="fa-solid fa-pen-to-square"></i> Yeni Mesaj</h3>
                <button class="msg-icon-btn" id="msg-compose-close"><i class="fa-solid fa-xmark"></i></button>
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
                    <button class="msg-compose-attach"><i class="fa-solid fa-paperclip"></i> Dosya Ekle</button>
                    <button class="msg-compose-send" id="msg-compose-send"><i class="fa-solid fa-paper-plane"></i> Gönder</button>
                </div>
            </div>
        </div>
    `;
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
            const detailEl = document.getElementById('msg-detail');
            if (detailEl) {
                detailEl.innerHTML = `
                    <div class="msg-empty-state">
                        <i class="fa-solid fa-circle-check" style="color: #22c55e;"></i>
                        <h3>Mesaj Gönderildi!</h3>
                        <p>Yanıt geldiğinde bildirim alacaksınız.</p>
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
