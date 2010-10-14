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
			url: "/test/transport/dummy.txt",
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
			url: "/test/transport/dummy.txt",
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
	
	createTest( "404NotFound", function( test ) {
		var connection = new Connection( JSON );
		
		var delegate = {
			error4xx: function( data ) {
				test.assertObject( "The data.connection variable should be an object", data.connection );
				test.assertInstanceof( "The data.connection variable should be an instance of Connection", data.connection, Connection );
				test.assertEquals( "The connection and data.connection variables should be the same object", data.connection, connection );
				test.assertNumber( "The data.status variable should be a number", data.status );
				test.assertEquals( "The data.status variable should be 404", data.status, 404 );
				test.pass();
			},
			
			success: function() {
				test.fail( "The success delegate should not have been called on a bad URL" );
			}
		};
		
		connection.setOptions( {
			url: "/bad/url/not/exists.txt",
			method: Connection.METHOD_GET,
			actions: {
				error4xx: {
					instance: delegate,
					method: "error4xx"
				},
				
				success: {
					instance: delegate,
					method: "success"
				}
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
	createTest( "500ServerError", function( test ) {
		var connection = new Connection( JSON );
		
		var delegate = {
			error5xx: function( data ) {
				test.assertObject( "The data.connection variable should be an object", data.connection );
				test.assertInstanceof( "The data.connection variable should be an instance of Connection", data.connection, Connection );
				test.assertEquals( "The connection and data.connection variables should be the same object", data.connection, connection );
				test.assertNumber( "The data.status variable should be a number", data.status );
				test.assertEquals( "The data.status variable should be 500", data.status, 500 );
				test.pass();
			},
			
			success: function() {
				test.fail( "The success delegate should not have been called when the server throws an error" );
			}
		};
		
		connection.setOptions( {
			url: "./500_error.php",
			method: Connection.METHOD_GET,
			dataType: Connection.DATA_TYPE_HTML,
			actions: {
				error5xx: {
					instance: delegate,
					method: "error5xx"
				},
				
				success: {
					instance: delegate,
					method: "success"
				}
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
	createTest( "generalErrorDelegate", function( test ) {
		var connection = new Connection( JSON );
		
		var delegate = {
			error: function( data ) {
				test.assertObject( "The data.connection variable should be an object", data.connection );
				test.assertInstanceof( "The data.connection variable should be an instance of Connection", data.connection, Connection );
				test.assertEquals( "The connection and data.connection variables should be the same object", data.connection, connection );
				test.assertNumber( "The data.status variable should be a number", data.status );
				test.assertEquals( "The data.status variable should be 404", data.status, 404 );
				test.pass();
			},
			
			success: function() {
				test.fail( "The success delegate should not have been called on a bad URL" );
			}
		};
		
		connection.setOptions( {
			url: "/bad/url/not/exists.txt",
			method: Connection.METHOD_GET,
			actions: {
				error: {
					instance: delegate,
					method: "error"
				},
				
				success: {
					instance: delegate,
					method: "success"
				}
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
	createTest( "generalErrorDelegateNotCalled4xx", function( test ) {
		var connection = new Connection( JSON );
		
		var delegate = {
			error4xx: function( data ) {
				test.pass();
			},
			
			error: function() {
				test.fail( "The general error delegate should not have been called" );
			},
			
			success: function() {
				test.fail( "The success delegate should not have been called on a bad URL" );
			}
		};
		
		connection.setOptions( {
			url: "/bad/url/not/exists.txt",
			method: Connection.METHOD_GET,
			actions: {
				error4xx: {
					instance: delegate,
					method: "error4xx"
				},
				
				error: {
					instance: delegate,
					method: "error"
				},
				
				success: {
					instance: delegate,
					method: "success"
				}
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
	createTest( "generalErrorDelegateNotCalled5xx", function( test ) {
		var connection = new Connection( JSON );
		
		var delegate = {
			error5xx: function( data ) {
				test.pass();
			},
			
			error: function() {
				test.fail( "The general error delegate should not have been called" );
			},
			
			success: function() {
				test.fail( "The success delegate should not have been called on a 500 error" );
			}
		};
		
		connection.setOptions( {
			url: "./500_error.php",
			method: Connection.METHOD_GET,
			actions: {
				error5xx: {
					instance: delegate,
					method: "error5xx"
				},
				
				error: {
					instance: delegate,
					method: "error"
				},
				
				success: {
					instance: delegate,
					method: "success"
				}
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
	createTest( "htmlHappyNoMeta", function( test ) {
		var connection = new Connection( JSON );
		var delegate = {
			success: function( data ) {
				test.assertString( "data.html should be a string", data.html );
				test.assertNull( "data.meta should be null", data.meta );
				test.pass();
			},
			
			error: function() {
				test.fail( "The error delegate should not have been called" );
			}
		};
		
		connection.setOptions( {
			url: "./dummy.txt",
			method: Connection.METHOD_GET,
			dataType: Connection.DATA_TYPE_HTML,
			actions: {
				success: {
					instance: delegate,
					method: "success"
				},
				
				error: {
					instance: delegate,
					method: "error"
				}
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
	createTest( "htmlHappyWithMeta", function( test ) {
		var connection = new Connection( JSON );
		var delegate = {
			success: function( data ) {
				test.assertString( "data.html should be a string", data.html );
				test.assertObject( "data.meta should be an object", data.meta );
				test.pass();
			},
			
			error: function( data ) {
				console.error( data );
				test.fail( "The error delegate should not have been called" );
			}
		};
		
		connection.setOptions( {
			url: "./html_meta.php",
			method: Connection.METHOD_GET,
			dataType: Connection.DATA_TYPE_HTML,
			actions: {
				success: {
					instance: delegate,
					method: "success"
				},
				
				error: {
					instance: delegate,
					method: "error"
				}
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
	createTest( "htmlUnhappyMeta", function( test ) {
		var connection = new Connection( JSON );
		
		var delegate = {
			success: function( data ) {
				test.fail( "The success delegate should not have been called" );
			},
			
			error: function( data ) {
				test.assertObject( "data should be an object", data );
				test.assertString( "data.type should be a string", data.type );
				test.assertEquals( "data.type should be jsonSyntaxError", data.type, "jsonSyntaxError" );
				test.assertObject( "data.error should be an object", data.error );
				test.assertInstanceof( "data.error should be an instance of Error", data.error, Error );
				test.pass();
			}
		};
		
		connection.setOptions( {
			url: "./html_meta_syntax_error.php",
			method: Connection.METHOD_GET,
			dataType: Connection.DATA_TYPE_HTML,
			actions: {
				success: {
					instance: delegate,
					method: "success"
				},
				
				error: {
					instance: delegate,
					method: "error"
				}
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
} )( TestController.getInstance() );
