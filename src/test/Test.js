/**
 * @class This class provides the Model for unit or functional tests in
 * JavaScript. Both synchronous and asynchronous tests are supported.
 *
 * @extends Object
 */
function Test( suiteId, testController, id ) {
	this.constructor( suiteId, testController, id );
}

/** @lends Test */
Test.prototype = {
	
	/**
	 * @property {Date} The end date of the test
	 */
	endDate: null,
	
	/**
	 * @property {Date} The start date of the test
	 */
	startDate: null,
	
	/**
	 * @constructs
	 *
	 * @param {String} suiteId The test suite Id to which this test belongs
	 * @param {Object} testController The controller managing this test
	 * @param {String} id Optional unique Id for this test
	 * @return {void}
	 */
	constructor: function( suiteId, testController, id ) {
		if ( !this.setSuiteId( suiteId ) ) {
			throw new Error( "Test.prototype.constructor argument 1 must be {String} suiteId" );
		}
		
		if ( !this.setTestController( testController ) ) {
			throw new Error( "Test.prototype.constructor argument 2 must be {Object} testController" );
		}
		
		if ( !this.setId( id ) ) {
			this.setId( String( ( new Date() ).getTime() ) );
		}
		
		this.assertions = {
			failed: [],
			passed: []
		};
		
		this.setStatus( this.STATUS_PENDING );
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
	 * @property {String} The current status of this test
	 */
	status: null,
	
	/**
	 * @const {String} This test is pending
	 */
	STATUS_PENDING: "pending",
	
	/**
	 * @const {String} This test is in progress, but has not timed out, failed,
	 *                 or passed.
	 */
	STATUS_IN_PROGRESS: "in_progress",
	
	/**
	 * @const {String} This test has timed out
	 */
	STATUS_TIMED_OUT: "timed_out",
	
	/**
	 * @const {String} This test has failed
	 */
	STATUS_FAILED: "failed",
	
	/**
	 * @const {String} This test has passed and is finished
	 */
	STATUS_PASSED: "passed",
	
	/**
	 * Checks to see if this test has failed
	 *
	 * @param {void}
	 * @return {Boolean}
	 */
	hasFailed: function() {
		return ( this.status === this.STATUS_FAILED );
	},
	
	/**
	 * Checks to see if this test has passed
	 *
	 * @param {void}
	 * @return {Boolean}
	 */
	hasPassed: function() {
		return ( this.status === this.STATUS_PASSED );
	},
	
	/**
	 * Checks to see if this test has timed out waiting for a pass or fail
	 * response from a test function.
	 *
	 * @param {void}
	 * @return {Boolean}
	 */
	hasTimedOut: function() {
		return ( this.status === this.STATUS_TIMED_OUT );
	},
	
	/**
	 * Checks to see if this test is in progress and is waiting for a pass or
	 * fail response from a test function.
	 *
	 * @param {void}
	 * @return {Boolean}
	 */
	inProgress: function() {
		return ( this.status === this.STATUS_IN_PROGRESS );
	},
	
	/**
	 * Checks to see if this test is pending, and has not begun running yet
	 *
	 * @param {void}
	 * @return {Boolean}
	 */
	isPending: function() {
		return ( this.status === this.STATUS_PENDING );
	},
	
	/**
	 * Sets the current status of this test.
	 *
	 * @param {String} status The new current test status
	 * @return {void}
	 */
	setStatus: function( status ) {
		switch ( status ) {
			
			case this.STATUS_IN_PROGRESS:
				this.status = this.STATUS_IN_PROGRESS;
			break;
			
			case this.STATUS_TIMED_OUT:
				this.status = this.STATUS_TIMED_OUT;
			break;
			
			case this.STATUS_PASSED:
				this.status = this.STATUS_PASSED;
			break;
			
			case this.STATUS_FAILED:
				this.status = this.STATUS_FAILED;
			break;
			
			case this.STATUS_PENDING:
			default:
				this.status = this.STATUS_PENDING;
			break;
			
		}
	},
	
	
	
	/**
	 * @property {String} Id of the test suite to which this test belongs
	 */
	suiteId: null,
	
	/**
	 * Get the suite Id
	 *
	 * @param {void}
	 * @return {String}
	 */
	getSuiteId: function() {
		return this.suiteId;
	},
	
	/**
	 * Set the suite Id
	 *
	 * @param {String} suiteId
	 * @return {Boolean} True if set successfully
	 */
	setSuiteId: function( suiteId ) {
		if ( typeof suiteId === "string" && suiteId !== "" ) {
			this.suiteId = suiteId;
			
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 * @property {Object} The controller managing this test
	 */
	testController: null,
	
	/**
	 * Get the controller managing this test
	 *
	 * @param {void}
	 * @return {Object}
	 */
	getTestController: function() {
		return this.testController;
	},
	
	/**
	 * Set the test controller managing this test
	 *
	 * @param {Object} testController The controller managing this test
	 * @return {Boolean} True if set successfully
	 */
	setTestController: function( testController ) {
		if ( testController && typeof testController === "object" ) {
			this.testController = testController;
			
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 * Run this test.
	 *
	 * @param {void}
	 * @return {void}
	 */
	runTest: function() {
		this.startDate = new Date();
		this.setStatus( this.STATUS_IN_PROGRESS );
		
		try {
			this.setup( this );
			
			var result = this.doTest( this );
			var type = typeof( result );
			
			switch ( type ) {
				
				case "boolean":
					// pass or fail this test immediately
					if ( result ) {
						this.pass();
					}
					else {
						this.fail();
					}
				break;
				
				case "number":
					// start a timer so this test doesn't stay in progress forever
					this.info( "Test returned and is in progress asynchronously. Waiting up to " + result + " milliseconds" );
					this.startTimeout( result );
				break;
				
				default:
					// test can stay in progress forever
					this.info( "Test returned and is in progress asynchronously" );
				break;
				
			}
		}
		catch ( error ) {
			this.fail( error );
		}
		
	},
	
	/**
	 * @abstract
	 *
	 * This function should be overridden by child classes or injected into an
	 * instance of the Test class. This method actually performs the test, makes
	 * assertions and eventually calls pass() or fail().
	 * 
	 * @param {Object} test The object representing this test, which is actually
	 *                      a reference to this test. Use this to refer to this
	 *                      test when calling private callback functions defined
	 *                      inside the doTest() method as a function closure.
	 * 
	 * @return {Boolean} Pass or fail this test immediately
	 * @return {Number} Wait this many milliseconds before declaring this
	 *                  asynchronous test "timed out"
	 * @return {other} This test is asynchronous and will wait indefinitely for
	 *                 a pass or fail.
	 */
	doTest: function( test ) {
		throw new Error( "Test.prototype.doTest must be overridden or injected." );
	},
	
	/**
	 * This method is called before doTest() to set up any additional properties
	 * or methods used in this test.
	 *
	 * @param {Object} test A reference to this test
	 * @return {void}
	 */
	setup: function( test ) {
		
	},
	
	/**
	 * This method is called at the end of this test.
	 *
	 * @param {Object} test A reference to this test
	 * @return {void}
	 */
	teardown: function( test ) {
		
	},
	
	
	
	/**
	 * @property {Object} A hash array of failed and successful assertions
	 */
	assertions: null,
	
	/**
	 * Add an assertion
	 *
	 * @param {Boolean} condition Whether the assertion passed or failed
	 * @param {String} message The failure message
	 * @param {String} type The assertion type
	 * @return {void}
	 */
	addAssertion: function( condition, message, type ) {
		if ( condition === true ) {
			this.assertions.passed.push( {
				type: type
			} );
		}
		else {
			this.assertions.failed.push( {
				message: message,
				type: type
			} );
		}
	},
	
	/**
	 * Get all assertions made in this test
	 *
	 * @param {void}
	 * @return {Object}
	 */
	getAssertions: function() {
		return this.assertions;
	},
	
	
	
	/**
	 * @property {Number} The timeout Id associated with this test
	 */
	timeoutId: null,
	
	/**
	 * Start a timer that declares this test timed out upon expiring.
	 *
	 * @param {Number} millis Number of milliseconds to wait before declaring
	 *                        this test timed out.
	 * @return {void}
	 */
	startTimeout: function( millis ) {
		if ( this.timeoutId ) {
			return;
		}
		
		var test = this;
		
		var timeoutCallback = function() {
			test.timeout();
			test = null;
		};
		
		this.timeoutId = setTimeout( timeoutCallback, millis );
	},
	
	/**
	 * Stops time out timer.
	 * 
	 * @param {void}
	 * @return {void}
	 */
	stopTimeout: function() {
		if ( this.timeoutId === null ) {
			return;
		}
		
		clearTimeout( this.timeoutId );
		this.timeoutId = null;
	},
	
	
	
	/**
	 * Make an assertion of a certain type.
	 *
	 * @param {Boolean} condition Whether or not the assertion has succeeded
	 * @param {String} message The failure message
	 * @param {String} type The type of assertion
	 * @return {Boolean}
	 */
	assert: function( condition, message, type ) {
		if ( !condition ) {
			this.testController.notifyAssertFailed( this, message, type );
		}
		
		this.addAssertion( condition, message, type );
		
		return condition;
	},
	
	/**
	 * Assert that the test value is an Array object
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @return {Boolean}
	 */
	assertArray: function( message, testValue ) {
		return this.assert( typeof testValue === "object" && testValue !== null && testValue.constructor && testValue.constructor === Array, message, "array" );
	},
	
	/**
	 * Assert that the test value is of type Boolean
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @return {Boolean}
	 */
	assertBoolean: function( message, testValue ) {
		return this.assert( typeof testValue === "boolean", message, "bool" );
	},
	
	/**
	 * Assert that the test value matches an actual value
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @param {Mixed} actualValue The value testValue should be
	 * @return {Boolean}
	 */
	assertEquals: function( message, testValue, actualValue ) {
		return this.assert( testValue === actualValue, message, "equals" );
	},
	
	/**
	 * Assert that the test value is false
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @return {Boolean}
	 */
	assertFalse: function( message, testValue ) {
		return this.assert( testValue === false, message, "false" );
	},
	
	/**
	 * Assert that the test value is an instance of a certain class
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @param {Function} classReference The object constructor function (class)
	 *                                  that testValue should be an instance of
	 * @return {Boolean}
	 */
	assertInstanceof: function( message, object, classReference ) {
		return this.assert( ( object instanceof classReference ), message, "instance" );
	},
	
	/**
	 * Assert that the test value does not match an actual value
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @param {Mixed} actualValue The value testValue should not be
	 * @return {Boolean}
	 */
	assertNotEquals: function( message, testValue, actualValue ) {
		return this.assert( testValue !== actualValue, message, "notEquals" );
	},
	
	/**
	 * Assert that the test value is not null
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @return {Boolean}
	 */
	assertNotNull: function( message, testValue ) {
		return this.assert( testValue !== null, message, "notNull" );
	},
	
	/**
	 * Assert that the test value is null
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @return {Boolean}
	 */
	assertNull: function( message, testValue ) {
		return this.assert( testValue === null, message, "null" );
	},
	
	/**
	 * Assert that the test value is a Number
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @return {Boolean}
	 */
	assertNumber: function( message, testValue ) {
		return this.assert( typeof testValue === "number", message, "number" );
	},
	
	/**
	 * Assert that the test value is an Object object
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @return {Boolean}
	 */
	assertObject: function( message, testValue ) {
		return this.assert( Object.prototype.toString.call( testValue ) === "[object Object]", message, "object" );
	},
	
	/**
	 * Assert that the test value is an Object object
	 * 
	 * @param {String} message The failure message
	 * @param {RegExp} regex A regular expression
	 * @param {String} testValue The string value that should match the regex
	 * @return {Boolean}
	 */
	assertRegexMatches: function( message, regex, testValue ) {
		return this.assert( regex.test( testValue ), message, "regex" );
	},
	
	/**
	 * Assert that the test value is a String
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @return {Boolean}
	 */
	assertString: function( message, testValue ) {
		return this.assert( typeof testValue === "string", message, "string" );
	},
	
	/**
	 * Assert that the test value is true
	 * 
	 * @param {String} message The failure message
	 * @param {Mixed} testValue The value to test
	 * @return {Boolean}
	 */
	assertTrue: function( message, testValue ) {
		return this.assert( testValue === true, message, "true" );
	},
	
	
	
	/**
	 * @property {String} The message generated at the time of test failure
	 */
	failureMessage: "",
	
	/**
	 * Mark this test as failed
	 *
	 * @param {String} message The optional failure message
	 * @return {void}
	 */
	fail: function( message ) {
		var type = typeof( message );
		var error = null;
		
		if ( message && type === "object" && message instanceof Error ) {
			error = message;
			message = error.message;
			
			if ( error.lineNumber ) {
				message += " on line " + error.lineNumber;
			}
			
			if ( error.fileName ) {
				message += " in file " + error.fileName;
			}
		}
		
		if ( type === "string" ) {
			this.failureMessage = message;
		}
		
		this.stopTimeout();
		this.endDate = new Date();
		this.setStatus( this.STATUS_FAILED );
		this.teardown();
		this.testController.notifyTestFailed( this );
	},
	
	/**
	 * Log an info message.
	 *
	 * @param {String} message The message to log
	 * @return {void}
	 */
	info: function( message ) {
		this.testController.info( message, this );
	},
	
	/**
	 * Mark this test as passed
	 *
	 * @param {void}
	 * @return {void}
	 */
	pass: function() {
		this.stopTimeout();
		this.endDate = new Date();
		this.setStatus( this.STATUS_PASSED );
		this.teardown();
		this.testController.notifyTestPassed( this );
	},
	
	/**
	 * Mark this test as timed out
	 *
	 * @param {void}
	 * @return {void}
	 */
	timeout: function() {
		this.stopTimeout();
		this.endDate = new Date();
		this.setStatus( this.STATUS_TIMED_OUT );
		this.teardown();
		this.testController.notifyTestTimedOut( this );
	},
	
	
	
	// utility methods
	
	/**
	 * Wrap a callback function in a try catch block so errors thrown in a
	 * callback cause this test to fail.
	 *
	 * @param {Function} callback The callback function to wrap
	 * @return {Function} The wrapped callback
	 */
	wrapCallback: function( callback ) {
		var test = this;
		
		return function() {
			try {
				return callback.apply( null, arguments );
			}
			catch ( error ) {
				test.fail( error );
			}
		};
	}
	
};

