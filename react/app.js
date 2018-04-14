import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import extensionReducer from './reducers/FileExtensionReducer';
import downloadStatusReducer from './reducers/FileDownloadStatusReducer'

import Download from './Download.jsx';

window.extension = window.extension || {};
window.extension.downloadlinks = window.extension.downloadlinks || {};
window.extension.downloadlinks.showPopup = function () { 
	console.log (' ======= RENDERING POPUP =======')
	let combinedReducers = combineReducers({
		extensionData: extensionReducer,
		downloadStatusData: downloadStatusReducer
	})
	// let store = createStore(extensionReducer);
	let store = createStore(combinedReducers);
	
	render(
		<Provider store={store}>
		<Download />
		</Provider>,
		document.getElementById('app')
	);
	window.extension.downloadlinks.initSearch();
}

