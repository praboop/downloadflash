import React from 'react';
import {g_diskStore} from '../PluginStore.jsx';
import '../css/preftabs.css'
import _ from 'lodash';
import HelpIcon from '../icons/HelpIcon.png';


class SaveOptions extends React.Component {

	constructor(props) {
		super(props);

		this.compname = buildTimeMarker('SaveOptions');
		console.time(this.compname);

		this.DEFAULT_DOWNLOAD_PATH = "Enter path/name/tag relative to Firefox download directory";

		this.toolTip =  "<div class='help-text-dl'> <p>Downloads by default will be saved with original filename and extension in Firefox download directory. " +
		" <i style='color:red;'>Rename tags</i> can be used to organize relative download location and filename of the resource being downloaded."
		+ " <BR>To use, enclose the name of the tag in curly braces {}. "
		+ " <BR>Usage Example:"
		+ " <BR>If today is 10/10/2018 and a link name is test.jpg, then final saved resource for various tag settings:"
		+ " <BR><table style='color:#FCFA9F; font-family:Arial; font-size: 12px' border=1>"
		+ " <thead><th>Setting</th><th>Resolves To</th></thead><tbody>"		
		+ " <tr><td>images/{dd}/{name}.{ext}</td>"
		+ " <td>[Firefox download directory]/images/10/test.jpg</td></tr>"
		+ " <tr><td>{name}_{dd}_{mm}.{ext}</td>"	
		+ " <td>[Firefox download directory]/test_10_10.jpg</td></tr>"			
		+ "</tbody></table></div>"
	}

	componentDidMount() {
		console.timeEnd(this.compname);
		console.timeEnd(window.appTime);
		console.profileEnd('DownloadLinks')
	}

	resolveTags(str) {

		var definedTags = g_diskStore.getTags();

		var BEGIN_TAG='{';
		var END_TAG='}'

		var tags = [];

		var lastTag = {};
		lastTag.text = "";
		var insideTag = false;
		
		$.each(str.split(''),function(index,ch){
			if (ch===BEGIN_TAG) {

				if (lastTag.text != "") {
					tags.push(lastTag);
				}

				lastTag = {};
				lastTag.text = "";

				lastTag.begin = index;
				insideTag = true;
			} else if (ch===END_TAG && insideTag) {
				lastTag.end = index;
				insideTag = false;
				lastTag.text = lastTag.text.trim();
				var foundTag = _.find(definedTags, {'tag' : lastTag.text});
				if (foundTag) {
					console.log("FOUND THE TAG: " + JSON.stringify(foundTag));
					lastTag.ref = foundTag;
				} else {
					// TODO display warning elsewhere
					console.log('WARNING no tag found matching the name ' + lastTag.text);
				}

				tags.push(lastTag);

				lastTag = {};
				lastTag.text = "";
			} else {
			   lastTag.text += ch;
			}
			
		});

		if (lastTag.text != "") {
			tags.push(lastTag);
		}

		return tags;
	}

	handlePathEditDone( media, event ) {
		var newPath = event.currentTarget.value;
		var oldPath = media.downloadDir;

		// no change
		if (newPath === oldPath) {
			return;
		} else  {
			g_diskStore.updateMediaDownloadLocation( media.name, newPath );
			if (newPath === "") {
				event.currentTarget.placeholder = this.DEFAULT_DOWNLOAD_PATH;
			}

			/*
			// CAN BE SHOWN SOMEWHERE while editing in Save Options.
			var tags = this.resolveTags(newPath);

			var resolvedPath = "";

			var param ='http://www.google.com/somefile.txt';

			tags.forEach(tag => {

				if (tag.ref) {
					var executor = new Function("'use strict'; return (" + tag.ref.script + ")")();

					resolvedPath += executor(param);
				} else {
					resolvedPath += tag.text;
				}

			});
			console.log('SaveOptions. For :' + newPath + ',resolved path is: ' + JSON.stringify(resolvedPath))
			*/

		}

		//alert("value on blur is " + value + " media " + media );
		//browser.downloads.showDefaultFolder();
	}

	handlePathEditOnChange( event ) {
		var value = event.currentTarget.value;
		var changedValue = value.replace(/\\/g,"/"); // Correct the path character to forward slash
		//console.log ("changed value1 is " + changedValue);
		changedValue = changedValue.replace(/^\//,''); // Remove leading / since absolute path is disallowed
		//console.log ("changed value2 is " + changedValue);
		changedValue = changedValue.replace(/([^a-z0-9\._~!&()+,;=:@/%{}]+)/gi, '-');
		//console.log( "changed from " + value + " to " + changedValue );
		event.currentTarget.value = changedValue;
	}


	getSaveMediaContent() {
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

			var helpDownloadDir = "", downloadDirValue = "";
			//console.log("HERE ---> " + media.downloadDir)
			if (media.downloadDir === 'default') {
				helpDownloadDir = this.DEFAULT_DOWNLOAD_PATH;
			} else {
				downloadDirValue = media.downloadDir;
			}

			mediaItems.push(
				<tr key={mIndex}>
					<td>
						<span key={mIndex++}>
							<img className="mediaIcon" src={media.iconClass} data-toggle='tooltip' title={media.name}/>
						</span>
					</td>
					<td>
						<input className="form-control" type="text" 
						onBlur={this.handlePathEditDone.bind(this, media)}
						onChange={this.handlePathEditOnChange.bind(this)}
						placeholder={helpDownloadDir} defaultValue={downloadDirValue}></input>
					</td>
				</tr>
			)
			mIndex++;
		}

		return mediaItems
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

		console.log("Rendering SaveOptions...");

		var saveMediaContent = this.getSaveMediaContent();
		return(
				<div className='card'>
				<div className="tab-content" id="urlManagerTabContent">
					<div className="tab-pane fade show active" id="active-url" role="tabpanel" aria-labelledby="active-url-tab">
						<table className="table table-striped" id="viewExtnTable">
							<thead className="thead-dark">
								<tr>
									<th>Media Type</th>
									<th className='col-sm-10'>Save path and file name <img src={HelpIcon} className="help-icon-dl-simple"  
														data-toggle="tooltip" data-html="true" title={this.toolTip}/>
									</th>
								</tr>
							</thead>
							<tbody>
								{ saveMediaContent }
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}
export default SaveOptions;