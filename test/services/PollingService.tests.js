( function( testController ) {
	
	// shortcut function to add tests to a suite
	var createTest = testController.createTestSuite( "PollingService" );

	window.services = [];
	
	var evtDispatcher = null;
	var getEventDispatcher = function() {
		if ( evtDispatcher === null ) {
			evtDispatcher = new EventPublisher();
		}
		
		return evtDispatcher;
	};
	
	createTest( "instantiate", function( test ) {
		var dispatcher = getEventDispatcher();
		var periodChangedKey = "test";
		var service = null;
		
		try {
			service = new PollingService();
			test.fail( "Instantiating a polling service with no event dispatcher should throw an Error." );
		}
		catch ( err ) {
			test.assertInstanceof( "Instantiating a polling service with no event dispatcher should throw an Error.", err, Error );
		}
		
		try {
			service = new PollingService( dispatcher );
			test.fail( "Instantiating a polling service with no periodChangedKey should throw an error" );
		}
		catch ( err ) {
			
		}
		
		service = new PollingService( dispatcher, periodChangedKey );
		services.push( service );
		
		return (
			test.assertObject( "The service variable should be an object", service ) &&
			test.assertInstanceof( "The service variable should be an instance of the PollingService class", service, PollingService ) &&
			test.assertEquals( "The default service period should be 10000 milliseconds", service.period, 10000 ) &&
			test.assertEquals( "The periodChangedKey should be " + periodChangedKey + ".", service.periodChangedKey, periodChangedKey )
		);
	} );
	
	createTest( "enableViaDispatcher", function( test ) {
		var dispatcher = getEventDispatcher();
		var periodChangedKey = "test";
		var service = new PollingService( dispatcher, periodChangedKey );
		
		service.init();
		service.disable();
		services.push( service );
		
		dispatcher.publish( "startUpdates" );
		
		return (
			test.assertTrue( "The service should have been enabled by the event dispatcher", service.isEnabled() )
		);
	} );

	createTest( "disableViaDispatcher", function( test ) {
		var dispatcher = getEventDispatcher();
		var periodChangedKey = "test";
		var service = new PollingService( dispatcher, periodChangedKey );
		
		service.init();
		service.enable();
		
		dispatcher.publish( "stopUpdates" );
		
		return (
			test.assertFalse( "The service should have been disabled by the event dispatcher", service.isEnabled() )
		);
	} );

	// createTest( "destructor", function( test ) {
	// 	var dispatcher = getEventDispatcher();
	// 	var periodChangedKey = "test";
	// 	var service = new PollingService( dispatcher, periodChangedKey );
	// 	
	// 	service.init();
	// 	service.disable();
	// 	service.destructor();
	// 	
	// 	dispatcher.publish( "startUpdates" );
	// 	
	// 	return (
	// 		test.assertNull( "The eventDispatcher property should be null after calling destructor().", service.eventDispatcher ) &&
	// 		test.assertFalse( "The service should not have been enabled by the event dispatcher after calling destructor().", service.isEnabled() )
	// 	);
	// } );

	createTest( "changePollingPeriod", function( test ) {
		var dispatcher = getEventDispatcher();
		var periodChangedKey = "test";
		var period = 5000;
		var newPeriod = 7500;
		var service = new PollingService( dispatcher, periodChangedKey, period );
		
		service.init();
		
		test.assertNumber( "The period should be a number", service.period );
		test.assertEquals( "The period in the service should be " + period + ", " + service.period + " given.", service.period, period );
		
		dispatcher.publish( "pollingPeriodChanged", {
			test: newPeriod
		} );
		
		return (
			test.assertEquals( "The period in the service should be " + newPeriod + ", " + service.period + " given.", service.period, newPeriod )
		);
	} );
	
	createTest( "polling", function( test ) {
		var dispatcher = getEventDispatcher();
		var periodChangedKey = "test";
		var period = 2000;
		var service = new PollingService( dispatcher, periodChangedKey, period );
		
		service.handleTimerExpired = function() {
			test.pass();
		};
		
		service.init();
		
		return 4000;
	} );

	createTest( "disableBeforeTimerExpires", function( test ) {
		var dispatcher = getEventDispatcher();
		var periodChangedKey = "test";
		var period = 10000;
		var service = new PollingService( dispatcher, periodChangedKey, period );
		
		service.handleTimerExpired = function() {
			test.fail( "The service timer should have been stopped." );
		};
		
		service.init();
		service.disable();
		
		setTimeout( test.wrapCallback( function() {
			test.pass();
		} ), 2000 );
		
		return 4000;
	} );

	 createTest( "noTimerAfterDestruction", function( test ) {
	 	var dispatcher = getEventDispatcher();
	 	var periodChangedKey = "test";
	 	var period = 1000;
	 	var service = new PollingService( dispatcher, periodChangedKey, period );
	 	
	 	service.init();
	 	service.destructor();
	 	service.startTimer();
	 	
	 	// set handleTimerExpired after destructor to ensure it's destroyed properly
	 	service.handleTimerExpired = function() {
	 		test.fail( "The service timer not have started after the service was destroyed." );
	 	};
	 	
	 	setTimeout( test.wrapCallback( function() {
	 		test.pass();
	 	} ), 2000 );
	 	
	 	return 4000;
	 } );

} )( TestController.getInstance() );
