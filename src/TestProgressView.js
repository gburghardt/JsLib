/**
 * @class This class is the progress indicator view
 *
 * @extends Object
 */
function TestProgressView( id ) {
	this.constructor( id );
}

/** @lends TestProgressView */
TestProgressView.prototype = {
	
	/**
	 * @property {HTMLDivElement} The bar that advances as tests are completed
	 */
	indicatorNode: null,
	
	/**
	 * @constructs
	 *
	 * @param {String} id Id of the root node for this view
	 * @return {void}
	 */
	constructor: function( id ) {
		if ( !this.setId( id ) ) {
			throw new Error( "TestProgressView.prototype.constructor: Argument 1 is not a valid HTML tag Id - " + id + " given." );
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
	 * Initialize the table DOM structure
	 *
	 * @param {void}
	 * @return {void}
	 */
	initTable: function() {
		var thead = document.createElement( "thead" );
		var tbody = document.createElement( "tbody" );
		
		thead.innerHTML = [
			'<tr>',
				'<th class="test-progressView-pending">Pending</th>',
				'<th class="test-progressView-inProgress">In Progress</th>',
				'<th class="test-progressView-passed">Passed</th>',
				'<th class="test-progressView-failed">Failed</th>',
				'<th class="test-progressView-timedOut">Timed Out</th>',
				'<th class="test-progressView-timedOut">Total</th>',
			'</tr>'
		].join( "" );
		
		tbody.innerHTML = [
			'<tr>',
				'<td class="test-progressView-pending"></td>',
				'<td class="test-progressView-inProgress"></td>',
				'<td class="test-progressView-passed"></td>',
				'<td class="test-progressView-failed"></td>',
				'<td class="test-progressView-timedOut"></td>',
				'<td class="test-progressView-total"></td>',
			'</tr>',
			'<tr>',
				'<td colspan="5"><div class="test-progressView-indicator" id="test-progressView-indicator-' + this.id + '"></div></td>',
			'</tr>'
		].join( "" );
		
		this.rootNode.createCaption().innerHTML = "Test Progress";
		this.rootNode.appendChild( thead );
		this.rootNode.appendChild( tbody );
		
		this.indicatorNode = document.getElementById( "test-progressView-indicator-" + this.id );
		
		thead = null;
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
	rootClassName: "test-progressView",
	
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
		if ( typeof data.percentComplete === "number" ) {
			this.indicatorNode.innerHTML = data.percentComplete + "%";
			
			if ( data.percentComplete > 99.5 ) {
				data.percentComplete = 0;
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
