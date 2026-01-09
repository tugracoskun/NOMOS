// GELİŞMİŞ HARİTA EDİTÖRÜ V2.0 - MODULAR IMPORT
// Bu dosya artik 'js/map/editor/' klasorundeki modülleri dışarı aktaran bir köprüdür.

export { getSavedData } from './editor/store.js';
export { initEditor, isEditorActive, openEditor, toggleDevMode } from './editor/ui.js';
export { toggleRegionSelection } from './editor/actions.js';

// Eğer başka yerlerden import ediliyorsa diye diğer yardımcı fonksiyonları da açabiliriz,
// ama şu anlık main.js sadece initEditor ve getSavedData kullanıyor.