import 'jquery';

import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import extensionReducer from './reducers/FileExtensionReducer';
import downloadStatusReducer from './reducers/FileDownloadStatusReducer'
import {g_diskStore} from './PluginStore.jsx'

import Download from './Download.jsx'
import Welcome from './Welcome.jsx'
//import TestScroll from './TestScroll.jsx';
//import Test from './Test.jsx'

window.extension = window.extension || {};
window.extension.downloadlinks = window.extension.downloadlinks || {};

console.profile('DownloadLinks')

window.buildTimeMarker = function (name) {
	return '[* Profiled time: ' + name + ' *]';
}

window.appTime = buildTimeMarker('Application Time');
console.time(window.appTime);


window.extension.downloadlinks.showPopup = function () { 
	
	console.log (' ======= RENDERING POPUP =======')

	g_diskStore.init(() => {

		console.log('After diskstore init, internal is: ' + JSON.stringify(g_diskStore.getInternal()));

		if (!window.extension.downloadlinks.welcomeDismissed) {
			if (!g_diskStore.getInternal().doNotShowWelcome) {
				console.log("Rendering welcome");
				render (
					<Welcome/>,
					document.getElementById('app')
				)
				return;
			}
		}

		let combinedReducers = combineReducers({
			extensionData: extensionReducer,
			downloadStatusData: downloadStatusReducer
		})

		console.log(" -- READ FROM DISK --");
		let store = createStore(combinedReducers);

		render(
			<Provider store={store}>
			<Download/>
			</Provider>,
			document.getElementById('app')
		);
		
	});
	
}

window.extension.downloadlinks.showPopup1 = function () { 
	render(<TestScroll />, document.getElementById('app'));
}


/*
window.extension.downloadlinks.showPopup =function() {
	console.log ("---- opening w2 asdhoiws");
	browser.windows.create({
		type: "panel", 
		url: "http://www.google.com",
		state: "normal"
		});
}
*/


