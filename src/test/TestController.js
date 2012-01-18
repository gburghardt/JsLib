/**
 * @class This class is the main driver of the JavaScript tests. It runs the
 * tests and updates the view as tests are run. The Delegate Pattern is used
 * extensively, as the test controller is passed to each test suite, which then
 * passes the test controller to each test.
 *
 * The Abstract Factory Pattern is also used to generate factory objects, which
 * then return instances of test suites, individual tests, and the view classes
 * that update the user on test progress. You can create your own view classes
 * and then specify your own view factory to change the views.
 *
 * @extends Object
 */
function TestController( factoryGenerator, log, id ) {
	this.constructor( factoryGenerator, log, id );
}

/** @lends TestController */
TestController.prototype = {
	
	summaryView: null,
	
	progressView: null,
	
	/**
	 * @constructs
	 *
	 * @param {Object} factoryGenerator The object responsible for generating
	 *                                  instances of factory objects.
	 * @param {Object} log The application logging object
	 * @param {String} id The optional Id for this test controller
	 * @return {void}
	 */
	constructor: function( factoryGenerator, log, id ) {
		if ( !this.setFactoryGenerator( factoryGenerator ) ) {
			throw new Error( "TestController.prototype.constructor: Argument 1 must be an instance of a factory generator." );
		}
		
		if ( !this.setLog( log ) ) {
			throw new Error( "TestController.prototype.constructor: Argument 2 must be an application logger." );
		}
		
		if ( !this.setId( id ) ) {
			this.setId( String( ( new Date() ).getTime() ) );
		}
		
		var viewFactory = this.factoryGenerator.getViewFactory();
		
		this.summaryView = viewFactory.getInstance( "summary", "test-view-summary-" + this.id );
		this.progressView = viewFactory.getInstance( "progress", "test-view-progress-" + this.id );
		
		this.testSuites = [];
		
		viewFactory = null;
	},
	
	/**
	 * Initialize this test controller
	 *
	 * @param {void}
	 * @return {void}
	 */
	init: function() {
		this.summaryView.init();
		this.progressView.init();
		
		for ( var i = 0, length = this.testSuites.length; i < length; i++ ) {
			this.progressView.renderTestSuite( this.testSuites[ i ] );
		}
		
		this.summaryView.render( this.getSummary() );
	},
	
	
	
	/**
	 * @property {Object} The object responsible for creating instance of
	 *                    test suites
	 */
	factoryGenerator: null,
	
	/**
	 * Set the suiteFactory property
	 *
	 * @param {Object} factoryGenerator The new factoryGenerator property
	 * @return {Boolean} True if set successfully
	 */
	setFactoryGenerator: function( factoryGenerator ) {
		if ( factoryGenerator && typeof factoryGenerator === "object" ) {
			this.factoryGenerator = factoryGenerator;
			
			return true;
		}
		
		return false;
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
	 *  @property {Array} An array of test suites this controller manages
	 */
	testSuites: null,
	
	/**
	 * Create a new test suite
	 * 
	 * @param {String} suiteId Id of the test suite to create
	 * @return {Function} A shortcut function to add tests to the new suite.
	 */
	createTestSuite: function( suiteId, returnSuite ) {
		if ( typeof suiteId !== "string" ) {
			suiteId = String( ( new Date() ).getTime() );
		}
		
		var suiteFactory = this.factoryGenerator.getSuiteFactory();
		var testFactory = this.factoryGenerator.getTestFactory();
		var suite = suiteFactory.getInstance( this, testFactory, suiteId );
		
		if (!returnSuite) {
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
			suiteFactory = testFactory = null;

			return testGenerator;
		}
		else {
			this.testSuites.push( suite );
			suiteFactory = testFactory = null;

			return suite;
		}
	},
	
	
	
	/**
	 * Get information on the progress of all tests
	 *
	 * @param {void}
	 * @return {Object}
	 */
	getSummary: function() {
		var summary = {
			passed: 0,
			failed: 0,
			pending: 0,
			timedOut: 0,
			inProgress: 0,
			complete: 0,
			total: 0,
			percentComplete: 0
		};
		
		var data = null;
		
		for ( var i = 0, length = this.testSuites.length; i < length; i++ ) {
			data = this.testSuites[ i ].getSummary();
			
			summary.passed += data.passed;
			summary.failed += data.failed;
			summary.pending += data.pending;
			summary.timedOut += data.timedOut;
			summary.inProgress += data.inProgress;
			summary.total += data.total;
			summary.complete += data.complete;
		}
		
		summary.percentComplete = Math.round( summary.complete / summary.total * 100 );
		
		return summary;
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
	 * Notify the user that an assertion has failed
	 *
	 * @param {Object} test The test that made the failed assertion
	 * @param {String} message The failure message
	 * @param {String} type The assertion type
	 * @return {void}
	 */
	notifyAssertFailed: function( test, message, type ) {
		this.log.error( message, test.getSuiteId() + "." + test.getId() );
		
		this.summaryView.render( this.getSummary() );
		this.progressView.renderTest( test );
	},
	
	/**
	 * Notify the user that a test has failed
	 *
	 * @param {Object} test The test that failed
	 * @param {String} message An optional failure message
	 * @return {void}
	 */
	notifyTestFailed: function( test ) {
		var message = "Test failed!";
		
		this.log.error( message, test.getSuiteId() + "." + test.getId() );
		
		this.summaryView.render( this.getSummary() );
		this.progressView.renderTest( test );
	},
	
	/**
	 * Notify the user that a test has passed
	 *
	 * @param {Object} test The test that passed
	 * @return {void}
	 */
	notifyTestPassed: function( test ) {
		this.log.info( "Passed", test.getSuiteId() + "." + test.getId() );
		
		this.summaryView.render( this.getSummary() );
		this.progressView.renderTest( test );
	},
	
	/**
	 * Notify the user that a test has timed out
	 *
	 * @param {Object} test The test that failed
	 * @return {void}
	 */
	notifyTestTimedOut: function( test ) {
		this.log.error( "Timed out", test.getSuiteId() + "." + test.getId() );
		
		this.summaryView.render( this.getSummary() );
		this.progressView.renderTest( test );
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
			this.summaryView.render( this.getSummary() );
			this.progressView.renderTestSuite( this.testSuites[ i ] );
		}
	}
	
};

TestController.instance = null;

TestController.createInstance = function( factoryGenerator, logger, id ) {
	this.instance = new TestController( factoryGenerator, logger, id );
};

TestController.getInstance = function() {
	return this.instance;
};
