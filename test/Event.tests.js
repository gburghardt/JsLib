( function( testController ) {
	
	var createTest = testController.createTestSuite( "Event" );
	
	createTest( "instantiateEventObject", function( test ) {
		var event = new Event( this );
		
		return (
			test.assertNotNull( "The event.target property should not be null", event.target ) &&
			test.assertObject( "The event.target property should be an object", event.target ) &&
			test.assertInstanceof( "The event object should be an instance of EVent", event, Event ) &&
			test.assertEquals( "The event.target property should be equal to this", event.target, this )
		);
	} );
	
	createTest( "initializeEvent", function( test ) {
		var event = new Event( this );
		var type = "testEvent";
		var topic = "testTopic";
		var bubbles = false;
		var cancelable = false;
		
		event.initEvent( type, bubbles, cancelable );
		event.setTopic( topic );
		
		return (
			test.assertString( "The event.type property should be a string", event.type ) &&
			test.assertEquals( "The event.type property should be " + type, event.type, type ) &&
			
			test.assertString( "The event.topic property should be a string", event.topic ) &&
			test.assertEquals( "The event.topic property should be " + topic, event.topic, topic ) &&
			
			test.assertBoolean( "The event.bubbles property should be a boolean", event.bubbles ) &&
			test.assertEquals( "The event.bubbles property should be " + bubbles, event.bubbles, bubbles ) &&
			
			test.assertBoolean( "The event.cancelable property should be a boolean", event.cancelable ) &&
			test.assertEquals( "The event.cancelable property should be " + cancelable, event.cancelable, cancelable ) &&
			
			test.assertObject( "The event.target property should be an object", event.target ) &&
			test.assertEquals( "The event.target property should be equal to this", event.target, this ) &&
			
			test.assertObject( "The event.currentTarget property should be an object", event.currentTarget ) &&
			test.assertEquals( "The event.currentTarget property should be equal to this", event.currentTarget, this )
		);
	} );
	
	createTest( "setData", function( test ) {
		var event = new Event( this );
		var data = {
			color: "green"
		};
		
		event.setData( data );
		
		return (
			test.assertNotNull( "The event data should not be null", event.getData() ) &&
			test.assertObject( "The event data should be an object", event.getData() ) &&
			test.assertEquals( "The event data should be equal to the data variable", event.getData(), data ) &&
			test.assertString( "Getting the 'color' event data should return a string", event.getData( "color" ) ) &&
			test.assertEquals( "The 'color' event data should be the same as the color property in the data variable.", event.getData( "color" ), data.color )
		);
	} );
	
	createTest( "setDataByKey", function( test ) {
		var event = new Event( this );
		var key = "color";
		var value = "green";
		
		event.setData( key, value );
		
		return (
			test.assertString( "Getting the event data '"+ key + "' should return a string", event.getData( key ) ) &&
			test.assertEquals( "Getting the event data '"+ key + "' should return " + value, event.getData( key ), value )
		);
	} );
	
	createTest( "messages", function( test ) {
		var event = new Event( this );
		var message = "foo";
		
		event.addMessage( message );
		
		return (
			test.assertTrue( "The event object should have messages but does not", event.hasMessages() ) &&
			test.assertArray( "The event messages should be an array", event.getMessages() ) &&
			test.assertGreaterThan( "The number of event messages should be greater than zero (0)", event.getMessages().length, 0 ) &&
			test.assertEquals( "The first message should be '" + message + "'.", event.getMessages()[ 0 ], message )
		);
	} );
	
	createTest( "errors", function( test ) {
		var event = new Event( this );
		var error = "foo";
		
		event.addError( error );
		
		return (
			test.assertTrue( "The event should have errors, but does not.", event.hasErrors() ) &&
			test.assertArray( "The event errors should be an array", event.getErrors() ) &&
			test.assertGreaterThan( "There should be more than zero event errors", event.getErrors().length, 0 ) &&
			test.assertEquals( "The first event error should be " + error + ", but '" + event.getErrors()[ 0 ] + "' was given instead.", event.getErrors()[ 0 ], error )
		);
	} );
	
	createTest( "propagating", function( test ) {
		var event = new Event( this );
		event.initEvent( "testEvent" );
		
		return (
			test.assertTrue( "The event should be propagating, but is not", event.isPropagating() )
		);
	} );
	
	createTest( "stopPropagating", function( test ) {
		var event = new Event( this );
		event.initEvent( "testEvent" );
		event.stopPropagation();
		
		return (
			test.assertFalse( "The event should not be propagating, but is", event.isPropagating() )
		);
	} );
	
	createTest( "preventDefault", function( test ) {
		var event = new Event( this );
		event.initEvent( "testEvent" );
		event.preventDefault();
		
		return(
			test.assertTrue( "The event should have the default action prevented, but has not", event.isDefaultPrevented() )
		);
	} );
	
	createTest( "bubbling(bubbles=true)", function( test ) {
		var event = new Event( this );
		event.initEvent( "testEvent", null, true );
		
		return (
			test.assertTrue( "The event should be able to bubble, but cannot", event.canBubble() )
		);
	} );
	
	createTest( "bubbling(bubbles=false)", function( test ) {
		var event = new Event( this );
		event.initEvent( "testEvent", false );
		
		return (
			test.assertFalse( "The event should not be able to bubble, but can", event.canBubble() )
		);
	} );
	
	createTest( "bubbling(cancelable=true)", function( test ) {
		var event = new Event( this );
		event.initEvent( "testEvent", true, true );
		
		return (
			test.assertTrue( "The event should be able to bubble, but cannot", event.canBubble() )
		);
	} );
	
	createTest( "bubbling(cancelable=false)", function( test ) {
		var event = new Event( this );
		event.initEvent( "testEvent", true, false );
		
		return (
			test.assertTrue( "The event should be able to bubble, but cannot", event.canBubble() )
		);
	} );
	
	createTest( "bubbling(bubbles=false,cancelable=false)", function( test ) {
		var event = new Event( this );
		event.initEvent( "testEvent", false, false );
		
		return (
			test.assertFalse( "The event should not be able to bubble, but can", event.canBubble() )
		);
	} );
	
} )( TestController.getInstance() );
