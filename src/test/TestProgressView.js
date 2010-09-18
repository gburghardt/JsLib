/**
 * @class This class is the view for the test progress table.
 *
 * @extends Object
 */
function TestProgressView( id ) {
	this.constructor( id );
}

/** @lends TestProgressView */
TestProgressView.prototype = {
	
	/**
	 * @property {String} The class name assigned to the root node for this view
	 */
	rootClassName: "test-view test-view-progress",
	
	/**
	 * @property {HTMLTableElement} The root node of this view
	 */
	rootNode: null,
	
	/**
	 * @constructs
	 *
	 * @param {String} id The Id of an HTML table element
	 * @return {void}
	 */
	constructor: function( id ) {
		if ( !this.setId( id ) ) {
			throw new Error( "TestProgressView.prototype.constructor: Argument 1 is not a valid HTML tag Id - " + id + " given." );
		}
		
		this.rows = {};
	},
	
	/**
	 * Initialize this view. This method should be called in the domready or
	 * window load events to ensure the required nodes exist in the DOM. 
	 *
	 * @param {void}
	 * @return {void}
	 */
	init: function() {
		var rootNode = document.getElementById( this.id );
		var template = this.getTemplateSource();
		
		rootNode.className = this.rootClassName;
		rootNode.innerHTML = template;
		
		this.rootNode = document.getElementById( "test-view-progress-tbody-" + this.id );
	},
	
	getTemplateSource: function() {
		return [
			'<table cellpadding="3" cellspacing="0" border="0" class="test-view-progress" id="test-view-progress-' + this.id + '">',
				'<caption>Test Progress</caption>',
				'<thead>',
					'<tr>',
						'<th rowspan="2" class="test-view-progress-status">Status</th>',
						'<th rowspan="2" class="test-view-progress-testId">Id</th>',
						'<th rowspan="2" class="test-view-progress-suiteId">Suite</th>',
						'<th colspan="3" class="test-view-progress-assertions">Assertions</th>',
						'<th rowspan="2" class="test-view-progress-dateStarted">Started</th>',
						'<th rowspan="2" class="test-view-progress-dateEnded">Ended</th>',
						'<th rowspan="2" class="test-view-progress-elapsedTime">Time (ms)</th>',
						'<th rowspan="2" class="test-view-progress-failureMessage">Failure Message</th>',
					'</tr>',
					'<tr>',
						'<th class="test-view-progress-passedAssertions">Passed</th>',
						'<th class="test-view-progress-failedAssertions">Failed</th>',
						'<th class="test-view-progress-totalAssertions">Total</th>',
					'</tr>',
				'</thead>',
				'<tfoot>',
					'<tr>',
						'<th rowspan="2" class="test-view-progress-status">Status</th>',
						'<th rowspan="2" class="test-view-progress-testId">Id</th>',
						'<th rowspan="2" class="test-view-progress-suiteId">Suite</th>',
						'<th class="test-view-progress-passedAssertions">Passed</th>',
						'<th class="test-view-progress-failedAssertions">Failed</th>',
						'<th class="test-view-progress-totalAssertions">Total</th>',
						'<th rowspan="2" class="test-view-progress-dateStarted">Started</th>',
						'<th rowspan="2" class="test-view-progress-dateEnded">Ended</th>',
						'<th rowspan="2" class="test-view-progress-elapsedTime">Time (ms)</th>',
						'<th rowspan="2" class="test-view-progress-failureMessage">Failure Message</th>',
					'</tr>',
					'<tr>',
						'<th colspan="3" class="test-view-progress-assertions">Assertions</th>',
					'</tr>',
				'</tfoot>',
				'<tbody id="test-view-progress-tbody-' + this.id + '">',
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
		if ( data.testSuite ) {
			this.renderTestSuite( data.testSuite );
		}
		else if ( data.test ) {
			this.renderTest( data.test );
		}
	},
	
	/**
	 * Render an entire test suite
	 *
	 * @param {Object} testSuite The test suite to render
	 * @return {void}
	 */
	renderTestSuite: function( testSuite ) {
		for ( var i = 0, length = testSuite.tests.length; i < length; i++ ) {
			this.renderTest( testSuite.tests[ i ] );
		}
		
		testSuite = null;
	},
	
	/**
	 * Render an individual test
	 *
	 * @param {Object} test The test to render
	 * @return {void}
	 */
	renderTest: function( test ) {
		var rowId = "test-view-progress-" + test.getSuiteId() + "-" + test.getId();
		var row = this.getRow( rowId );
		var elapsedTime = test.getElapsedTime();
		var failureMessages = test.getFailureMessages();
		
		if ( elapsedTime < 0 ) {
			elapsedTime = "--";
		}
		
		row.className = this.getStatusClass( test );
		
		row.cells[ 0 ].innerHTML = this.getStatusText( test );
		row.cells[ 1 ].innerHTML = test.getId();
		row.cells[ 2 ].innerHTML = test.getSuiteId();
		row.cells[ 3 ].innerHTML = test.getPassedAssertionCount();
		row.cells[ 4 ].innerHTML = test.getFailedAssertionCount();
		row.cells[ 5 ].innerHTML = test.getAssertionCount();
		row.cells[ 6 ].innerHTML = this.formatDate( test.getStartDate(), "--" );
		row.cells[ 7 ].innerHTML = this.formatDate( test.getEndDate(), "--" );
		row.cells[ 8 ].innerHTML = elapsedTime;
		
		if ( failureMessages ) {
			row.cells[ 9 ].innerHTML = "<ol><li>" + this.escapeHTML( failureMessages ).replace( /\n/g, '</li><li>\n' ) + "</li></ol>";
		}
		
		failureMessages = null;
		assertions = null;
		test = null;
		row = null;
	},
	
	
	
	rows: null,
	
	/**
	 * Create the DOM nodes required for one row in the test view
	 * 
	 * @param {String} rowId The Id of this new row
	 * @return {HTMLTableRowElement}
	 */
	createRow: function( rowId ) {
		var row = document.createElement( "tr" );
		var cell = null;
		
		row.id = rowId;
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-status";
		row.appendChild( cell );
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-testId";
		row.appendChild( cell );
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-suiteId";
		row.appendChild( cell );
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-passedAssertions";
		row.appendChild( cell );
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-failedAssertions";
		row.appendChild( cell );
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-totalAssertions";
		row.appendChild( cell );
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-dateStarted";
		row.appendChild( cell );
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-dateEnded";
		row.appendChild( cell );
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-elapsedTime";
		row.appendChild( cell );
		
		cell = document.createElement( "td" );
		cell.className = "test-view-progress-failureMessage";
		row.appendChild( cell );
		
		this.rootNode.appendChild( row );
		
		cell = null;
		
		return row;
	},
	
	getRow: function( rowId ) {
		if ( !this.rows[ rowId ] ) {
			this.rows[ rowId ] = this.createRow( rowId );
		}
		
		return this.rows[ rowId ];
	},
	
	
	
	// utility methods
	
	/**
	 * Add a class name to a DOM node
	 *
	 * @param {HTMLElement} node The node to add the class name to
	 * @param {String} className The class name to add
	 * @return {void}
	 */
	addClass: function( node, className ) {
		if ( this.hasClass( node, className ) ) {
			node.className += " " + className;
		}
		else {
			node.className = className;
		}
		
		node = null;
	},
	
	escapeHTML: function( str ) {
		return str.replace( /&/g, "&gt;" )
		          .replace( />/g, "&gt;" )
		          .replace( /</g, "&lt;" )
		       ;
	},
	
	formatDate: function( date, defaultDate ) {
		if ( typeof defaultDate === "undefined" ) {
			defaultDate = "";
		}
		
		if ( date ) {
			return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate() +
				" " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds();
		}
		else {
			return defaultDate;
		}
	},
	
	/**
	 * Detect if a class name exists in a DOM node
	 *
	 * @param {HTMLElement} node The node to test
	 * @param {String} className The class name to test for
	 * @return {Boolean}
	 */
	hasClass: function( node, className ) {
		return ( node.className && node.className.indexOf( className ) > -1 );
	},
	
	/**
	 * Remove a class name from a DOM node
	 *
	 * @param {HTMLElement} node The node to remove the class name from
	 * @param {String} className The class name to remove
	 * @return {void}
	 */
	removeClass: function( node, className ) {
		if ( !node.className || !this.hasClass( node, className ) ) {
			return;
		}
		
		var classes = node.className.split( " " );
		
		for ( var i = 0, length = classes.length; i < length; i++ ) {
			if ( className === classes[ i ] ) {
				classes.splice( i, 1 );
			}
		}
		
		node.className = classes.join( " " );
		
		node = null;
	},
	
	/**
	 * Get an HTML tag class name from the test status
	 *
	 * @param {String} status
	 * @return {String} An HTML tag class name
	 */
	getStatusClass: function( test ) {
		var statusClass = "";
		var status = test.getStatus();
		
		switch ( status ) {
			
			case test.STATUS_IN_PROGRESS:
				statusClass = "test-status-inProgress";
			break;
			
			case test.STATUS_TIMED_OUT:
				statusClass = "test-status-timedOut";
			break;
			
			case test.STATUS_PASSED:
				statusClass = "test-status-passed";
			break;
			
			case test.STATUS_FAILED:
				statusClass = "test-status-failed";
			break;
			
			case test.STATUS_PENDING:
				statusClass = "test-status-pending";
			break;
			
			default:
				statusClass = "test-status-unknown";
			break;
			
		}
		
		return statusClass;
	},
	
	/**
	 * Get text visible to the user for the current status of a test
	 *
	 * @param {String} status
	 * @return {String} Text dislayed to the user
	 */
	getStatusText: function( test ) {
		var statusText = "";
		var status = test.getStatus();
		
		switch ( status ) {
			
			case test.STATUS_IN_PROGRESS:
				statusText = "Running";
			break;
			
			case test.STATUS_TIMED_OUT:
				statusText = "Timed Out";
			break;
			
			case test.STATUS_PASSED:
				statusText = "Passed";
			break;
			
			case test.STATUS_FAILED:
				statusText = "Failed";
			break;
			
			case test.STATUS_PENDING:
				statusText = "Ready";
			break;
			
			default:
				statusText = "&mdash;";
			break;
			
		}
		
		return statusText;
	}
	
};
