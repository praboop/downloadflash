# Download links
Firefox plugin that would allow the user to specify what kind of files to download (pdf, mp3 etc) and autodownloads all matching files form links.

---

# Installation:
1. download all files to local directory.
2. Open "about:debugging" in Firefox, click "Load Temporary Add-on" and select any file in your extension's directory:
3. The extension will now be installed, and will stay until you restart Firefox.

---

*Note: This is a un-signed temporary plugin. Once you restart Firefox again, the extension would be removed.*

# How to use:
1. Navigate to the target webpage.
2. In the tool bar, cick on the plugin-icon and click on 'Download Links'. Refer the green rectangle below.
![alt text](https://github.com/praboop/downloadlinks/blob/master/screen.png)
3. The extension file selected for download would be downloaded to firefox default "downloads" folder.



# Tip:

Below error can be seen in console when the extension is triggered in development mode.
Content Security Policy: The page’s settings blocked the loading of a resource at self 
Fix by:
about:config
security.csp.enable change to false