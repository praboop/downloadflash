import musicIcon from '../icons/music.svg';
import videoIcon from '../icons/video.svg';
import pictureIcon from '../icons/picture.svg';
import textIcon from '../icons/text.svg';
import compressedIcon from '../icons/compressed.svg';
import otherIcon from '../icons/others.svg';
import {g_diskStore} from '../PluginStore.jsx'

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
	const __OTHERS__ = 'Others'
	const _OTHER_MEDIA_GROUP_ = { name: __OTHERS__, extensions: g_diskStore.getDefaultExtensions().toString(), iconClass: otherIcon};

	console.log('FileExtensionReducer: currentState: ' + JSON.stringify(currentState) + ', action: ' + JSON.stringify(action))

	if (actionType === 'SHOW_BANNER_ACTION') {
		var banner = buildMessage(payload.level, payload.message, false);
		return {...currentState, banner};
	}
	else if (actionType === 'ADD_EXTENSION') {
		if (!payload || payload.length==0) {
			console.log('returning current stat')
			return currentState;
		}
		payload =payload.toUpperCase();
		console.log("Got a request to add a new extension: " + JSON.stringify(payload));
		var newMediaGroups = [...currentState.mediaGroups];
		let exists=false
		let targetMedia;
		let mediaIndex = 0, index = 0;
		let errorMsg;
		for (let media of newMediaGroups) {
			media.extensions.forEach(
				extn => { 
					if (extn.name===payload) { 
						errorMsg = "<B>" +  extn.name + "</B> already exists in Media type <B>" + media.mediaName + "</B>";
						console.log(extn.name + " already exists in " + media.mediaName)
						exists=true; 
					}
				});
			if (exists) {
				var banner = buildMessage('warning', errorMsg, true);
				return {...currentState, banner};
			}
			if (media.mediaName === __OTHERS__) {
				console.log("match");
				targetMedia = media;
				mediaIndex = index;
			}
			console.log("not match")
			index++;
		}
		if (!targetMedia) {
			targetMedia = _OTHER_MEDIA_GROUP_;
			targetMedia.mediaName = __OTHERS__;
			targetMedia.extensions = [];
			mediaIndex = newMediaGroups.push(targetMedia)-1;
			targetMedia.mediaId = mediaIndex;
		}

		// Add the files matching extension in UrlData
		var newDataArr = [...currentState.data];
		let count=0;
		index = newDataArr.length;
		g_allUrls.forEach( url => {
			if (url.toLowerCase().endsWith(payload.toLowerCase())) {
				newDataArr.push({
					index: index++,
					extName: payload,
					mediaId: mediaIndex,
					url: url,
					download: true
				});
				count++;
			} 
		});

		// Add the extension in the media group
		targetMedia.extensions.push({name: payload, isSelected: true, mediaId: mediaIndex, count: count});

		

		for (let newMedia of newMediaGroups) {
			if (newMedia.mediaName === targetMedia.mediaName) {
				newMedia.extensions.map(e => {
					for (let newData of newDataArr) {
						if (newData.mediaId === e.mediaId)
							newData.download = e.isSelected;
					}
				})
			}
		}

		g_diskStore.addUserExtension(payload);

		return { page: currentState.page, data: newDataArr, mediaGroups: newMediaGroups}
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
		console.log("After media click handling in reducer, to return " + JSON.stringify(model));
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
							console.log("HERE: selected? " + ext.isSelected + ", mediaID: " + ext.mediaId + ", url " + newData.url)
							newData.download = ext.isSelected; // Check mark for url
						}
					}
				}
			}
		}

		var model = { page: currentState.page, data: newDataArr, mediaGroups: newMediaGroups}
		console.log("After extn click handling in reducer, to return " + JSON.stringify(model));
		return model;
	} else if (actionType === 'NAV_FILTER_FILES') {
		console.log("Model update - NAV_FILTER_FILES - Setting page: " + payload);
		var newModel = {page: payload, data: currentState.data, mediaGroups: currentState.mediaGroups}
		console.log("TO RETURN: " + JSON.stringify(newModel));
		return newModel;
	} else if (actionType === 'TOGGLE_ACTION') {
		console.log("Model update - TOGGLE_ACTION: " + payload);
		var updatedMediaGroups = updateMediaSelection([...currentState.mediaGroups], payload);
		var newModel = {page: currentState.page, data: payload, mediaGroups: updatedMediaGroups}
		return newModel;
	} else if (actionType === 'SINGLE_CHECK_ACTION') {
		var incomingUrlData = payload;
		var updatedData = [...currentState.data].map ( (currentUrlData, index) => {
			if (currentUrlData.index !== incomingUrlData.index)
				return currentUrlData;
			else {
				console.log("Setting to " + !incomingUrlData.download + " for " + JSON.stringify(currentUrlData));
				return {...incomingUrlData, download: !incomingUrlData.download};
			}
		});
		var updatedMediaGroups = updateMediaSelection([...currentState.mediaGroups], updatedData);
		var newModel = {page: currentState.page, data: updatedData, mediaGroups: updatedMediaGroups}
		return newModel;
	} else if (actionType === 'DEFINED_DOWNLOAD') {
		var newModel = {extensions: [...currentState.extensions], page: 'page2', data: [...currentState.data], mediaGroups: [...currentState.mediaGroups]}
		return newModel;
	} else if (actionType === 'ITEM_CREATED' || actionType === 'ITEM_CHANGED') {
		console.log("File Extension Reducer - Passing off the original model for this actionType");
		return currentState;
	}

	var mediaGroupDefinition = [
		{ name: 'Audio',            extensions: 'MP3,WAV,OGG,WMA,AIF,CDA,MID', iconClass: musicIcon },
		{ name: 'Video',            extensions: 'MP4,AVI,FLV,MOV,WMV', iconClass: videoIcon},
		{ name: 'Images',           extensions: 'JPEG,JPG,PNG,GIF', iconClass: pictureIcon},
		{ name: 'Text',             extensions: 'PDF,TXT,DOC,DOCX,RTF,ODT,TEX,WPD,CSV,DAT,JSON,LOG,SQL,XML,DTD', iconClass: textIcon},
		{ name: 'Compressed Files', extensions: '7Z,ARJ,DEB,PKG,RAR,RPM,TAR.GZ,Z,ZIP,TAR', iconClass: compressedIcon},
		_OTHER_MEDIA_GROUP_
	];


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

	var model = { page: 'page0', data: defUrlData, mediaGroups: defMediaGroups}
	return model;
}

/**
 * Build Media Group and Extensions 
 * @param {*} mediaGroupDef 
 */
function buildMediaGroups(mediaGroupDef) {
	var mediaGroupArray = [];

	for (let media of mediaGroupDef) {
		var extArray = [];
		var mediaInfo = { mediaName: media.name, extensions: extArray, iconClass: media.iconClass }
		var mediaId = mediaGroupArray.push(mediaInfo) - 1;
		mediaInfo.mediaId = mediaId;
		media.extensions.split(',').map(extName => {
				if (extName)
					extArray.push( {name: extName, isSelected: false, mediaId: mediaId, count: 0})
			}
		)
	}

	return mediaGroupArray;
}

function buildUrlData(mediaGroups) {
	var index = 0;
	var urlData = [];
	var extLookup = [];
	for (let media of mediaGroups) {
		for (let ext of media.extensions) {
			extLookup["." + ext.name.toLowerCase()] = ext;
			ext.count = 0;
		}
	}

	g_allUrls.forEach( url => {

		for (var extName in extLookup) {
			//console.log(url + ' => Testing with Extension => ' + extName );
			if (url.toLowerCase().endsWith(extName)) {
				//console.log('matched ' + extName );
				urlData.push({
					index: index++,
					extName: extLookup[extName].name,
					mediaId: extLookup[extName].mediaId,
					url: url,
					download: false
				})
				extLookup[extName].count += 1;
				break;
			}
		};
		
	});
	console.log("Built urlData:" + JSON.stringify(urlData));
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