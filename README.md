# ByzMusic 🎵 — Partituri de Muzică Psaltică & Bizantină

Site static modern, ultrarapid și elegant, creat special pentru a găzdui partituri psaltice în format PDF și a oferi link-uri directe de descărcare și vizualizare pentru descrierile videoclipurilor de pe **YouTube**.

---

## 🎯 Scopul Proiectului

Când postezi un videoclip pe YouTube cu o cântare psaltică, pui în descriere:
```text
Partitura o găsești aici: https://byzmusic.pages.dev/partitura.html?id=axion-patriarhal
```
sau:
```text
Partitura o găsești aici: https://byzmusic.pages.dev/partituri/axion-patriarhal.html
```

Vizitatorul care dă click pe link:
1. Vede **titlul**, **glasul**, **autorul/melosul** și categoria liturgică.
2. Vizualizează partitura direct în browser (computer sau telefon) prin **PDF viewer-ul integrat**.
3. O poate descărca cu **1 singur click** (PDF de înaltă rezoluție).
4. Poate reasculta videoclipul YouTube direct pe pagină.

---

## ✨ Funcționalități Principale

- 📜 **Catalog Complet & Căutare Instantă**: Filtrare automată în timp real după Glas (Glasul 1 - Glasul 8), categorie liturgică (Axioane, Heruvice, Polieleu, etc.) și autor.
- 👁️ **Vizualizator PDF Integrat**: Toolbar cu zoom, vizualizare pe ecran complet și buton de descărcare dedicat.
- 📋 **Generator de Link-uri YouTube**: Fiecare pagină are un buton de copiat cu un click textul pentru descrierea YouTube.
- ➕ **Pagină Generator `adauga.html`**: Formular vizual unde introduci datele unei partituri noi și primești instant codul JSON și textul pentru YouTube.
- 🌓 **Suport Temă Întunecată / Luminoasă**: Comutare automată și manuală cu paletă cromatică bizantină (roșu imperial bizantin, auriu și fildeș).
- ⚡ **100% Static & Gratuit**: Fără baze de date, fără costuri de server. Găzduire gratuită pe **GitHub Pages** și **Cloudflare Pages**.

---

## 📁 Structura Fișierelor

```
byzmusic/
├── index.html               # Pagina principală / Catalogul de partituri
├── partitura.html           # Vizualizatorul universal dinamic de partitură (?id=...)
├── adauga.html              # Generatorul vizual pentru adăugarea partiturilor noi
├── data/
│   └── partituri.json       # Baza de date statică cu toate partiturile
├── pdf/
│   └── axion-patriarhal.pdf # Fișierele PDF cu partiturile reale
├── partituri/               # Pagini HTML statice generate pentru SEO & share
│   ├── axion-patriarhal.html
│   └── ...
├── assets/
│   ├── css/style.css        # Stiluri moderne cu temă bizantină
│   ├── js/app.js            # Filtre și căutare catalog
│   ├── js/score.js          # Logică pagină partitură & PDF embed
│   ├── js/admin.js          # Generator partituri noi
│   └── img/logo.svg         # Emblema bizantină ByzMusic
└── scripts/
    └── build.js             # Generator pagini statice SSG (opțional)
```

---

## ➕ Cum adaugi o partitură nouă

### Metoda 1: Folosind pagina `adauga.html` (Recomandat)
1. Deschide `adauga.html` în browser.
2. Completează datele: Titlu, Glas, Autor, Categorie, etc.
3. Apasă **„Descarcă fișierul partituri.json actualizat”** și salvează-l în folderul `data/`.
4. Pune fișierul PDF în folderul `pdf/`.
5. Fă `git add`, `git commit -m "Adăugat partitură"` și `git push`.
6. Site-ul pe Cloudflare Pages se actualizează automat în câteva secunde!

### Metoda 2: Direct în `data/partituri.json`
Adaugă un bloc nou la începutul fișierului `data/partituri.json`:
```json
{
  "id": "cantare-noua",
  "titlu": "Titlu Cântare",
  "subtitlu": "Descriere scurtă",
  "glas": "Glasul 5",
  "glasNum": 5,
  "autor": "Compozitor",
  "categorie": "Heruvice",
  "slujba": "Sfânta Liturghie",
  "notatie": "Psaltică",
  "pagini": 4,
  "data": "2026-10-02",
  "pdf": "pdf/cantare-noua.pdf",
  "youtubeId": "COD_YOUTUBE",
  "descriere": "Descriere...",
  "taguri": ["heruvic", "glas 5"]
}
```

---

## 🌐 Găzduire pe Cloudflare Pages

Consultă fișierul detaliat [DEPLOY_CLOUDFLARE.md](DEPLOY_CLOUDFLARE.md) pentru pașii exacți de configurare în 60 de secunde pe Cloudflare Pages.
