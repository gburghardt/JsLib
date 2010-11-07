/**
 * @depends TestController
 * @depends JSON
 * @depends Delegator
 * @depends SameDomainConnection
 */
( function( testController ) {
	
	var createTest = testController.createTestSuite( "SameDomainConnection" );
	
	createTest( "instantiate", function( test ) {
		var connection = new SameDomainConnection( JSON );
		
		return true;
	} );
	
	createTest( "setMethod", function( test ) {
		var connection = null;
		
		var methods = [
			SameDomainConnection.METHOD_GET,
			SameDomainConnection.METHOD_POST,
			SameDomainConnection.METHOD_DELETE,
			SameDomainConnection.METHOD_PUT,
			"INVALID_METHOD",
			null,
			42,
			{},
			function () {},
			NaN,
			""
		];
		
		var expectedMethods = [
			SameDomainConnection.METHOD_GET,
			SameDomainConnection.METHOD_POST,
			SameDomainConnection.METHOD_DELETE,
			SameDomainConnection.METHOD_PUT,
			SameDomainConnection.METHOD_POST,
			SameDomainConnection.METHOD_POST,
			SameDomainConnection.METHOD_POST,
			SameDomainConnection.METHOD_POST,
			SameDomainConnection.METHOD_POST,
			SameDomainConnection.METHOD_POST,
			SameDomainConnection.METHOD_POST,
		];
		
		var currentMethod = null;
		var expectedMethod = null;
		var actualMethod = null;
		
		for ( var i = 0, length = methods.length; i < length; i++ ) {
			currentMethod = methods[ i ];
			expectedMethod = expectedMethods[ i ];
			connection = new SameDomainConnection();
			connection.setOptions( { method: currentMethod } );
			actualMethod = connection.getMethod();
			
			test.assertEquals( "The method should have been " + expectedMethod + " but " + actualMethod + " was found instead." , actualMethod, expectedMethod );
		}
		
		return true;
	} );
	
	createTest( "setDataType", function( test ) {
		var connection = null;
		var dataTypes = [
			SameDomainConnection.DATA_TYPE_JSON,
			SameDomainConnection.DATA_TYPE_HTML,
			SameDomainConnection.DATA_TYPE_XML,
			"invalid_data_type",
			34,
			null,
			{},
			[],
			function () {},
			NaN
		];
		var expectedDataTypes = [
			SameDomainConnection.DATA_TYPE_JSON,
			SameDomainConnection.DATA_TYPE_HTML,
			SameDomainConnection.DATA_TYPE_XML,
			SameDomainConnection.DATA_TYPE_JSON,
			SameDomainConnection.DATA_TYPE_JSON,
			SameDomainConnection.DATA_TYPE_JSON,
			SameDomainConnection.DATA_TYPE_JSON,
			SameDomainConnection.DATA_TYPE_JSON,
			SameDomainConnection.DATA_TYPE_JSON,
			SameDomainConnection.DATA_TYPE_JSON
		];
		var currentDataType = null;
		var expectedDataType = null;
		var actualDataType = null;
		
		for ( var i = 0, length = dataTypes.length; i < length; i++ ) {
			currentDataType = dataTypes[ i ];
			expectedDataType = expectedDataTypes[ i ];
			connection = new SameDomainConnection();
			connection.setDataType( currentDataType );
			actualDataType = connection.getDataType();
			
			test.assertEquals( "The dataType should have been " + expectedDataType + " but " + actualDataType + " was found instead.", actualDataType, expectedDataType );
		}
		
		return true;
	} );
	
	createTest( "getUrl", function( test ) {
		var connection = null;
		var postUrl = "./post_form.php";
		var getUrl = "./dummy.txt";
		var params = null;
		var expectedUrl = null;
		var actualUrl = null;
		var allInfo = [
			{
				url: postUrl,
				method: SameDomainConnection.METHOD_POST,
				params: "name=getUrl",
				expectedUrl: postUrl
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: "name=getUrl",
				expectedUrl: getUrl + "?name=getUrl"
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: {
					name: "getUrl"
				},
				expectedUrl: getUrl + "?name=getUrl"
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: function() {
					var p = new SerializableData();
					p.set( "name", "getUrl" );
					return p;
				}(),
				expectedUrl: getUrl + "?name=getUrl"
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: function() {},
				expectedUrl: getUrl
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: NaN,
				expectedUrl: getUrl
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: null,
				expectedUrl: getUrl
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: "",
				expectedUrl: getUrl
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: undefined,
				expectedUrl: getUrl
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: true,
				expectedUrl: getUrl
			},{
				url: getUrl,
				method: SameDomainConnection.METHOD_GET,
				params: false,
				expectedUrl: getUrl
			}
		];
		
		var info = null;
		
		for ( var i = 0, length = allInfo.length; i < length; i++ ) {
			info = allInfo[ i ];
			connection = new SameDomainConnection( JSON );
			connection.setOptions( {
				url: info.url,
				method: info.method,
				params: info.params
			} );
			actualUrl = connection.getUrl();
			expectedUrl = info.expectedUrl;
			test.assertEquals( "(" + i + ") url should be equal to " + expectedUrl + " but instead " + actualUrl + " was given.", actualUrl, expectedUrl );
		}
		
		// TODO - create test that reuses a connection where the URL doesn't change because the params are invalid
		
		return true;
	} );
	
	createTest( "getUrlReuseSameDomainConnection", function( test ) {
		var connection = new SameDomainConnection( JSON );
		
		var delegate = {
			success1: function() {
				test.info( "First call was a success" );
			},
			
			success2: function() {
				test.info( "Second call was a success" );
			},
			
			error: function() {
				test.fail( "The error delegate should not have been called." );
			}
		};
		
		var expectedUrl = "";
		var actualUrl = "";
		
		connection.setOptions( {
			url: "./dummy.txt",
			async: false,
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			params: "foo=bar"
		} );
		
		expectedUrl = "./dummy.txt?foo=bar";
		actualUrl = connection.getUrl();
		test.assertEquals( "The URLs should be the same", actualUrl, expectedUrl );
		
		connection.setParams( 1234 );
		actualUrl = connection.getUrl();
		test.assertEquals( "The URLs should be the same", actualUrl, expectedUrl );
		
		expectedUrl = "./dummy.txt?name=Fred";
		connection.setParams( "name=Fred" );
		actualUrl = connection.getUrl();
		test.assertEquals( "The URLs should be the same", actualUrl, expectedUrl );
		
		return true;
	} );
	
	createTest( "send", function( test ) {
		var connection = new SameDomainConnection( JSON );
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
			url: "./dummy.txt",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
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
		var connection = new SameDomainConnection( JSON );
		var delegate = {
			success: function( html, meta ) {
				test.pass();
			}
		};
		
		params.set( "type", "dummy" );
		params.set( "arr", 1 );
		params.set( "arr", 2 );
		
		connection.setOptions( {
			url: "./dummy.txt",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
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
		var connection = new SameDomainConnection();
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
			url: "./sleep.php",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
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
		var connection = new SameDomainConnection();
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
			url: "./dummy.txt",
			method: SameDomainConnection.METHOD_GET,
			async: false,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
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
		var connection = new SameDomainConnection( JSON );
		
		var delegate = {
			error4xx: function( data ) {
				test.assertObject( "The data.connection variable should be an object", data.connection );
				test.assertInstanceof( "The data.connection variable should be an instance of SameDomainConnection", data.connection, SameDomainConnection );
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
			method: SameDomainConnection.METHOD_GET,
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
		var connection = new SameDomainConnection( JSON );
		
		var delegate = {
			error5xx: function( data ) {
				test.assertObject( "The data.connection variable should be an object", data.connection );
				test.assertInstanceof( "The data.connection variable should be an instance of SameDomainConnection", data.connection, SameDomainConnection );
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
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
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
		var connection = new SameDomainConnection( JSON );
		
		var delegate = {
			error: function( data ) {
				test.assertObject( "The data.connection variable should be an object", data.connection );
				test.assertInstanceof( "The data.connection variable should be an instance of SameDomainConnection", data.connection, SameDomainConnection );
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
			method: SameDomainConnection.METHOD_GET,
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
		var connection = new SameDomainConnection( JSON );
		
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
			method: SameDomainConnection.METHOD_GET,
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
		var connection = new SameDomainConnection( JSON );
		
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
			method: SameDomainConnection.METHOD_GET,
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
		var connection = new SameDomainConnection( JSON );
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
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
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
		var connection = new SameDomainConnection( JSON );
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
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
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
		var connection = new SameDomainConnection( JSON );
		
		var delegate = {
			success: function( data ) {
				test.fail( "The success delegate should not have been called" );
			},
			
			error: function( data ) {
				test.assertObject( "data should be an object", data );
				test.assertString( "data.type should be a string", data.type );
				test.assertEquals( "data.type should be jsonSyntaxError", data.type, "jsonSyntaxError" );
				test.assertString( "data.responseText should be a string", data.responseText );
				test.assertObject( "data.error should be an object", data.error );
				test.assertInstanceof( "data.error should be an instance of Error", data.error, Error );
				test.pass();
			}
		};
		
		connection.setOptions( {
			url: "./html_meta_syntax_error.php",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
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
	
	createTest( "XML Happy", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function( xml ) {
				test.assertObject( "The xml variable should be an object", xml );
				test.assertDefined( "The xml.childNodes variable should be an object", xml.childNodes );
				test.assertNumber( "The xml.childNodes.length property should be a number", xml.childNodes.length );
				test.pass();
			},
			
			error: function( data ) {
				test.fail( "The error delegate should not have been called" );
			}
		};
		
		connection.setOptions( {
			url: "./test.xml",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_XML,
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
	
	createTest( "invalidXML", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function( xml ) {
				test.fail( "The success delegate should not have been called" );
			},
			
			error: function( data ) {
				test.assertObject( "data should be an object", data );
				test.assertString( "data.type should be a string", data.type );
				test.assertEquals( "data.type should be equal to xmlSyntaxError", data.type, "xmlSyntaxError" );
				test.assertString( "data.responseText should be a string", data.responseText );
				test.pass();
			}
		};
		
		connection.setOptions( {
			url: "./invalid.xml",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_XML,
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
	
	createTest( "emptyXMLFile", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function( xml ) {
				test.fail( "The success delegate should not have been called" );
			},
			
			error: function( data ) {
				test.assertObject( "data should be an object", data );
				test.assertString( "data.type should be a string", data.type );
				test.assertEquals( "data.type should be equal to xmlSyntaxError", data.type, "xmlSyntaxError" );
				test.assertString( "data.responseText should be a string", data.responseText );
				test.pass();
			}
		};
		
		connection.setOptions( {
			url: "./dummy.txt",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_XML,
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
	
	createTest( "JSON Happy", function( test ) {
		var connection = new SameDomainConnection( JSON );
		var delegate = {
			success: function( data ) {
				test.assertObject( "data should be an object", data );
				test.assertString( "data.foo should be a string", data.foo );
				test.pass();
			},
			
			error: function() {
				test.fail( "The error delegate should not have been called" );
			}
		};
		
		connection.setOptions( {
			url: "./json.txt",
			method: SameDomainConnection.METHOD_GET,
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
	
	createTest( "JSON Unhappy - No jsonService", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function( data ) {
				test.fail( "The success delegate should not have been called" );
			},
			
			error: function( data ) {
				test.assertObject( "data should be an object", data );
				test.assertString( "data.type should be a string", data.type );
				test.assertEquals( "data.type should be missingJsonServiceError", data.type, "missingJsonServiceError" );
				test.assertInstanceof( "data.error should be an instance of Error", data.error, Error );
				test.assertString( "data.responseText should be a String", data.responseText );
				test.pass();
			}
		};
		
		connection.setOptions( {
			url: "./bad_json.txt",
			method: SameDomainConnection.METHOD_GET,
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
	
	createTest( "JSON Unhappy - Syntax error", function( test ) {
		var connection = new SameDomainConnection( JSON );
		var delegate = {
			success: function( data ) {
				test.fail( "The success delegate should not have been called with malformed JSON" );
			},
			
			error: function( data ) {
				test.assertString( "data.type should be a string", data.type );
				test.assertEquals( "data.type should be jsonSyntaxError", data.type, "jsonSyntaxError" );
				test.assertString( "data.responseText should be a string", data.responseText );
				test.assertObject( "data.error should be an object", data.error );
				test.assertInstanceof( "data.error should be an instance of Error", data.error, Error );
				test.pass();
			}
		};
		
		connection.setOptions( {
			url: "./bad_json.txt",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_JSON,
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
	
	createTest( "abort", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function( data ) {
				test.fail( "The success delegate should not have been called" );
			},
			timeout: function( data ) {
				test.fail( "The timeout delegate should not have been called" );
			},
			error: function( data ) {
				test.fail( "The error delegate should not have been called" );
			}
		};
		
		connection.setOptions( {
			url: "./sleep.php",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			timeoutPeriod: 5000,
			actions: {
				success : { instance: delegate, method: "success" },
				timeout : { instance: delegate, method: "timeout" },
				error   : { instance: delegate, method: "error" }
			}
		} );
		
		connection.send();
		connection.abort();
		
		return true;
	} );
	
	createTest( "destroy", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function( data ) {
				test.fail( "The success delegate should not have been called" );
			},
			timeout: function( data ) {
				test.fail( "The timeout delegate should not have been called" );
			},
			error: function( data ) {
				test.fail( "The error delegate should not have been called" );
			}
		};
		
		connection.setOptions( {
			url: "./sleep.php",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			timeoutPeriod: 5000,
			actions: {
				success : { instance: delegate, method: "success" },
				timeout : { instance: delegate, method: "timeout" },
				error   : { instance: delegate, method: "error" }
			}
		} );
		
		connection.send();
		connection.destructor();
		connection = null;
		
		return true;
	} );
	
	createTest( "post", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function( data ) {
				test.assertString( "data.html should have been a string", data.html );
				test.pass();
			},
			
			error: function( data ) {
				test.fail( "The error callback should not have been called" );
			}
		};
		
		connection.setOptions( {
			url: "./post_form.php",
			method: SameDomainConnection.METHOD_POST,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			params: "name=John",
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
	
	createTest( "invalidMethod", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function() {
				test.pass();
			},
			error: function() {
				test.fail( "The error delegate should not have been called." );
			}
		};
		
		connection.setOptions( {
			url: "./post_form.php",
			method: "invalid_method",
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			params: "name=Ed",
			actions: {
				success: { instance: delegate, method: "success" },
				error: { instance: delegate, method: "error" }
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
	createTest( "sendWithOptions", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function() {
				test.pass();
			},
			error: function() {
				test.fail( "The error delegate should not have been called." );
			}
		};
		
		connection.sendWithOptions( {
			url: "./dummy.txt",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			actions: {
				success: { instance: delegate, method: "success" },
				error: { instance: delegate, method: "success" }
			}
		} );
		
		return 5000;
	} );
	
	createTest( "sendWithStringParams", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function() {
				test.pass();
			},
			error: function() {
				test.fail( "The error delegate should not have been called." );
			}
		};
		
		connection.setOptions( {
			url: "./post_form.php",
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			actions: {
				success: { instance: delegate, method: "success" },
				error: { instance: delegate, method: "success" }
			}
		} );
		
		connection.sendWithParams( "name=sendWithParams" );
		
		return 5000;
	} );
	
	createTest( "sendWithObjectParams", function( test ) {
		var connection = new SameDomainConnection();
		var delegate = {
			success: function() {
				test.pass();
			},
			error: function() {
				test.fail( "The error delegate should not have been called." );
			}
		};
		
		connection.setOptions( {
			url: "./post_form.php",
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			actions: {
				success: { instance: delegate, method: "success" },
				error: { instance: delegate, method: "success" }
			}
		} );
		
		connection.sendWithParams( {
			name: "sendWithObjectParams"
		} );
		
		return 5000;
	} );
	
	createTest( "sendWithSerializableParams", function( test ) {
		var connection = new SameDomainConnection();
		var params = new SerializableData();
		var delegate = {
			success: function() {
				test.pass();
			},
			error: function() {
				test.fail( "The error delegate should not have been called." );
			}
		};
		
		params.set( "name", "sendWithSerializableData" );
		
		connection.setOptions( {
			url: "./post_form.php",
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			actions: {
				success: { instance: delegate, method: "success" },
				error: { instance: delegate, method: "success" }
			}
		} );
		
		connection.sendWithParams( params );
		
		return 5000;
	} );
	
	createTest( "reuseSameDomainConnection", function( test ) {
		var connection = new SameDomainConnection();
		var timesSent = 0;
		
		var delegate = {
			success: test.wrapCallback( function() {
				if( timesSent > 1 ) {
					test.pass();
				}
				else {
					timesSent++;
					connection.send();
				}
			} ),
			error: function() {
				test.fail( "The error delegate should not have been called" );
			}
		};
		
		connection.setOptions( {
			url: "./dummy.txt?test=reuseSameDomainConnection",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			actions: {
				success: { instance: delegate, method: "success" },
				error: { instance: delegate, method: "error" }
			}
		} );
		
		timesSent++;
		connection.send();
		
		return 15000;
	} );
	
	createTest( "enforceAJAXInBackend", function( test ) {
		var connection = new SameDomainConnection();
		
		var delegate = {
			success: function( data ) {
				test.assertObject( "data should be an Object", data );
				test.pass();
			},
			error: function() {
				test.fail( "The error delegate should not have been called." );
			}
		};
		
		connection.setOptions( {
			url: "./enforce_ajax.php",
			method: SameDomainConnection.METHOD_GET,
			dataType: SameDomainConnection.DATA_TYPE_HTML,
			actions: {
				success: { instance: delegate, method: "success" },
				error: { instance: delegate, method: "error" }
			}
		} );
		
		connection.send();
		
		return 5000;
	} );
	
} )( TestController.getInstance() );
