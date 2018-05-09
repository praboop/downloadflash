
/**
 * Stores and retrieves JSON data that is used by this application from the browser's plugin storage area.
 */
export class PluginStore {

	constructor() {
		console.log ("--------> Created PluginStore <---------")
		this.extensions = [];
	}

	saveOptions(options) {
		browser.storage.sync.set(options);
	}

	getOptions() {
		browser.storage.sync.get();
	}

	register(callBack) {
		this.pref = callBack;
	}

	addUserExtension(payload) {
		console.log("Saving user extension");

		var gettingExtensions = browser.storage.local.get('user.extensions')
		gettingExtensions.then((jsonObject => {

			console.log("User extensions from storage: " + JSON.stringify(jsonObject))
			if (!jsonObject.hasOwnProperty('user.extensions')) {
				browser.storage.local.set({'user.extensions': [payload]});
			} else {
				browser.storage.local.set({'user.extensions': [...jsonObject['user.extensions'], payload]});
			}
			if (this.pref) {
				this.pref();
			}
		}), error => {
			console.log("Some error occurred, when trying to retrieve extension. ")
		})
	}

	getUserExtensions(callback) {
		var gettingExtensions = browser.storage.local.get('user.extensions');
		gettingExtensions.then((jsonObject => {

			if (!jsonObject.hasOwnProperty('user.extensions')) 
				callback([]);
			else {
				console.log("calling callback with " + JSON.stringify([...jsonObject['user.extensions']]));
				callback([...jsonObject['user.extensions']]);
			}
		}));
	}

	getDefaultExtensions() {
		return this.extensions;
	}

	loadStore(callback) {
		var gettingExtensions = browser.storage.local.get('user.extensions');
		var parent = this;
		gettingExtensions.then((jsonObject => {
			if (!jsonObject.hasOwnProperty('user.extensions')) 
				parent.extensions = [];
			else
				parent.extensions = [...jsonObject['user.extensions']];
			callback();
		}));
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
