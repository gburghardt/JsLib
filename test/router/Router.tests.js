( function( testController ) {
	
	var createTest = testController.createTestSuite("Router");
	
	var controller1 = {};
	var controller2 = {};
	
	createTest( "getRoute", function( test ) {
		var route1 = Router.getRoute("foo/bar");
		var route2 = Router.getRoute("foo/bar");
		
		return (
			test.assertObject("route1 should be an object", route1) &&
			test.assertInstanceof("route1 should be an instance of Route", route1, Route) &&
			test.assertEquals("route1 should be the same as route2", route1, route2)
		);
	} );
	
	createTest( "registerController", function( test ) {
		Router.registerController("foo", controller1);
		Router.registerController("foo", controller1);
		Router.registerController("abc", controller2);
		
		return (
			test.assertEquals("There should only be 1 controller registered for route 'foo'", 1, Router.controllers.foo.length) &&
			test.assertEquals("There should be 1 controller registered for route 'abc'", 1, Router.controllers.abc.length)
		);
	} );
	
	createTest( "unregisterController", function( test ) {
		var controller3 = {};
		
		Router.registerController("1", controller3);
		Router.registerController("2", controller3);
		
		var removed1 = Router.unregisterController("foo", controller1);
		var removed2 = Router.unregisterController("foo", controller1);
		var removed3 = Router.unregisterController("abc", controller2);
		var removed4 = Router.unregisterController(controller3);
		
		return (
			test.assertTrue("removed1 should be true", removed1) &&
			test.assertFalse("removed2 should be false", removed2) &&
			test.assertTrue("removed3 should be true", removed3) &&
			test.assertEquals("removed4 should be undefined", removed4, undefined) &&
			test.assertEquals("No controllers should be registered for route 'foo'", 0, Router.controllers.foo.length) &&
			test.assertEquals("No controllers should be registered for route 'abc'", 0, Router.controllers.abc.length) &&
			test.assertEquals("No controllers should be registered for route '1'", 0, Router.controllers["1"].length) &&
			test.assertEquals("No controllers should be registered for route '2'", 0, Router.controllers["2"].length)
		);
	} );
	
} )( TestController.getInstance() );