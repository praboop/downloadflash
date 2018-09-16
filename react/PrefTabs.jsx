import React from 'react';
import HelpIcon from './icons/HelpIcon.png';

import {g_diskStore} from './PluginStore.jsx';

import RenameTags from './preferences/RenameTags.jsx';
import SaveOptions from './preferences/SaveOptions.jsx';

import donateIcon from './icons/donate_now.png';

import './css/preftabs.css'

class PrefTabs extends React.Component {

	constructor(props) {
		super(props);
		this.compname = buildTimeMarker('PrefTabs');
		console.time(this.compname);

		this.state = props.state;
		this.showBanner = props.showBanner;
		this.segments = {};
		this.ICON_MAP = g_diskStore.getIconMap();
		this.removeUserExtension = this.removeUserExtension.bind(this);
		// this.DEFAULT_DOWNLOAD_PATH = "Enter path relative to download directory";

		//console.log("PRef tabs has been inited. Props: " + JSON.stringify(this.props))
	}

	componentDidMount() {
		console.log("PrefTab: componentDidMount")
		console.timeEnd(this.compname);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.state);  
		//console.log("PRef tabs got comp update. Props: " + JSON.stringify(nextProps))
	}

	buildGeneralSegment() {

		var saveAsTip = "<div class='help-text-dl'> <p>This setting specifies whether a file chooser "
		+ "dialog will prompt to select a filename for every download.<BR>If this option is not set then whether the browser will show the "
		+ "file chooser or not is based on the general user preference for this behavior."
		+ "<BR>    Refer <i style='color:red;'>Firefox preference</i> labeled 'Always ask you where to save files' in about:preferences "
		+ "or browser.download.useDownloadDir in about:config.<BR>"
		+ "    You may want to <u><b>keep this checked</b></u> to disable annoying prompts for every download.</p><div>";

		var imageTip = "<div class='help-text-dl'> <p>If images are being downloaded then enable this option to "
		+ "preview before download in <i style='color:red;'>Filter</i> page.<BR>"
		+ "    Enabling this option would result in prefetch of images in memory so that a thumbnail with size can be shown in "
		+ "<i style='color:red;'>Filter</i> page. " 
		+ " Additionally, you can click on the thumbnail for a mini preview of all images!</p></div>";

		this.segments['General'] = function() {

			function handleSaveAsPrompt(event) {
				g_diskStore.setDisableSaveAsPrompt(event.target.checked);
			};

			function handlePreview(type, event) {
				g_diskStore.setPreviewCheck(type, event.target.checked);
			}


			return (
				<div className='card'>
					<button type="button" className="btn btn-secondary help-button-dl" 
						data-toggle="tooltip" 
						data-html="true" 
						data-placement="bottom" 
						title={saveAsTip}>
					Save As Prompts
					<img src={HelpIcon} className="help-icon-dl" alt='Help for Save As Prompts'/>
					</button>
					<div className='card-body'>
						<div className="checkbox">
							<label><input type="checkbox" defaultChecked={ g_diskStore.isSaveAsPromptDisabled() }
							onClick={ handleSaveAsPrompt.bind(this) }/>   Do not open file location chooser for every download</label>
						</div>
					</div>		
					
					<button type="button" className="btn btn-secondary help-button-dl" 
						data-toggle="tooltip" 
						data-html="true" 
						data-placement="bottom" 
						title={imageTip}>
					Preview Images
					<img src={HelpIcon} className="help-icon-dl" alt='Help for preview images'/>
					</button>
					<div className='card-body'>
						<div className="checkbox">
							<label><input type="checkbox" defaultChecked={ g_diskStore.isPreview('Images') }
							onClick={ handlePreview.bind(this, 'Images') }/>  Preview Images </label>
						</div>
					</div>	


				</div>

			)
		}
	}

	buildSettingsSegment() {
		var prefValue = JSON.stringify(g_diskStore.getPreferences(), null, 2);
		var prefTip = "<div class='help-text-dl'> <p>Current settings that are saved by this add-on in it's local storage. </p></div>"

		this.segments['Settings'] = function() {
			return(
				<div className='card'>
					<button type="button" className="btn btn-secondary help-button-dl" 
						data-toggle="tooltip" 
						data-html="true" 
						data-placement="bottom" 
						title={prefTip}>
					Schema (Readonly)
					<img src={HelpIcon} className="help-icon-dl" alt='Help for view preferences'/>
			  	</button>
				<div className='card-body'>
			 	 <pre id='settings' className='settingsCode all-copy'>
					{prefValue}
				</pre>
				</div>
				</div>

			);
		};
	}

	buildDonateSegment() {
		this.segments['Make a Donation'] = function() {
			var blahblah = "Even though Downloadlinks is a free addon, it costs a lot to develop "
			+ " and maintain. If you think you have benefited by using it, please consider supporting us "
			+ " by making a token donation via paypal."
			return(
				<div className='alert alert-success'>
					<h2>Support Downloadlinks</h2>
					<hr/>
					<h6>{blahblah}</h6>
					<a  href='https://paypal.me/praboop' className="paypalImage" target="_blank" role='button'>
						<input type="image" className="paypalImage" src={donateIcon} border="0" 
							alt="PayPal – The safer, easier way to pay online!"/>										
					</a>
				</div>
			)
		}
	}

	buildRenameTagSegment() {
		this.segments['Rename Tags'] = function() {
			return(
				<RenameTags/>
			);
		};
	}


	getActiveMedia() {
		var mediaGroupDef = g_diskStore.getMediaGroups();
		let mediaItems = [];
		let mIndex=0;
		let eIndex=0;
		for (let media of mediaGroupDef) {

			let extnItems = [];
	
			for (let extn of media.extensions) {
				extnItems.push(		
						<span key={eIndex} className="badge badge-info labelA1">
							<span className="spanA1 font-weight-normal"> {extn} </span>
						</span>
				)

				eIndex++;
			}	
			for (let extn of media.userExtensions) {
				extnItems.push(		
						<span key={eIndex} className="badge item labelA1">
							<span className="spanA1 font-weight-normal"> {extn} </span>
						</span>
				)

				eIndex++;
			}			

			mediaItems.push(
				<tr key={mIndex}>
					<td>
						<span key={mIndex++}>
							<img className="mediaIcon" src={media.iconClass}/>
							{media.name}
						</span>
					</td>
					<td>
						{extnItems}
					</td>
				</tr>
			)
			mIndex++;
		}

		return mediaItems
	}

	handleMediaSelection( event ) {
		var $target = $( event.currentTarget );

		this.selectedMedia = $target.text().trim();

		console.log("To handle media selection " + this.selectedMedia)

		$('#dropdownMedia').text( $target.text() ).end().dropdown( 'toggle' );

		// Enable the disabled items
		$('#extNameCustom').prop('disabled', false);
		$('#addExtnBtn').removeClass('disabled').addClass('toggleBtn')

	    return false;
	}

	buildDropDownMediaNames() {
		var mediaGroupDef = g_diskStore.getMediaGroups();
		this.handleMediaSelection = this.handleMediaSelection.bind(this);

		let mediaNames = [];
		let mIndex=0;

		for (let media of mediaGroupDef) {
			mediaNames.push(<a key={mIndex++} className='dropdown-item' onClick={this.handleMediaSelection} href='#'> {media.name} </a>);
		}

		return (
			<div className="dropdown">
				<button className="btn btn-info dropdown-toggle active" 
					type="button" id="dropdownMedia" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					{'Select Media'}
				</button>
				<div className="dropdown-menu" aria-labelledby="dropdownMedia">
					{mediaNames}
				</div>
			</div>
		);
	}

	onAddNewExtn(event) {
		if ($('#extNameCustom').prop('disabled'))
			return;

		if (!event.keyCode || event.keyCode == 13) {
			let newExtn = $('#extNameCustom').val();
			if (newExtn=='') return;
			if (newExtn.length > 10) {
				this.showBanner('warning', "Extension is " + newExtn.length + " characters. Should be less than 10 characters");
				return;
			}

			console.log('adding new extn: ' + newExtn + ' in category ' + this.selectedMedia);
			//this.showBanner('warning', "Some thing wrong");
			g_diskStore.addUserExtension(this.selectedMedia, newExtn)
		}
		//console.log('ignoring key code ' + event.keyCode);
	}

	removeUserExtension(ext) {
		console.log('To remove this extension ' + ext);
		g_diskStore.removeUserExtension(ext);
	}


	getConfiguredMedia() {
		var mediaGroupDef = g_diskStore.getMediaGroups();
		let mediaItems = [];
		let mIndex=0;
		let eIndex=0;
		let dropDownNames = this.buildDropDownMediaNames();
		this.onAddNewExtn = this.onAddNewExtn.bind(this);
		for (let media of mediaGroupDef) {

			let extnItems = [];
	
			for (let extn of media.userExtensions) {
				extnItems.push(	
					
					<span key={eIndex} className="badge item labelA1">
						<button onClick={this.removeUserExtension.bind(this, extn)} type="button">
						x</button>
						<span className="font-weight-normal">{extn}</span>
					</span>
				/*
						<span key={eIndex} className="badge badge-info labelA1">
							<span className="spanA1 font-weight-normal"> {extn} </span>
						</span>
					*/
				)

				eIndex++;
			}

			if (extnItems.length > 0) {
				mediaItems.push(
					<tr key={mIndex}>
						<td>
							<span key={mIndex++}>
								<img className="mediaIcon" src={media.iconClass}/>
								{media.name}
							</span>
						</td>
						<td>
							{extnItems}
						</td>
					</tr>
				)
			}
			mIndex++;
		}

		var custom = (
			<tr key={mIndex}>
				<td>
					{dropDownNames}
				</td>
				<td>
					<div className="input-group">
						<input disabled id="extNameCustom" type="text" className="form-control btnHeight" 
							placeholder="Enter extension" aria-label="Enter extension" 
							onKeyUp={this.onAddNewExtn}>
						</input>
						<div className="input-group-append">
							<button type="button" id='addExtnBtn' className=" btn btn-info disabled" 
									onClick={this.onAddNewExtn}>Add</button>
						</div>
					</div>
				</td>
			</tr>
		);
		mediaItems.push(custom);

		return mediaItems
	}

	

	buildMediaSegment() {

		var mediaTip = "<div class='help-text-dl'> <p>The table below lists that extensions that are used for classifying link to media types."
		+"<p>The stock extensions are not editable and custom extensions can be added.<div>"

		var activeMediaContent = this.getActiveMedia();
		var customMediaContent = this.getConfiguredMedia();



		this.segments['Extensions'] = function() {

			return (
				<div className='card'>


					<ul className="nav nav-horizontal nav-pills" id="urlManager" role="tablist">
					<li className="nav-item " data-toggle="tooltip" data-html="true" title={mediaTip}>
						<a className="nav-link active" id="active-url-tab" data-toggle="pill" 
							href="#active-url" role="tab" aria-controls="active-url" 
							aria-selected="true">
							Active </a>
					</li>
					<li className="nav-item">
						<a className="nav-link" id="urlconfig-tab" data-toggle="pill" href="#configure-url" 
							role="tab" aria-controls="configure-url" aria-selected="false">
							Custom</a>
					</li>
					</ul>

					<div className="tab-content" id="urlManagerTabContent">
						<div className="tab-pane fade show active" id="active-url" role="tabpanel" aria-labelledby="active-url-tab">
							<table className="table table-striped" id="viewExtnTable">
								<thead className="thead-dark">
									<tr>
										<th>Media Type</th>
										<th>Extensions</th>
									</tr>
								</thead>
								<tbody>
									{ activeMediaContent }
								</tbody>
							</table>
						</div>

						<div className="tab-pane fade" id="configure-url" role="tabpanel" aria-labelledby="urlconfig-tab">
							<table className="table table-striped" id="viewExtnTable">
									<thead className="thead-dark">
										<tr>
											<th>Media Type</th>
											<th>User Extensions</th>
										</tr>
									</thead>
									<tbody>
										{ customMediaContent }
									</tbody>
							</table>
						</div>
					</div>

				</div>

			)
		}

	}

	buildSaveFileSegment() {

		this.segments['Save Options'] = function() {
			return(
				<SaveOptions/>
			);
		};

	}

	render() {
		try {
			console.time(this.compname + ".render");
			return this._render();
		} finally {
			console.timeEnd(this.compname + ".render");
		}
	}

	_render () {

		// console.log("PRef child is rendered. state is " + JSON.stringify(this.state))
		console.log("Rendering PrefTabs...");

		if (this.state.inited) {

			this.buildGeneralSegment();
			this.buildMediaSegment();
			this.buildRenameTagSegment();
			this.buildSaveFileSegment();
			this.buildSettingsSegment();
			this.buildDonateSegment();

			var tabNames = []
			var tabContent = []
	
			var index=0;
			Object.keys(this.segments).forEach(
				title => {
					var uniqueTabId = 'v-pills-tab' + index;
					tabNames.push(
						<a key={index} className={ "nav-link " + ((index==0) ? "active" : "") } 
							id={ uniqueTabId + '-tab' }
							data-toggle="pill"
							href={'#' + uniqueTabId }
							role="tab" 
							aria-controls={uniqueTabId} 
							aria-expanded={ (index==0) ? "true" : "false" }>{title}</a>
					)
	
	
					tabContent.push(
						<div key={index} className={ "tab-pane fade show " + ((index==0) ? "active" : "") } 
							id={uniqueTabId} 
							role="tabpanel" 
							aria-labelledby={ uniqueTabId + '-tab' }>{this.segments[title]()}</div>					
					)
					index++;
				}
			)
	
			return (
				<div id="wrapper" className="toggled">
				  <div id="sidebar-wrapper">
					
						<div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist">
							{tabNames}
						</div>
					
				  </div>

					<div className="page-content-wrapper">
						<div className="container-fluid">
							<div className="row">
							<div className="col-lg-12">
								<div className="tab-content" id="v-pills-tabContent">
									{tabContent}
								</div>
							</div>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div> Loading... </div>
			)
		}
	}

}

export default PrefTabs;