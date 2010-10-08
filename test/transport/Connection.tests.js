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
		var obj = {
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
					instance: obj,
					method: "success"
				},
				timeout: {
					instance: obj,
					method: "timeout"
				}
			}
		} );
		
		connection.send();
		
		return 30000;
	} );
	
} )( TestController.getInstance() );
