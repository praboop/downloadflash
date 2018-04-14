// You'd better put the code inside ready() function
$(document).ready(function () {

    console.log("in updated ready........");

	function onExecuted(result) {
		//	alert("REUSLT IS " + (typeof result));
		//	document.body.innerHTML = "SUCCESS: " + result;
		try {
            g_allUrls = result.toString().split(",");
            console.log("========> All URLS UPDATED TO: " + JSON.stringify(g_allUrls));
            window.extension.downloadlinks.showPopup();
            //alert('To Download: ' + result.toString().split(","))
			//download(result.toString().split(","));
		} catch (error) {
			document.body.innerHTML += "SOME ERROR: " + error.message;
		}
    }
    
    function onError(error) {
        alert(error);
        document.body.innerHTML = "FAILURE: " + result;
        console.log(`Error: ${error}`);
    }

    var downloadItems = {};
    var g_status;

    window.extension.downloadlinks.registerEventActions = function(statusCallback) {
        g_status = statusCallback;
    }

	window.extension.downloadlinks.download = function(files) {

        function onStartedDownload(itemId) {
            //document.body.innerHTML += `Started downloading: ${itemId}`;
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

            console.log('SOmething changed ---->' + JSON.stringify(item));
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
				var downloading = browser.downloads.download({
                    url: files[index]
                });

				downloading.then(onStartedDownload, onFailed);

			} catch (e) {
				document.body.innerHTML += "  ERROR: " + e.message;
			}
		}
	} // End function download


	var executing = browser.tabs.executeScript({
		file: "/js/findfiles.js",
		allFrames: true
	});
    executing.then(onExecuted, onError);

   window.extension.downloadlinks.showPopup();
});


var g_allUrls = [];

/*
// Link items
var g_allUrls = ['http://www.default.com/default1.mp3',
'http://www.default.com/default.mp4'
];


console.log("========> All URLS KNOWN: " + JSON.stringify(g_allUrls));
*/