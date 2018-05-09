import 'jquery';
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import extensionReducer from './reducers/FileExtensionReducer';
import downloadStatusReducer from './reducers/FileDownloadStatusReducer'
import {g_diskStore} from './PluginStore.jsx'

import Download from './Download.jsx';

window.extension = window.extension || {};
window.extension.downloadlinks = window.extension.downloadlinks || {};

let combinedReducers = combineReducers({
	extensionData: extensionReducer,
	downloadStatusData: downloadStatusReducer
})

//React.render(<App />, document.getElementById('app'));

window.extension.downloadlinks.showPopup = function () { 
	
	console.log (' ======= RENDERING POPUP =======')

	g_diskStore.loadStore(() => {

		console.log(" -- READ FROM DISK --");
		let store = createStore(combinedReducers);

		render(
			<Provider store={store}>
			<Download />
			</Provider>,
			document.getElementById('app')
		);
		
		window.extension.downloadlinks.initSearch();
	});
	
}

