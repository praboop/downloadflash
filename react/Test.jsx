
import React from 'react';

//import CodeMirror from 'react-codemirror'

import {UnControlled as CodeMirror} from 'react-codemirror2'

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'


class Test extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            code: "// Code",
        }
	}
	
    updateCode(newCode) {
        this.setState({
            code: newCode,
        });
	}

	toggleCode() {
		$("#code").toggle();
	}
	

	render() {

		console.log("Rendering again...")

		console.log(JSON.stringify(CodeMirror.defaults));

		this.options = {
			mode: 'application/javascript',
			matchBrackets: true,
			lineNumbers: true
		};
		
		/*
		return (
			<CodeMirror value={""} onChange={this.updateCode} options={this.options}>
			</CodeMirror>
		)
		*/

		
        return (

			<div>
				<div id='code' className="card">
					<CodeMirror options={this.options}/>
				</div>
				<div className="card-footer text-center"> 
					<button type="button" onClick={this.toggleCode.bind(this)} className="btn btn-primary">Toggle Code</button>
				</div>
			</div>
		)


	}
};

export default Test;



