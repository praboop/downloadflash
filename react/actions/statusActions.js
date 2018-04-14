
let statusActions = {
	statDownInitAction: function( itemId ) {
		console.log('initiated download ' + JSON.stringify(itemId));
		return { type: 'DEFINED_DOWNLOAD', payload: itemId }
	},
	statItemCreatedAction: function ( item ) {
		console.log('Download item created '+ JSON.stringify(item));
		return { type: 'ITEM_CREATED', payload: item }
	},
	statItemChangedAction: function ( item ) {
		console.log('Download item changed '+ JSON.stringify(item));
		return { type: 'ITEM_CHANGED', payload: item }
	}
}

export default statusActions;