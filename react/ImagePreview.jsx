import React from 'react';
import './app.css';
import backIcon from './icons/ArrowLeft.svg';
import forwardIcon from './icons/ArrowRight.svg';

class ImagePreview extends React.Component {
	constructor(props) {
		super(props);
		this.compname = buildTimeMarker('ImagePreview' + this.props.id);
		console.time(this.compname);
		this.state = {dimensions: {}, imgSrc: this.props.src, imgId: this.props.id, images: this.props.images};
		this.onImgLoad = this.onImgLoad.bind(this);
		this.onImgError = this.onImgError.bind(this);
		this.onImgToggle = this.onImgToggle.bind(this);
		this.modalId =  'imageModal-'+this.props.id;
		this.popup = this.popup.bind(this);
		this.imgLoaded = false;
		console.log("IP images" + this.state.images.length + ' src: ' + this.props.src + ' id ' + this.props.id)
	}

	componentDidMount() {
		console.log('ImagePreview -> componentDidMount for ' + this.state.imgId);
		//$('#thumbnail-' + this.state.imgId).loadScroll($('#filterTbody'), this.state.imgId, );
		//$('#filterRow' + this.state.imgId).loadScroll($('#filterTbody'), this.state.imgId, );

		$('#filterRow' + this.state.imgId).loadScroll($('#filterTbody'), this.state.imgId, );

		console.timeEnd(this.compname);
	}

	init() {
		this.setState({imgSrc: this.props.src, imgId: this.props.id, images: this.props.images});
	}

	componentWillReceiveProps(nextProps) {
		//console.log("CTRL: Bfore updating " + JSON.stringify(nextProps));
		this.modalId =  'imageModal-'+this.props.id;
		this.setState({imgId: nextProps.id, images: nextProps.images})
	}

    onImgLoad({target:img}) {
		//console.log("Image has been loaded, " + this.props.src + " id " + this.props.id);
		this.imgLoaded = true;
        this.setState({dimensions:{height:img.naturalHeight,
								   width:img.naturalWidth}});

	}

	isLastImage() {
//		console.log("CTRL Checking for last image: " + this.props.src + ", id " + this.props.id 
//		 + ' imgId: ' + this.state.imgId + ' isLast ? ' + (this.state.imgId==(this.state.images.length-1)) + ' total ' + (this.state.images.length-1));
		return (this.state.imgId == this.state.images.length-1)
	}

	isFirstImage() {
//		console.log("CTRL Checking for first image: " + this.props.src + ", id " + this.props.id 
//			+ ' imgId: ' + this.state.imgId + ' isFirst ? ' + (this.state.imgId==0));
		return this.state.imgId==0
	}

	onPrevClick() {
		var targetId = this.state.imgId - 1;
		if (targetId < 0) return;

		var imgSrc = this.state.images[targetId];
		//console.log("CTRL Previous click. Image source is now: " + imgSrc + ". TargetId: " + targetId);

		this.setState({imgSrc: imgSrc, imgId: targetId});
	}

	onNextClick() {
		var targetId = this.state.imgId + 1;
		if (targetId > this.state.images.length) return;

		var imgSrc = this.state.images[targetId];
		//console.log("CTRL Next click. Image source is now: " + imgSrc + ". TargetId: " + targetId);

		this.setState({imgSrc: imgSrc, imgId: targetId});
	}
	
	onImgError({target:img}) {
		console.log("Image Load error for " + this.props.src);

		this.setState({dimensions:{height:0,
			width:0}});
		this.props.handleBrokenLink(this.props.src);
	}

	 popup(url) 
		{
			var params  = 'width='+screen.width;
			params += ', height='+screen.height;
			params += ', top=0, left=0'
			params += ', fullscreen=yes';

			newwin=window.open(this.state.imgSrc,'windowname4', params);

			// if (window.focus) {newwin.focus()}
			return newwin;
		}

	onImgToggle() {
		// $('body').width(2800);
		// $('body').height(1700);

		console.log('CTRL onImgToggle for ' + this.state.imgSrc + ' modalId: ' + this.modalId);
		this.init();
		
		/*
		var myWindow = window.open("", "MsgWindow", "width=200,height=100");
myWindow.document.write("<p>This is 'MsgWindow'. I am 200px wide and 100px tall!</p>");
		*/

		//this.popup(this.props.src);

		$('#' + this.modalId).modal('toggle')

		/*
		const openPop = async() => {
			try {
				console.log("Invoking open pop");
				await browser.windows.create({
				type: "popup", url: "./ImagePreview.html",
				top: 0, left: 0, width: 900, height: 800,
				});
				console.log("Done Invoking Open pop");
			} catch (err) {
				console.error(err);
			}
		}*/

		/*
		browser.windows.create({
			type: "panel", url: "./ImagePreview.html",
			top: 0, left: 0, width: 900, height: 800,
			})
		*/

		// openPop();
		
		//window.open("./ImagePreview.html",'Image Preview');
		
	}

	render() {
		const {width, height} = this.state.dimensions;

		const backArrow = (!this.isFirstImage()) ? (									
			<button type="button" onClick={this.onPrevClick.bind(this)}
			className="btn btn-primary btn-lg download prev">
			<img className="arrowIcons" src={backIcon}/>
			</button>) : "";

		const forwArrow =(!this.isLastImage()) ? (
			<button type="button" onClick={this.onNextClick.bind(this)} 
			className="btn btn-primary btn-lg download next">
			 <img className="arrowIcons" src={forwardIcon}/>
			</button>
		): "";

		return (
			<div>
				<div className="modal fade" id={this.modalId} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered imgPopDialog" role="document">
						<div className="modal-content imgModelContent">
							<div className="modal-header bg-primary">
								<h5 className="modal-title text-white" id="exampleModalLabel">Preview</h5>
								<button type="button" className="close" onClick={this.onImgToggle} data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body  imgPopContainer">
								<img className='imgPop' src={this.state.imgSrc} />
							</div>
							<div className="modal-footer nav">
								{ 
									backArrow
								}
								{
									forwArrow
								}

							</div>
						</div>
					</div>
				</div>		

			<a  className='d-flex flex-column align-items-start' onClick={this.onImgToggle}>

				<img className={'imgPreview' /*'img-thumbnail'*/}
				id={'thumbnail-' + this.state.imgId}
				data-src={this.props.src}
				onLoad={this.onImgLoad}
				onError={this.onImgError}
				alt='Loading...'
				/>

				{ (this.imgLoaded) ?  (<span>{width} X {height}</span>): "" }
				
			</a>
			</div>
		);
	}
}

export default ImagePreview;

/*
				<img className='img-thumbnail' 
				src={this.props.src}
				onLoad={this.onImgLoad}
				onError={this.onImgError}
				/>
*/