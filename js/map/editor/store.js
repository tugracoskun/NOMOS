// Editor State Management
const savedData = JSON.parse(localStorage.getItem('nomos_map_data')) || {};

export const state = {
    isDevMode: false,
    currentFeature: null,
    currentLayer: null,
    mapRef: null,
    layerRef: null,
    selectedRegions: new Set(),
    changeHistory: [],
    currentTab: 'single', // 'single', 'multi', 'data', 'history', 'market'
    savedData: savedData
};

export function getSavedData() {
    return state.savedData;
}

export function saveToStorage() {
    localStorage.setItem('nomos_map_data', JSON.stringify(state.savedData));
}

export function addToHistory(type, description) {
    state.changeHistory.push({
        type,
        description,
        timestamp: Date.now()
    });

    // Son 50 değişikliği tut
    if (state.changeHistory.length > 50) {
        state.changeHistory.shift();
    }
}
