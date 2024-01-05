# bitcare-photos
A simple JavaScript solution to download all photos automatically from your child's bitcare profile.

Step-by-step instructions in [English](#instructions) & [Nederlands](#instructies).

## Instructions

### Step 0: Login to Bitcare

### Step 1: Navigate to the Photos Page

- Only displayed photos will be downloaded.
- To download all photos, continuously press the `Show more` button until all photos are shown.

### Step 2: Prepare your browser

#### Safari:
1. Enable developer tools:
   - Navigate to settings.
   - Click on the `Advanced` tab.
   - Enable `Show Develop menu in the menu bar`.

2. Open the JavaScript console:
   - In the menu bar, go to `Develop` > `Show JavaScript Console`.

#### Chrome or Brave:
1. Disable file location pop-ups:
   - Navigate to settings.
   - Go to the `Downloads` tab.
   - Disable `Ask where to save each file before downloading`.

2. Open the JavaScript console:
   - In the menu bar, go to `View` > `Developer` > `Show JavaScript Console`.

### Step 3: Download all photos

Copy-paste the [JavaScript code](#javascript-code) into the console (after the `>` sign), press enter, and wait. 
Photos will appear in your downloads.

### Additional Notes

- Photos are in the original/full resolution.
- The download order is from oldest to newest.
- The default `prefix` of each photo is your child's name. Modify the variable `prefix` to set an alternative prefix. Leave it blank to disable.
- The filename is either based on the unique ID, as defined by Bitcare, or based on a counter.
   * `useCounter=true` (default) sets the filenames based on a counter to preserve the order of appearance on Bitcare.
   * Optionally provide an `offsetCounter` value to start counting from a specific value (defaults to `0`).
   * `useCounter=false` disables renaming all photos and uses the unique ID.
     Sort the photos with the unique ID by date, old to new, to see the order of appearance on the Bitcare photos page.

## Instructies

### Stap 0: Log in op Bitcare

### Stap 1: Ga naar de Foto's Pagina

- Alleen weergegeven foto's worden gedownload.
- Om alle foto's te downloaden, blijf op de `Meer tonen` knop drukken totdat alle foto's worden getoond.

### Stap 2: Bereid je browser voor

#### Safari:
1. Schakel ontwikkelaarshulpmiddelen in:
   - Ga naar instellingen.
   - Klik op het tabblad `Geavanceerd`.
   - Schakel `Toon Ontwikkel-menu in menubalk` in.

2. Open de JavaScript-console:
   - In de menubalk, ga naar `Ontwikkel` > `Toon JavaScript-console`.

#### Chrome of Brave:
1. Schakel pop-ups voor bestandslocaties uit:
   - Ga naar instellingen.
   - Ga naar het tabblad `Downloads`.
   - Schakel `Vragen waar elk bestand moet worden opgeslagen` uit.

2. Open de JavaScript-console:
   - In de menubalk, ga naar `Weergave` > `Ontwikkelaar` > `Toon JavaScript-console`.

### Stap 3: Download alle foto's

Kopieer en plak de [JavaScript-code](#javascript-code) in de console (na het `>` teken), druk op enter en wacht.
De foto's verschijnen in je downloads.

### Aanvullende notities

- Foto's zijn in de originele/volle resolutie.
- De downloadvolgorde is van oud naar nieuw.
- De standaard `prefix` van elke foto is de naam van je kind. Pas de variabele `prefix` aan om een alternatieve voorvoegsel in te stellen. Laat het leeg om uit te schakelen.
- De bestandsnaam is gebaseerd op de unieke ID, zoals gedefinieerd door Bitcare, of op een teller.
   * `useCounter=true` (standaard) stelt de bestandsnamen in op basis van een teller om de volgorde van verschijning op Bitcare te behouden.
   * Geef optioneel een `offsetCounter`-waarde op om te beginnen tellen vanaf een specifieke waarde (standaard is `0`).
   * `useCounter=false` schakelt het hernoemen van alle foto's uit en gebruikt de unieke ID.
     Sorteer de foto's met de unieke ID op datum, oud naar nieuw, om de volgorde van verschijning op de Bitcare-fotopagina te zien.

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
async function processImagesAsync(prefix = '', useCounter = true, offsetCounter = 0) {
  // Load all images
  var images = document.querySelectorAll('img[src^="/photos/"]');
  
  // Convert NodeList to an array and reverse the order (oldest to newest)
  var imageArray = Array.from(images);
  imageArray.reverse();

  for (var i = 0; i < imageArray.length; i++) {
    var img = imageArray[i];

    // Skip any image that does not end with "/medium.jpg".
    if (!img.src.includes("/medium.jpg")) {
      continue;
    }

    // Set the url to the original image
    var url = img.src.replace('medium', 'original');

    // Set the filename based on a counter or the numeric part of the url
    var fileName;
    if (useCounter) {
      fileName = prefix + (i + offsetCounter).toString().padStart(5, '0') + '.jpg';
    } else {
      fileName = prefix + url.replace('https://app.bitcare.com/photos/', '').replace('/original', '');
    }

    // Provide some feedback of the file that shall be downloaded
    console.log(url, fileName);

    // Use await to wait for the download to complete before processing the next image
    await downloadFileAsync(url, fileName);
  }
}

// Set the prefix to your child's name (white spaces are replaced by underscores).
var prefix = document.querySelector(".h2").textContent.replaceAll(' ', '_') + '_';

// Call the asynchronous function with an optional prefix, useCounter parameter, and the offsetCounter value
processImagesAsync(prefix, true, 0);
```
