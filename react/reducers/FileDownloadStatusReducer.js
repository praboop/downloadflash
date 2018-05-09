function fileDownloadStatusReducer(currentState, action) {

	console.log('To reduce for download status' + JSON.stringify(currentState) + ' with action ' + JSON.stringify(action));

	let { type : actionType, payload } = action;

	if (actionType === 'DEFINED_DOWNLOAD') {
		console.log('About to start download for a item. currentState is' + JSON.stringify(currentState))
		if (!payload || payload.length==0) {
			console.log('returning current state    ')
			return currentState;
		}
		var modelCopy = [...currentState];
		return modelCopy;
	} else if (actionType === 'ITEM_CREATED') {
		console.log('Download item has been defined. Adding the model ' + JSON.stringify(currentState))
		var modelCopy = {...currentState};
		modelCopy[payload.id] = payload;
		console.log('New model is: ' + JSON.stringify(modelCopy));
		return modelCopy;
	} else if (actionType === 'ITEM_CHANGED') {
		console.log('Download item has changed. Updating the model ' + JSON.stringify(currentState))
		var modelCopy = {...currentState};
		var model = modelCopy[payload.id]

		Object.entries(payload).map( ([key, value]) => { 
				
				if (key != 'id') {
					model[key] = value.current;
				}

		});

		console.log('New model is: ' + JSON.stringify(modelCopy));
		return modelCopy;
	}
	console.log("FileDownloadStatusReducer - Returning empty states for actionType " + actionType);
	return [];
 
}

export default fileDownloadStatusReducer;