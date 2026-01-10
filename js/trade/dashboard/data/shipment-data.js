// SHIPMENT & LOGISTICS DATA MANAGEMENT
// Kargo ve lojistik verilerini yönetir - Gemi, Hava, Kara, Tren yolları

const SHIPMENT_STORAGE_KEY = 'nomos_shipments';

// === TAŞIMA TÜRLERİ ===
export const TRANSPORT_TYPES = {
    SEA: {
        id: 'sea',
        name: 'Deniz Yolu',
        icon: 'fa-solid fa-ship',
        color: '#0ea5e9',
        speedFactor: 0.3,  // En yavaş ama en ucuz
        costFactor: 0.4,
        capacityFactor: 3.0, // En yüksek kapasite
        riskFactor: 0.15,
        description: 'Büyük hacimli yükler için ideal, ekonomik'
    },
    AIR: {
        id: 'air',
        name: 'Hava Yolu',
        icon: 'fa-solid fa-plane',
        color: '#8b5cf6',
        speedFactor: 1.0,  // En hızlı
        costFactor: 2.5,   // En pahalı
        capacityFactor: 0.3, // Düşük kapasite
        riskFactor: 0.05,  // En güvenli
        description: 'Hızlı teslimat, premium fiyat'
    },
    ROAD: {
        id: 'road',
        name: 'Kara Yolu',
        icon: 'fa-solid fa-truck',
        color: '#f59e0b',
        speedFactor: 0.6,
        costFactor: 1.0,
        capacityFactor: 1.0,
        riskFactor: 0.2,
        description: 'Esnek ve yaygın, orta mesafe için ideal'
    },
    RAIL: {
        id: 'rail',
        name: 'Demir Yolu',
        icon: 'fa-solid fa-train',
        color: '#10b981',
        speedFactor: 0.5,
        costFactor: 0.7,
        capacityFactor: 2.0,
        riskFactor: 0.1,
        description: 'Güvenilir ve ekonomik, ağır yükler için'
    }
};

// === KARGO DURUMLARI ===
export const SHIPMENT_STATUS = {
    PENDING: {
        id: 'pending',
        name: 'Beklemede',
        icon: 'fa-solid fa-clock',
        color: '#94a3b8'
    },
    PROCESSING: {
        id: 'processing',
        name: 'Hazırlanıyor',
        icon: 'fa-solid fa-box-open',
        color: '#f59e0b'
    },
    IN_TRANSIT: {
        id: 'in_transit',
        name: 'Yolda',
        icon: 'fa-solid fa-route',
        color: '#3b82f6'
    },
    CUSTOMS: {
        id: 'customs',
        name: 'Gümrükte',
        icon: 'fa-solid fa-passport',
        color: '#a855f7'
    },
    DELIVERED: {
        id: 'delivered',
        name: 'Teslim Edildi',
        icon: 'fa-solid fa-circle-check',
        color: '#22c55e'
    },
    CANCELLED: {
        id: 'cancelled',
        name: 'İptal',
        icon: 'fa-solid fa-ban',
        color: '#ef4444'
    },
    DELAYED: {
        id: 'delayed',
        name: 'Gecikme',
        icon: 'fa-solid fa-triangle-exclamation',
        color: '#f97316'
    }
};

// === ÖRNEK ROTALAR ===
export const SAMPLE_ROUTES = [
    { from: 'İstanbul', to: 'Londra', distance: 2500, region: 'europe' },
    { from: 'İstanbul', to: 'New York', distance: 8500, region: 'america' },
    { from: 'Ankara', to: 'Berlin', distance: 2200, region: 'europe' },
    { from: 'İzmir', to: 'Tokyo', distance: 9000, region: 'asia' },
    { from: 'Bursa', to: 'Dubai', distance: 3000, region: 'middle_east' },
    { from: 'Antalya', to: 'Moskova', distance: 2100, region: 'europe' },
    { from: 'Trabzon', to: 'Pekin', distance: 7500, region: 'asia' },
    { from: 'Mersin', to: 'Singapur', distance: 8000, region: 'asia' }
];

// === LOAD SHIPMENTS ===
export function loadShipments() {
    try {
        const raw = localStorage.getItem(SHIPMENT_STORAGE_KEY);
        if (raw) {
            const shipments = JSON.parse(raw);
            // Update statuses based on time
            return shipments.map(updateShipmentProgress);
        }
        // Create sample shipments for demo
        const sampleShipments = createSampleShipments();
        saveShipments(sampleShipments);
        return sampleShipments;
    } catch (e) {
        console.error('Shipment load error:', e);
        return [];
    }
}

// === SAVE SHIPMENTS ===
export function saveShipments(shipments) {
    localStorage.setItem(SHIPMENT_STORAGE_KEY, JSON.stringify(shipments));
}

// === CREATE SHIPMENT ===
export function createShipment(data) {
    const shipments = loadShipments();

    const transportType = TRANSPORT_TYPES[data.transportType.toUpperCase()] || TRANSPORT_TYPES.ROAD;
    const estimatedDuration = calculateDuration(data.distance, transportType);
    const shippingCost = calculateCost(data.weight, data.distance, transportType);

    const newShipment = {
        id: `SHP_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        trackingId: generateTrackingId(),

        // Rota bilgileri
        origin: data.origin,
        destination: data.destination,
        distance: data.distance || 1000,

        // Yük bilgileri
        productName: data.productName,
        quantity: data.quantity,
        weight: data.weight || 100, // kg
        value: data.value || 1000,

        // Taşıma detayları
        transportType: transportType.id,
        carrier: data.carrier || 'NOMOS Logistics',

        // Durum
        status: 'pending',
        progress: 0, // 0-100

        // Zaman
        createdAt: Date.now(),
        estimatedDuration: estimatedDuration, // ms
        estimatedDelivery: Date.now() + estimatedDuration,
        actualDelivery: null,

        // Maliyet
        shippingCost: shippingCost,
        insuranceCost: Math.round(data.value * 0.02),

        // İzleme noktaları
        checkpoints: generateCheckpoints(data.origin, data.destination, transportType),
        currentCheckpoint: 0,

        // Ek bilgiler
        notes: data.notes || '',
        priority: data.priority || 'normal', // 'low', 'normal', 'high', 'express'
        insured: data.insured || false
    };

    shipments.push(newShipment);
    saveShipments(shipments);

    return newShipment;
}

// === UPDATE SHIPMENT ===
export function updateShipment(shipmentId, updates) {
    const shipments = loadShipments();
    const index = shipments.findIndex(s => s.id === shipmentId);

    if (index !== -1) {
        shipments[index] = { ...shipments[index], ...updates };
        saveShipments(shipments);
        return shipments[index];
    }
    return null;
}

// === UPDATE SHIPMENT PROGRESS (Time-based) ===
function updateShipmentProgress(shipment) {
    if (shipment.status === 'delivered' || shipment.status === 'cancelled') {
        return shipment;
    }

    const now = Date.now();
    const elapsed = now - shipment.createdAt;
    const progress = Math.min(100, Math.round((elapsed / shipment.estimatedDuration) * 100));

    // Update status based on progress
    let newStatus = shipment.status;
    let currentCheckpoint = shipment.currentCheckpoint;

    if (progress >= 100) {
        newStatus = 'delivered';
        currentCheckpoint = shipment.checkpoints.length - 1;
    } else if (progress >= 80) {
        newStatus = 'customs';
        currentCheckpoint = Math.min(shipment.checkpoints.length - 2, Math.floor(progress / 25));
    } else if (progress >= 10) {
        newStatus = 'in_transit';
        currentCheckpoint = Math.floor(progress / 25);
    } else if (progress >= 5) {
        newStatus = 'processing';
    }

    return {
        ...shipment,
        progress,
        status: newStatus,
        currentCheckpoint
    };
}

// === HELPER FUNCTIONS ===

function generateTrackingId() {
    const prefix = 'NMS';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

function calculateDuration(distance, transportType) {
    // Base: 1 hour per 100km for trucks
    const baseHours = distance / 100;
    const adjustedHours = baseHours / transportType.speedFactor;
    return Math.round(adjustedHours * 60 * 60 * 1000); // Convert to ms
}

function calculateCost(weight, distance, transportType) {
    const baseCost = (weight * 0.5) + (distance * 0.1);
    return Math.round(baseCost * transportType.costFactor);
}

function generateCheckpoints(origin, destination, transportType) {
    const checkpoints = [
        {
            name: `${origin} - Çıkış Deposu`,
            type: 'origin',
            estimatedTime: 0
        }
    ];

    // Add intermediate checkpoints based on transport type
    if (transportType.id === 'sea') {
        checkpoints.push(
            { name: `${origin} Limanı`, type: 'port', estimatedTime: 0.1 },
            { name: 'Açık Deniz', type: 'transit', estimatedTime: 0.5 },
            { name: `${destination} Limanı`, type: 'port', estimatedTime: 0.85 }
        );
    } else if (transportType.id === 'air') {
        checkpoints.push(
            { name: `${origin} Havalimanı`, type: 'airport', estimatedTime: 0.1 },
            { name: 'Uçuşta', type: 'transit', estimatedTime: 0.5 },
            { name: `${destination} Havalimanı`, type: 'airport', estimatedTime: 0.85 }
        );
    } else if (transportType.id === 'rail') {
        checkpoints.push(
            { name: `${origin} İstasyonu`, type: 'station', estimatedTime: 0.1 },
            { name: 'Aktarma İstasyonu', type: 'transit', estimatedTime: 0.5 },
            { name: `${destination} İstasyonu`, type: 'station', estimatedTime: 0.85 }
        );
    } else {
        checkpoints.push(
            { name: 'Transit Merkezi', type: 'hub', estimatedTime: 0.3 },
            { name: 'Dağıtım Merkezi', type: 'distribution', estimatedTime: 0.7 }
        );
    }

    checkpoints.push({
        name: `${destination} - Teslimat`,
        type: 'destination',
        estimatedTime: 1.0
    });

    return checkpoints;
}

function createSampleShipments() {
    const samples = [
        {
            origin: 'İstanbul',
            destination: 'Londra',
            distance: 2500,
            productName: 'Tekstil Koleksiyonu',
            quantity: 500,
            weight: 250,
            value: 25000,
            transportType: 'air',
            priority: 'high'
        },
        {
            origin: 'İzmir',
            destination: 'Dubai',
            distance: 3000,
            productName: 'Zeytinyağı',
            quantity: 1000,
            weight: 1000,
            value: 15000,
            transportType: 'sea',
            priority: 'normal'
        },
        {
            origin: 'Ankara',
            destination: 'Berlin',
            distance: 2200,
            productName: 'Makine Parçaları',
            quantity: 200,
            weight: 800,
            value: 50000,
            transportType: 'rail',
            priority: 'normal'
        },
        {
            origin: 'Bursa',
            destination: 'Atina',
            distance: 800,
            productName: 'Otomotiv Parçaları',
            quantity: 300,
            weight: 500,
            value: 35000,
            transportType: 'road',
            priority: 'high'
        }
    ];

    // Create shipments directly without calling createShipment (to avoid recursion)
    return samples.map((data, index) => {
        const transportType = TRANSPORT_TYPES[data.transportType.toUpperCase()] || TRANSPORT_TYPES.ROAD;
        const estimatedDuration = calculateDuration(data.distance, transportType);
        const shippingCost = calculateCost(data.weight, data.distance, transportType);

        // Offset creation time to show different progress states
        const hoursAgo = index * 12;
        const createdAt = Date.now() - (hoursAgo * 60 * 60 * 1000);

        const shipment = {
            id: `SHP_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}_${index}`,
            trackingId: generateTrackingId(),
            origin: data.origin,
            destination: data.destination,
            distance: data.distance || 1000,
            productName: data.productName,
            quantity: data.quantity,
            weight: data.weight || 100,
            value: data.value || 1000,
            transportType: transportType.id,
            carrier: 'NOMOS Logistics',
            status: 'pending',
            progress: 0,
            createdAt: createdAt,
            estimatedDuration: estimatedDuration,
            estimatedDelivery: createdAt + estimatedDuration,
            actualDelivery: null,
            shippingCost: shippingCost,
            insuranceCost: Math.round(data.value * 0.02),
            checkpoints: generateCheckpoints(data.origin, data.destination, transportType),
            currentCheckpoint: 0,
            notes: '',
            priority: data.priority || 'normal',
            insured: false
        };

        return updateShipmentProgress(shipment);
    });
}

// === GET SHIPMENT BY ID ===
export function getShipmentById(shipmentId) {
    const shipments = loadShipments();
    return shipments.find(s => s.id === shipmentId || s.trackingId === shipmentId);
}

// === GET SHIPMENTS BY STATUS ===
export function getShipmentsByStatus(status) {
    const shipments = loadShipments();
    return shipments.filter(s => s.status === status);
}

// === GET TRANSPORT TYPE INFO ===
export function getTransportTypeInfo(typeId) {
    return Object.values(TRANSPORT_TYPES).find(t => t.id === typeId) || TRANSPORT_TYPES.ROAD;
}

// === GET STATUS INFO ===
export function getStatusInfo(statusId) {
    return Object.values(SHIPMENT_STATUS).find(s => s.id === statusId) || SHIPMENT_STATUS.PENDING;
}

// === CALCULATE SHIPMENT STATS ===
export function calculateShipmentStats() {
    const shipments = loadShipments();

    return {
        total: shipments.length,
        pending: shipments.filter(s => s.status === 'pending').length,
        inTransit: shipments.filter(s => s.status === 'in_transit').length,
        delivered: shipments.filter(s => s.status === 'delivered').length,
        delayed: shipments.filter(s => s.status === 'delayed').length,
        totalValue: shipments.reduce((sum, s) => sum + s.value, 0),
        totalShippingCost: shipments.reduce((sum, s) => sum + s.shippingCost, 0)
    };
}
