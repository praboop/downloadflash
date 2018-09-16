import React from 'react';
import './app.css';

import {g_diskStore} from './PluginStore.jsx'

import PrefTabs from './PrefTabs.jsx'
import Banner from './Banner.jsx';
import sidebarToggle from './icons/sidebarIcon.svg';

class Preferences extends React.Component {

	constructor(props) {
		super(props);

		this.compname = buildTimeMarker('Preferences');
		console.time(this.compname);

		this.state = { preferences: {}, inited : true }
		this.updatePreferences = this.updatePreferences.bind(this);
		g_diskStore.getPreferences(this.updatePreferences);
		g_diskStore.register((opResult)=> {
			//console.log("Loading preferences from disk store. status of operation " + opResult.error);
			//g_diskStore.getPreferences(this.updatePreferences);
			if (!opResult.error) {
				this.updatePreferences(opResult);
			} else {
				this.showBanner('warning', opResult.error);
			}
		});
	}

	componentDidMount() {
		console.timeEnd(this.compname);
	}

	componentDidUpdate() {
		// This needs to be done for the tooltips to work
		// console.log("Preference: componentDidUpdate")
		$('[data-toggle="tooltip"]').tooltip()
	}

	updatePreferences(opResult) {
		//console.log("Preferences . Updating to " + JSON.stringify(opResult.preferences))
		this.setState({preferences: opResult.preferences, inited : true });
		//console.log("Invoking Reducer Actions due to " + opResult.update.action)
		if (opResult.update.action === 'ADD_EXTENSION') {
			this.props.addAction(opResult.update.model);
		} else if (opResult.update.action === 'DEL_EXTENSION') {
			this.props.delAction(opResult.update.model);
		} else if (opResult.update.action === 'QUERY_PARAM_ACTION') {
			this.props.prefIgnoreQueryAction();
		} else if (opResult.update.action === 'MEDIA_UPDATE') {
			this.props.updateMediaAction(opResult.update.model);
		} else if (opResult.update.action === 'MEDIA_DOWNLOAD_PROPS_CHANGE') {
			this.props.mediaDownloadChangeAction(opResult.update.model);
		}
	}

	onCloseClick() {
		console.log("Go to source page: " + this.props.from)
		var navInfo = {'to' : this.props.from}

		this.props.navigateAction(navInfo);
		//this.showBanner('warning', 'hoya');
	}


	showBanner(msgType, message) {

		console.log("To display banner with message " + message);
		var bannerProp={style: msgType, message: message, dismiss: false, visible: true};
		var newState = {...this.state};
		newState.banner = bannerProp;
		this.setState(newState);
	}

	onNavToggleClick(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
		$("#sidebarComp").toggleClass("sidebarToggleRotate");
	}

	render() {
		try {
			console.time(this.compname + ".render");
			return this._render();
		} finally {
			console.timeEnd(this.compname + ".render");
		}
	}

	_render() {

		if (this.props.page.to !== 'page3') {
			console.log(this.props.page.to + ": Skip Rendering Preferences....");
			return (
				<li className={this.props.visibility}>
				</li>
			)
		}

		console.log("Rendering Preferences...");
						
		if (this.state.banner) {
			//console.log ("Creating banner model since it is present." + this.state.banner)
			this.bannerModel=this.state.banner;
		} else {
			//console.log("Not creating banner since message is not present.")
			this.bannerModel={visible:false}
		}

		var sideBarHelp="Show or hide sidebar"

		var sideBarButton = (<button type="button"
								id="sidebarComp" 
								className="btn btn-info menu-toggle sidebarToggle"
								data-toggle="tooltip"
								title={sideBarHelp}
								onClick={this.onNavToggleClick.bind(this)}>
								<img className="sidebarToggleIcon" src={sidebarToggle}/>
						</button>);

		return(


<li className={this.props.visibility}>
	<div className="card">

		<div className="card-header bg-primary header">
			<h4 className="card-title text-center text-white">{sideBarButton} Preferences</h4>
		</div>

		<Banner model={this.bannerModel}/>

		<div className="modal-body">
			<PrefTabs state={this.state} showBanner={this.showBanner.bind(this)}/>
		</div>

		<div className="col-sm-12 text-center full-width">
			<button type="button" className="btn btn-secondary btn-lg download" onClick={this.onCloseClick.bind(this)}>Back</button>
		</div>
	</div>
</li>	

		);
	}
}


export default Preferences;