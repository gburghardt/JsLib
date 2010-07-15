/**
 * @class This class is the progress indicator view
 *
 * @extends Object
 */
function TestSummaryView( id ) {
	this.constructor( id );
}

/** @lends TestSummaryView */
TestSummaryView.prototype = {
	
	/**
	 * @property {HTMLDivElement} The bar that advances as tests are completed
	 */
	indicatorNode: null,
	
	/**
	 * @property {HTMLDivElement} The node that displays the percentage complete
	 */
	indicatorTextNode: null,
	
	/**
	 * @property {String} The class name assigned to the root node for this view
	 */
	rootClassName: "test-summaryView",
	
	/**
	 * @property {HTMLTableElement} The root node of this view
	 */
	rootNode: null,
	
	/**
	 * @constructs
	 *
	 * @param {String} id Id of the root node for this view
	 * @return {void}
	 */
	constructor: function( id ) {
		if ( !this.setId( id ) ) {
			throw new Error( "TestSummaryView.prototype.constructor: Argument 1 is not a valid HTML tag Id - " + id + " given." );
		}
	},
	
	/**
	 * Initialize this view
	 *
	 * @param {void}
	 * @return {void}
	 */
	init: function() {
		var rootNode = document.getElementById( this.id );
		var template = this.getTemplateSource();
		
		rootNode.className = this.rootClassName;
		rootNode.innerHTML = template;
		
		this.rootNode = document.getElementById( "test-summaryView-" + this.id );
		this.indicatorNode = document.getElementById( "test-summaryView-indicator-" + this.id );
		this.indicatorTextNode = document.getElementById( "test-summaryView-indicatorText-" + this.id );
	},
	
	/**
	 * Get the template source code
	 *
	 * @param {void}
	 * @return {String} The HTML to be injected into the DOM for this view
	 */
	getTemplateSource: function() {
		return [
			'<table cellpadding="0" cellspacing="0" border="0" id="test-summaryView-' + this.id + '">',
				'<caption>Test Summary</caption>',
				'<thead>',
					'<tr>',
						'<th class="test-summaryView-pending">Pending</th>',
						'<th class="test-summaryView-inProgress">In Progress</th>',
						'<th class="test-summaryView-passed">Passed</th>',
						'<th class="test-summaryView-failed">Failed</th>',
						'<th class="test-summaryView-timedOut">Timed Out</th>',
						'<th class="test-summaryView-total">Total</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr>',
						'<td class="test-summaryView-pending">-</td>',
						'<td class="test-summaryView-inProgress">-</td>',
						'<td class="test-summaryView-passed">-</td>',
						'<td class="test-summaryView-failed">-</td>',
						'<td class="test-summaryView-timedOut">-</td>',
						'<td class="test-summaryView-total">-</td>',
					'</tr>',
					'<tr>',
						'<td class="test-summaryView-indicatorBox" colspan="6">',
							'<div class="test-summaryView-indicator" id="test-summaryView-indicator-' + this.id + '">',
								'<div class="test-summaryView-indicator2" id="test-summaryView-indicatorText-' + this.id + '"></div>',
							'</div>',
						'</td>',
					'</tr>',
				'</tbody>',
			'</table>'
		].join( "" );
	},
	
	
	
	/**
	 * @property {String} Unique Id for this test
	 */
	id: null,
	
	/**
	 * Get the Id associated with this test.
	 *
	 * @param {void}
	 * @return {String}
	 */
	getId: function() {
		return this.id;
	},
	
	/**
	 * Sets the Id for this test.
	 *
	 * @param {String} id New Id for this test
	 * @return {Boolean} True if set successfully
	 */
	setId: function( id ) {
		if ( typeof id === "string" && id !== "" ) {
			this.id = id;
			
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 * Render data to the view
	 *
	 * @param {Object} data The data to render
	 * @return {void}
	 */
	render: function( data ) {
		if ( typeof data.percentComplete === "number" ) {
			this.indicatorTextNode.innerHTML = data.percentComplete + "%";
			
			if ( data.percentComplete > 99.5 ) {
				data.percentComplete = 100;
			}
			else if ( data.percentComplete < 0.5 ) {
				data.percentComplete = 0;
			}
			
			this.indicatorNode.style.width = data.percentComplete + "%";
		}
		
		var row = this.rootNode.rows[ 1 ];
		
		row.cells[ 0 ].innerHTML = data.pending;
		row.cells[ 1 ].innerHTML = data.inProgress;
		row.cells[ 2 ].innerHTML = data.passed;
		row.cells[ 3 ].innerHTML = data.failed;
		row.cells[ 4 ].innerHTML = data.timedOut;
		row.cells[ 5 ].innerHTML = data.total;
		
		row = null;
	}
	
};
