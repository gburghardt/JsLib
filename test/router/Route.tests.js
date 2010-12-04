( function( testController ) {
	
	var createTest = testController.createTestSuite("Route");
	
	createTest( "instantiateWithRouteString", function( test ) {
		var route = new Route("/foo/bar" );
		test.assertEquals("The getControllerId() method should have returned foo", route.getControllerId(), "foo");
		test.assertEquals("The getMethodName() method should have returned bar", route.getMethodName(), "bar");
		
		route = new Route("foo/bar/arg1");
		test.assertEquals("The getControllerId() method should have returned foo", route.getControllerId(), "foo");
		test.assertEquals("The getMethodName() method should have returned bar", route.getMethodName(), "bar");
		test.assertString("Arg 0 should be a string", route.getArgs()[0]);
		test.assertEquals("Arg 0 should be 'arg1'", route.getArgs()[0], "arg1");
		
		route = new Route("foo/bar/100");
		test.assertEquals("The getControllerId() method should have returned foo", route.getControllerId(), "foo");
		test.assertEquals("The getMethodName() method should have returned bar", route.getMethodName(), "bar");
		test.assertNumber("Arg 0 should be a number", route.getArgs()[0]);
		test.assertEquals("Arg 0 should be 100", route.getArgs()[0], 100);
		
		route = new Route("foo/bar/null");
		test.assertEquals("The getControllerId() method should have returned foo", route.getControllerId(), "foo");
		test.assertEquals("The getMethodName() method should have returned bar", route.getMethodName(), "bar");
		test.assertNull("Arg 0 should be null", route.getArgs()[0]);
		test.assertEquals("Arg 0 should be null", route.getArgs()[0], null);
		
		route = new Route("foo/bar/a,b");
		test.assertEquals("The getControllerId() method should have returned foo", route.getControllerId(), "foo");
		test.assertEquals("The getMethodName() method should have returned bar", route.getMethodName(), "bar");
		test.assertArray("Arg 0 should be an Array", route.getArgs()[0]);
		test.assertEquals("Arg 0[0] should be 'a'", route.getArgs()[0][0], "a");
		
		return true;
	} );
	
	createTest( "instantiateWithArgs", function( test ) {
		var route = new Route("foo", "bar");
		test.assertEquals("The getControllerId() method should have returned foo", route.getControllerId(), "foo");
		test.assertEquals("The getMethodName() method should have returned bar", route.getMethodName(), "bar");
		
		try {
			route = new Route();
			test.fail("Instantiating a Route with no constructor args should throw an error.");
		}
		catch( err ) {
			test.assertInstanceof("err should be an Error", err, Error);
		}
		
		try {
			route = new Route("foo");
			test.fail("Instantiating a Route with 1 constructor arg should throw an error.");
		}
		catch( err2 ) {
			test.assertInstanceof("err2 should be an Error", err2, Error);
		}
		
		return true;
	} );
	
} )( TestController.getInstance() );