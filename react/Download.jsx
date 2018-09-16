import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './app.css';
import downloadActions from './actions';
import Status from './Status.jsx';
import Filter from './Filter.jsx';
import Banner from './Banner.jsx';
import Gear from './preferences/Gear.jsx';


import arrowRight from './icons/arrow_forward.svg';
import Preferences from './Preferences.jsx';



class Download extends React.Component {
	constructor(props) {
		super(props);
		this.compname = buildTimeMarker('Download');
		console.time(this.compname);

		let { page, urlData, banner, statusData,  pickExisting, mediaClick, addNew, navigateAction, 
			statDownInitAction, statItemCreatedAction, statItemChangedAction, showBannerAction } = this.props;
		// console.log('properties: ' + JSON.stringify(this.props));

		this.banner = banner;
		this.pickExisting = pickExisting.bind(this);
		this.mediaClick = mediaClick.bind(this);
		this.mediaGroups = this.props.mediaGroups;
		this.statDownInitAction = statDownInitAction.bind(this);
		this.statItemCreatedAction = statItemCreatedAction.bind(this);
		this.statItemChangedAction = statItemChangedAction.bind(this);
		this.showBannerAction = showBannerAction.bind(this);

	}

	componentDidMount() {
		console.timeEnd(this.compname);
	}

	onFilterNav() {
		//console.log("To do filter")
		this.props.navigateAction({'from' : 'page0', 'to' : 'page1'});
	}

	getPageClass(pageId, activePage) {
		var clazz = pageId===activePage.to ? 'show' : 'hidden';
		// console.log(pageId + ' - ' + clazz);
		return clazz;
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

		// console.log ('Download.jsx#render() -> props: ' + JSON.stringify(this.props));
/*
		if (this.props.page.to !== 'page0') {
			console.log(this.props.page.to + ": Skip Rendering Download....");
			return;
		}
*/

		console.log("Rendering Download..." + JSON.stringify(this.props.page));

		/*
		let extItems = extData.map((extDetail, index) => (
			<button key={index} type="button" className="btn btn-info" onClick={pickExisting.bind(this, extDetail)} >{extDetail.name}</button>
		));
		*/

		// console.log('Total default media groups:' + this.mediaGroups.length);


		let mediaItems = [];
		let choosenItems = [];
		let mIndex = 0;
		let eIndex = 0;
		for (let media of this.mediaGroups) {
			let extnItems = [];
	
			for (let extn of media.extensions) {
				extnItems.push(		
						<span key={eIndex} className="badge badge-info labelA1" onClick={this.pickExisting.bind(this, extn)}>
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
							<button onClick={this.pickExisting.bind(this, extn)} type="button">x</button>
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
							onClick={this.mediaClick.bind(this, media)}>
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

		let totalCheckedUrls = 0;
		this.props.urlData.forEach(urlDetail => {
			if (urlDetail.download == true) totalCheckedUrls++;
		});

		if (!this.banner) {
			this.banner = {visible: false};
		}

		this.bannerObj = <Banner model={this.banner}/>;

		this.header = (
			<div className="card-header bg-primary header">
				<h4 className="card-title text-center text-white">
					Select file types to download <Gear navigateAction={this.props.navigateAction} from='page0'/></h4>
			</div>
		);


		// <div style={{"height" : "300px", "width" : "600px"}}>

		return (
			<div>
				<ul className="nav full-width">

					<li className={this.getPageClass('page0', this.props.page)}>
						<div className="card">
							{ this.header }
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

					<Filter model= {this.props.urlData}
						page = {this.props.page}
						banner = {this.props.banner}
						mediaGroups = {this.props.mediaGroups}
						totalCheckedUrls = {totalCheckedUrls}
						checkAction = {this.props.checkAction}
						navigateAction={this.props.navigateAction}
						toggleAction={this.props.toggleAction}
						showBannerAction={this.props.showBannerAction}
						showOnlyCheckedAction={this.props.showOnlyCheckedAction}
						visibility={this.getPageClass('page1', this.props.page)}> </Filter>

					<Status model = {this.props.statusData} 
					    page = {this.props.page}
						initAction={this.statDownInitAction}
						navigateAction={this.props.navigateAction}
						itemCreated={this.statItemCreatedAction}
						itemChanged={this.statItemChangedAction}
					 	visibility={this.getPageClass('page2', this.props.page)}> </Status>

					<Preferences visibility={this.getPageClass('page3', this.props.page)}
								page = {this.props.page}
								from={this.props.page.from}
								navigateAction={this.props.navigateAction}
								addAction={this.props.addNew}
								delAction={this.props.delAction}
								prefIgnoreQueryAction={this.props.prefIgnoreQueryAction}
								mediaDownloadChangeAction={this.props.mediaDownloadChangeAction}/> 

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