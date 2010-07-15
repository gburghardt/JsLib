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
	 * @constructs
	 *
	 * @param {String} id The Id of an HTML table element
	 * @return {void}
	 */
	constructor: function( id ) {
		if ( !this.setId( id ) ) {
			throw new Error( "TestProgressView.prototype.constructor: Argument 1 is not a valid HTML tag Id - " + id + " given." );
		}
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
		
		if ( !this.setRootNode( rootNode ) ) {
			if ( rootNode ) {
				rootNode.parentNode.removeChild( rootNode );
				rootNode = null;
			}
			
			rootNode = document.createElement( "table" );
			rootNode.setAttribute( "id", this.id );
			
			document.getElementsByTagName( "body" )[ 0 ].appendChild( rootNode );
		}
		
		if ( !rootNode.getAttribute( "class" ) ) {
			rootNode.setAttribute( "class", this.rootClassName );
		}
		
		this.setRootNode( rootNode );
		this.initTable();
	},
	
	/**
	 * Generate a brand new table for this view if one doesn't already exist.
	 *
	 * @param {void}
	 * @return {void}
	 */
	initTable: function() {
		var thead = document.createElement( "thead" );
		var tfoot = document.createElement( "tfoot" );
		var tbody = document.createElement( "tbody" );
		
		thead.innerHTML = [
			'<tr>',
				'<td class="test-assertions" colspan="2">Assertions</td>',
			'</tr>',
			'<tr>',
				'<th class="test-status" rowspan="2">Status</th>',
				'<th class="test-id" rowspan="2">Test Id</th>',
				'<th class="test-assertions-passed">Passed</th>',
				'<th class="test-assertions-failed">Failed</th>',
				'<th class="test-dateStarted" rowspan="2">Started</th>',
				'<th class="test-dateEnded" rowspan="2">Finshed</th>',
				'<th class="test-elapsedTime" rowspan="2">Elapsed Time</th>',
				'<th class="test-suiteId" rowspan="2">Suite Id</th>',
			'</tr>'
		].join( "" );
		
		tfoot.innerHTML = [
			'<tr>',
				'<th class="test-status" rowspan="2">Status</th>',
				'<th class="test-id" rowspan="2">Test Id</th>',
				'<th class="test-assertions-passed">Passed</th>',
				'<th class="test-assertions-failed">Failed</th>',
				'<th class="test-dateStarted" rowspan="2">Started</th>',
				'<th class="test-dateEnded" rowspan="2">Finshed</th>',
				'<th class="test-elapsedTime" rowspan="2">Elapsed Time</th>',
				'<th class="test-suiteId" rowspan="2">Suite Id</th>',
			'</tr>',
			'<tr>',
				'<td class="test-assertions" colspan="2">Assertions</td>',
			'</tr>'
		].join( "" );
		
		this.rootNode.appendChild( thead );
		this.rootNode.appendChild( tfoot );
		this.rootNode.appendChild( tbody );
		
		thead = null;
		tfoot = null;
		tbody = null;
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
	 * @property {String} The class name assigned to the root node for this view
	 */
	rootClassName: "test-view",
	
	/**
	 * @property {HTMLTableElement} The root node of this view
	 */
	rootNode: null,
	
	/**
	 * Set the rootNode property
	 *
	 * @param {HTMLTableElement} rootNode
	 * @return {Boolean} True if set properly
	 */
	setRootNode: function( rootNode ) {
		if ( rootNode && typeof rootNode.nodeName === "string" && rootNode.nodeName === "TABLE" ) {
			this.rootNode = rootNode;
			
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
		if ( data.progress ) {
			this.renderProgress( data.progress );
		}
		
		if ( data.testSuite ) {
			this.renderTestSuite( data.testSuite );
		}
		else if ( data.test ) {
			this.renderTest( data.test );
		}
	},
	
	/**
	 * Render the test progress view
	 * 
	 * @param {Object} progress Information on the test progress
	 * @return {void}
	 */
	renderProgress: function( progress ) {
		if ( this.progressView ) {
			this.progressView.render( progress );
		}
		
		progress = null;
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
		var rowId = "test=" + test.getSuiteId() + "-" + test.getId();
		var row = document.getElementById( rowId );
		
		if ( !row ) {
			row = this.createRow( rowId );
		}
		
		var assertions = test.getAssertions();
		
		row.className = this.getStatusClass( test.getStatus() );
		
		row.cells[ 0 ].innerHTML = this.getStatusText( test.getStatus() );
		row.cells[ 1 ].innerHTML = test.getId();
		row.cells[ 2 ].innerHTML = assertions.passed.length;
		row.cells[ 3 ].innerHTML = assertions.failed.length;
		row.cells[ 4 ].innerHTML = this.formatDate( test.getStartDate() );
		row.cells[ 5 ].innerHTML = this.formatDate( test.getEndDate() );
		row.cells[ 6 ].innerHTML = test.getElapsedTime();
		row.cells[ 7 ].innerHTML = test.getSuiteId();
		
		assertions = null;
		test = null;
		row = null;
	},
	
	/**
	 * Create the DOM nodes required for one row in the test view
	 * 
	 * @param {String} rowId The Id of this new row
	 * @return {HTMLTableRowElement}
	 */
	createRow: function( rowId ) {
		var row = document.createElement( "tr" );
		
		row.setAttribute( "id", rowId );
		
		row.innerHTML = [
			'<td class="test-status"></td>',
			'<td class="test-id"></td>',
			'<td class="test-assertions-passed"></td>',
			'<td class="test-assertions-failed"></td>',
			'<td class="test-dateStarted"></td>',
			'<td class="test-dateEnded"></td>',
			'<td class="test-elapsedTime"></td>',
			'<td class="test-suiteId"></td>'
		].join( "" );
		
		var tbody = this.rootNode.getElementsByTagName( "tbody" )[ 0 ];
		
		tbody.appendChild( row );
		
		tbody = null;
		
		return row;
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
	 * @param {Object} test A test object
	 * @return {String} An HTML tag class name
	 */
	getStatusClass: function( test ) {
		var statusClass = "";
		
		switch ( test.getStatus() ) {
			
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
	 * @param {Object} test A test object
	 * @return {String} Text dislayed to the user
	 */
	getStatusText: function( test ) {
		var statusText = "";
		
		switch ( test.getStatus() ) {
			
			case test.STATUS_IN_PROGRESS:
				statusText = "In Progress";
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
				statusText = "Pending";
			break;
			
			default:
				statusText = "&mdash;";
			break;
			
		}
		
		return statusText;
	}
	
};
