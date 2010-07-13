/**
 * @class This class is responsible for returning new instances of test suite
 * objects.
 *
 * @extends Object
 */
function TestSuiteFactory() {
	this.constructor();
}

/** @lends TestFactory */
TestSuiteFactory.prototype = {
	
	/**
	 * @property {Object} A hash object of test suites, indexed by their id
	 */
	 suites: null,
	
	/**
	 * @constructs
	 *
	 * @param {void}
	 * @return {void}
	 */
	constructor: function() {
		this.suites = {};
	},
	
	/**
	 * Get a new instance of a test suite object
	 *
	 * @param {Object} testController Test controller managing the test suite
	 * @param {Object} testFactory The test factory object
	 * @param {String} id The optional id of this test suite
	 * @return {Object} A new test suite object
	 */
	getInstance: function( testController, testFactory, id ) {
		if ( typeof id !== "string" || id === "" ) {
			id = String( ( new Date() ).getTime() );
		}
		
		if ( !this.suites[ id ] ) {
			this.suites[ id ] = new TestSuite( testController, testFactory, id );
		}
		
		testController = null;
		testFactory = null;
		
		return this.suites[ id ];
	}
	
};

/**
 * @property {TestSuiteFactory} The sole instance of this class
 */
TestSuiteFactory.instance = null;

/**
 * @static
 *
 * Get an instance of this class
 *
 * @param {void}
 * @return {TestFactory}
 */
TestSuiteFactory.getInstance = function() {
	if ( this.instance === null ) {
		this.instance = new this();
	}
	
	return this.instance;
};
