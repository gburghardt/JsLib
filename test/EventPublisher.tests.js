( function( testController ) {
	
	
	
	// shortcut function to add tests to a suite
	var createTest = testController.createTestSuite( "EventPublisher" );
	
	
	
	// utility methods
	
	var getSubscriber = function() {
		return {
			handleTestEvent: function() {}
		};
	};
	
	
	
	// tests
	
	createTest( "instantiateEventPublisher", function( test ) {
		var publisher = new EventPublisher();
		
		return (
			test.assertInstanceof( "The publisher variable should be an instance of EventPublisher", publisher, EventPublisher )
		);
	} );
	
	createTest( "topic", function( test ) {
		var topic = "testTopic";
		var publisher = new EventPublisher( topic );
		
		return test.assertEquals( "Publisher default topic and specified topic should be the same", publisher.defaultTopic, topic );
	} );
	
	createTest( "addSubscriber", function( test ) {
		var publisher = new EventPublisher();
		var eventName = "testEvent";
		var subscriber = getSubscriber();
		var topic = publisher.defaultTopic;
		
		publisher.subscribe( eventName, subscriber, "handleTestEvent" );
		
		return (
			test.assertTrue( "Event " + eventName + " should have topics.", publisher.eventHasTopics( eventName ) ) &&
			test.assertTrue( "Topic " + topic + " should have subscriptions", publisher.topicHasSubscriptions( eventName, topic ) ) &&
			test.assertEquals( "Subscriber was not found in the publisher", publisher.subscriptions[ eventName ][ topic ][ 0 ].instance, subscriber )
		);
	} );
	
	createTest( "addTopicSubscriber", function( test ) {
		var publisher = new EventPublisher();
		var topic = "testTopic";
		var eventName = "testEvent";
		var subscriber = getSubscriber();
		
		publisher.subscribe( eventName, subscriber, "handleTestEvent", topic );
		
		return (
			test.assertTrue( "Event should have topics", publisher.eventHasTopics( eventName ) ) &&
			test.assertTrue( "Topic should have subscriptions", publisher.topicHasSubscriptions( eventName, topic ) ) &&
			test.assertEquals( "Subscriber was not found in the publisher", publisher.subscriptions[ eventName ][ topic ][ 0 ].instance, subscriber )
		);
	} );
	
	createTest( "unsubscribe", function( test ) {
		var publisher = new EventPublisher();
		var subscriber = getSubscriber();
		var eventName = "testEvent";
		var topic = "testTopic";
		var unsubscribed = false;
		
		publisher.subscribe( eventName, subscriber, "handleTestEvent", topic );
		unsubscribed = publisher.unsubscribe( eventName, subscriber, topic );
		
		return (
			test.assertTrue( "Subscriber not found in publisher", unsubscribed ) &&
			test.assertObject( "Should be an object", publisher.subscriptions[ eventName ] ) &&
			test.assertEquals( "Subscriptions should be zero for event " + eventName + " on topic " + topic, publisher.subscriptions[ eventName ][ topic ].length, 0 )
		);
	} );
	
	createTest( "publishDefaultTopic", function( test ) {
		var publisher = new EventPublisher();
		var subscriber = {
			handleTestEvent: function( event ) {
				notified = true;
			}
		};
		var eventName = "testEvent";
		var notified = false;
		var success = false;
		
		publisher.subscribe( eventName, subscriber, "handleTestEvent" );
		
		success = publisher.publish( eventName );
		
		return (
			test.assertTrue( "The publish() method should have returned true", success ) &&
			test.assertTrue( "Event subscriber should have been notified", notified )
		);
	} );
	
	createTest( "publishWithTopic", function( test ) {
		var publisher = new EventPublisher();
		var subscriber = {
			handleTestEvent: function( event ) {
				notified = true;
			}
		};
		var eventName = "testEvent";
		var topic = "testTopic";
		var notified = false;
		var success = false;
		
		publisher.subscribe( eventName, subscriber, "handleTestEvent", topic );
		
		success = publisher.publish( eventName, null, topic );
		
		return (
			test.assertTrue( "The publish() method should have returned true", success ) &&
			test.assertTrue( "Event subscriber should have been notified", notified )
		);
	} );
	
	createTest( "asynchronousPublish", function( test ) {
		var publisher = new EventPublisher();
		var eventName = "testEvent";
		var topic = "testTopic";
		var success = false;
		
		var subscriber = {
			handleTestEvent: function( event ) {
				test.pass();
			}
		};
		
		var timeoutLength = 1000;
		
		var timeoutCallback = function() {
			success = publisher.publish( eventName, null, topic );
			test.assertTrue( "The publish() method should have returned true", success );
		};
		
		publisher.subscribe( eventName, subscriber, "handleTestEvent", topic );
		
		setTimeout( test.wrapCallback( timeoutCallback ), timeoutLength );
		
		return 2000;
	} );
	
	createTest( "bubbleEvent", function( test ) {
		var publisher = new EventPublisher();
		var eventName = "testEvent";
		var topic = "testTopic";
		var subscriber1 = new EventPublisher();
		var subscriber2 = new EventPublisher();
		var success = false;
		var notified1 = false;
		var notified2 = false;
		
		subscriber1.handleTestEvent = function( event ) {
			notified1 = true;
			this.bubble( event );
		};
		
		subscriber2.handleTestEvent = function( event ) {
			notified2 = true;
		};
		
		publisher.subscribe( eventName, subscriber1, "handleTestEvent", topic );
		subscriber1.subscribe( eventName, subscriber2, "handleTestEvent", topic );
		
		success = publisher.publish( eventName, null, topic );
		
		return (
			test.assertTrue( "The publish() method should have returned true", success ) &&
			test.assertTrue( "Subscriber 1 should have been notified", notified1 ) &&
			test.assertTrue( "Subscriber 2 should have been notified", notified2 )
		);
	} );
	
	createTest( "stopBubbling", function( test ) {
		var publisher = new EventPublisher();
		var eventName = "testEvent";
		var topic = "testTopic";
		var subscriber1 = new EventPublisher();
		var subscriber2 = new EventPublisher();
		var subscriber3 = new EventPublisher();
		var success = false;
		var notified1 = false;
		var notified2 = false;
		var notified3 = false;
		
		subscriber1.handleTestEvent = function( event ) {
			notified1 = true;
			this.bubble( event );
		};
		
		subscriber2.handleTestEvent = function( event ) {
			notified2 = true;
			event.stopPropagation();
			this.bubble( event );
		};
		
		subscriber3.handleTestEvent = function( event ) {
			notified3 = true;
		};
		
		publisher.subscribe( eventName, subscriber1, "handleTestEvent", topic );
		
		subscriber1.subscribe( eventName, subscriber2, "handleTestEvent", topic );
		subscriber2.subscribe( eventName, subscriber3, "handleTestEvent", topic );
		
		success = publisher.publish( eventName, null, topic );
		
		return (
			test.assertTrue( "The publish() method should have returned true", success ) &&
			test.assertTrue( "Subscriber 1 should have been notified", notified1 ) &&
			test.assertTrue( "Subscriber 2 should have been notified", notified2 ) &&
			test.assertFalse( "Subscriber 3 handler should not have notified", notified3 )
		);
	} );
	
} )( TestController.getInstance() );
