# Ghid de Publicare pe Cloudflare Pages 🚀

Cloudflare Pages este cel mai rapid și stabil serviciu de găzduire statică gratuit din lume. Oferă CDN global ultra-rapid, certificat SSL (HTTPS) gratuit automat și trafic nelimitat.

---

## ⚡ Pași de Configurare (durează doar 1 minut)

### 1. Autentifică-te pe Cloudflare
Accesează panoul de control:
👉 **[https://dash.cloudflare.com/](https://dash.cloudflare.com/)**

### 2. Creează un proiect Pages nou
1. În meniul din stânga, dă click pe **Workers & Pages** (sau **Compute**).
2. Apasă pe butonul albastru **Create application** (sau **Create**).
3. Selectează fila **Pages**.
4. Apasă pe **Connect to Git** (Conectează la Git).

### 3. Selectează depozitul GitHub
1. Alege contul tău GitHub (`almeueste777-ops`).
2. Găsește și alege depozitul **`byzmusic`**.
3. Apasă **Begin setup**.

### 4. Setări de Build (Construire)
Configurează câmpurile conform instrucțiunilor de mai jos:

| Câmp | Valoare |
| :--- | :--- |
| **Project name** | `byzmusic` (sau ce nume dorești) |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | `npm run build` *(opțional, generează paginile statice)* |
| **Build output directory** | `/` *(rădăcina proiectului)* |

### 5. Salvează și Publică
- Apasă butonul **Save and Deploy**.
- În 10-20 de secunde, site-ul tău va fi live la o adresă de forma:
  👉 **`https://byzmusic.pages.dev`** *(sau numele ales)*

---

## 🔗 Cum folosești link-ul în descrierile YouTube

După ce site-ul este live pe Cloudflare Pages, când încarci un videoclip pe YouTube, pui în descriere:

```text
🎵 Partitura o găsești aici:
https://byzmusic.pages.dev/partitura.html?id=axion-patriarhal
```
sau:
```text
🎵 Partitura o găsești aici:
https://byzmusic.pages.dev/partituri/axion-patriarhal.html
```

Orice vizitator va putea:
- Să vadă partitura direct în browser pe telefon sau laptop;
- Să descarce PDF-ul cu 1 click prin butonul **Descarcă Partitura PDF**;
- Să asculte și alte cântări psaltice din același glas.

---

## 🔄 Cum se fac actualizările ulterioare?

De fiecare dată când:
1. Pui un fișier `.pdf` nou în folderul `pdf/`;
2. Adaugi cântarea în `data/partituri.json`;
3. Faci `git push` pe GitHub;

Cloudflare Pages detectează automat modificarea și **re-publică site-ul în câteva secunde fără să mai faci nimic manual!**
