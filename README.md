# F5 APM URL Decoder Chrome Extension

The point of this project was to create a Chrome extension that will show the decoded version of a hex-encoded url used with the F5 BIG-IP APM.

Example:
  When accessing a url like `https://www.example.com/f5-w-68747470733A2F2F6D79736974652E696E7465726E616C2E6C6F63616C$$/index.html`, the extension will be enabled and clicking on the icon will display a popup that show the decoded information (i.e. that the internal url will be `https://mysite.internal.local/index.html`). 

# Installation instructions
Currently, this extension is not in the Chrome App Store, but you can sideload it into Chrome.

* Navigate to `chrome://extensions`
* Ensure that the `Developer mode` checkbox is enabled
* Sub-Method 1: Load unpacked extension
  * Click the `Load unpacked extension` button and select the folder that contains the source
* Sub-Method 2: Load the *crx* file
  * From the file system, click and drag the `.crx` file onto the extension page to begin the installation.
