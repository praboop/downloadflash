import React from 'react';


/**
 * Takes the following props
 * style - 'success', 'info', 'warning', 'danger'
 * dismiss - 'true' or 'false'
 * message - <HTML text to be displayed>
 */
class Banner extends React.Component {

	constructor(props) {
		super(props);
		this.state = { visible: props.model.visible }
		//console.log("=== BANNER CONSTRUCTOR: " + JSON.stringify(props) + " model: " + JSON.stringify(this.state));
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.model);  
		//console.log("Banner got update. Props: " + JSON.stringify(nextProps))
	}

	closeAlert() {
		//console.log("BANNER: Alert will be hidden");
		this.props.model.visible = false;
		this.setState(this.props.model);
	}
	
	render() {
		//console.log("--> render banner props is : " + JSON.stringify(this.props));
		if (this.props.model.visible) {
			var model = this.props.model;
			this.className = "alert alert-" + model.style;

			if (model.dismiss && model.dismiss === true) {
				this.className += " alert-dismissible";
			}
			this.message = model.message;
			this.closeAlert = this.closeAlert.bind(this);
		}
		return (
			<div>
				{
					this.props.model.visible ?
						<div id='alertBox'>
							<div className={this.className} role="alert">
								<button type="button" className="close" onClick={this.closeAlert} aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
								<div dangerouslySetInnerHTML={{
									__html: this.message
								}} />
							</div>
						</div> 
					: null
				}	
			</div>

		)
	};
}

export default Banner;