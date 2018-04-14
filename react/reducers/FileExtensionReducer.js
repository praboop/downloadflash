function fileExtensionReducer(currentState, action) {
	let { type : actionType, payload } = action;

	console.log('FileExtensionReducer: currentState: ' + JSON.stringify(currentState) + ', action: ' + JSON.stringify(action))

	if (actionType === 'ADD_EXTENSION') {
		console.log('got a call in add ext')
		if (!payload || payload.length==0) {
			console.log('returning current stat')
			return currentState;
		}
		payload =payload.toUpperCase();
		console.log("Got a request to add a new extension: " + JSON.stringify(payload));
		let exists=false
		currentState.extensions.forEach(
			extn => { 
				if (extn.name===payload) { 
					console.log("ignoring since " + extn.name + " already exists")
					exists=true; 
				}
			});
		if (exists)
			return currentState;

		let newExtension = {
			name: payload.toUpperCase(),
			isSelected : true
		}
		var updatedExtensions = [...currentState.extensions, newExtension];
		return { extensions: updatedExtensions, page: currentState.page, data: buildData(updatedExtensions)}
	} else if (actionType === 'EXT_SELECTION') {
		console.log("Handling extensions selection in reducer");
		let extToToggle = payload,
		toggledExt = {...extToToggle, isSelected : !extToToggle.isSelected};

		let newArr = currentState.extensions.map(ext => ext===extToToggle ? toggledExt : ext );
		var model = { extensions: newArr, page: currentState.page, data: buildData(newArr)}
		console.log("After click handling in reducer, to return " + JSON.stringify(model));
		return model;
	} else if (actionType === 'NAV_FILTER_FILES') {
		console.log("Model update - Setting page: " + payload);
		var newModel = {extensions: [...currentState.extensions], page: payload, data: [...currentState.data]}
		return newModel;
	} else if (actionType === 'TOGGLE_ACTION') {
		console.log("Model update - To Toggle action: " + payload);
		var updatedExtensions = getUpdatedExtensions(currentState.extensions, payload);
		var newModel = {extensions: updatedExtensions, page: currentState.page, data: payload}
		return newModel;
	} else if (actionType === 'SINGLE_CHECK_ACTION') {
		var incomingUrlData = payload;
		var updatedData = [...currentState.data].map ( (currentUrlData, index) => {
			if (currentUrlData.index !== incomingUrlData.index)
				return currentUrlData;
			else {
				return {...incomingUrlData, download: !incomingUrlData.download};
			}
		});
		var updatedExtensions = getUpdatedExtensions(currentState.extensions, updatedData);
		var newModel = {extensions: updatedExtensions, page: currentState.page, data: updatedData}
		return newModel;
	} else if (actionType === 'DEFINED_DOWNLOAD') {
		var newModel = {extensions: [...currentState.extensions], page: 'page2', data: [...currentState.data]}
		return newModel;
	} else if (actionType === 'ITEM_CREATED' || actionType === 'ITEM_CHANGED') {
		console.log("File Extension Reducer - Passing off the original model for this actionType");
		return currentState;
	}

	var defExtData = [];
	['PDF', 'MP3', 'JPEG', 'TXT', 'MP4', 'OGG'].map(ext => defExtData.push( {name : ext, isSelected : false}));
	var model = { extensions: defExtData, page: 'page0', data: buildData(defExtData)}
	return model;
}

function buildData(extData) {
	var index = 0;
	var urlData = [];
	g_allUrls.forEach( url => {

		//TODO fix this ugly loop
		var isARegisteredExtension = false;
		var extension = '';
		var isSelected = false;
		extData.forEach( ext => {
			if (url.toLowerCase().endsWith('.' + ext.name.toLowerCase())) {
				extension = ext.name;
				isARegisteredExtension = true;
				isSelected = ext.isSelected;
			}
		});
		
		if (isARegisteredExtension) {
			urlData.push({
				index: index++,
				type: extension.toUpperCase(),
				download: isSelected,
				url: url,
			})
		}
	});
	// console.log("Built urlData:" + JSON.stringify(urlData));
	return urlData;
}

function getUpdatedExtensions(currentExtensions, urlList) {
	// Recompute selected extensions based on these checks.
	return currentExtensions.map (ext => {
		var isSelected = ext.isSelected;
		var isChecked = false;
		urlList.forEach(urlDetail => {
			if (ext.name===urlDetail.type && urlDetail.download) {
				isChecked = true;
			}
		})
		if (isChecked != isSelected) {
			return {...ext, isSelected : isChecked}
		}
		return ext;
	});
}




export default fileExtensionReducer;