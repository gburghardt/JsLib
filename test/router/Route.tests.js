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
	
	createTest( "parseRouteString", function( test ) {
		var route = new Route("foo/bar");
		var routeArgs      = [ "abc", "100", "-100", "1.3", "null", "true", "false", "a%20b", "foo: bar; bar: 123; abc: null; arr: 1,2,abc%20123" ];
		var expectedValues = [ "abc",  100,   -100,   1.3,   null,   true,   false,  "a b", {foo: "bar", bar: 123, abc: null, arr: [1,2,"abc 123"]} ];
		var rawRoute = "foo/bar/" + routeArgs.join("/");
		test.info("Raw route: " + rawRoute);
		var info = route.parseRouteString(rawRoute);
		var passing = true;
		
		return (
			test.assertString("Arg 0 should be a string", info.args[0]) &&
			test.assertEquals("Arg 0 should be " + expectedValues[0], info.args[0], expectedValues[0]) &&
			
			test.assertNumber("Arg 1 should be a number", info.args[1]) &&
			test.assertEquals("Arg 1 should be " + expectedValues[1], info.args[1], expectedValues[1]) &&
			
			test.assertNumber("Arg 2 should be a number", info.args[2]) &&
			test.assertEquals("Arg 2 should be " + expectedValues[2], info.args[2], expectedValues[2]) &&
			
			test.assertNumber("Arg 3 should be a number", info.args[3]) &&
			test.assertEquals("Arg 3 should be " + expectedValues[3], info.args[3], expectedValues[3]) &&
			
			test.assertNull("Arg 4 should be null", info.args[4]) &&
			test.assertEquals("Arg 4 should be " + expectedValues[4], info.args[4], expectedValues[4]) &&
			
			test.assertBoolean("Arg 5 should be boolean", info.args[5]) &&
			test.assertTrue("Arg 5 should be true", info.args[5]) &&
			
			test.assertBoolean("Arg 6 should be boolean", info.args[6]) &&
			test.assertFalse("Arg 6 should be false", info.args[6]) &&
			
			test.assertString("Arg 7 should be a string", info.args[7]) &&
			test.assertEquals("Arg 7 should be '" + expectedValues[7] + "'", info.args[7], expectedValues[7]) &&
			
			test.assertObject("Arg 8 should be an object", info.args[8]) &&
			test.assertEquals("Arg 8, foo should be bar", info.args[8].foo, expectedValues[8].foo) &&
			test.assertEquals("Arg 8, bar should be 123", info.args[8].bar, expectedValues[8].bar) &&
			test.assertEquals("Arg 8, abc should be null", info.args[8].abc, expectedValues[8].abc) &&
			test.assertArray("Arg 8, arr should be an array", info.args[8].arr) &&
			test.assertEquals("Arg 8, arr should be " + expectedValues[8].arr, info.args[8].arr.toString(), expectedValues[8].arr.toString())
		);
	} );
	
	createTest( "toString", function( test ) {
		var rawRoute1 = "foo/bar/abc/null/1234/true/a%20b";
		var route = new Route(rawRoute1);
		var rawRoute2 = route.toString();
		
		return (
			test.assertEquals("The two raw routes should be equal", rawRoute1, rawRoute2)
		);
	} );
	
} )( TestController.getInstance() );