import React from 'react';
import './app.css';
import HelpIcon from './icons/HelpIcon.png';
import arrowLeft from './icons/arrow_backward.svg';
import arrowDownload from './icons/arrow_download.svg';
import brokenLinkIcon from './icons/BrokenLink.svg';
import Banner from './Banner.jsx';
import ImagePreview from './ImagePreview.jsx';
import {g_diskStore} from './PluginStore.jsx';
import Gear from './preferences/Gear.jsx';

import './js/SearchingPlugin.js';

//import './css/test_scroll.css';
//import './js/testScroll.js';
import './js/jQuery.loadScroll.js';

/*
	TODO:
	2. Filter by image size
*/

class Filter extends React.Component {
	constructor(props) {
		super(props);
		this.showUrl = 'Saving in';
		this.showDwn = 'Source link';

		this.compname = buildTimeMarker('Filter');
		console.time(this.compname);

		this.state = {
			description : this.showDwn,
			tags : g_diskStore.getTags()
		}

		var parent = this;
		g_diskStore.register( (opResult)=> {
			console.log('FILTER. GOT UPDATE. ACTION: ' + JSON.stringify(opResult));
			console.log('FILTER opresult error? ' + (opResult.error))
			if (!opResult.error && opResult.update.action == 'TAG_UPDATE') {
				console.log('FILTER forcing update');
				var state = {...parent.state};
				state.tags = g_diskStore.getTags();
				parent.setState( state );
			}
		});
		
	}

	componentDidMount() {
		console.timeEnd(this.compname);
	}

	componentDidUpdate() {
		if (this.props.page.to !== 'page1') { // some model got changed but we are not showing this component yet.
			return;
		}

		console.time(this.compname + ".componentDidUpdate");

		window.extension.downloadlinks.initSearch();

		console.log("Filter.jsx=> componentDidUpdate!")
		$(".search_input").keyup();

		// This needs to be done for the tooltips to work
		$('[data-toggle="tooltip"]').tooltip()

		$('#filterTbody').scroll(); // will force rendering of images in view.

		console.timeEnd(this.compname + ".componentDidUpdate");

	}

	onMediaSelectNav() {
		console.log("Back clicked from Filter. Navigating to Media selection")
		this.props.navigateAction({'from' : 'page1', 'to' : 'page0'});
	}

	onMarkClick(urlData) {
		//console.log('onMark -> before');
		//console.table(urlData);

		var newUrlData = [...urlData].map(item => {
			//console.log('hit -> ' + JSON.stringify(item))
			item.download = !item.download;
			return item;
		})

		//console.log('onMark -> after');
		//console.table(newUrlData);


		/*
		var table=$(".EasyTableSearch");
		var rowIndex=0;
		table.find('tbody > tr').each(function() {
			var $row = $(this);
			if ($row.is(":visible")) {
				newUrlData[rowIndex].download = !newUrlData[rowIndex].download;
			}
			rowIndex++;
		});
		*/
		this.toggleAction(newUrlData);
	}

	nextDesc() {
		return (this.state.description === this.showUrl) ? this.showDwn : this.showUrl;
	}

	toggleDescription(urlData) {
		this.setState({description: this.nextDesc()});
	}

	markBrokenLink(brokenUrl) {
		console.log('to mark broken link: ' + brokenUrl);
		var urlData = [...this.props.model];
		urlData.forEach(data => {
			if (data.linkObj.url === brokenUrl) {
				data.isBrokenLink = true;
				data.download = false;
			}
		})
		this.toggleAction(urlData);
	}

	startDownload(urlData, mediaGroups) {
		var filteredData = [...urlData].filter(
			extDetail => {return extDetail.download})
			.map(extDetail => { return { linkObj : extDetail.linkObj, downloadPath: extDetail.downloadPath, mediaId: extDetail.mediaId } }  );
		console.log('to start download for: ' + JSON.stringify(filteredData));

		if (filteredData.length==0) {
			this.props.showBannerAction('info', "No files have been selected for download!");
			return;
		}
		this.props.navigateAction({'from' : 'page1', 'to' : 'page2'});
		window.extension.downloadlinks.download(filteredData, mediaGroups, g_diskStore.isSaveAsPromptDisabled());
	}	

	resolveTags(str) {

		var definedTags = this.state.tags;

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
					//console.log("FOUND THE TAG: " + JSON.stringify(foundTag));
					lastTag.func = new Function("'use strict'; return (" + foundTag.script + ")")();
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

	resolveDownloadLocation(tags, linkObj) {

		var resolvedPath = "";

		tags.forEach(tag => {

			if (tag.func) {
				// var executor = new Function("'use strict'; return (" + tag.ref.script + ")")();

				resolvedPath += tag.func(linkObj);
			} else {
				resolvedPath += tag.text;
			}
		});

		return resolvedPath;
	}

	render() {
		try {
			console.time(this.compname + ".render");
			return this._render();
		} finally {
			console.timeEnd(this.compname + ".render");
		}
	}

	_render1() {
		return (
			<div>
				<table id='demo' border='1'>
				<thead>
				<tr>
					<td className='col1'>#</td><td className='h2'>content</td>
				</tr>
				</thead>
				<tbody id='filterTbody'>
				<tr id='filterRow0'><td className='col1'>1</td><td id='1' className='data'>one</td></tr>
				<tr id='filterRow1'><td className='col1'>2</td><td id='2' className='data'>two</td></tr>
				<tr id='filterRow2'><td className='col1'>3</td><td id='3' className='data'>three</td></tr>
				<tr id='filterRow3'><td className='col1'>4</td><td id='4' className='data'>four</td></tr>
				</tbody>
				</table>

				<span id='log'></span>
			</div>
		)
	}

	_render() {

		if (this.props.page.to !== 'page1') {
			console.log(this.props.page.to + ": Skip Rendering Filter....");
			return (
				<li className={this.props.visibility}>
				</li>
			)
		}


		console.log("Rendering Filter...");

		this.startDownload = this.startDownload.bind(this);

		this.markBrokenLink = this.markBrokenLink.bind(this);

		this.toggleAction = this.props.toggleAction.bind(this);

		let filterGroup = (
			<div className="input-group align-middle" style={{ alignItems: 'center' }}>
				<span className="input-group-addon">
					<input type="text" className="search_input" placeholder="search"/>
				</span>
				<span className="input-group-addon" onClick={this.props.showOnlyCheckedAction.bind(this)}>
					<b> <input id='ShowChecked' type="checkbox"/> Show Checked Items</b>
				</span>		
			</div>
		);

		let urlData = this.props.model;
		let mediaGroups = this.props.mediaGroups;
		let checkAction = this.props.checkAction;

		let mediaGroupTags = [];


		console.time(this.compname + ".resolveTags");
		mediaGroups.forEach(media => {
			//console.log("Resolving for media ID: " + media.mediaId + " Media " + media.mediaName);
			mediaGroupTags[media.mediaId] = this.resolveTags(media.downloadDir);
		})
		console.timeEnd(this.compname + ".resolveTags");

		let toggleCheck = (
			<button key='toggleCheck' type="button" className="btn btn-info markBtn toggleClass toggleCheck" onClick={this.onMarkClick.bind(this, urlData)}>
			<span>Mark</span></button>
		);

		var activeTagTip = "<div class='help-text-dl'> <p>Click the button in left to view original link or where it will be saved in. "
		+ "By default, all links will be saved in default download directory that is set in Firefox preferences."
		+ " <BR>If you would like to organise in different folders relative to that folder then customisation options are available in plugin "
		+ " <i style='color:red;'>Preferences->Save Options</i>. Click on the gear icon in top right corner to launch plugin preferences.</div>"

		let toolTipImage = (
			<img src={HelpIcon} className="help-icon-dl-simple"  
			data-toggle="tooltip" data-html="true" data-placement="bottom" title={activeTagTip}/>
		);

		let toggleDesc = (
			<div>
				<button key='toggleDesc' 
					type="button" 
					className="btn btn-info markBtn toggleClass" 
					onClick={this.toggleDescription.bind(this, urlData)}>
				<span>{this.nextDesc()}</span>
				</button>
				<span className='p-3'>{toolTipImage}</span>
			</div>
		);

		var isShowChecked = $("#ShowChecked").prop('checked')
		var isImgPreviewEnabled = g_diskStore.isPreview('Images');
		var imgNo=-1;

		this.images = [];

		console.time(this.compname + ".buildtable");
		let urlTableRowData = urlData
			.filter((urlData) => {
				var ret = (isShowChecked) ? urlData.download : true;
				//console.log("FILTER ROW -> " + ret + " FOR " + JSON.stringify(urlData));
				return ret;
			})
			.map((urlDetail, index) => 
				{
				//console.log("FILTER: PROCESSING ROW -> " + JSON.stringify(urlDetail));
				var media = mediaGroups.filter(media => media.mediaId==urlDetail.mediaId)[0];
				var imageContId;
				// var decodedUrl = decodeURIComponent(urlDetail.url);
				var linkObj = {...urlDetail.linkObj};
				linkObj.url =  decodeURIComponent(urlDetail.linkObj.url);

				var downloadPath = this.resolveDownloadLocation(mediaGroupTags[media.mediaId], linkObj);

				urlDetail.downloadPath = downloadPath // Set this reference for actual download;

				//console.log(linkObj.url + " BROKEN ? " + urlDetail.isBrokenLink)


				if (media.mediaName==='Images' /*&& urlDetail.download && !(urlDetail.isBrokenLink)*/ ) {
					imgNo+=1;
					imageContId = 'span-img-'+imgNo
					this.images[imgNo] = linkObj.url;
					//console.log("Filter.added to images imgNo: " + imgNo + " URL: " + linkObj.url)
				}
				//console.log("Filter.total images: " + this.images.length + " THEY ARE: " + JSON.stringify(this.images));

				var preview = (isImgPreviewEnabled && media.mediaName==='Images' && urlDetail.download && !(urlDetail.isBrokenLink)) ? (
					
					<span id={imageContId} className={'label label-info DottedBox_content'}>
					
							<ImagePreview
							rowIndex={urlDetail.index}
							id={imgNo} 
							src={linkObj.url}
							handleBrokenLink = {this.markBrokenLink}
							images={this.images}/>

					</span>
				): urlDetail.isBrokenLink ?
				(<div><img className="mediaIcon" src={media.iconClass}/> <img className="mediaIcon" src={brokenLinkIcon}/></div>)
				: (<img className="mediaIcon" src={media.iconClass}/>);

				//console.log("Filter built preview " + imgNo + " " + linkObj.url);

				var description = (this.state.description === this.showUrl) ? (
					linkObj.url
				) : (
					downloadPath === 'default' ? 'Default download directory' : downloadPath
				);

				//console.log("FILTER -> checked for this row ? " + ((urlDetail.download) ? true : false));

				return(

					<tr key={index} id={'filterRow' + index}>
					<td className='col-1'>{index+1}</td>
					<td className='col-2'>
						{preview}
					</td>
					<td className='col-1'>
					{
						urlDetail.isBrokenLink ? (
							<input type="checkbox"  disabled/>
						) : ( 
							<input type="checkbox" checked={urlDetail.download} onChange={()=>{}}
							onClick={checkAction.bind(this, urlDetail)}/> 
						)
				    }
				    </td>
					<td className="all-copy col-8">
						{description}
					</td>
				</tr>


				)
				}
			);
		
		console.timeEnd(this.compname + ".buildtable");	

		let banner = this.props.banner;

		if (!banner) {
			banner = {visible: false};
		}

		this.bannerObj = <Banner model={banner}/>;

		this.header = (
			<div className="card-header bg-primary header">
				<h4 className="card-title text-center text-white">
				Verify files selected for download <Gear navigateAction={this.props.navigateAction} from='page1'/></h4>
			</div>
		);

		return (
			<li className={this.props.visibility}>
			<div className="card">
				{ this.header }
				{ this.bannerObj }
				<div className="card-body">
					<div style={{ paddingBottom: '1.25rem' }}>{filterGroup}</div>
					<table className="table table-striped table-hover table-sm EasyTableSearch">
						<thead >
							<tr className="thead-dark d-flex">
								<th scope="col" data-sort="index" className="vMiddleAlign col-1">#</th>
								<th scope="col" data-sort="String" className="vMiddleAlign col-2">Type</th>
								<th scope="col" data-sort="String" className="vMiddleAlign col-1">{toggleCheck}</th>
								<th scope="col" data-sort="String" className="vMiddleAlign col-8">{toggleDesc}</th>
							</tr>
						</thead>
						<tbody id='filterTbody' className='classFilterTbody'>
							{urlTableRowData}
						</tbody>
					</table>


				</div>
				<div className="card-footer">
						<h5>
							Files to download: {this.props.totalCheckedUrls}
						</h5>
				</div>
				<div className="col-sm-12 text-center full-width">
					<button type="button" onClick={this.onMediaSelectNav.bind(this)} className="btn btn-primary btn-lg download">
					<img className="arrowIcons" src={arrowLeft}/> Back
					</button>
					<button type="button" className="btn btn-success btn-lg download" onClick={this.startDownload.bind(this, urlData, mediaGroups)}>
					<img className="arrowIcons" src={arrowDownload}/> Download
					</button>
				</div>
			</div>
		</li>
		)
	}

}

export default Filter;



/*

<div className="input-group mb-3">
  <div className="input-group-prepend">
	<button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" 
	aria-haspopup="true" aria-expanded="false">Dropdown</button>
    <div className="dropdown-menu">
      <a className="dropdown-item" href="#">Action</a>
      <a className="dropdown-item" href="#">Another action</a>
    </div>
  </div>
  <input type="text" className="form-control" aria-label="Text input with dropdown button" placeholder='{decodedUrl}' readonly/>
</div>

					<td className="all-copy">
						URL: {decodedUrl}
						Downloading to: {'Find it out'}
					</td>
*/