import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import { Button } from 'react-bootstrap';
import { Label } from 'react-bootstrap';
import './app.css';
import downloadActions from './actions';
import Status from './Status.jsx';

class Download extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	onClick() {
		let newExtn = this.refs.textNewExtn.value;
		console.log('new extn: ' + newExtn);
		this.props.addNew(newExtn);
	}

	onFilterNav() {
		console.log("To do filter")
		this.props.navigateAction('page1');
	}

	onExtensionNav() {
		console.log("To choose extensions")
		this.props.navigateAction('page0');
	}

	getPageClass(pageId, activePage) {
		var clazz = pageId===activePage ? 'show' : 'hidden';
		console.log(pageId + ' - ' + clazz);
		return clazz;
	}

	toggleVisible(urlData) {
		//var table = $(this).closest("table");
		var table=$(".EasyTableSearch");
		var rowIndex=0;
		var newUrlData = [...urlData];
		table.find('tbody > tr').each(function() {
			var $row = $(this);
			if ($row.is(":visible")) {
				newUrlData[rowIndex].download = !newUrlData[rowIndex].download;
			}
			rowIndex++;
		});
		this.toggleAction(newUrlData);
	}

	startDownload(urlData) {
		var filteredData = [...urlData].filter(
			extDetail => {return extDetail.download})
			.map(extDetail => extDetail.url );
		console.log('to start download for: ' + JSON.stringify(filteredData));
		this.props.navigateAction('page2');
		
		window.extension.downloadlinks.download(filteredData);
	}


	render() {

		console.log ('Download.jsx: reading from props ' + JSON.stringify(this.props));

		let { extData, page, urlData, statusData,  pickExisting, addNew, navigateAction, toggleAction, checkAction, 
			statDownInitAction, statItemCreatedAction, statItemChangedAction } = this.props;
		// console.log('properties: ' + JSON.stringify(this.props));
		this.toggleAction = toggleAction.bind(this);
		this.startDownload = this.startDownload.bind(this);
		this.statDownInitAction = statDownInitAction.bind(this);
		this.statItemCreatedAction = statItemCreatedAction.bind(this);
		this.statItemChangedAction = statItemChangedAction.bind(this);

		let extItems = extData.map((extDetail, index) => (
			<button key={index} type="button" className="btn btn-info" onClick={pickExisting.bind(this, extDetail)} >{extDetail.name}</button>
		));

		let choosenItems = extData
				.filter(extDetail => { return extDetail.isSelected })
				.map((extDetail, index) => (
					<span key={index} className="item">
						<button onClick={pickExisting.bind(this, extDetail)} type="button">x</button>
						{extDetail.name}
					</span>
				));

		let toggleBtn = (
			<button key='toggleBtn' type="button" className="btn btn-info toggleBtn" onClick={this.toggleVisible.bind(this, urlData)} >Check/Uncheck</button>
		);

		let totalCheckedUrls = 0;
		urlData.forEach(urlDetail => {
			if (urlDetail.download) totalCheckedUrls++;
		});
		let urlTableRowData = urlData
			.map((urlDetail, index) => 
				(
				<tr key={index}>
					<td>{urlDetail.index}</td>
					<td>{urlDetail.type}</td>
					<td>{urlDetail.download ?
					(
						<input type="checkbox" checked='true' onClick={checkAction.bind(this, urlDetail)}/>
					):
					(
						<input type="checkbox" onClick={checkAction.bind(this, urlDetail)}/>
					)}</td>
					<td>{urlDetail.url}</td>
				</tr>
				)
		);

		let showOnlyChecked = (
			<div className="input-group">
				<span className="input-group-addon">
					<b> <input id='ShowChecked' type="checkbox"/> Show Checked Items</b>
				</span>	
			</div>
		);

		return (
			<div>
				<ul className="nav">
					<li className={this.getPageClass('page0', page)}>
						<div className="panel panel-primary">
							<div className="panel-heading">
								<h3 className="panel-title">Select/Add file types to download</h3>
							</div>
							<div className="panel-body">
								<div className="btn-group-vertical col-xs-4 button-wrapper">
									{extItems}
								</div>
								<div className="input-group col-xs-4">
									<span className="input-group-btn">
										<input ref="textNewExtn" type="text" className="form-control col-md-9" />
										<button type="button" className="customBtn btn btn-info" 
											onClick={this.onClick}>Add</button>
									</span>
								</div>
							</div>
							<div className="panel-footer fixedWidth">
								{choosenItems}
								<h4>
									Matching files: {totalCheckedUrls}
								</h4>
							</div>
							<div className="col-sm-6 text-center full-width">
								<button type="button" onClick={this.onFilterNav.bind(this)} className="btn btn-primary btn-lg download">
									Filter Files <span className="glyphicon glyphicon-arrow-right"></span> 
								</button>
							</div>
						</div>
					</li>
					<li className={this.getPageClass('page1', page)}>
						<div className="panel panel-primary">
							<div className="panel-heading">
								<h3 className="panel-title">Verify files selected for download</h3>
							</div>
							<div className="panel-body">
								<div>{showOnlyChecked}</div>
								<table className="table table-striped table-hover EasyTableSearch">
								<thead>
									<tr>
										<th colSpan="4"><input type="text" className="search_input" placeholder="search"/></th>
									</tr>
									<tr>
										<th data-sort="index">#</th>
										<th data-sort="String">Type</th>
										<th data-sort="String">{toggleBtn}</th>
										<th data-sort="String">URL</th>
									</tr>
								</thead>
								<tbody>
									{urlTableRowData}
								</tbody>
								</table>								
							</div>
							<div className="panel-footer">
									<h4>
										Files to download: {totalCheckedUrls}
									</h4>
							</div>
							<div className="col-sm-6 text-center full-width">
								<button type="button" onClick={this.onExtensionNav.bind(this)} className="btn btn-primary btn-lg download">
									<span className="glyphicon glyphicon-arrow-left"></span> Back
								</button>
								<button type="button" className="btn btn-success btn-lg download" onClick={this.startDownload.bind(this, urlData)}>
									<span className="glyphicon glyphicon-download"></span> Download
								</button>
							</div>
						</div>
					</li>

					<Status model = {this.props.statusData} 
						initAction={this.statDownInitAction}
						navigateAction={this.props.navigateAction}
						itemCreated={this.statItemCreatedAction}
						itemChanged={this.statItemChangedAction}
					 	visibility={this.getPageClass('page2', page)}> </Status>
				</ul>
			</div>
		)
	}
}

// export default Download;

function mapStateToProps(state) {
	//console.log('original - state here is: ' + JSON.stringify(state))
	return {
		extData : state.extensionData.extensions,
		page : state.extensionData.page,
		urlData : state.extensionData.data,
		statusData: state.downloadStatusData
	}
}

function mapDispatchToProps(dispatch){
	var boundOnes = bindActionCreators (downloadActions, dispatch);
	return boundOnes;
}


function a(state) {
	console.log('state here is: ' + state)
	return {extData: [ {name: 'abc'}, { name: 'def'}, { name: 'ghi'} ]};
}


function b(dispatch) {
	console.log('dispatch here is: ' + dispatch)
	dispatch({ type : 'INCREMENT'});
	return {'123' : '456'};
}

export default connect (mapStateToProps, mapDispatchToProps) (Download);