// == Bitcare Photo Downloader ==
// Dit script voegt een controlepaneel toe aan de Bitcare fotopagina,
// laat toe om alle foto's te downloaden met behoud van volgorde,
// slaat reeds gedownloade foto's lokaal op, en markeert ze visueel.

// --- Utilities: Local storage per prefix ---
function getStorageKeyForPrefix(prefix) {
  return {
    uuids: `bitcare_downloads_${prefix}`,
    counter: `bitcare_counter_${prefix}`
  };
}

function getDownloadedUUIDs(prefix) {
  const { uuids } = getStorageKeyForPrefix(prefix);
  const raw = localStorage.getItem(uuids);
  return raw ? new Set(JSON.parse(raw)) : new Set();
}

function saveDownloadedUUIDs(prefix, uuidSet) {
  const { uuids } = getStorageKeyForPrefix(prefix);
  localStorage.setItem(uuids, JSON.stringify([...uuidSet]));
}

function getPrefixCounter(prefix) {
  const { counter } = getStorageKeyForPrefix(prefix);
  return parseInt(localStorage.getItem(counter) || "0", 10);
}

function savePrefixCounter(prefix, count) {
  const { counter } = getStorageKeyForPrefix(prefix);
  localStorage.setItem(counter, count.toString());
}

function clearDownloadedData(prefix) {
  const { uuids, counter } = getStorageKeyForPrefix(prefix);
  localStorage.removeItem(uuids);
  localStorage.removeItem(counter);
}

// --- Download helper ---
function downloadFileAsync(url, fileName) {
  return new Promise((resolve) => {
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = new URL(url, window.location.origin).href;
    anchor.download = fileName;
    document.body.appendChild(anchor);

    anchor.addEventListener('click', () => {
      setTimeout(() => {
        document.body.removeChild(anchor);
        resolve();
      }, 200);
    });

    anchor.click();
  });
}

// --- Handle photo updates ---
function handlePhotoUpdates() {
  const h2 = document.querySelector(".h2");
  const prefix = h2 ? h2.textContent.trim().replaceAll(' ', '_') + '_' : 'foto_';
  updateCounterDisplay(prefix);
  updatePhotoHighlights();
}

// --- Load all photos ---
async function showAllPhotos() {
  let tries = 0;
  const h2 = document.querySelector(".h2");
  const prefix = h2 ? h2.textContent.trim().replaceAll(' ', '_') + '_' : 'foto_';

  const interval = setInterval(() => {
    const btn = document.querySelector('div.text-center.mt-3 > button.btn.btn-default');
    if (!btn || btn.disabled || tries >= 50) {
      clearInterval(interval);
      setTimeout(() => {
        handlePhotoUpdates();
        alert(`Alle foto's zijn geladen! 📷 Aantal gevonden foto's: ${getVisiblePhotoCount()}`);
      }, 2000);
    } else {
      btn.click();
      tries++;
    }
  }, 1500);
}

// --- Detect manual "Toon meer" clicks ---
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button.btn.btn-default');
  if (btn && btn.textContent.includes("Toon meer")) {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
      handlePhotoUpdates();
    }, 2000);
  }
});

// --- Utility ---
function getVisiblePhotoCount() {
  return document.querySelectorAll('.photo-gallery-grid-item img[src*="/photos/"]').length;
}

// --- Download all images ---
async function processImagesAsync(prefix) {
  const images = document.querySelectorAll('img[src^="/photos/"]');
  const imageArray = Array.from(images).reverse();

  const downloaded = getDownloadedUUIDs(prefix);
  let counter = getPrefixCounter(prefix);

  for (let img of imageArray) {
    if (!img.src.includes("/medium.jpg")) continue;

    const uuidMatch = img.src.match(/\/photos\/([a-zA-Z0-9]+)\//);
    if (!uuidMatch) continue;

    const uuid = uuidMatch[1];
    if (downloaded.has(uuid)) {
      console.log(`Skipping already downloaded: ${uuid}`);
      continue;
    }

    const url = img.src.replace('medium', 'original');
    const fileName = `${prefix}${String(counter + 1).padStart(5, '0')}.jpg`;

    console.log("Downloading", url, fileName);
    await downloadFileAsync(url, fileName);

    downloaded.add(uuid);
    counter++;
    saveDownloadedUUIDs(prefix, downloaded);
    savePrefixCounter(prefix, counter);
    updateCounterDisplay(prefix);
  }

  alert("Download voltooid!");
  updatePhotoHighlights();
}

// --- Mark downloaded photos ---
function updatePhotoHighlights() {
  const h2 = document.querySelector(".h2");
  const prefix = h2 ? h2.textContent.trim().replaceAll(' ', '_') + '_' : 'foto_';
  const downloaded = getDownloadedUUIDs(prefix);

  const images = document.querySelectorAll('.photo-gallery-grid-item img[src*="/photos/"]');
  images.forEach(img => {
    const match = img.src.match(/\/photos\/([a-zA-Z0-9]+)\//);
    const wrapper = img.closest('.photo-gallery-grid-item');
    if (!match || !wrapper) return;

    const uuid = match[1];
    const existingMark = wrapper.querySelector('.bitcare-downloaded-mark');
    if (existingMark) existingMark.remove();

    if (downloaded.has(uuid)) {
      const badge = document.createElement('div');
      badge.className = 'bitcare-downloaded-mark';
      badge.textContent = '✅';
      badge.style.position = 'absolute';
      badge.style.top = '4px';
      badge.style.right = '4px';
      badge.style.fontSize = '16px';
      badge.style.background = 'rgba(255, 255, 255, 0.8)';
      badge.style.borderRadius = '4px';
      badge.style.padding = '0 4px';
      badge.style.zIndex = '10';

      wrapper.style.position = 'relative';
      wrapper.appendChild(badge);
    }
  });
}

// --- UI Panel ---
function createControlPanel() {
  const existingPanel = document.getElementById('bitcare-download-panel');
  if (existingPanel) return;

  const panel = document.createElement('div');
  panel.id = 'bitcare-download-panel';
  panel.style.position = 'fixed';
  panel.style.top = '20px';
  panel.style.right = '20px';
  panel.style.width = '220px';
  panel.style.background = '#fff';
  panel.style.border = '1px solid #ccc';
  panel.style.borderRadius = '10px';
  panel.style.padding = '10px';
  panel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  panel.style.zIndex = 9999;
  panel.style.fontFamily = 'sans-serif';
  panel.style.fontSize = '14px';
  panel.style.boxSizing = 'border-box';
  panel.style.cursor = 'move';

  const h2 = document.querySelector(".h2");
  const prefix = h2 ? h2.textContent.trim().replaceAll(' ', '_') + '_' : 'foto_';

  const titleBar = document.createElement('div');
  titleBar.style.display = 'flex';
  titleBar.style.justifyContent = 'space-between';
  titleBar.style.alignItems = 'center';
  titleBar.style.marginBottom = '8px';
  titleBar.innerHTML = `<strong>📸 Photo Downloader</strong>`;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.border = 'none';
  closeBtn.style.background = 'transparent';
  closeBtn.style.fontSize = '18px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => panel.remove();
  titleBar.appendChild(closeBtn);

  const prefixDisplay = document.createElement('div');
  prefixDisplay.textContent = `Prefix: ${prefix}`;
  prefixDisplay.style.marginBottom = '8px';

  const counterDisplay = document.createElement('div');
  counterDisplay.id = 'bitcare-download-counter';
  counterDisplay.style.marginBottom = '8px';
  counterDisplay.style.whiteSpace = 'pre-line';

  const loadBtn = document.createElement('button');
  loadBtn.textContent = "📂 Laad alles";
  loadBtn.style.marginBottom = '8px';
  loadBtn.style.width = '100%';
  loadBtn.onclick = async () => {
    await showAllPhotos();
    updateCounterDisplay(prefix);
  };

  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = "💾 Download";
  downloadBtn.style.marginBottom = '8px';
  downloadBtn.style.width = '100%';
  downloadBtn.onclick = async () => {
    await processImagesAsync(prefix);
    updateCounterDisplay(prefix);
  };

  const resetBtn = document.createElement('button');
  resetBtn.textContent = "❌ Reset";
  resetBtn.style.width = '100%';
  resetBtn.onclick = () => {
    clearDownloadedData(prefix);
    updateCounterDisplay(prefix);
    updatePhotoHighlights();
    alert(`Downloadgeschiedenis gewist voor prefix: ${prefix}`);
  };

  panel.appendChild(titleBar);
  panel.appendChild(prefixDisplay);
  panel.appendChild(counterDisplay);
  panel.appendChild(loadBtn);
  panel.appendChild(downloadBtn);
  panel.appendChild(resetBtn);

  document.body.appendChild(panel);

  updateCounterDisplay(prefix);
  updatePhotoHighlights();
  makePanelDraggable(panel);
}

function updateCounterDisplay(prefix) {
  const label = document.getElementById('bitcare-download-counter');
  if (!label) return;
  const visible = getVisiblePhotoCount();
  const downloaded = getDownloadedUUIDs(prefix).size;
  const lastNumber = getPrefixCounter(prefix);
  label.textContent = `📷 Zichtbaar: ${visible}\n💾 Gedownload: ${downloaded} (laatste nr: ${lastNumber})`;
}

function makePanelDraggable(panel) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  panel.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.getBoundingClientRect().left;
    offsetY = e.clientY - panel.getBoundingClientRect().top;
    panel.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      panel.style.left = `${e.clientX - offsetX}px`;
      panel.style.top = `${e.clientY - offsetY}px`;
      panel.style.right = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function isOnPhotosTab() {
  return location.pathname.startsWith("/contacts/") && location.hash.endsWith("#/photos");
}

function removeControlPanel() {
  const panel = document.getElementById('bitcare-download-panel');
  if (panel) {
    panel.remove();
    console.log("[Bitcare Downloader] Panel removed (left #/photos)");
  }
}

function waitForPhotosPageAndInit() {
  if (!isOnPhotosTab()) {
    removeControlPanel();
    return;
  }

  const existingPanel = document.getElementById('bitcare-download-panel');
  if (existingPanel) return;

  console.log("[Bitcare Downloader] Waiting for content to load...");

  const interval = setInterval(() => {
    const h2 = document.querySelector(".h2");
    const photoImgs = document.querySelectorAll('img[src*="/photos/"]');

    if (h2 && photoImgs.length > 0) {
      clearInterval(interval);
      console.log("[Bitcare Downloader] DOM ready — creating panel");
      createControlPanel();
    }
  }, 500);

  setTimeout(() => clearInterval(interval), 10000);
}

window.addEventListener('load', waitForPhotosPageAndInit);
window.addEventListener('hashchange', waitForPhotosPageAndInit);
