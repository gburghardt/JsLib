function Test( testController ) {
	this.constructor( testController );
}

Test.prototype = {
	
	testController: null;
	
	constructor: function( testController ) {
		if ( testController && typeof testController === "object" ) {
			this.testController = testController;
		}
		else {
			throw new Error( "Test.prototype.constructor requires 1 argument: Object testController" );
		}
	},
	
	

	assert: function( condition, message, assertType ) {
		if ( !condition ) {
			this.testController.notifyAssertFailed( this, message, assertType );
			
			return false;
		}
		
		return true;
	},
	
	assertArray: function( message, testValue ) {
		return this.assert( typeof testValue === "object" && testValue !== null && testValue.constructor && testValue.constructor === Array, message, "array" );
	},
	
	assertBoolean: function( message, testValue ) {
		return this.assert( typeof testValue === "boolean", message, "bool" );
	},
	
	assertEquals: function( message, testValue, actualValue ) {
		return this.assert( testValue === actualValue, message, "equals" );
	},
	
	assertFalse: function( message, testValue ) {
		return this.assert( testValue === false, message, "false" );
	},
	
	assertInstanceof: function( message, object, classReference ) {
		return this.assert( ( object instanceof classReference ), message, "instance" );
	},
	
	assertNotEquals: function( message, assertType, testValue, actualValue ) {
		return this.assert( testValue !== actualValue, message, "notEquals" );
	},
	
	assertNotNull: function( message, testValue ) {
		return this.assert( testValue !== null, message, "notNull" );
	},
	
	assertNull: function( message, testValue ) {
		return this.assert( testValue === null, message, "null" );
	},
	
	assertNumber: function( message, testValue ) {
		return this.assert( typeof testValue === "number", message, "number" );
	},
	
	assertObject: function( message, testValue ) {
		return this.assert( Object.prototype.toString.call( testValue ) === "[object Object]", message, "object" );
	},
	
	assertRegexMatches: function( message, regex, testValue ) {
		return this.assert( regex.test( testValue ), message, "regex" );
	},
	
	assertString: function( message, testValue ) {
		return this.assert( typeof testValue === "string", message, "string" );
	},
	
	assertTrue: function( message, testValue ) {
		return this.assert( testValue === true, message, "true" );
	},
	
	
	
	fail: function( message, this, startDate ) {
		this.testController.notifyTestFailed( this, message, startDate );
	},
	
	info: function( message, this ) {
		this.testController.info( message, this );
	},
	
	pass: function( this, startDate ) {
		this.testController.notifyTestPassed( this, startDate );
	}
	
};

