import React from 'react';
import HelpIcon from '../icons/HelpIcon.png';

import {g_diskStore} from '../PluginStore.jsx';

import { JSHINT } from 'jshint'
import {UnControlled as CodeMirror} from 'react-codemirror2'
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
import 'codemirror/addon/lint/lint.css'

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/javascript-lint'
import 'codemirror/addon/selection/active-line'

window.JSHINT = JSHINT


class RenameTags extends React.Component {

	constructor(props) {
		super(props);
		this.initing = true;
		this.tags = g_diskStore.getTags();
		this.compname = buildTimeMarker('RenameTags');
		this.renderTriggered = false;
		console.time(this.compname);
	}

	componentDidMount() {
		console.log('RenameTags -> componentDidMount')
		$("td.tagEdit").toggle();
		$("#tagTable").click(this.onRowClick);
		$('.CodeMirror').css('height', '150px');
		this.initing = false;
		console.timeEnd(this.compname);
	}


	componentDidUpdate() {
		console.log('RenameTags -> componentDidUpdate')
		$('[data-toggle="tooltip"]').tooltip()
		console.timeStamp('RenameTags');
		console.log('RenameTags -> Setting render triggered to false')
		this.renderTriggered = false;
	}

	onRowClick( event ) {
		var target = $( event.target );

		if (!target.closest("td").attr("colspan")) { // Clicks in the parent container
			var td = target.closest("tr").next('tr').find('td').toggle();
			var isHidden=td.attr('style').indexOf('none') > 0;
			target.closest("tr").find("td:first").html(isHidden ? "+" : "-");
			// event.stopPropagation();
		} else { // Clicks within the expanded item
			//target.closest("td").toggle();
			//target.closest("tr").prev().find("td:first").html("+");
		}
	}

	handleEditDone( tagData, event ) {
		var newValue = event.target.value;
		var oldValue = tagData.tag;

		// no change
		if (newValue === oldValue) {
			return;
		} else  {
			/*
			g_diskStore.updateMediaDownloadLocation( media.name, newPath );
			if (newPath === "") {
				event.currentTarget.placeholder = this.DEFAULT_DOWNLOAD_PATH;
			}
			*/
			// console.log('To add logic for edit done')
		}
	}

	handleEditOnChange( otherAllowedChars, maxlength, event ) {
		var value = event.currentTarget.value;
		if (value.length > maxlength) {
			value = value.slice(0, -1); // Remove last character
			event.currentTarget.value = value;
			return;
		}
		var changedValue = value.replace(/\\/g,"/"); // Correct the path character to forward slash
		changedValue = changedValue.replace(/^\//,''); // Remove leading / since absolute path is disallowed

		//console.log("Space allowed? " + spaceAllowed);

		var expr = new RegExp('([^a-z0-9\._~!&()+,;=:@/%' + otherAllowedChars + ']+)', 'gi');
		changedValue = changedValue.replace(expr, '-');
		//console.log( "changed from " + value + " to " + changedValue );
		event.currentTarget.value = changedValue;
	}

	buildTagEditContent(tagData, key) {
		var enterTagName = 'Enter tag name'
		var enterTagDesc = 'Enter tag description'
		var enterScript  = 'Enter script that returns a value for tag'
		var enterValidateUrl = 'Validate the above script with this test Parameter'
		var tagNameId="tagName" + key
		var tagDescId="tagDesc" + key
		var scriptId ="scriptId" + key
		var validateUrlId = "validateUrlId" + key
		var validateResult = "validateResult" + key
		var testUrlTip = "<div className='help-text-dl'> <p>A test data that would be passed as input parameter to the "
		+ " <i style='color:red;'>Script</i> below. <BR>For example, let's say there is a link like: <BR> "
		+ " <i style='color:#625af9;'>"
		+ " &lt;a href='http://nosite/path/visual_designs.pdf?chapter=1' title='Introduction to visual designs'&gt;Chapter1&lt;/a&gt; <BR> "
		+ " </i>"
		+ " The JSON object after parsing would be similar to the one given below and it would be passed as input to the script.</div>"

		/*
		this.options = {
			mode: 'application/javascript',
			theme: 'material',
			gutters: ["CodeMirror-lint-markers"], -> Bug. If you close and open it is not proper.
			lint: true,
			matchBrackets: true,
			autoCloseBrackets: true,
			lineNumbers: true,
			lineWrapping: true,
			styleActiveLine: true,
			readOnly: tagData.stock,
			lineHeight: 10
		};
		*/

		//console.log('Script for ' + tagData.tag + ': ' + tagData.script);

		this.options = {
			mode: 'application/javascript',
			theme: 'material',

			//gutters: ["CodeMirror-lint-markers"], 
			//lint: true,

			readOnly: tagData.stock,
			matchBrackets: true,
			autoCloseBrackets: true,
			styleActiveLine: true,
			lineNumbers: true,
			lineWrapping: true,
			lineHeight: 10
		}

		var scriptLabel = "Script (editable from line 3)"
		var readonly = false;
		var disabledStyle = " roundedBtn ";
		if (tagData.stock === true) {
			scriptLabel = "Script (readonly)"
			readonly = true;
			disabledStyle = " roundedBtn disabled ";
		}

		var readOnlyLines = [0,1];

		var currentValue=tagData.script;

		var validatorFunc = function() {

			var ret = {};
			$('#' + validateResult).removeClass('d-none');
			try {
				var executor = new Function("'use strict'; return (" + currentValue + ")")();
				var testLinkObj = JSON.parse($('#'+ validateUrlId).val());
				var result = executor(testLinkObj);
				ret.status = true;
				ret.response = result;
				$('#' + validateResult).text('Returns: ' + result);
			} catch (err) {
				ret.status = false;
				ret.err = err.message;
				$('#' + validateResult).text(err.message);
			}
			return ret;
		}

		return (
			<form>
					<div className='form-group'>
						<label htmlFor={tagNameId}>Tag Name</label>
						<input className="form-control" type="text" 
						id={tagNameId}
						onBlur={this.handleEditDone.bind(this, tagData)}
						onChange={this.handleEditOnChange.bind(this, '', 10)}
						placeholder={enterTagName} defaultValue={tagData.tag}
						readOnly={readonly}/>
					</div>
					<div className='form-group'>
						<label htmlFor={tagDescId}>Description</label>
						<input className="form-control" type="text" 
						id={tagDescId}
						onBlur={this.handleEditDone.bind(this, tagData)}
						onChange={this.handleEditOnChange.bind(this, " \?", 100)}
						placeholder={enterTagDesc} defaultValue={tagData.description}
						readOnly={readonly}/>
					</div>
					<div className='form-group'>
						<span htmlFor={validateUrlId} >Test Parameter Value (linkData) 
						<img src={HelpIcon} className="help-icon-dl-simple" data-toggle="tooltip" data-html="true" title={testUrlTip}/>
						</span> 

						<textarea className="form-control" type="text" 
						id={validateUrlId}
						onBlur={this.handleEditDone.bind(this, tagData)}
						onChange={this.handleEditOnChange.bind(this, " \?\n\t\}\{\"'", 1000)}
						placeholder={enterValidateUrl} defaultValue={JSON.stringify(tagData.testUrl, null, 2)}
						readOnly={readonly}/>
					</div>
					<div className='form-group'>
						<label>{scriptLabel}</label>
						<CodeMirror 
							className="editor" 
							value={tagData.script}
							options={this.options}
							onBeforeChange={(editor, change, value, next) => {
								var cancelFlag = tagData.stock || (!tagData.stock && this.renderTriggered==false && (readOnlyLines.indexOf(change.from.line)>-1));
								console.log('For ' + tagData.tag + ' line: ' + change.from.line + ' Render triggered ' + this.renderTriggered + ' Cancel ? ' + cancelFlag);
								if (this.initing) {
									next();
								} // For add operation, automatically render will be called with script filled in. We allow that initial edit op to go through.
								else if ( cancelFlag ) {
									change.cancel();
								} else {
									next();
								}
							}}
							onChange={(editor, change, value) => {
								//console.log('CodeMirror-> on change invoked' + JSON.stringify(change))
								currentValue = value;
							}}
						/>
					</div>
					<div className='form-group'>
						<div id={validateResult} className="col-sm-12 alert alert-primary d-none" role="alert">
						</div>
					</div>
					
					<div className='form-group row'>
							<button type="button" className={"btn btn-primary text-center " + disabledStyle} aria-disabled={readonly}
								onClick={() => {
									g_diskStore.deleteTag(tagData.tag)
									_.pull(this.tags, tagData);
									// console.log("RenameTags--> After delete calling set state");
									this.setState({...this.tags});
									return;
								}} disabled={readonly}> 							
								Delete tag
							</button>

							<button type="button" className="btn btn-primary roundedBtn text-center"
									onClick={validatorFunc}>
									Check Script
							</button>
	
							<button type="button" className={"btn btn-primary text-center " + disabledStyle} aria-disabled={readonly}
								onClick={() => {
									var tagName = $('#'+ tagNameId).val();
									var tagDesc = $('#'+ tagDescId).val();
									var testUrl = JSON.parse($('#'+ validateUrlId).val());
									if (!tagName) {
										$('#' + validateResult).removeClass('d-none');
										$('#' + validateResult).text("Tag name cannot be empty");
										return;
									}

									var resp = validatorFunc();
									if (resp.status) {
										console.log("Saving value: " + currentValue + ", tagName: " + tagName + ", tagDesc: " + tagDesc);
										g_diskStore.updateTag(tagData, currentValue, tagName, tagDesc, testUrl );
										tagData.isSavedTag = true;
										tagData.tag = tagName;
										tagData.description = tagDesc;
										tagData.script = currentValue;
										this.renderTriggered = true;
										this.setState({...this.tags})
										$('#' + validateResult).text("Saved");
										window.setTimeout(() => {
											$('#' + validateResult).text('');
											$('#' + validateResult).addClass('d-none')
										}, 2000);
										return;
									}
									console.log("Not saving due to validation errors.")
								}} disabled={readonly}> 							
										Apply Changes
							</button>
	
					</div>


			</form>
		)
	}

	addTag() {
		//console.log('Creating container for add tag');
		var tags2 = [...this.tags];
		var newTag = 		
		{
			isNewTag: true,
			isSavedTag: false,
			tag: '',
			description: '',
			stock: false,
			testUrl: {url: 'http://nosite/path/visual_designs.pdf?chapter=1', text: 'Chapter1', attributes: { title : 'Introduction to visual designs' } },
			script: "function getValue(linkData)\r\n{\r\n  // Do something with the linkData;\r\n  return 'TODO';  \r\n  " 
			+ "\r\n}\r\n"
		}
		tags2.push(newTag);
		this.tags = tags2;
		this.renderTriggered = true;
		this.setState(this.tags);
	}

	buildDisplayContent() {
		var rows = [];
		var rowId=0, tagno=0;

		this.tags.forEach(tdata => {

			var clazz = "badge " + ((tdata.stock) ? "badge-info" : "item") + " dl-tag";

			// New tag that is added to the end of the tags array, needs to be expanded by default.
			// console.log("RenameTags->TagNo: " + tagno + ", Tag: " + tdata.tag + ": newTag? " + tdata.isNewTag);
			var expandChar = tdata.isNewTag ? '-' : '+';

			rows.push(
				<tr key={tdata.tag + '-outline'} id={'tag' + rowId}>
					<td className='align-middle'>{expandChar}</td>
					<td> 
						<span key={tdata.tag} className={clazz}>
							<span className="font-weight-normal">{tdata.tag}</span>
						</span>
					</td>
					<td className='align-middle'> {tdata.description} </td>
				</tr>
			)
			{rowId++}
			rows.push(
			<tr key={tdata.tag + '-editor'} id={'tagEditRow' + rowId} >
			<td className='tagEdit' colSpan='3'>{ this.buildTagEditContent(tdata, rowId) }</td></tr>)
			{rowId++; tagno++}
		})

		return(
			<tbody id='tags'>{rows}</tbody>
		)
	}

	render() {
		try {
			console.time(this.compname + ".render");
			return this._render();
		} finally {
			console.timeEnd(this.compname + ".render");
		}
	}

	_render () {

		console.log("Rendering RenameTags...");

		var activeTagTip = "<div class='help-text-dl'> <p>Renaming tags can be used in "
		+ " <i style='color:red;'>Save Options</i> for customizing relative path and filename of a downloadable file."
		+ " To use these tags, enclose the tag name in curly braces like: {name} <BR>"
		+ " Stock tags are greyed out and not editable.<BR>"
		+ " Custom tags can be created but it requires basic knowledge of Javascript.<BR>"		
		+ " Example:<BR>"
		+ " Let's consider the following setting for text files in save options: {dd}/{name}.{ext}"
		+ " Above, {dd} stands for day, {name} stands for name of the file and {ext} stands for extension."
		+ " This would result in all text file downloads everyday being kept in a folder named on that day.</div>"


		var activeTagContent = this.buildDisplayContent()


		return (
			(
				<div className='card'>

						<div className="card-body">
						

							<table id="tagTable" className="table table-striped editable-table">
								<thead className="thead-dark">
									<tr>
										<th className="w-1"></th>
										<th className="w-24">Tags <img src={HelpIcon} className="help-icon-dl-simple"  
													data-toggle="tooltip" data-html="true" title={activeTagTip}/>
										</th>
										<th>Description</th>
									</tr>
								</thead>

								{activeTagContent}
							</table>

							<div className="text-center"> 
								<button type="button" onClick={this.addTag.bind(this)} className="btn btn-primary customBtn text-center">Add Custom Tag</button>
							</div>

						</div>
					

				</div>
			)
		)
	}
}

export default RenameTags;
