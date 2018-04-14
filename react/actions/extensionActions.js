
let extensionActions = {
	pickExisting: function( extDetail ) {
		console.log('clicked on existing extension ' + JSON.stringify(extDetail));
		return { type: 'EXT_SELECTION', payload: extDetail }
	},
	addNew: function( extName ) {
		console.log('add new invoked for extension ' + extName);
		return { type: 'ADD_EXTENSION', payload: extName }
	},
	navigateAction: function( page ) {
		console.log('navigating to page ' + JSON.stringify(page));
		return { type: 'NAV_FILTER_FILES', payload: page }
	},
	toggleAction: function( filterData ) {
		console.log('clicked on toggle action ' + JSON.stringify(filterData));
		return { type: 'TOGGLE_ACTION', payload: filterData};
	},
	checkAction: function ( urlData ) {
		console.log('to set/unset check box for ' + JSON.stringify(urlData));
		return {type: 'SINGLE_CHECK_ACTION', payload: urlData};
	}
}

export default extensionActions;


/*
let extensionActionCreators = {
	increment : function(){
		console.log('increment called');
		return { type : 'INCREMENT'}
	},
	decrement : function(){
		return { type : 'DECREMENT'}
	}
};
export default extensionActionCreators;
*/
