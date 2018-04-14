function logURL(requestDetails) {
	console.info("Loading request " + requestDetails.url);
  }
  
  browser.webRequest.onBeforeRequest.addListener(
	logURL,
	{urls: ["<all_urls>"]}
);