/**
 * ByzMusic - Generator și Adăugare Partituri Noi
 */

let existingScores = [];

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  await loadCurrentScores();
  setupFormListeners();
  updatePreviewAndCode();
});

async function loadCurrentScores() {
  try {
    const res = await fetch('data/partituri.json');
    if (res.ok) {
      existingScores = await res.json();
    }
  } catch (e) {
    console.warn('Nu s-a putut citi lista existentă:', e);
  }
}

function setupFormListeners() {
  const form = document.getElementById('score-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', updatePreviewAndCode);
  });

  // Auto-slug din titlu dacă id-ul nu este tastat manual
  const titleInput = document.getElementById('input-titlu');
  const idInput = document.getElementById('input-id');
  if (titleInput && idInput) {
    titleInput.addEventListener('input', () => {
      if (!idInput.dataset.manual) {
        idInput.value = generateSlug(titleInput.value);
        updatePdfName();
        updatePreviewAndCode();
      }
    });
    idInput.addEventListener('input', () => {
      idInput.dataset.manual = 'true';
      updatePdfName();
    });
  }

  // Buton copiază JSON
  const copyJsonBtn = document.getElementById('btn-copy-json');
  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', () => {
      const code = document.getElementById('json-output').textContent;
      navigator.clipboard.writeText(code).then(() => {
        showToast('Codul JSON a fost copiat în clipboard!');
      });
    });
  }

  // Buton copiază YouTube Text
  const copyYtBtn = document.getElementById('btn-copy-yt');
  if (copyYtBtn) {
    copyYtBtn.addEventListener('click', () => {
      const ytText = document.getElementById('preview-yt-text').textContent;
      navigator.clipboard.writeText(ytText).then(() => {
        showToast('Textul pentru descrierea YouTube a fost copiat!');
      });
    });
  }

  // Buton descarcă partituri.json actualizat
  const downloadJsonBtn = document.getElementById('btn-download-json');
  if (downloadJsonBtn) {
    downloadJsonBtn.addEventListener('click', downloadUpdatedJson);
  }
}

function updatePdfName() {
  const id = document.getElementById('input-id').value;
  const pdfInput = document.getElementById('input-pdf');
  if (pdfInput && !pdfInput.dataset.manual && id) {
    pdfInput.value = `pdf/${id}.pdf`;
  }
}

function getFormData() {
  const titlu = document.getElementById('input-titlu')?.value.trim() || 'Titlu Partitură';
  const subtitlu = document.getElementById('input-subtitlu')?.value.trim() || '';
  const id = document.getElementById('input-id')?.value.trim() || generateSlug(titlu);
  const glas = document.getElementById('input-glas')?.value || 'Glasul 1';
  const autor = document.getElementById('input-autor')?.value.trim() || 'Tradițional';
  const categorie = document.getElementById('input-categorie')?.value || 'Sfânta Liturghie';
  const slujba = document.getElementById('input-slujba')?.value.trim() || 'Sfânta Liturghie';
  const notatie = document.getElementById('input-notatie')?.value || 'Psaltică';
  const pagini = parseInt(document.getElementById('input-pagini')?.value) || 1;
  const pdf = document.getElementById('input-pdf')?.value.trim() || `pdf/${id}.pdf`;
  const youtubeUrl = document.getElementById('input-youtube')?.value.trim() || '';
  const descriere = document.getElementById('input-descriere')?.value.trim() || '';
  
  const youtubeId = extractYouTubeId(youtubeUrl);
  const glasNum = parseInt(glas.replace(/\D/g, '')) || 1;

  return {
    id,
    titlu,
    subtitlu,
    glas,
    glasNum,
    autor,
    categorie,
    slujba,
    notatie,
    pagini,
    data: new Date().toISOString().split('T')[0],
    pdf,
    youtubeId,
    descriere: descriere || `${titlu} în ${glas}, melos de ${autor}.`,
    taguri: [
      titlu.toLowerCase(),
      glas.toLowerCase(),
      autor.toLowerCase(),
      categorie.toLowerCase()
    ].filter(Boolean)
  };
}

function updatePreviewAndCode() {
  const data = getFormData();

  // Actualizare Live Preview Card
  const previewCard = document.getElementById('preview-card');
  if (previewCard) {
    previewCard.innerHTML = `
      <div class="card-top">
        <span class="badge-glas">🎵 ${escapeHtml(data.glas)}</span>
        <span class="badge-cat">${escapeHtml(data.categorie)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(data.titlu)}</h3>
      ${data.subtitlu ? `<p class="card-subtitle">${escapeHtml(data.subtitlu)}</p>` : ''}
      <div class="card-meta">
        <div class="meta-item"><span>👤 <strong>Autor:</strong> ${escapeHtml(data.autor)}</span></div>
        <div class="meta-item"><span>⛪ <strong>Slujbă:</strong> ${escapeHtml(data.slujba)}</span></div>
        <div class="meta-item"><span>📄 <strong>Pagini:</strong> ${data.pagini} pag.</span></div>
      </div>
      <div class="btn-row" style="margin-top: 1rem;">
        <span class="btn btn-primary" style="pointer-events: none;">👁️ Deschide</span>
        <span class="btn btn-secondary" style="pointer-events: none;">📥 Descarcă PDF</span>
      </div>
    `;
  }

  // Actualizare YouTube Preview
  const basePath = window.location.pathname.replace(/\/[^\/]*$/, '');
  const scoreUrl = `${window.location.origin}${basePath}/partitura.html?id=${encodeURIComponent(data.id)}`;
  const ytText = `Partitura o găsești aici: ${scoreUrl}`;
  
  const ytPreviewEl = document.getElementById('preview-yt-text');
  if (ytPreviewEl) {
    ytPreviewEl.textContent = ytText;
  }

  // Actualizare Cod JSON
  const jsonOutput = document.getElementById('json-output');
  if (jsonOutput) {
    jsonOutput.textContent = JSON.stringify(data, null, 2);
  }
}

function downloadUpdatedJson() {
  const newScore = getFormData();
  // Filtrăm dacă exista deja cu același id
  const updatedList = [newScore, ...existingScores.filter(s => s.id !== newScore.id)];
  
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(updatedList, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "partituri.json");
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();

  showToast('Fișierul partituri.json a fost descărcat! Înlocuiește-l în folderul data/');
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // eliminare diacritice
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function extractYouTubeId(url) {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : (url.length === 11 ? url : '');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
