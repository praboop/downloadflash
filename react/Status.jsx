import React from 'react';
import './app.css';
class Status extends React.Component {

	constructor(props) {
		super(props);

		this.compname = buildTimeMarker('Status');
		console.time(this.compname);

	}

	componentDidMount() {
		console.timeEnd(this.compname);
	}

	onExtensionNav() {
		console.log("Back clicked from status")
		this.props.navigateAction({'from' : 'page2', 'to' : 'page1'});
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
		try {
			console.time(this.compname + ".render");
			return this._render();
		} finally {
			console.timeEnd(this.compname + ".render");
		}
	}

	_render() {

		if (this.props.page.to !== 'page2') {
			console.log(this.props.page.to + ": Skip Rendering Status....");
			return (
				<li className={this.props.visibility}>
				</li>
			)
		}


		let {model} = this.props;
		console.log("Rendering Status...");

		window.extension.downloadlinks.registerEventActions(this);

		this.browserOpenFolder = browser.downloads.showDefaultFolder;
		this.openFolder = () => this.browserOpenFolder();

		// <td>{decodeURIComponent(item.url)}</td>

		let fileStatus = Object.values(model)
				.map( item  => 
				(
					<tr key={item.id}>
						<td data-toggle="tooltip" data-placement="bottom" className='col-9'
							title={decodeURIComponent(item.url)}>{item.filename}</td>
						<td className='col-2'>{item.error != null ? item.error : 
							item.state=='in_progress' ? "downloading..." : item.state}</td>
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
				<table className="table table-striped table-hover table-sm FixedLayoutTable">
				<thead >
					<tr>
					<th colSpan="2">
					    <button type="button" className="btn btn-info customBtn" onClick={this.openFolder.bind(this)}>Open Download Folder</button>
					</th>
					</tr>
					<tr className="thead-dark">
						<th scope='col' className="vMiddleAlign col-9"> Saved as </th>
						<th scope='col' className="vMiddleAlign col-2"> Status </th>
						<th scope='col' className='hidden'> File Size </th>
						<th scope='col' className='hidden'> Downloaded Size </th>
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