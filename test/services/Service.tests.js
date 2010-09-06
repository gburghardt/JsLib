( function( testController ) {
	
	// shortcut function to add tests to a suite
	var createTest = testController.createTestSuite( "Service" );
	
	var evtDispatcher = null;
	var getEventDispatcher = function() {
		if ( evtDispatcher === null ) {
			evtDispatcher = new EventPublisher();
		}
		
		return evtDispatcher;
	};
	
	createTest( "instantiate", function( test ) {
		var service = null;
		
		try {
			service = new Service();
			test.fail( "Instantiating a service with no event dispatcher should throw an Error." );
		}
		catch ( err ) {
			test.assertInstanceof( "Instantiating a service with no event dispatcher should throw an Error.", err, Error );
		}
		
		service = new Service( getEventDispatcher() );
		
		return (
			test.assertObject( "The service variable should be an object", service ) &&
			test.assertInstanceof( "The service variable should be an instance of the Service class", service, Service )
		);
	} );
	
	createTest( "enableViaDispatcher", function( test ) {
		var dispatcher = getEventDispatcher();
		var service = new Service( dispatcher );
		
		service.init();
		service.disable();
		
		dispatcher.publish( "startUpdates" );
		
		return (
			test.assertTrue( "The service should have been enabled by the event dispatcher", service.isEnabled() )
		);
	} );

	createTest( "disableViaDispatcher", function( test ) {
		var dispatcher = getEventDispatcher();
		var service = new Service( dispatcher );
		
		service.init();
		service.enable();
		
		dispatcher.publish( "stopUpdates" );
		
		return (
			test.assertFalse( "The service should have been disabled by the event dispatcher", service.isEnabled() )
		);
	} );

	createTest( "destructor", function( test ) {
		var dispatcher = getEventDispatcher();
		var service = new Service( dispatcher );
		
		service.init();
		service.disable();
		service.destructor();
		
		dispatcher.publish( "startUpdates" );
		
		return (
			test.assertNull( "The eventDispatcher property should be null after calling destructor().", service.eventDispatcher ) &&
			test.assertFalse( "The service should not have been enabled by the event dispatcher after calling destructor().", service.isEnabled() )
		);
	} );

} )( TestController.getInstance() );
