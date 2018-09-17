import {g_diskStore} from '../PluginStore.jsx'
import _ from 'lodash';

/**
 * 
 * @param {*} msgType - one of success/info/warning/danger
 * @param {*} message 
 * @param {*} dismiss - true or false
 */
function buildMessage(msgType, message, dismiss) {
	return {style: msgType, message: message, dismiss: dismiss, visible: true}
}

function fileExtensionReducer(currentState, action) {
	let { type : actionType, payload } = action;

	/*
	const __OTHERS__ = 'Others'
	const _OTHER_MEDIA_GROUP_ = { name: __OTHERS__, extensions: g_diskStore.getDefaultExtensions().toString(), iconClass: otherIcon};
	*/

	// console.log('FileExtensionReducer: currentState: ' + JSON.stringify(currentState) + ', action: ' + JSON.stringify(action))

	if (actionType === 'SHOW_BANNER_ACTION') {
		var banner = buildMessage(payload.level, payload.message, false);
		return {...currentState, banner};
	} 
	else if (actionType == 'QUERY_PARAM_ACTION') {
		var state = initialState();

		return { page: currentState.page, data: state.data, mediaGroups: state.mediaGroups };
	}
	else if (actionType === 'MEDIA_DOWNLOAD_PROPS_CHANGE') {
		var updateMediaGroups = [...currentState.mediaGroups];
		let targetMedia = _.find(updateMediaGroups, { mediaName : payload.media.mediaType } )
		targetMedia.downloadDir = payload.media.downloadDir;

		console.log('----> REDUCER. MEDIA_DOWNLOAD_PROPS_CHANGE, SENDING: ' + JSON.stringify(updateMediaGroups))

		return { page: currentState.page, data: currentState.data, mediaGroups: updateMediaGroups };
	}
	else if (actionType === 'DEL_EXTENSION') {
		console.log("Got del extension call in reducer for " + JSON.stringify(payload));

		var updateMediaGroups = [...currentState.mediaGroups];
		let targetMedia = _.find(updateMediaGroups, { mediaName : payload.media.mediaType } )
		_.remove(targetMedia.extensions, (ext) => ext.name===payload.delExt )

		console.log("after removing target media is " + JSON.stringify(targetMedia))

		return { page: currentState.page, data: currentState.data, mediaGroups: updateMediaGroups }
	}
	else if (actionType === 'ADD_EXTENSION') {

		console.log("Got add extension call in reducer for " + JSON.stringify(payload));

		// Got add extension call in reducer for {"media":{"mediaType":"Images","icon":"pictureIcon",
		// "extensions":["JPEG","JPG","PNG","GIF"],"userExtensions":["CMS"]},"newExt":"CMS"}

		var updateMediaGroups = [...currentState.mediaGroups];
		let targetMedia = _.find(updateMediaGroups, { mediaName : payload.media.mediaType } )
		//console.log("Found target media: " + JSON.stringify(targetMedia))

		// {"mediaName":"Images","extensions":[{"name":"JPG","isSelected":false,"mediaId":2,"count":1}],"iconClass":"icons/picture.svg","mediaId":2}

		// Find how may urls match this extension.
		let count=0;
		let newExt=payload.newExt.toLowerCase();
		g_allUrls.forEach( linkObj => isUrlMatches(linkObj.url, newExt) ? count++ : count )

		//console.log('Number of extensions matching: ' + count);

		// Add this to targetMedia extensions.
		targetMedia.extensions.push(buildExtensionInfo(payload.newExt, targetMedia.mediaId, count))

		return { page: currentState.page, data: currentState.data, mediaGroups: updateMediaGroups }

		
	} else if (actionType === 'MEDIA_SELECTION') {
		var clickedMedia = payload;
		var newMediaGroups = [...currentState.mediaGroups];
		var newDataArr = [...currentState.data];

		for (let newMedia of newMediaGroups) {
			if (newMedia.mediaName === clickedMedia.mediaName) {
				newMedia.extensions.map(e => {
					e.isSelected = !e.isSelected;
					for (let newData of newDataArr) {
						if (newData.mediaId === e.mediaId)
							newData.download = e.isSelected;
					}
				})
			}
		}
		var model = { page: currentState.page, data: newDataArr, mediaGroups: newMediaGroups}
		//console.log("After media click handling in reducer, to return " + JSON.stringify(model));
		return model;
	}  else if (actionType === 'EXT_SELECTION') {
		let extToToggle = payload,
		toggledExt = {...extToToggle, isSelected : !extToToggle.isSelected};
		let newMediaGroups = [...currentState.mediaGroups];
		var newDataArr = [...currentState.data];

		console.log("Model update - EXT_SELECTION. Ext: " + toggledExt.name + " is selected " + toggledExt.isSelected);

		for (let newMedia of newMediaGroups) {
			for (let ext of newMedia.extensions) {
				if (ext.name === toggledExt.name) {
					ext.isSelected = toggledExt.isSelected; // Check mark for the extn
					console.log("EXTN: " + ext.name + " selected? " + ext.isSelected)
					for (let newData of newDataArr) {
						console.log("To compare " + newData.extName + " with " + ext.name);
						if (newData.extName === ext.name) {
							console.log("HERE: selected? " + ext.isSelected + ", mediaID: " + ext.mediaId + ", url " + newData.linkObj.url)
							newData.download = ext.isSelected; // Check mark for url
						}
					}
				}
			}
		}

		var model = { page: currentState.page, data: newDataArr, mediaGroups: newMediaGroups}
		console.log("After extn click handling in reducer, to return " + JSON.stringify(model));
		return model;
	} else if (actionType === 'DIALOG_NAVIGATE') {
		console.log("Model update - " + actionType + " - Setting page: " + JSON.stringify(payload));
		var returnUrlData;

		if (payload.to=='page1') {
			returnUrlData = buildUrlData(currentState.mediaGroups).filter( (urlData, index) => {
				return urlData.download;
			});
		} else if (payload.to=='page0') {
			returnUrlData = buildUrlData(currentState.mediaGroups);
		} else if (payload.to=='page3') { // Preferences
			returnUrlData = currentState.data;
		} else { // Start Download
			returnUrlData = currentState.data;
		}

		var newModel = {page: payload, data: returnUrlData, mediaGroups: currentState.mediaGroups}
		// console.log("TO RETURN: " + JSON.stringify(newModel));
		return newModel;
	} else if (actionType === 'SHOW_CHECKED_ITEMS') {
		console.log("SHOW_CHECKED_ITEMS: building updated model " + actionType)

		// If show checked is on, then display URL according to download status. 
		// Else if show checked is off, then display URL.

		//var isShowChecked = $("#ShowChecked").prop('checked')
		// Without the rebuilding of URL, the above check action does not work properly
		// The visibility of the URL data is controlled by the SearchingPlugin. Refer handleCheck in SearchingPlugin
		/*
		var filteredData = buildUrlData(currentState.mediaGroups).filter((urlData, index) => {
			return urlData.download;
		});
		*/

		var filteredData = [...currentState.data];

		var newModel = {page: currentState.page, data: filteredData, mediaGroups: currentState.mediaGroups}

		return newModel;
	} else if (actionType === 'TOGGLE_ACTION') {
		//console.log("Model update - TOGGLE_ACTION: " + JSON.stringify(payload));

		var updatedMediaGroups = updateMediaSelection([...currentState.mediaGroups], payload);

		var newModel = {page: currentState.page, data: payload, mediaGroups: updatedMediaGroups}
		return newModel;
	} else if (actionType === 'SINGLE_CHECK_ACTION') {
		var incomingUrlData = payload;
		var updatedData = [...currentState.data].map ( (currentUrlData, index) => {
			if (currentUrlData.index !== incomingUrlData.index)
				return currentUrlData;
			else {
				//console.log("Setting to " + !incomingUrlData.download + " for " + JSON.stringify(currentUrlData));
				return {...incomingUrlData, download: !incomingUrlData.download};
			}
		});

		// If show checked is on, then display URL according to download status. 
		// Else if show checked is off, then display URL.
		/*
		var isShowChecked = $("#ShowChecked").prop('checked')
		var filteredData = updatedData.filter((urlData, index) => {
			return (isShowChecked) ? urlData.download : true;
		});
		*/
		//var newModel = {page: currentState.page, data: updatedData, mediaGroups: updatedMediaGroups}

		var updatedMediaGroups = updateMediaSelection([...currentState.mediaGroups], updatedData);

		var newModel = {page: currentState.page, data: updatedData, mediaGroups: currentState.mediaGroups}
		return newModel;
	} else if (actionType === 'DEFINED_DOWNLOAD') {
		var newModel = {extensions: [...currentState.extensions], page: {'to' : 'page2'}, data: [...currentState.data], mediaGroups: [...currentState.mediaGroups]}
		return newModel;
	} else if (actionType === 'ITEM_CREATED' || actionType === 'ITEM_CHANGED') {
		console.log("File Extension Reducer - Passing off the original model for this actionType");
		return currentState;
	}

	var state = initialState();
	var startPage = {'to' : 'page0'};

	return { page: startPage, data: state.data, mediaGroups: state.mediaGroups };
}

function initialState() {
	//g_diskStore.init();
	var mediaGroupDefinition = g_diskStore.getMediaGroups();
	var defMediaGroups = buildMediaGroups(mediaGroupDefinition);
	var defUrlData = buildUrlData(defMediaGroups);

	// Use extensions that are present in the WEB page.
	defMediaGroups = defMediaGroups.filter( media => 
		{
			media.extensions = media.extensions.filter((extension) => { return extension.count > 0; }) // Show extensions applicable
			return media.extensions.length > 0; // Show media types applicable
		}
	);

	console.log('INITIAL MEDIA GROUPS: ' + JSON.stringify(defMediaGroups));
	return {data: defUrlData, mediaGroups : defMediaGroups}
}

function isUrlMatches(url, ext) {
	if (true /*g_diskStore.isIgnoreQueryParams()*/) {
		url = url.split(/[?#]/)[0]
	}
	return url.toLowerCase().endsWith(ext)
}

function buildExtensionInfo(extName, mediaId, count) {
	return {name: extName, isSelected: false, mediaId: mediaId, count: count};
}

/**
 * Build Media Group and Extensions 
 * @param {*} mediaGroupDef 
 */
function buildMediaGroups(mediaGroupDef) {
	var mediaGroupArray = [];

	for (let media of mediaGroupDef) {
		var extArray = [];
		var mediaInfo = { mediaName: media.name, extensions: extArray, iconClass: media.iconClass, downloadDir: media.downloadDir }
		var mediaId = mediaGroupArray.push(mediaInfo) - 1;
		mediaInfo.mediaId = mediaId;
		var combinedExtensions = media.extensions.concat(media.userExtensions)
		combinedExtensions.forEach(extName => {
				if (extName)
					extArray.push(buildExtensionInfo(extName, mediaId, 0))
			}
		)
	}

	return mediaGroupArray;
}

function buildUrlData(mediaGroups) {
	var index = 0;
	var urlData = [];
	var extLookup = [];

	var me = buildTimeMarker('buildUrlData');
	console.time(me);

	for (let media of mediaGroups) {
		for (let ext of media.extensions) {
			extLookup["." + ext.name.toLowerCase()] = ext;
			ext.count = 0;
		}
	}

	g_allUrls.forEach( linkObj => {

		for (var extName in extLookup) {
			//console.log(url + ' => Testing with Extension => ' + extName );
			if (isUrlMatches(linkObj.url, extName)) {
				//console.log('matched ' + extName );
				urlData.push({
					index: index++,
					extName: extLookup[extName].name,
					mediaId: extLookup[extName].mediaId,
					linkObj: linkObj,
					isBrokenLink: false,
					download: extLookup[extName].isSelected
				})
				extLookup[extName].count += 1;
				break;
			}
		};
		
	});

	console.timeEnd(me);

	// console.log("Built urlData:" + JSON.stringify(urlData));
	return urlData;
}

function updateMediaSelection(mediaGroups, urlList) {
	// Recompute selected extensions based on these checks.
	return mediaGroups.map (medGroup => 
		{
			medGroup.extensions.map ( ext => {
				var isSelected = ext.isSelected;
				var isChecked = false;
				urlList.forEach(urlDetail => {
					if (ext.name===urlDetail.extName && urlDetail.download) {
						isChecked = true;
					}
				})
				if (isChecked != isSelected) {
					ext.isSelected = isChecked;
				}
				return ext;
			});
			return medGroup;
		}
	);
}

export default fileExtensionReducer;