// --- Download helper ---
function downloadFileAsync(url, fileName) {
  return new Promise((resolve) => {
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);

    anchor.addEventListener('click', () => {
      setTimeout(() => {
        document.body.removeChild(anchor);
        resolve();
      }, 150);
    });

    anchor.click();
  });
}

// --- Load all "Toon meer" buttons ---
async function showAllPhotos() {
  let tries = 0;
  while (true) {
    const btn = [...document.querySelectorAll("button")]
      .find(b => b.textContent.trim() === "Toon meer");

    if (!btn || btn.disabled || tries > 30) break;

    btn.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    tries++;
  }
  alert("Alle foto's zijn geladen!");
}

// --- Process and download all images ---
async function processImagesAsync(prefix = '', useCounter = true, offsetCounter = 0) {
  const images = document.querySelectorAll('img[src^="/photos/"]');
  const imageArray = Array.from(images).reverse();

  for (let i = 0; i < imageArray.length; i++) {
    const img = imageArray[i];
    if (!img.src.includes("/medium.jpg")) continue;

    const url = img.src.replace('medium', 'original');
    const fileName = useCounter
      ? `${prefix}${(i + offsetCounter).toString().padStart(5, '0')}.jpg`
      : prefix + url.replace('https://app.bitcare.com/photos/', '').replace('/original', '');

    console.log(url, fileName);
    await downloadFileAsync(url, fileName);
  }

  alert("Download voltooid!");
}

// --- Add UI panel with buttons ---
function createControlPanel() {
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.top = '20px';
  panel.style.right = '20px';
  panel.style.background = '#fff';
  panel.style.border = '1px solid #ccc';
  panel.style.borderRadius = '10px';
  panel.style.padding = '10px';
  panel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  panel.style.zIndex = 9999;

  const loadBtn = document.createElement('button');
  loadBtn.textContent = "📂 Laad alle foto's";
  loadBtn.style.marginBottom = '8px';
  loadBtn.onclick = showAllPhotos;

  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = "💾 Download alle foto's";
  downloadBtn.onclick = async () => {
    const h2 = document.querySelector(".h2");
    const prefix = h2 ? h2.textContent.trim().replaceAll(' ', '_') + '_' : '';
    await processImagesAsync(prefix, true, 0);
  };

  panel.appendChild(loadBtn);
  panel.appendChild(document.createElement('br'));
  panel.appendChild(downloadBtn);
  document.body.appendChild(panel);
}

// --- Initialize when page loads ---
window.addEventListener('load', () => {
  createControlPanel();
});
