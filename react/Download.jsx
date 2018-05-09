import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './app.css';
import downloadActions from './actions';
import Status from './Status.jsx';
import Banner from './Banner.jsx';

import arrowLeft from './icons/arrow_backward.svg';
import arrowDownload from './icons/arrow_download.svg';
import arrowRight from './icons/arrow_forward.svg';
import settings from './icons/settings.svg';
import Preferences from './Preferences.jsx';



class Download extends React.Component {
	constructor(props) {
		super(props);
		this.onAddNewExtn = this.onAddNewExtn.bind(this);
	}

	onAddNewExtn(event) {
		if (!event.keyCode || event.keyCode == 13) {
			let newExtn = this.refs.textNewExtn.value;
			console.log('adding new extn: ' + newExtn);
			this.props.addNew(newExtn);
		}
		//console.log('ignoring key code ' + event.keyCode);
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

		if (filteredData.length==0) {
			this.props.showBannerAction('info', "No files have been selected for download!");
			return;
		}

		this.props.navigateAction('page2');
		
		window.extension.downloadlinks.download(filteredData);
	}


	render() {

		console.log ('Download.jsx: reading from props ' + JSON.stringify(this.props));

		let { page, urlData, mediaGroups, banner, statusData,  pickExisting, mediaClick, addNew, navigateAction, toggleAction, checkAction, 
			statDownInitAction, statItemCreatedAction, statItemChangedAction, showBannerAction } = this.props;
		// console.log('properties: ' + JSON.stringify(this.props));
		this.toggleAction = toggleAction.bind(this);
		this.startDownload = this.startDownload.bind(this);
		this.statDownInitAction = statDownInitAction.bind(this);
		this.statItemCreatedAction = statItemCreatedAction.bind(this);
		this.statItemChangedAction = statItemChangedAction.bind(this);
		this.showBannerAction = showBannerAction.bind(this);

		/*
		let extItems = extData.map((extDetail, index) => (
			<button key={index} type="button" className="btn btn-info" onClick={pickExisting.bind(this, extDetail)} >{extDetail.name}</button>
		));
		*/

		console.log('Total default media groups:' + mediaGroups.length);


		let mediaItems = [];
		let choosenItems = [];
		let mIndex = 0;
		let eIndex = 0;
		for (let media of mediaGroups) {
			let extnItems = [];
	
			for (let extn of media.extensions) {
				extnItems.push(		
						<span key={eIndex} className="badge badge-info labelA1" onClick={pickExisting.bind(this, extn)}>
							<input className="big-checkbox" 
							type="checkbox" checked={extn.isSelected}>
							</input>
							<span className="spanA1 font-weight-normal"> {extn.name} </span>
							<span className="badge badge-pill dl-badge-info"> {extn.count}</span>
						</span>
				)
				if (extn.isSelected) {
					choosenItems.push(
						<span key={eIndex} className="item">
							<button onClick={pickExisting.bind(this, extn)} type="button">x</button>
							{extn.name}
						</span>
					)
				}

				eIndex++;
			}
			mediaItems.push(
				<tr key={mIndex}>
					<td>
						<button key={mIndex++} type="button" 
							className="btn btn-info customBtn"
							onClick={mediaClick.bind(this, media)}>
								<img className="mediaIcon" src={media.iconClass}/>
								{media.mediaName}
						</button>
					</td>
					<td>
						{extnItems}
					</td>
				</tr>
			)
		};


		let toggleBtn = (
			<button key='toggleBtn' type="button" className="btn btn-info markBtn toggleClass toggleBtn" onClick={this.toggleVisible.bind(this, urlData)}>
			<span>Mark</span></button>
		);

		let totalCheckedUrls = 0;
		urlData.forEach(urlDetail => {
			if (urlDetail.download == true) totalCheckedUrls++;
		});
		let urlTableRowData = urlData
			.map((urlDetail, index) => 
				{
				var media = mediaGroups.filter(media => media.mediaId==urlDetail.mediaId)[0];

				return(
				<tr key={index}>
					<td>{urlDetail.index}</td>
					<td>
						<span className={'label label-info DottedBox_content'}>
							<img className="mediaIcon" src={media.iconClass}/>
						</span>
					</td>
					<td>{urlDetail.download ?
					(
						<input type="checkbox" checked='true' onClick={checkAction.bind(this, urlDetail)}/>
					):
					(
						<input type="checkbox" onClick={checkAction.bind(this, urlDetail)}/>
					)}</td>
					<td className="all-copy">{decodeURIComponent(urlDetail.url)}</td>
				</tr>
				)
				}
		);

		let showOnlyChecked = (
			<div className="input-group">
				<span className="input-group-addon">
					<b> <input id='ShowChecked' type="checkbox"/> Show Checked Items</b>
				</span>	
			</div>
		);

		if (!banner) {
			banner = {visible: false};
		}

		this.bannerObj = <Banner model={banner}/>;

		var gearButton = (<button type="button" 
							className="btn btn-info settings"
							data-toggle="modal" data-target="#exampleModal">
							<img className="settingsIcon" src={settings}/>
						</button>);
		

		// <div style={{"height" : "300px", "width" : "600px"}}>

		return (
			<div>
				<ul className="nav">

					<li className={this.getPageClass('page0', page)}>
						<Preferences/>
						<div className="card">

							<div className="card-header bg-primary header">
								<h4 className="card-title text-center text-white">Select/Add file types to download {gearButton}</h4>
								
							</div>
							{ this.bannerObj }
							<div className="card-body">
								<table className="table table-striped">
									<thead className="thead-dark">
										<tr>
											<th>Select by Media</th>
											<th>Select by Extension</th>
										</tr>
									</thead>
									<tbody>
										{mediaItems}
										<tr>
											<td>Something else?</td>
											<td>
												<div className="input-group">
													<input ref="textNewExtn" type="text" className="form-control btnHeight" 
														placeholder="Enter extension" aria-label="Enter extension" 
														aria-describedby="basic-addon2"
														onKeyUp={this.onAddNewExtn}>
													</input>
													<div className="input-group-append">
														<button type="button" className="toggleBtn btn btn-info" 
																onClick={this.onAddNewExtn}>Add</button>
													</div>
												</div>
											</td>
										</tr>
									</tbody>
								</table>


							</div>
							<div className="card-footer">
								{choosenItems}
									<h5>
									Files to download: {totalCheckedUrls}
									</h5>
							</div>
							<div className="col-sm-12 text-center full-width">
								<button type="button" onClick={this.onFilterNav.bind(this)} className="btn btn-primary btn-lg download">
								Filter Files <img className="arrowIcons" src={arrowRight}/>
								</button>
							</div>
						</div>
					</li>
					<li className={this.getPageClass('page1', page)}>
						<div className="card">
							<div className="card-header bg-primary">
								<h4 className="card-title text-center text-white">Verify files selected for download</h4>
							</div>
							{ this.bannerObj }
							<div className="card-body">
								<div>{showOnlyChecked}</div>
								<table className="table table-striped table-hover EasyTableSearch">
								<thead>
									<tr>
										<th colSpan="4"><input type="text" className="search_input" placeholder="search"/></th>
									</tr>
									<tr className="thead-dark">
										<th data-sort="index" className="vMiddleAlign">#</th>
										<th data-sort="String" className="vMiddleAlign">Type</th>
										<th data-sort="String" className="vMiddleAlign">{toggleBtn}</th>
										<th data-sort="String" className="vMiddleAlign">URL</th>
									</tr>
								</thead>
								<tbody>
									{urlTableRowData}
								</tbody>
								</table>								
							</div>
							<div className="card-footer">
									<h5>
										Files to download: {totalCheckedUrls}
									</h5>
							</div>
							<div className="col-sm-12 text-center full-width">
								<button type="button" onClick={this.onExtensionNav.bind(this)} className="btn btn-primary btn-lg download">
								<img className="arrowIcons" src={arrowLeft}/> Back
								</button>
								<button type="button" className="btn btn-success btn-lg download" onClick={this.startDownload.bind(this, urlData)}>
								<img className="arrowIcons" src={arrowDownload}/> Download
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
		page : state.extensionData.page,
		urlData : state.extensionData.data,
		mediaGroups: state.extensionData.mediaGroups,
		banner: state.extensionData.banner,
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