/**
 * @class This class is responsible for returning instances of factory objects
 * which generate the other objects necessary for this testing framework. The
 * Abstract Factory Pattern is implimented here.
 *
 * @extends Object
 */
function TestFactoryGenerator() {
	this.constructor();
}

/** @lends TestFactory */
TestFactoryGenerator.prototype = {
	
	/**
	 * @constructs
	 *
	 * @param {void}
	 * @return {void}
	 */
	constructor: function() {
		
	},
	
	/**
	 * Get a factory object that returns new test suite objects
	 * 
	 * @param {void}
	 * @return {Object}
	 */
	getSuiteFactory: function() {
		return TestSuiteFactory.getInstance();
	},
	
	/**
	 * Get a factory object that returns new test objects
	 *
	 * @param {void}
	 * @return {Object}
	 */
	getTestFactory: function() {
		return TestFactory.getInstance();
	},
	
	/**
	 * Get a factory object that returns new test view objects
	 *
	 * @param {void}
	 * @return {Object}
	 */
	getViewFactory: function() {
		return TestViewFactory.getInstance();
	}
	
};

/**
 * @property {TestFactoryGenerator} The sole instance of this class
 */
TestFactoryGenerator.instance = null;

/**
 * @static
 *
 * Get an instance of this class
 *
 * @param {void}
 * @return {TestFactoryGenerator}
 */
TestFactoryGenerator.getInstance = function() {
	if ( this.instance === null ) {
		this.instance = new this();
	}
	
	return this.instance;
};
