import React from 'react';
import './css/test_scroll.css';
import './js/testScroll.js';

class TestScroll extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		$('#1').loadScroll($('#cont'), 100)
		$('#2').loadScroll($('#cont'), 100)
		$('#3').loadScroll($('#cont'), 100)
		$('#4').loadScroll($('#cont'), 100)
		$('#cont').scroll();
	}
	

	render() {
		
        return (

			<div>
				<table id='demo' border='1'>
				<thead>
				<tr>
					<td className='col1'>#</td><td className='h2'>content</td>
				</tr>
				</thead>
				<tbody id='cont'>
				<tr><td className='col1'>1</td><td id='1' className='data'>one</td></tr>
				<tr><td className='col1'>2</td><td id='2' className='data'>two</td></tr>
				<tr><td className='col1'>3</td><td id='3' className='data'>three</td></tr>
					<tr><td className='col1'>4</td><td id='4' className='data'>four</td></tr>
				</tbody>
				</table>

				<span id='log'></span>
			</div>
		)


	}
};

export default TestScroll;