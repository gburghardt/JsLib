/**
 * @class This class is the main driver of the JavaScript tests. It runs the
 * tests and updates the view as tests are run. The Delegate Pattern is used
 * extensively, as the test controller is passed to each test suite, which then
 * passes the test controller to each test.
 *
 * @extends Object
 */
function TestController( suiteFactory, viewFactory ) {
	this.constructor( suiteFactory, viewFactory );
}

/** @lends TestController */
TestController.prototype = {
	
	/**
	 * @constructs
	 *
	 * @param {Object} suiteFactory The object responsible for churning out new
	 *                              instances of test suite objects.
	 * @param {Object} viewFactory The object responsible for returning an
	 *                             instance of a view object.
	 * @param {Object} log The application logging object
	 * @return {void}
	 */
	constructor: function( suiteFactory, viewFactory, log ) {
		if ( !this.setSuiteFactory( suiteFactory ) ) {
			throw new Error( "Argument 1 in TestController.prototype.constructor requires an instance of a test suite factory." );
		}
		
		if ( !this.setViewFactory( viewFactory ) ) {
			throw new Error( "Argument 2 in TestController.prototype.constructor requires an instance of a view factory." );
		}
		
		this.testSuites = [];
	},
	
	
	
	/**
	 * @property {Object} The object responsible for application logging
	 */
	log: null,
	
	/**
	 * Set the log property
	 *
	 * @param {Object} log The new log property
	 * @return {Boolean} True if set successfully
	 */
	setLog: function( log ) {
		if ( log && typeof log === "object" ) {
			this.log = log;
			
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 *  @property {Object} The object responsible for creating instance of
	 *                     test suites
	 */
	suiteFactory: null,
	
	/**
	 * Set the suiteFactory property
	 *
	 * @param {Object} suiteFactory The new suiteFactory property
	 * @return {Boolean} True if set successfully
	 */
	setSuiteFactory: function( suiteFactory ) {
		if ( suiteFactory && typeof suiteFactory === "object" ) {
			this.suiteFactory = suiteFactory;
			
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 *  @property {Array} An array of test suites this controller manages
	 */
	testSuites: null,
	
	/**
	 * Create a new test suite
	 * 
	 * @param {String} suiteId Id of the test suite to create
	 * @return {Function} A shortcut function to add tests to the new suite.
	 */
	createTestSuite: function( suiteId ) {
		if ( typeof suiteId !== "string" ) {
			suiteId = String( ( new Date() ).getTime() );
		}
		
		var suite = this.suiteFactory.getInstance( this, suiteId );
		
		/**
		 * A shortcut function allowing tests to be easily added to the suite.
		 *
		 * @param {String} testId Id of the new test
		 * @param {Function} doTest The function containing the test code
		 * @return {void}
		 */
		var testGenerator = function( testId, doTest ) {
			if ( typeof doTest !== "function" ) {
				throw new Error( "Argument 2 in <Private: testGenerator> must be the function which performs the actual test." );
			}
			
			suite.createTest( testId, doTest );
			
			doTest = null;
		};
		
		/**
		 * Clean up the function closure to allow gracefull garbage collection
		 * of objects
		 *
		 * @param {void}
		 * @return {void}
		 */
		testGenerator.cleanup = function() {
			suite = null;
		};
		
		this.testSuites.push( suite );
		
		return testGenerator;
	},
	
	
	
	/**
	 *  @property {Object} The object responsible for updating the view
	 */
	view: null,
	
	/**
	 * Set the view property
	 *
	 * @param {Object} view The new view property
	 * @return {Boolean} True if set successfully
	 */
	setView: function( view ) {
		if ( view && typeof view === "object" ) {
			this.view = view;
			
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 *  @property {Object} The object responsible for getting an instance of a
	 *                     test view
	 */
	viewFactory: null,
	
	/**
	 * Set the viewFactory property
	 *
	 * @param {Object} viewFactory The new viewFactory property
	 * @return {Boolean} True if set successfully
	 */
	setViewFactory: function( viewFactory ) {
		if ( viewFactory && typeof viewFactory === "object" ) {
			this.viewFactory = viewFactory;
			
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 * Log an info statement to the application logger
	 *
	 * @param {String} message The message to log
	 * @param {Object} test The test object generating the logging statement
	 * @return {void}
	 */
	info: function( message, test ) {
		this.log.info( message, test.getSuiteId() + "." + test.getId() );
	},
	
	/**
	 * 
	 */
	notifyAssertFailed: function( test, message, type ) {
		this.log.error( message, test.getId() );
		this.view.render( test );
	},
	
	/**
	 * Notify the user that a test has failed
	 *
	 * @param {Object} test The test that failed
	 * @param {String} message An optional failure message
	 * @return {void}
	 */
	notifyTestFailed: function( test, message ) {
		if ( typeof message === "string" ) {
			message = "Failed with message: " + message;
		}
		else {
			message = "Failed";
		}
		
		this.log.error( message, test.getId() );
		this.view.render( test );
	},
	
	/**
	 * Notify the user that a test has passed
	 *
	 * @param {Object} test The test that passed
	 * @return {void}
	 */
	notifyTestPassed: function( test ) {
		this.log.info( "Passed", test.getId() );
		this.view.render( test );
	},
	
	/**
	 * Notify the user that a test has timed out
	 *
	 * @param {Object} test The test that failed
	 * @return {void}
	 */
	notifyTestTimedOut: function( test ) {
		this.log.error( "Timed out", test.getId() );
		this.view.render( test );
	},
	
	/**
	 * Run all the tests this controller manages.
	 *
	 * @param {void}
	 * @return {void}
	 */
	runTests: function() {
		if ( this.testSuites.length === 0 ) {
			return;
		}
		
		for ( var i = 0, length = this.testSuites.length; i < length; i++ ) {
			this.testSuites[ i ].runTests();
		}
	}
	
};
