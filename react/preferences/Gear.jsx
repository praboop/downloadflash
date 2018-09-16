import React from 'react';

import '../app.css';
import settingsImage from '../icons/settings.svg';

class Gear extends React.Component {

	constructor(props) {
		super(props);
	}

	onPreferencesNav() {
		console.log("To show preferences. Props: " + JSON.stringify(this.props));
		var navInfo = {'from' : this.props.from, 'to' : 'page3'}
		this.props.navigateAction(navInfo);
	}

	render() {
		return (
			<button type="button" 
				className="btn btn-info settings"
				onClick={this.onPreferencesNav.bind(this)}>
				<img className="settingsIcon" src={settingsImage}/>
			</button>
		)
	}
}

export default Gear;