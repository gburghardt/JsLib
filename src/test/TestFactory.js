/**
 * @class This class is responsible for returning new instances of test objects.
 *
 * @extends Object
 */
function TestFactory() {
	this.constructor();
}

/** @lends TestFactory */
TestFactory.prototype = {
	
	/**
	 * @constructs
	 *
	 * @param {void}
	 * @return {void}
	 */
	constructor: function() {
		
	},
	
	/**
	 * Get a new instance of a test object
	 *
	 * @param {String} suiteId Id of the test suite to which this test belongs
	 * @param {Object} testController The test controller managing the new test
	 * @param {String} testId The optional id of this test
	 * @return {Object} A new test object
	 */
	getInstance: function( suiteId, testController, testId ) {
		return new Test( suiteId, testController, testId );
	}
	
};

/**
 * @property {TestFactory} The sole instance of this class
 */
TestFactory.instance = null;

/**
 * @static
 *
 * Get an instance of this class
 *
 * @param {void}
 * @return {TestFactory}
 */
TestFactory.getInstance = function() {
	if ( this.instance === null ) {
		this.instance = new this();
	}
	
	return this.instance;
};
