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
