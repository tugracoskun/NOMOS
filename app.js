// NOMOS Client Side Logic

document.addEventListener('DOMContentLoaded', () => {
    console.log("NOMOS System Initialized.");

    // Navigasyon Mantığı
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Aktif sınıfını değiştir
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const page = link.getAttribute('data-page');
            loadPage(page);
        });
    });
});

function loadPage(pageName) {
    const container = document.getElementById('app-container');
    console.log(`Sayfa yükleniyor: ${pageName}`);
    
    // Şimdilik sadece text değiştiriyoruz, ileride buraya harita veya tablo gelecek
    container.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100%; flex-direction:column;">
            <h1 style="color:var(--text-dim); font-size: 3rem; opacity: 0.2;">${pageName.toUpperCase()}</h1>
            <p style="color:var(--text-dim);">Bu modül yapım aşamasında.</p>
        </div>
    `;
}