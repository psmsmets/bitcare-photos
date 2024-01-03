# bitcare-photos
A simple javascript trick to download all photos from your child's bitcare profile.

## Go the photos
Navigate to the photos page. Only displayed photos will be downloaded (at the original/full resolution). 
To download all photos keep pressing the `Show more` button until all photos are shown.

## Download all photos using Safari:
1. Enable developer tools: navigate to `settings` > `advanced` > enable `Show features for web developers`
2. Open the JavaScript console: navigate to `Develop` > `Show JavaScript Console` (or simply press `Option` + `Command` + `C`)
3. Copy-paste the JavaScript code below, press enter and wait. Photos should start flying in.

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
  var images = document.querySelectorAll('img[src^="/photos/"]');
  
  // Convert NodeList to an array and reverse it if needed
  var imageArray = Array.from(images);
  if (reverseOrder) {
    imageArray.reverse();
  }

  for (var img of imageArray) {
    if (!img.src.includes("medium")) {
      continue;
    }

    var url = img.src.replace('medium', 'original');
    var name = url.replace('https://app.bitcare.com/photos/', '').replace('/original', '');

    // Append the prefix to the variable name
    name = prefix + name;

    console.log(url, name);

    // Use await to wait for the download to complete before processing the next image
    await downloadFileAsync(url, name);
  }
}
// Set the prefix to your child's name (white spaces are replaced by underscores).
var prefix = document.querySelector(".h2").textContent.replaceAll(' ', '_') + '_';

// Call the asynchronous function with an optional prefix and reversed order
processImagesAsync(prefix, true);
```
