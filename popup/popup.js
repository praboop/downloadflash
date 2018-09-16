// You'd better put the code inside ready() function
$(document).ready(function () {

    console.log("in updated ready........");

	function onExecuted(result) {
		try {
            g_allUrls = result[0];
            //console.log("========> " + g_allUrls.length + " URLS DETECTED: " + JSON.stringify(g_allUrls));
            window.extension.downloadlinks.showPopup();
			//download(result.toString().split(","));
		} catch (error) {
            console.log("SOME ERROR: " + error.stack);
		}
    }
    
    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var downloadItems = {};
    var g_status;

    window.extension.downloadlinks.registerEventActions = function(statusCallback) {
        g_status = statusCallback;
    }

	window.extension.downloadlinks.download = function(files , mediaArray, isSaveAsPromptDisabled) {

        function onStartedDownload(itemId) {
            console.log(`Started downloading: ${itemId}`);
            g_status.updateData(`${itemId}`);
        }
    
        function onFailed(error) {
            document.body.innerHTML += `Download failed: ${error}`
            console.log(`Download failed: ${error}`);
        };

        function handleCreated(item) {

            g_status.itemCreated(item);

            /*
            downloadItems[item.id] = item;	
            document.body.innerHTML = "";	
            for (i in downloadItems) {
                document.body.innerHTML += `<BR>Started downloading: ` + downloadItems[i].url;
            }
            */
        }

        function handleChanged(item) {	

            console.log('Item changed ---->' + JSON.stringify(item));
            g_status.itemChanged(item);
            /*	
            document.body.innerHTML = "";	
            downloadItems[item.id].state = item.state;
            for (i in downloadItems) {
                if (downloadItems[i].state.current === "complete")
                    document.body.innerHTML += `<BR>Completed downloading: ` + downloadItems[i].url;
                else
                    document.body.innerHTML += `<BR>Downloading...: ` + downloadItems[i].url;		
            }
            */
        }

        browser.downloads.onCreated.addListener(handleCreated);
        browser.downloads.onChanged.addListener(handleChanged);

		for (index in files) {
			try {
                var decodedUrl = decodeURIComponent(files[index].linkObj.url);

                var mediaId = files[index].mediaId;
                //console.log ('media id of downloaded item: ' + mediaId);

                var targetMedia = mediaArray.find(media => media.mediaId == mediaId);

                //console.log ('media file path: ' + targetMedia.downloadDir);
                var saveLocAndName = "";

                if (targetMedia.downloadDir === 'default') {
                    var fileName = decodedUrl.substring(decodedUrl.lastIndexOf('/')+1);
                    fileName = fileName.split('?')[0];
                    saveLocAndName = fileName;
                } else {
                    saveLocAndName = files[index].downloadPath;
                }

                //console.log("saving to " + saveLocAndName);
                
                //console.log('Downloading file: >>' + decodedUrl + '<<');

				var downloading = browser.downloads.download({
                    url: decodedUrl,
                    filename: saveLocAndName,
                    saveAs: !isSaveAsPromptDisabled /* true - allow the user to select a file name */
                });

				downloading.then(onStartedDownload, onFailed);

			} catch (e) {
				console.error("ERROR during download", e);
			}
		}
	} // End function download


	var executing = browser.tabs.executeScript({
		file: "/js/findfiles.js",
		allFrames: true
	});
    executing.then(onExecuted, onError);

});


var g_allUrls = [];