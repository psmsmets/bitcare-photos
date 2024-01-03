# bitcare-photos
A simple javascript trick to download all photo's from your child's bitcare profile.

## Go the the photo's
Navigate to the photo's page. Only displayed photo's will be downloaded (at the original/full resolution). 
To download all photo's keep pressing the `load more` button.

## Download all photo's using Safari:
1. Enable developer tools (`settings` > `advanced` > enable `Show features for web developers`)
2. Develop > `Show JavaScript Console` (or simply `Option` + `Command` + `C`)
3. Copy-paste the JavaScript code below, change `prefix_` in whatever you want, press enter and wait.

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
      }, 100); // Adjust the delay as needed
    });

    anchor.click();
  });
}

// Function to process images asynchronously with an optional prefix
async function processImagesAsync(prefix = '') {
  var images = document.querySelectorAll('img[src^="/photos/"]');

  for (var img of images) {
    if (!img.src.includes("medium")) {
      continue;
    }

    var url = img.src.replace('medium', 'original');
    var name = prefix + url.replace('https://app.bitcare.com/photos/', '').replace('/original', '');

    console.log(url, name);

    // Use await to wait for the download to complete before processing the next image
    await downloadFileAsync(url, name);
  }
}

// Call the asynchronous function with an optional prefix
processImagesAsync('prefix_');

```
