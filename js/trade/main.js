// TRADE MODULE - MAIN CONTROLLER
// Handles page rendering, state management, and trade operations
// Now includes Dashboard mode as default view

import { generateTradePage, getResourcePrice, calculatePortfolioValue } from './templates.js';
import { marketState, getMarketMultiplier, initMarket } from '../data/market.js';
import { updateGold, getGameState } from '../data/state.js';
import { renderTradeDashboard, destroyDashboard } from './dashboard/index.js';

// === VIEW MODES ===
let currentViewMode = 'dashboard'; // 'dashboard' or 'marketplace'

// === TRADE STATE ===
let tradeState = {
    selectedResource: null,
    quantity: 1,
    activeCategory: 'all',
    searchQuery: '',
    totalVolume: 1250000, // Simulated
    marketTrend: 2.3      // Simulated
};

// === PLAYER TRADE DATA ===
const INVENTORY_KEY = 'nomos_player_inventory';
const HISTORY_KEY = 'nomos_trade_history';

function loadPlayerInventory() {
    try {
        const raw = localStorage.getItem(INVENTORY_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function savePlayerInventory(inventory) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

function loadTradeHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveTradeHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// === MAIN RENDER FUNCTION ===
export function renderTradePage(container, viewMode = 'dashboard') {
    currentViewMode = viewMode;

    // Dashboard Mode (Default - New)
    if (currentViewMode === 'dashboard') {
        renderTradeDashboard(container);
        return;
    }

    // Classic Marketplace Mode
    renderMarketplace(container);
}

// === RENDER MARKETPLACE (Classic View) ===
function renderMarketplace(container) {
    // Load CSS
    loadTradeStyles();

    // Initialize market if needed
    if (Object.keys(marketState).length === 0) {
        initMarket();
    }

    // Load player data
    const inventory = loadPlayerInventory();
    const history = loadTradeHistory();

    // Render page
    container.innerHTML = generateTradePage(tradeState, inventory, history);

    // Setup event listeners
    setupEventListeners(container);
}

// === LOAD STYLES ===
function loadTradeStyles() {
    if (!document.getElementById('trade-page-style')) {
        const link = document.createElement('link');
        link.id = 'trade-page-style';
        link.rel = 'stylesheet';
        link.href = 'css/trade.css';
        document.head.appendChild(link);
    }
}

// === EVENT HANDLERS ===
function setupEventListeners(container) {
    // Resource card clicks
    container.querySelectorAll('.resource-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Ignore if clicking quick buttons
            if (e.target.closest('.quick-btn')) return;

            const resourceName = card.dataset.resource;
            selectResource(resourceName, container);
        });
    });

    // Quick buy/sell buttons
    container.querySelectorAll('[data-action="quick-buy"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const resourceName = btn.dataset.resource;
            executeTrade('buy', resourceName, 1, container);
        });
    });

    container.querySelectorAll('[data-action="quick-sell"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const resourceName = btn.dataset.resource;
            executeTrade('sell', resourceName, 1, container);
        });
    });

    // Category tabs
    container.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            tradeState.activeCategory = tab.dataset.category;
            refreshResourcesGrid(container);
        });
    });

    // Search input
    const searchInput = container.querySelector('#resource-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            tradeState.searchQuery = e.target.value;
            refreshResourcesGrid(container);
        });
    }

    // Quantity controls
    container.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'increase') {
                tradeState.quantity = Math.min(tradeState.quantity + 1, 1000);
            } else if (action === 'decrease') {
                tradeState.quantity = Math.max(tradeState.quantity - 1, 1);
            }
            updateTradePanel(container);
        });
    });

    // Quantity input
    const quantityInput = container.querySelector('#trade-quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', (e) => {
            const val = parseInt(e.target.value) || 1;
            tradeState.quantity = Math.min(Math.max(val, 1), 1000);
            updateTradePanel(container);
        });
    }

    // Execute buy
    const buyBtn = container.querySelector('[data-action="execute-buy"]');
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            if (tradeState.selectedResource) {
                executeTrade('buy', tradeState.selectedResource, tradeState.quantity, container);
            }
        });
    }

    // Execute sell
    const sellBtn = container.querySelector('[data-action="execute-sell"]');
    if (sellBtn) {
        sellBtn.addEventListener('click', () => {
            if (tradeState.selectedResource) {
                executeTrade('sell', tradeState.selectedResource, tradeState.quantity, container);
            }
        });
    }

    // Inventory item clicks
    container.querySelectorAll('.inventory-item').forEach(item => {
        item.addEventListener('click', () => {
            const resourceName = item.dataset.resource;
            selectResource(resourceName, container);
        });
    });
}

// === SELECT RESOURCE ===
function selectResource(resourceName, container) {
    tradeState.selectedResource = resourceName;
    tradeState.quantity = 1;

    // Update visual selection
    container.querySelectorAll('.resource-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.resource === resourceName);
    });

    // Update trade panel
    updateTradePanel(container);
}

// === UPDATE TRADE PANEL ===
function updateTradePanel(container) {
    const tradePanel = container.querySelector('.trade-panel');
    if (!tradePanel) return;

    const { selectedResource, quantity } = tradeState;

    if (!selectedResource) return;

    const price = getResourcePrice(selectedResource);
    const total = price * quantity;

    // Update quantity input
    const quantityInput = container.querySelector('#trade-quantity');
    if (quantityInput) quantityInput.value = quantity;

    // Update summary
    const summaryRows = tradePanel.querySelectorAll('.summary-row .value');
    if (summaryRows.length >= 3) {
        summaryRows[0].textContent = `${price.toLocaleString()} ₳`;
        summaryRows[1].textContent = `x${quantity}`;
        summaryRows[2].textContent = `${total.toLocaleString()} ₳`;
    }
}

// === EXECUTE TRADE ===
function executeTrade(type, resourceName, quantity, container) {
    const price = getResourcePrice(resourceName);
    const total = price * quantity;
    const gameState = getGameState();

    if (type === 'buy') {
        // Check if player has enough gold
        if (gameState.gold < total) {
            showTradeNotification('Yetersiz altın!', 'error');
            return false;
        }

        // Deduct gold
        updateGold(-total);

        // Add to inventory
        const inventory = loadPlayerInventory();
        if (!inventory[resourceName]) {
            inventory[resourceName] = { quantity: 0, avgBuyPrice: 0 };
        }

        // Update average buy price
        const oldQty = inventory[resourceName].quantity;
        const oldTotal = oldQty * inventory[resourceName].avgBuyPrice;
        const newTotal = oldTotal + total;
        const newQty = oldQty + quantity;
        inventory[resourceName].quantity = newQty;
        inventory[resourceName].avgBuyPrice = Math.round(newTotal / newQty);

        savePlayerInventory(inventory);

        // Log transaction
        logTrade('buy', resourceName, quantity, price, total);

        showTradeNotification(`${quantity}x ${resourceName} satın alındı!`, 'success');

    } else if (type === 'sell') {
        // Check if player has the resource
        const inventory = loadPlayerInventory();
        if (!inventory[resourceName] || inventory[resourceName].quantity < quantity) {
            showTradeNotification('Yetersiz kaynak!', 'error');
            return false;
        }

        // Add gold
        updateGold(total);

        // Remove from inventory
        inventory[resourceName].quantity -= quantity;
        if (inventory[resourceName].quantity <= 0) {
            delete inventory[resourceName];
        }
        savePlayerInventory(inventory);

        // Log transaction
        logTrade('sell', resourceName, quantity, price, total);

        showTradeNotification(`${quantity}x ${resourceName} satıldı! +${total.toLocaleString()} ₳`, 'success');
    }

    // Refresh page
    renderTradePage(container);
    return true;
}

// === LOG TRADE ===
function logTrade(type, resource, quantity, price, total) {
    const history = loadTradeHistory();
    history.push({
        id: `TRD_${Date.now()}`,
        type,
        resource,
        quantity,
        price,
        total,
        timestamp: Date.now()
    });

    // Keep only last 100 transactions
    if (history.length > 100) {
        history.shift();
    }

    saveTradeHistory(history);
}

// === REFRESH RESOURCES GRID ===
function refreshResourcesGrid(container) {
    const inventory = loadPlayerInventory();
    const history = loadTradeHistory();

    // Re-render entire page to simplify
    container.innerHTML = generateTradePage(tradeState, inventory, history);
    setupEventListeners(container);
}

// === TRADE NOTIFICATION ===
function showTradeNotification(message, type) {
    // Create notification element
    let notification = document.getElementById('trade-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'trade-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            font-family: 'Inter', sans-serif;
        `;
        document.body.appendChild(notification);
    }

    // Set style based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        notification.style.color = 'white';
    }

    notification.textContent = message;

    // Show
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
    }, 3000);
}

// === EXPOSE FOR TESTING ===
window.testBuyResource = (name, qty) => {
    const container = document.getElementById('app-container') || document.body;
    return executeTrade('buy', name, qty, container);
};

window.testSellResource = (name, qty) => {
    const container = document.getElementById('app-container') || document.body;
    return executeTrade('sell', name, qty, container);
};
