# bitcare-photos
A simple JavaScript trick to download all photos from your child's bitcare profile.

Step-by-step instructions in [English](#instructions) & [Nederlands](#instructies).

## Instructions

### Step 0 - Login to Bitcare

### Step 1 - Navigate to the Photos Page

Only displayed photos will be downloaded. 
To download all photos keep pressing the `Show more` button until all photos are shown.

### Step 2 - Prepare your browser

#### Safari:
1.  Enable developer tools:

   *   Navigate to settings
   *   Click on the `Advanced`-tab
   *   Enable `Show features for web developers`

2.  Open the JavaScript console:

   *   In the menu bar, go to `Develop` > `Show JavaScript Console`

#### Chrome or Brave:
1.  Disable file location pop-ups:

   *   Navigate to settings
   *   Go to the `Downloads`-tab
   *   Disable `Ask where to save each file before downloading`

2.  Open the JavaScript console:

   *   In the menu bar, go to `View` > `Developer` > `Show JavaScript Console`

### Step 3 - Download all photos

Copy-paste the [JavaScript code](#javascript-code) below, press enter and wait. 
Photos shall be appear in your downloads.

### Additional Notes

*   Photos have their unique id as filename and the original/full resolution.
*   The download order shall be from old to new.
    As such, the file timestamp provides the order of appearence on bitcare (sort by date, old to new).


## Instructies

### Stap 0 - Login op Bitcare

### Stap 1 - Ga naar de Foto Pagina

Alleen weergegeven foto's worden gedownload.
Om alle foto's te downloaden, blijf op de `Meer tonen`-knop drukken totdat alle foto's zichtbaar zijn.

### Stap 2 - Bereid je browser voor

#### Safari:
1.  Schakel de ontwikkelaarstools in:

   *   Ga naar instellingen
   *   Klik op het tabblad `Geavanceerd`
   *   Schakel `Functies tonen voor webontwikkelaars` in

2.  Open de JavaScript-console:

   *   In de menubalk, ga naar `Ontwikkelen` > `JavaScript-console tonen`

#### Chrome of Brave:
1.  Schakel pop-ups voor bestandslocatie uit:

   *   Ga naar instellingen
   *   Ga naar het tabblad `Downloads`
   *   Schakel `Vragen waar elk bestand moet worden opgeslagen voordat het wordt gedownload` uit

2.  Open de JavaScript-console:

   *   In de menubalk, ga naar `Weergave` > `Ontwikkelaar` > `JavaScript-console tonen`

### Stap 3 - Download alle foto's

Kopieer-plak de [JavaScript-code](#javaScript-code) hieronder, druk op Enter en wacht.
Foto's zullen verschijnen in je downloads.

### Aanvullende notities

*   Foto's hebben hun unieke ID als bestandsnaam en zijn in de originele/volle resolutie.
*   De downloadvolgorde zal van oud naar nieuw zijn.
    Zo biedt de bestandstijd de volgorde van verschijning op bitcare (sorteer op datum, oud naar nieuw).


## JavaScript code
```javascript
// Function to download a file asynchronously
function downloadFileAsync(url, fileName) {
  return new Promise((resolve, reject) => {
    var anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.setAttribute("id", fileName);
    document.body.appendChild(anchor);

    anchor.href = url;
    anchor.download = fileName;

    anchor.addEventListener('click', function() {
      setTimeout(() => {
        document.body.removeChild(anchor);
        resolve();
      }, 150); // Adjust the delay as needed
    });

    anchor.click();
  });
}

// Function to process images asynchronously with an optional prefix and reversed order
async function processImagesAsync(prefix = '', reverseOrder = true) {
  // Load all images
  var images = document.querySelectorAll('img[src^="/photos/"]');
  
  // Convert NodeList to an array and reverse it if needed
  var imageArray = Array.from(images);
  if (reverseOrder) {
    imageArray.reverse();
  }

  for (var img of imageArray) {
    // Skip any image that does not ends with "/medium.jpg".
    if (!img.src.includes("/medium.jpg")) {
      continue;
    }

    // Set the url to the original image and the filenNme based on the numeric part of the url
    var url = img.src.replace('medium', 'original');
    var fileName = prefix + url.replace('https://app.bitcare.com/photos/', '').replace('/original', '');

    // Provide some feedback of the file that shall be downloaded
    console.log(url, fileName);

    // Use await to wait for the download to complete before processing the next image
    await downloadFileAsync(url, fileName);
  }
}
// Set the prefix to your child's name (white spaces are replaced by underscores).
var prefix = document.querySelector(".h2").textContent.replaceAll(' ', '_') + '_';

// Call the asynchronous function with an optional prefix and reversed order
processImagesAsync(prefix, true);
```
