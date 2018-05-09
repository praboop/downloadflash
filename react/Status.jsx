import React from 'react';
import './app.css';
class Status extends React.Component {

	constructor(props) {
		super(props);
	}

	onExtensionNav() {
		console.log("Back clicked from status")
		this.props.navigateAction('page1');
	}

	itemCreated(item) {
		console.log("Adding item");
		this.props.itemCreated(item);
	}

	itemChanged(item) {
		console.log("Updating item");
		this.props.itemChanged(item);
	}

	updateData(incoming) {
		//console.log("Status Component: To update data " + incoming);
		//this.setState({statDownInitAction: incoming})
		//this.props.initAction(incoming);
	}

	render() {
		let {model} = this.props;
		console.log('In status, model is ' + JSON.stringify(model));
		window.extension.downloadlinks.registerEventActions(this);

		this.browserOpenFolder = browser.downloads.showDefaultFolder;
		this.openFolder = () => this.browserOpenFolder();
		let fileStatus = Object.values(model)
				.map( item  => 
				(
					<tr key={item.id}>
						<td>{decodeURIComponent(item.url)}</td>
						<td>{item.state=='in_progress' ? "downloading..." : item.state}</td>
						<td className='hidden'>{item.totalBytes}</td>
						<td className='hidden'>{item.bytesReceived}</td>
					</tr>
					)
			);

		return (
			<li className={this.props.visibility}>
			<div className="card">
				<div className="card-header bg-primary">
					<h4 className="card-title text-center text-white">Download status</h4>
				</div>
				<div className="card-body">
				<table className="table table-striped table-hover EasyTableSearch">
				<thead >
					<tr>
					<th colSpan="4">
					    <button type="button" className="btn btn-info customBtn" onClick={this.openFolder.bind(this)}>Open Download Folder</button>
					</th>
					</tr>
					<tr className="thead-dark">
						<th> Filename </th>
						<th> Status </th>
						<th className='hidden'> File Size </th>
						<th className='hidden'> Downloaded Size </th>
					</tr>
					</thead>
					<tbody>
						{fileStatus}
					</tbody>
					</table>
				</div>
				<div className="col-sm-12 text-center full-width">
					<button type="button" onClick={this.onExtensionNav.bind(this)} className="btn btn-primary btn-lg download">
						<span className="glyphicon glyphicon-arrow-left"></span> Back
					</button>
				</div>
			</div>
			</li>
		);
	}
}

export default Status;