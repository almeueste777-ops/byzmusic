/**
 * ByzMusic - Catalog & Aplicație Principală
 */

let allScores = [];
let activeGlas = 'toate';
let activeCat = 'toate';
let searchQuery = '';

// Inițializare
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  await loadScores();
  setupEventListeners();
});

// Încărcare date partituri
async function loadScores() {
  const container = document.getElementById('scores-grid');
  if (!container) return;

  try {
    const res = await fetch('data/partituri.json');
    if (!res.ok) throw new Error('Nu s-au putut încărca datele');
    allScores = await res.json();
    renderScores();
    updateCount();
  } catch (err) {
    console.error('Eroare la încărcarea partiturilor:', err);
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Eroare la încărcarea partiturilor</h3>
        <p>Verifică dacă fișierul data/partituri.json este disponibil.</p>
      </div>
    `;
  }
}

// Filtrare și Afișare
function renderScores() {
  const container = document.getElementById('scores-grid');
  if (!container) return;

  const filtered = allScores.filter(score => {
    // Filtru Glas
    const matchesGlas = activeGlas === 'toate' || 
      score.glas.toLowerCase().includes(activeGlas.toLowerCase()) ||
      (score.glasNum && `glas ${score.glasNum}` === activeGlas.toLowerCase());

    // Filtru Categorie
    const matchesCat = activeCat === 'toate' || 
      score.categorie.toLowerCase() === activeCat.toLowerCase();

    // Filtru Căutare
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      score.titlu.toLowerCase().includes(q) ||
      (score.subtitlu && score.subtitlu.toLowerCase().includes(q)) ||
      (score.autor && score.autor.toLowerCase().includes(q)) ||
      (score.glas && score.glas.toLowerCase().includes(q)) ||
      (score.categorie && score.categorie.toLowerCase().includes(q)) ||
      (score.taguri && score.taguri.some(t => t.toLowerCase().includes(q)));

    return matchesGlas && matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Nicio partitură găsită</h3>
        <p>Încearcă să schimbi filtrele sau termenii de căutare.</p>
      </div>
    `;
    updateCount(0);
    return;
  }

  container.innerHTML = filtered.map(createScoreCard).join('');
  updateCount(filtered.length);
}

// Creare HTML Card Partitură
function createScoreCard(score) {
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
  const scorePageUrl = `${baseUrl}/partitura.html?id=${encodeURIComponent(score.id)}`;
  const youtubeText = `Partitura o găsești aici: ${scorePageUrl}`;

  return `
    <article class="score-card" data-id="${escapeHtml(score.id)}">
      <div class="card-top">
        <span class="badge-glas">🎵 ${escapeHtml(score.glas)}</span>
        <span class="badge-cat">${escapeHtml(score.categorie || 'Cântare')}</span>
      </div>

      <h3 class="card-title">${escapeHtml(score.titlu)}</h3>
      ${score.subtitlu ? `<p class="card-subtitle">${escapeHtml(score.subtitlu)}</p>` : ''}

      <div class="card-meta">
        <div class="meta-item">
          <span class="meta-icon">👤</span>
          <span><strong>Autor:</strong> ${escapeHtml(score.autor || 'Tradițional')}</span>
        </div>
        ${score.slujba ? `
          <div class="meta-item">
            <span class="meta-icon">⛪</span>
            <span><strong>Slujbă:</strong> ${escapeHtml(score.slujba)}</span>
          </div>
        ` : ''}
        <div class="meta-item">
          <span class="meta-icon">📄</span>
          <span><strong>Pagini:</strong> ${score.pagini || 1} pag.</span>
        </div>
      </div>

      <div class="card-actions">
        <div class="btn-row">
          <a href="partitura.html?id=${encodeURIComponent(score.id)}" class="btn btn-primary">
            👁️ Deschide
          </a>
          <a href="${escapeHtml(score.pdf)}" download class="btn btn-secondary" title="Descarcă direct fișierul PDF">
            📥 Descarcă PDF
          </a>
        </div>
        <button class="btn btn-youtube-copy" onclick="copyYoutubeText('${escapeJsString(youtubeText)}')">
          📋 Copiază link pt. YouTube
        </button>
      </div>
    </article>
  `;
}

// Actualizare contor
function updateCount(count = allScores.length) {
  const countEl = document.getElementById('scores-count');
  if (countEl) {
    countEl.textContent = `${count} partitur${count === 1 ? 'ă' : 'i'} afișat${count === 1 ? 'ă' : 'e'}`;
  }
}

// Evenimente
function setupEventListeners() {
  // Input căutare
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderScores();
    });
  }

  // Filtre Glas
  document.querySelectorAll('[data-filter-glas]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-filter-glas]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeGlas = e.target.getAttribute('data-filter-glas');
      renderScores();
    });
  });

  // Filtre Categorie
  document.querySelectorAll('[data-filter-cat]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-filter-cat]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeCat = e.target.getAttribute('data-filter-cat');
      renderScores();
    });
  });
}

// Copiere text YouTube
function copyYoutubeText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Text copiat! Lipește-l în descrierea YouTube.');
  }).catch(() => {
    // Fallback clasic
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Text copiat! Lipește-l în descrierea YouTube.');
  });
}

// Notificare Toast
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${escapeHtml(message)}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Temă Întunecată / Luminoasă
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('byzmusic-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (toggleBtn) toggleBtn.textContent = '☀️';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (toggleBtn) toggleBtn.textContent = '🌙';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('byzmusic-theme', next);
      toggleBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }
}

// Utilități
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJsString(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}
