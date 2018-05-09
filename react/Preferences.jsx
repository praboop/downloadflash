import React from 'react';
import './app.css';

import {g_diskStore} from './PluginStore.jsx'

class Preferences extends React.Component {

	constructor(props) {
		super(props);
		this.addUserExtensions = this.addUserExtensions.bind(this);
		this.clearUserExtension = this.clearUserExtension.bind(this);
		this.save = this.save.bind(this);
		this.state = { extensions: [] }
		g_diskStore.getUserExtensions(this.addUserExtensions);
		g_diskStore.register(()=> {
			console.log("Updating preferences")
			g_diskStore.getUserExtensions(this.addUserExtensions)}
		);
	}

	addUserExtensions(ext) {
		this.setState({ extensions: ext });
	}

	clearUserExtension(ext) {
		console.log('To remove this extension ' + ext);
		var filtered = this.state.extensions.filter(item => {if (item!=ext)  return item;});
		this.setState({extensions: filtered});
	}

	save() {
		console.log('saving changes');
		g_diskStore.saveUserExtensions(this.state.extensions);
		$(function () {
			$('#exampleModal').modal('toggle');
		 });
	}

	render() {
		
		let choosenExtensions = [];
		let eIndex = 0;
		this.state.extensions.map(extn => { 
			choosenExtensions.push(
				<span key={eIndex} className="item">
					<button onClick={this.clearUserExtension.bind(this, extn)} type="button">x</button>
					{extn}
				</span>
			)
			eIndex++;})

		var prefExtensions = (
			<div>
				<h5> User Extensions </h5>
				{choosenExtensions}
			</div>
		);


		return(
			<div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header bg-primary">
							<h5 className="modal-title text-white" id="exampleModalLabel">Preferences</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							{prefExtensions}
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
							<button type="button" className="btn btn-primary" onClick={this.save.bind()}>Save changes</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Preferences;