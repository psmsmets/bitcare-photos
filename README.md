# bitcare-photos
A simple javascript trick to download all photo's from your child's bitcare profile.

## Go the the photo's
Navigate to the photo's page. Only displayed photo's will be downloaded (at the original/full resolution). 
To download all photo's keep pressing the `load more` button.

## Download all photo's using Safari:
1. Enable developer tools (`settings` > `advanced` > enable `Show features for web developers`)
2. Develop > `Show JavaScript Console` (or simply `Option` + `Command` + `C`)
3. Copy-paste the JavaScript code below and press enter. 

## JavaScript code
```javascript
document.querySelectorAll('img[src^="/photos/"]').forEach(
  img => {

    // check
    if (!img.src.includes("medium")) {
      return;
    }

    // extract url and replace medium to original
    var url = img.src.replace('medium', 'original');

    // set filename based on the numeric part
    var name = url.replace('https://app.bitcare.com/photos/', '').replace('/original', '');

    // download
    console.log(url, name);

    // Create a hidden anchor element
    var anchor = document.createElement('a');
    anchor.setAttribute("id", "name");
    anchor.style.display = 'none';
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);

    // Trigger a click event on the anchor to start the download
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  }
);
```
