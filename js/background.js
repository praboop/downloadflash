function logURL(requestDetails) {
	console.info("Loading request " + requestDetails.url);
  }
  
  browser.webRequest.onBeforeRequest.addListener(
	logURL,
	{urls: ["<all_urls>"]}
);

console.log('background started');

function headerDetailsListener(object){
	var headers = object.responseHeaders;
	console.info("Header Info for URL " + object.url);
	for (responseHeader in headers) {
			console.log("HEADER: " + JSON.stringify(response.header));
		}
}

browser.webRequest.onResponseStarted.addListener(
  headerDetailsListener,             // function
  {urls: ["<all_urls>"]},               //  filter object
  ['responseHeaders']        //  optional array of strings
)