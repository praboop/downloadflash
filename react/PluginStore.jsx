
import store from './PluginStoreData.js'
import musicIcon from './icons/music.svg';
import videoIcon from './icons/video.svg';
import pictureIcon from './icons/picture.svg';
import textIcon from './icons/text.svg';
import compressedIcon from './icons/compressed.svg';
import otherIcon from './icons/others.svg';
import _ from 'lodash';

/**
 * Stores and retrieves JSON data that is used by this application from the browser's plugin storage area.
 */
export class PluginStore {

	constructor() {
		// console.log ("--------> Created PluginStore <--------- " + JSON.stringify(store.DEFAULT_DATA))
		this.ICON_MAP = {}
		this.ICON_MAP['musicIcon'] = musicIcon;
		this.ICON_MAP['videoIcon'] = videoIcon;
		this.ICON_MAP['pictureIcon'] = pictureIcon;
		this.ICON_MAP['textIcon'] = textIcon;
		this.ICON_MAP['compressedIcon'] = compressedIcon;
		this.ICON_MAP['otherIcon'] = otherIcon;
		this.isInitDone = false;
		this.changeListener = [];
		// this.clearStorage();
		this.init();

	}

	init(callback) {
		if (!this.isInitDone) {
			//console.log("STARTED TO LOAD STORE...")
			var gettingPref = browser.storage.local.get('preferences');			
			var parent = this;
			gettingPref.then((jsonObject => {
				// console.log("Incoming json object is " + JSON.stringify(jsonObject))
				if (_.isEmpty(jsonObject)) {
//			if (true) { // Uncomment this to clear all preferences
					parent.preferences = store.DEFAULT_DATA;
					browser.storage.local.set({'preferences': store.DEFAULT_DATA});
					console.log("Saved default preferences in local storage" + JSON.stringify(store.DEFAULT_DATA))
				}
				else {
					parent.preferences = jsonObject.preferences;
				}
				parent.isInitDone = true;
				//console.log("STORE LOADED")			
			}));
			// console.log("returning from init of store")
		} 

		if (callback) {
			try {
				callback();
			} catch (e) {
				console.error('Components are not able to read the store. ', e);
			}
		}
		
	}

	getIconMap() {
		return this.ICON_MAP
	}

	saveOptions(options) {
		browser.storage.sync.set(options);
	}

	getOptions() {
		browser.storage.sync.get();
	}

	register(callBack) {
		this.changeListener.push(callBack);
	}

	publish(data) {
		this.changeListener.forEach(callback => callback(data));
	}

	removeUserExtension(extension) {
		console.log("Deleting a user extension: " + extension);
		var gettingPreferences = browser.storage.local.get('preferences')
		gettingPreferences.then((jsonObject => {
			let targetMedia = null;
			jsonObject.preferences.mediaAssociation.every(media => {
				if (_.includes(media.userExtensions, extension)) {
					targetMedia = media;
					return false;
				}
				return true;
			});



			if (targetMedia != null) {
				_.pull(targetMedia.userExtensions, extension);
				this.preferences = jsonObject.preferences;
				browser.storage.local.set({'preferences' : jsonObject.preferences});
				if (this.changeListener) {
					var opResult = {};
					opResult.preferences = jsonObject.preferences;
					opResult.error = false;
					opResult.update = { action: 'DEL_EXTENSION', model: {'media' : targetMedia, 'delExt' : extension}};
					this.publish(opResult);
				}
			}


		}), error => {
			console.log("Some error occurred, when trying to delete extension. ")
		})

	}

	isSaveAsPromptDisabled() {
		return this.preferences.general.saveAsPromptDisabled;
	}

	isPreview(type) {
		return this.preferences.general.preview[type];
	}

	setDisableSaveAsPrompt(isDisabled) {
		console.log("Setting query param ignorable to: " + isDisabled);
		var gettingPreferences = browser.storage.local.get('preferences')
		gettingPreferences.then((jsonObject => {
			this.preferences = jsonObject.preferences;
			this.preferences.general.saveAsPromptDisabled = isDisabled;
			browser.storage.local.set({'preferences' : this.preferences});
			/*
			if (this.changeListener) {
				var opResult = {};
				opResult.error = false;
				opResult.update = { action: 'QUERY_PARAM_ACTION', model: {'ignoreQuery' : isQueryParamIgnorable}};
				this.publish(opResult);
			}
			*/
		}))
	}

	setPreviewCheck(type, isEnabled) {
		console.log("Setting preview of type " + type + " to: " + isEnabled);
		var gettingPreferences = browser.storage.local.get('preferences')
		gettingPreferences.then((jsonObject => {
			this.preferences = jsonObject.preferences;
			this.preferences.general.preview[type] = isEnabled;
			browser.storage.local.set({'preferences' : this.preferences});
			/*
			if (this.changeListener) {
				var opResult = {};
				opResult.error = false;
				opResult.update = { action: 'QUERY_PARAM_ACTION', model: {'ignoreQuery' : isQueryParamIgnorable}};
				this.publish(opResult);
			}*/
		}))		
	}

	_setDownloadPath(media, path) {
		if (path === "") {
			media.downloadDir = "default";
		} else {
			media.downloadDir = path;
		}
	}

	updateMediaDownloadLocation(mediaType, path) {

		this.preferences.mediaAssociation.every(media => {
			if (media.mediaType === mediaType) {
				this._setDownloadPath(media, path);
				browser.storage.local.set({'preferences' : this.preferences});

				if (this.changeListener) {
					var opResult = {};
					opResult.update = { action: 'MEDIA_DOWNLOAD_PROPS_CHANGE', model: {'media' : media}};
					opResult.error = false;
					console.log("PLLUGIN STORE " + JSON.stringify(opResult));
					this.publish(opResult);
				}

				return false;
			}
			return true;
		});

	}


	addUserExtension(mediaType, extension) {
		console.log("Saving a user extension: " + extension);

		var newExt = extension.toUpperCase();

		var gettingPreferences = browser.storage.local.get('preferences')
		gettingPreferences.then((jsonObject => {

			let errorMsg = null;
			let targetMedia = null;

			jsonObject.preferences.mediaAssociation.every(media => {

				if (_.includes(media.extensions, newExt)) {
					errorMsg = "Extension <B>" +  newExt + "</B> is a predefined extension in Media type <B>" + media.mediaType + "</B>";
					console.log(newExt + " already exists in " + media.mediaType)
					return false;
				}
				if (_.includes(media.userExtensions, newExt)) {
					errorMsg = "Extension <B>" +  newExt + "</B> already exists in Media type <B>" + media.mediaType + "</B>";
					console.log(newExt + " already exists in " + media.mediaType)
					return false;
				}

				if (media.mediaType==mediaType) {
					targetMedia = media;
					return false;
				}
				return true;
			});


			var opResult = {};
			if (targetMedia != null) {
				targetMedia.userExtensions.push(newExt);
				this.preferences = jsonObject.preferences;
				opResult.preferences = jsonObject.preferences;
				opResult.error = false;
				opResult.update = { action: 'ADD_EXTENSION', model: {'media' : targetMedia, 'newExt' : newExt}};

				browser.storage.local.set({'preferences' : jsonObject.preferences});
			}
			else if (errorMsg != null) {
				opResult.error = errorMsg;
			} else {
				opResult.error = "Unable to find media type for adding extension " + newExt;
			}

			if (this.changeListener) {
				this.publish(opResult);
			}

		}), error => {
			console.log("Some error occurred, when trying to add extension. ")
		})

	}

	getUserExtensions(callback) {
		var gettingExtensions = browser.storage.local.get('user.extensions');
		gettingExtensions.then((jsonObject => {

			if (!jsonObject.hasOwnProperty('user.extensions')) 
				callback([]);
			else {
				//console.log("calling callback with " + JSON.stringify([...jsonObject['user.extensions']]));
				callback([...jsonObject['user.extensions']]);
			}
		}));
	}

	getPreferences(callback) {

		if (!callback) {
			return this.preferences;
		}
		
		var gettingPreferences = browser.storage.local.get('preferences')
		var parent = this;
		gettingPreferences.then((jsonObject => {
			//console.log("Fetched preferences from store Preferences, passing: " + JSON.stringify(jsonObject))
			parent.preferences = jsonObject.preferences;
			callback(jsonObject)
		}), error => {
			console.log("Some error occurred, when trying to retrieve preferences. ")
		})	
	}

	
	getMediaGroups() {


		//console.log("In getMediaGroups. Preferences: " + JSON.stringify(this.preferences))

		var mediaGroups = [];

		this.preferences.mediaAssociation.forEach(mediaInfo => {
			var pushItem = {};
			pushItem.name = mediaInfo.mediaType;
			pushItem.extensions = mediaInfo.extensions;
			pushItem.userExtensions = mediaInfo.userExtensions;
			pushItem.iconClass = this.ICON_MAP[mediaInfo.icon];
			pushItem.downloadDir = mediaInfo.downloadDir;
			mediaGroups.push(pushItem)
		});

		// console.log("Returning media groups: " + JSON.stringify(mediaGroups))

		return mediaGroups;
	}

	getTags() {
		return [...this.preferences.renameTags]
	}

	updateTag(incomingTag, script, name, desc, testUrl) {
		var updated = false;
		this.preferences.renameTags.every(existingTag => {
			if (existingTag.tag === incomingTag.tag) {
				existingTag.tag = name;
				existingTag.description = desc;
				existingTag.script = script;
				existingTag.testUrl = testUrl;
				browser.storage.local.set({'preferences' : this.preferences});
				updated = true;

				if (this.changeListener) {
					var opResult = {};
					opResult.update = { action: 'TAG_UPDATE', model: {}};
					opResult.error = false;
					this.publish(opResult);
				}

				return false;
			}
			return true;
		});

		if (!updated) { // Its a new tag
			var newTag = {};
			newTag.tag = name;
			newTag.description = desc;
			newTag.stock = false;
			newTag.script = script;
			newTag.testUrl = testUrl;
			this.preferences.renameTags.push(newTag);
			browser.storage.local.set({'preferences' : this.preferences});
			if (this.changeListener) {
				var opResult = {};
				opResult.error = false;
				opResult.update = { action: 'TAG_UPDATE', model: {}};
				this.publish(opResult);
			}
		}
	}

	deleteTag( tagName ) {

		var sizeBefore = this.preferences.renameTags.length;
		_.remove(this.preferences.renameTags, { tag: tagName });
		var sizeAfter = this.preferences.renameTags.length;
		var isDeleted = (sizeBefore - sizeAfter) == 1

		if (isDeleted) {
			console.log('Deleted tag ' + tagName);
			browser.storage.local.set({'preferences' : this.preferences});
			if (this.changeListener) {
				var opResult = {};
				opResult.error = false;
				opResult.update = { action: 'TAG_UPDATE', model: {}};
				this.publish(opResult);
			}
		} else {
			console.log('Tag name not matched for delete. Tagname: ' + tagName)
		}
	}
	

	
	saveUserExtensions(extensions) {
		browser.storage.local.set({'user.extensions': extensions});
	}

	/**
	 * Warning: This will clear the entire storage and all settings will be lost!
	 */
	clearStorage() {
		console.log("Clearing user storage");

		var clearing = browser.storage.local.clear();
		clearing.then(ok=>console.log("Successfully cleared"), fail=>console.log("Failed to clear " + JSON.stringify(fail)));
	}
}

// Singleton instance in global namespace.
export let g_diskStore = new PluginStore();

