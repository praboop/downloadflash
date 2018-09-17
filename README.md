# Download links
Firefox plugin that would allow the user to specify what kind of files to download (pdf, mp3 etc) and autodownloads all matching files form links.

---

# Build:
1. Install npm
2. npm run build
3. The dist directory has the build artifacts

---


# Installation:
1. Open "about:debugging" in Firefox, click "Load Temporary Add-on" and select any file in your dist directory:
2. The extension will now be installed, and will stay until you restart Firefox.

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


# Feature Status:

| Release | Feature | 
| --- | --- |
| 1.0 | Simple HTML UI and minimal functionality to download links |
| 2.0 | Feature to filter files and report download status with better UI |
| 3.0 | Feature to auto detect extensions and count in extension configuration page, UI refreshed, more extension types added, save extensions |
| 4.0 | Feature to organize downloads by directory, rename files by each file type |
| 4.0 | Feature to create custom tags from link information |
| 4.0 | Feature to display image size |
| 4.0 | Feature to preview images |
| x.x | Feature to configure max number of parallel downloads from a target site |
| x.x | Feature to display file size after downloads |
| x.x | Feature to filter by image size |
| x.x | Feature to pause/cancel/delete downloaded files |
| x.x | Feature to preview text |
| x.x | Feature to interact with clipboard |


# Defects

| 4.0 | Carry forward applied filter settings from first page to second page |
