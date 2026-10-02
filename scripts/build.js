/**
 * scripts/build.js
 * Generator static pentru paginile individuale de partituri (SSG).
 * Generează fișiere HTML pre-randate în folderul partituri/[id].html
 * pentru indexare SEO și previzualizări Open Graph perfecte pe YouTube/WhatsApp/Facebook.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'partituri.json');
const OUTPUT_DIR = path.join(ROOT_DIR, 'partituri');
const TEMPLATE_FILE = path.join(ROOT_DIR, 'partitura.html');

function run() {
  console.log('🚀 Inițiere generare pagini statice ByzMusic...');

  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ Fișierul data/partituri.json nu există!');
    process.exit(1);
  }

  const scores = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  console.log(`📖 S-au găsit ${scores.length} partituri.`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

  scores.forEach(score => {
    const pageTitle = `${score.titlu} (${score.glas}) — ByzMusic`;
    const desc = score.descriere || `Descarcă și ascultă partitura „${score.titlu}” în ${score.glas}, melos de ${score.autor}.`;
    
    // Înlocuire tag-uri din template
    let html = template
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`)
      .replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="${escapeHtml(desc)}">`
      );

    // Ajustare căi relative dacă fișierul este plasat în subfolderul partituri/
    // (înlocuiește href="assets/ cu href="../assets/ etc.)
    html = html
      .replace(/href="assets\//g, 'href="../assets/')
      .replace(/src="assets\//g, 'src="../assets/')
      .replace(/href="data\//g, 'href="../data/')
      .replace(/src="data\//g, 'src="../data/')
      .replace(/href="pdf\//g, 'href="../pdf/')
      .replace(/src="pdf\//g, 'src="../pdf/')
      .replace(/href="index\.html"/g, 'href="../index.html"')
      .replace(/href="adauga\.html"/g, 'href="../adauga.html"')
      .replace(/href="partitura\.html"/g, 'href="../partitura.html"');

    // Pre-injectare date de bază în HTML pentru viteza de încărcare
    html = html
      .replace(
        /<h1 id="score-title".*?>.*?<\/h1>/s,
        `<h1 id="score-title" class="hero-title" style="text-align: left; font-size: 2.2rem; margin-bottom: 0.25rem;">${escapeHtml(score.titlu)}</h1>`
      )
      .replace(
        /<span id="badge-glas".*?>.*?<\/span>/s,
        `<span id="badge-glas" class="badge-glas">🎵 ${escapeHtml(score.glas)}</span>`
      )
      .replace(
        /<span id="badge-cat".*?>.*?<\/span>/s,
        `<span id="badge-cat" class="badge-cat">${escapeHtml(score.categorie)}</span>`
      )
      .replace(
        /<div id="meta-autor".*?>.*?<\/div>/s,
        `<div id="meta-autor" style="font-weight: 600;">${escapeHtml(score.autor || 'Tradițional')}</div>`
      )
      .replace(
        /<div id="meta-slujba".*?>.*?<\/div>/s,
        `<div id="meta-slujba" style="font-weight: 600;">${escapeHtml(score.slujba || 'Bisericească')}</div>`
      );

    const outPath = path.join(OUTPUT_DIR, `${score.id}.html`);
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`  ✓ Generat: partituri/${score.id}.html`);
  });

  console.log('✅ Toate paginile statice au fost generate cu succes!');
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

run();
