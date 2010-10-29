/**
 * @depends TestController
 * @depends JSON
 * @depends Delegator
 * @depends Connection
 * @depends ConnectionFactory
 */
( function( testController ) {
	
	var createTest = testController.createTestSuite( "ConnectionPool" );
	
	createTest( "instantiate", function( test ) {
		var factory = new ConnectionFactory();
		var pool1 = new ConnectionPool( factory );
		var pool2 = new ConnectionPool( factory, 10 );
		
		try {
			var pool = new ConnectionPool();
			test.fail( "Instantiating a ConnectionPool with no connectionFactory should throw an error." );
		}
		catch ( err ) {
			test.assertInstanceof( "err should be an instance of Error", err, Error );
		}
		
		return (
			test.assertEquals( "pool1.connectionFactory should be equal to factory", pool1.connectionFactory, factory ) &&
			test.assertEquals( "pool1.maxConnections should be -1", pool1.maxConnections, -1 ) &&
			
			test.assertEquals( "pool2.connectionFactory should be equal to factory", pool2.connectionFactory, factory ) &&
			test.assertEquals( "pool2.maxConnections should be 10", pool2.maxConnections, 10 )
		);
	} );
	
	createTest( "getConnection", function( test ) {
		var pool = new ConnectionPool( new ConnectionFactory(), 3 );
		var connection1 = pool.getConnection();
		var connection2 = pool.getConnection();
		var connection3 = pool.getConnection();
		var connection4 = pool.getConnection();
		
		return (
			test.assertObject( "connection1 should be an object", connection1 ) &&
			test.assertObject( "connection2 should be an object", connection2 ) &&
			test.assertObject( "connection3 should be an object", connection3 ) &&
			test.assertNull( "connection4 should be null", connection4 )
		);
	} );
	
} )( TestController.getInstance() );
