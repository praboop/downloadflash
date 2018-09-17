import React from 'react';
import { g_diskStore } from './PluginStore.jsx';

class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.release = '4.0'
	}

	dismiss() {
		window.extension.downloadlinks.welcomeDismissed = true;
		window.extension.downloadlinks.showPopup();
	}

	doNotShow(e) {
		if (e.currentTarget.id !== 'dnd') {
			// Toggle only for parent container click
			$('#dnd')[0].checked = !$('#dnd').prop('checked');
		}

		var internal = g_diskStore.getInternal();
		internal.doNotShowWelcome = $('#dnd').prop('checked');

		g_diskStore.updateInternal(internal);

		e.stopPropagation();
	}

	render() {
		return (
			<div className="alert  " role="alert">

			<div className="card-header bg-primary header col-sm-12">
				<h4 className="card-title text-center text-white">
					Downloadlinks {this.release}</h4>
			</div>
			
				<h5>
					<br/>
					Welcome to new release of Download links! New features pertaining to this release are listed below.
					<br/>
			
				</h5>
				<br/>

					<table className="table table-sm table-striped">
						<thead className="thead-dark"><tr><th>{this.release} Features</th></tr></thead>
						<tbody>
							<tr><td>Feature to organize downloads by directory, rename files by each file type</td></tr>
							<tr><td>Feature to create custom tags from link data</td></tr>
							<tr><td>Feature to display image size</td></tr>
							<tr><td>Feature to preview images</td></tr>
						</tbody>
					</table>

				<hr/>
				<h5>
					To drop a feedback or report issues, kindly click 
					<a href='https://addons.mozilla.org/en-US/firefox/addon/download-links/' target="_blank"> on this link</a>
				</h5>

				<div className="input-group-append" id='parent' onClick={this.doNotShow.bind(this)}>
				<span className="input-group-text px-2"><input type='checkbox' id='dnd' className='dl-mr-6px' onClick={this.doNotShow.bind(this)}/> Do not show this again</span>
				</div>

				<div className='col-sm-12 text-center'>
				
				<button type="button" onClick={this.dismiss.bind(this)} className="btn btn-primary btn-lg download text-center">
					 Dismiss			
				</button>
				</div>



			</div>
		);
	}
}

export default Welcome;
