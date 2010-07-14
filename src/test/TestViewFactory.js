/**
 * @class This class is responsible for returning new instances of test view
 * objects.
 *
 * @extends Object
 */
function TestViewFactory() {
	this.constructor();
}

/** @lends TestFactory */
TestViewFactory.prototype = {
	
	/**
	 * @property {Object} A hash object of views indexed by their rootNodeId
	 */
	instances: null,
	
	/**
	 * @constructs
	 *
	 * @param {void}
	 * @return {void}
	 */
	constructor: function() {
		this.instances = {};
	},
	
	/**
	 * Get a new instance of a test view object
	 *
	 * @param {String} type The type of view to instantiate
	 * @param {String} rootNodeId Id of the root node for the new view
	 * @return {Object} A new test view object
	 */
	getInstance: function( type, rootNodeId ) {
		if ( !this.instances[ rootNodeId ] ) {
			if ( "progress" === type ) {
				this.instances[ rootNodeId ] = new TestProgressView( rootNodeId );
			}
			else if ( "summary" === type ) {
				this.instances[ rootNodeId ] = new TestSummaryView( rootNodeId );
			}
			else {
				this.instances[ rootNodeId ] = null;
				throw new Error( "An invalid view type was specified in TestViewFactory.getInstance(). " + type + " given." );
			}
		}
		
		return this.instances[ rootNodeId ];
	}
	
};

/**
 * @property {TestViewFactory} The sole instance of this class
 */
TestViewFactory.instance = null;

/**
 * @static
 *
 * Get an instance of this class
 *
 * @param {void}
 * @return {TestViewFactory}
 */
TestViewFactory.getInstance = function() {
	if ( this.instance === null ) {
		this.instance = new this();
	}
	
	return this.instance;
};
