/**
 * @depends TestController
 * @depends JSON
 * @depends Delegator
 * @depends Connection
 */
( function( testController ) {
	
	var createTest = testController.createTestSuite( "Connection" );
	
	createTest( "instantiate", function( test ) {
		var connection = new Connection( JSON );
		
		return true;
	} );
	
	createTest( "send", function( test ) {
		var connection = new Connection( JSON );
		var delegate = {
			success: function( data ) {
				test.assertObject("data should be an object", data);
				test.assertString("The html variable should be a string", data.html);
				test.pass();
			},
			
			timeout: function( error ) {
				test.fail( error );
			}
		};
		
		connection.setOptions( {
			url: "http://localhost:4000/test/transport/dummy.txt",
			method: Connection.METHOD_GET,
			dataType: Connection.DATA_TYPE_HTML,
			user: "foo",
			password: "bar",
			params: {
				foo: "bar"
			},
			actions: {
				success: {
					instance: delegate,
					method: "success"
				},
				timeout: {
					instance: delegate,
					method: "timeout"
				}
			}
		} );
		
		connection.send();
		
		return 10000;
	} );
	
	createTest( "sendWithSerializableData", function( test ) {
		var params = new SerializableData();
		var connection = new Connection( JSON );
		var delegate = {
			success: function( html, meta ) {
				test.pass();
			}
		};
		
		params.set( "type", "dummy" );
		params.set( "arr", 1 );
		params.set( "arr", 2 );
		
		connection.setOptions( {
			url: "http://localhost:4000/test/transport/dummy.txt",
			method: Connection.METHOD_GET,
			dataType: Connection.DATA_TYPE_HTML,
			params: params,
			actions: {
				success: {
					instance: delegate,
					method: "success"
				}
			}
		} );
		connection.send();
		
		return 10000;
	} );
	
	createTest( "timeout", function( test ) {
		var connection = new Connection();
		var delegate = {
			success: function( html, meta ) {
				test.fail( "The connection should have timed out" );
			},
			timeout: function( data ) {
				test.assertString( "data.url should be a string", data.url );
				test.assertString( "data.method should be a string", data.method );
				test.assertNumber( "data.readyState should be a number", data.readyState );
				test.assertNumber( "data.timeoutCount should be a number", data.timeoutCount );
				test.pass();
			}
		};
		
		connection.setOptions( {
			url: "/test/transport/sleep.php",
			method: Connection.METHOD_GET,
			dataType: Connection.DATA_TYPE_HTML,
			timeoutPeriod: 5000,
			actions: {
				success: {
					instance: delegate,
					method: "success"
				},
				timeout: {
					instance: delegate,
					method: "timeout"
				}
			}
		} );
		connection.send();
		
		return 20000;
	} );
	
	createTest("synchronousRequest", function( test ) {
		var connection = new Connection();
		var successCalled = false;
		var delegate = {
			success: function( html, meta ) {
				successCalled = true;
			},
			timeout: function() {
				test.fail( "The connection timed out" );
			}
		};
		
		connection.setOptions( {
			url: "/test/transport/dummy.txt",
			method: Connection.METHOD_GET,
			async: false,
			dataType: Connection.DATA_TYPE_HTML,
			timeoutPeriod: 5000,
			actions: {
				success: {
					instance: delegate,
					method: "success"
				},
				timeout: {
					instance: delegate,
					method: "timeout"
				}
			}
		} );
		
		connection.send();
		
		return (
			test.assertTrue( "The success delegate should have been called", successCalled )
		);
	} );
	
} )( TestController.getInstance() );
