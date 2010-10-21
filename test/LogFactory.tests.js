( function( testController ) {
	
	var createTest = testController.createTestSuite( "LogFactory" );
	
	createTest( "instantiate", function( test ) {
		var logFactory = new LogFactory( "console", JSON );
		
		return (
			test.assertString( "logFactory.type should be a string", logFactory.type ) &&
			test.assertObject( "logFactory.jsonService should be an object", logFactory.jsonService )
		);
	} );
	
	createTest( "getInstanceConsole", function( test ) {
		var logFactory = new LogFactory( "console", JSON );
		var log = logFactory.getInstance("testLogger" );
		
		log.info("Testing console logger", "getInstanceConsole", {
			foo: "bar"
		} );
		
		return (
			test.assertInstanceof( "The log object should be an instance of ConsoleLogger", log, ConsoleLogger )
		);
	} );
	
	createTest( "getInstanceBlackbird", function( test ) {
		var logFactory = new LogFactory( "blackbird", JSON );
		var log = logFactory.getInstance( "testLogger" );
		
		log.info("Testing blackbird logger", "getInstanceBlackbird", {
			foo: "bar"
		} );
		
		return (
			test.assertInstanceof( "The log object should be an instance of BlackbirdLogger", log, BlackbirdLogger )
		);
	} );
	
} )( TestController.getInstance() );