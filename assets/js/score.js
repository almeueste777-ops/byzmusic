/**
 * ByzMusic - Pagina de Vizualizare Partitură Individuală
 */

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  const scoreId = getScoreIdFromUrl();
  if (!scoreId) {
    showError('Nu a fost specificată nicio partitură.');
    return;
  }
  await loadAndRenderScore(scoreId);
});

// Extragere ID din parametrii URL sau din calea fișierului
function getScoreIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get('id');
  if (paramId) return paramId;

  // Dacă suntem pe /partituri/nume-partitura.html
  const pathParts = window.location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1] || '';
  if (lastPart.endsWith('.html') && lastPart !== 'partitura.html') {
    return decodeURIComponent(lastPart.replace(/\.html$/, ''));
  }
  return null;
}

// Încărcare și Randare Partitură
async function loadAndRenderScore(scoreId) {
  try {
    const isInSubfolder = window.location.pathname.includes('/partituri/');
    const dataPath = isInSubfolder ? '../data/partituri.json' : 'data/partituri.json';
    const res = await fetch(dataPath);
    if (!res.ok) throw new Error('Nu s-a putut citi catalogul de partituri.');
    const scores = await res.json();
    const score = scores.find(s => s.id === scoreId);

    if (!score) {
      showError(`Partitura cu identificatorul „${scoreId}” nu a fost găsită.`);
      return;
    }

    renderScoreDetails(score, scores);
  } catch (err) {
    console.error(err);
    showError('A apărut o problemă la încărcarea partiturii.');
  }
}

// Randare efectivă a conținutului
function renderScoreDetails(score, allScores) {
  // Titlu pagină
  document.title = `${score.titlu} (${score.glas}) — ByzMusic`;

  // Breadcrumbs & Titlu
  const breadcrumbCat = document.getElementById('breadcrumb-cat');
  if (breadcrumbCat) breadcrumbCat.textContent = score.categorie || 'Partituri';

  const scoreTitle = document.getElementById('score-title');
  if (scoreTitle) scoreTitle.textContent = score.titlu;

  const scoreSubtitle = document.getElementById('score-subtitle');
  if (scoreSubtitle) {
    if (score.subtitlu) {
      scoreSubtitle.textContent = score.subtitlu;
      scoreSubtitle.style.display = 'block';
    } else {
      scoreSubtitle.style.display = 'none';
    }
  }

  // Badges
  const badgeGlas = document.getElementById('badge-glas');
  if (badgeGlas) badgeGlas.textContent = `🎵 ${score.glas}`;

  const badgeCat = document.getElementById('badge-cat');
  if (badgeCat) badgeCat.textContent = score.categorie || 'Cântare';

  // Metadate
  setText('meta-autor', score.autor || 'Tradițional');
  setText('meta-slujba', score.slujba || 'Bisericească');
  setText('meta-notatie', score.notatie || 'Psaltică (Bizantină)');
  setText('meta-pagini', `${score.pagini || 1} pagini`);
  setText('score-descriere', score.descriere || 'Partitură disponibilă pentru descărcare și studiu.');

  // URL-ul complet al acestei pagini
  const currentUrl = window.location.href;
  const youtubeText = `Partitura o găsești aici: ${currentUrl}`;

  // Câmpul pentru descrierea YouTube
  const ytInput = document.getElementById('yt-copy-input');
  if (ytInput) ytInput.value = youtubeText;

  const ytBtn = document.getElementById('yt-copy-btn');
  if (ytBtn) {
    ytBtn.onclick = () => {
      copyToClipboard(youtubeText, 'Textul pentru descrierea YouTube a fost copiat!');
    };
  }

  // PDF Viewer & Download Paths
  const isInSubfolder = window.location.pathname.includes('/partituri/');
  const pdfPath = (isInSubfolder && !score.pdf.startsWith('http') && !score.pdf.startsWith('/'))
    ? `../${score.pdf}`
    : score.pdf;

  // Butoane PDF
  const downloadBtn = document.getElementById('btn-download-pdf');
  if (downloadBtn) {
    downloadBtn.href = pdfPath;
    downloadBtn.setAttribute('download', `${score.id}.pdf`);
  }

  const openNewTabBtn = document.getElementById('btn-open-pdf');
  if (openNewTabBtn) {
    openNewTabBtn.href = pdfPath;
  }

  // PDF Viewer Frame
  const pdfFrame = document.getElementById('pdf-frame');
  if (pdfFrame) {
    pdfFrame.src = `${pdfPath}#toolbar=1&navpanes=0&view=FitH`;
  }

  // Fallback link pentru dispozitive mobile
  const pdfFallback = document.getElementById('pdf-fallback-link');
  if (pdfFallback) {
    pdfFallback.href = pdfPath;
  }

  // YouTube Video Embed (dacă este furnizat id)
  const videoSection = document.getElementById('video-section');
  const videoFrame = document.getElementById('video-frame');
  if (score.youtubeId && videoSection && videoFrame) {
    videoFrame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(score.youtubeId)}`;
    videoSection.style.display = 'block';
  } else if (videoSection) {
    videoSection.style.display = 'none';
  }

  // Partituri Recomandate (același glas sau categorie)
  renderRelatedScores(score, allScores);
}

// Partituri Recomandate
function renderRelatedScores(currentScore, allScores) {
  const container = document.getElementById('related-grid');
  if (!container) return;

  const related = allScores.filter(s => s.id !== currentScore.id && (s.glas === currentScore.glas || s.categorie === currentScore.categorie)).slice(0, 3);
  if (related.length === 0) {
    const parent = document.getElementById('related-section');
    if (parent) parent.style.display = 'none';
    return;
  }

  container.innerHTML = related.map(s => `
    <article class="score-card" style="padding: 1.25rem;">
      <div class="card-top">
        <span class="badge-glas" style="font-size: 0.7rem;">${escapeHtml(s.glas)}</span>
        <span class="badge-cat" style="font-size: 0.7rem;">${escapeHtml(s.categorie)}</span>
      </div>
      <h4 style="font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 0.5rem;">${escapeHtml(s.titlu)}</h4>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">👤 ${escapeHtml(s.autor || 'Tradițional')}</p>
      <a href="partitura.html?id=${encodeURIComponent(s.id)}" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">
        👁️ Vezi Partitura
      </a>
    </article>
  `).join('');
}

// Mesaj de Eroare
function showError(message) {
  const main = document.getElementById('score-main-container');
  if (!main) return;
  main.innerHTML = `
    <div class="empty-state" style="margin: 3rem auto; max-width: 600px;">
      <div class="empty-icon">📜</div>
      <h2>Partitură negăsită</h2>
      <p style="margin: 1rem 0 1.5rem; color: var(--text-muted);">${escapeHtml(message)}</p>
      <a href="index.html" class="btn btn-primary">
        ← Înapoi la Biblioteca de Partituri
      </a>
    </div>
  `;
}

// Copiere în Clipboard
function copyToClipboard(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(successMsg);
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

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
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

// Temă
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
