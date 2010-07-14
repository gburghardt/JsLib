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
	views: null,
	
	/**
	 * @constructs
	 *
	 * @param {void}
	 * @return {void}
	 */
	constructor: function() {
		this.views = {};
	},
	
	/**
	 * Get a new instance of a test view object
	 *
	 * @param {String} rootNodeId Id of the root node for the new view
	 * @return {Object} A new test view object
	 */
	getInstance: function( rootNodeId ) {
		if ( !this.views[ rootNodeId ] ) {
			this.views[ rootNodeId ] = new TestView( rootNodeId );
		}
		
		return this.views[ rootNodeId ];
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
