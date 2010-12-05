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
	
	createTest( "processRoute", function( test ) {
		var barCalled = false,
			bar2Called = false,
			fromRouteObjCalled = false,
			fromDifferentControllerId = false,
			nonExistentMethod2Called = false
		;
		
		var controllerA = {
			bar: function() {
				barCalled = true;
				return true;
			},
			
			hasArgs: function(str, num, nil, arr) {
				test.assertString("str should be a string", str);
				test.assertNumber("num should be a number", num);
				test.assertNull("nil should be null", nil);
				test.assertArray("arr should be an array", arr);
				return true;
			},
			
			fromRouteObj: function() {
				fromRouteObjCalled = true;
				return true;
			},
			
			fromDifferentControllerId: function() {
				fromDifferentControllerId = true;
				return true;
			},
			
			returnsFalse: function() {
				return false;
			}
		};
		
		var controllerB = {
			bar: function() {
				bar2Called = true;
				return true;
			},
			
			returnsFalse: function() {
				test.fail("The returnsFalse method of controllerB should not have been called");
			},
			
			nonExistentMethod: function() {
				nonExistentMethod2Called = true;
			}
		};
		
		var controllerC = {
			bar: function() {
				test.fail("controllerC.bar should not have been called after controllerC was unregistered.");
			}
		};
		
		Router.registerController("testRoute", controllerA);
		Router.registerController("testRoute", controllerB);
		Router.registerController("testRoute", controllerC);
		
		Router.unregisterController("testRoute", controllerC);
		test.assertEquals("Router.controllers.testRoute.length should be 2", 2, Router.controllers.testRoute.length);
		
		Router.processRoute("testRoute/bar");
		Router.processRoute("testRoute/hasArgs/abc/100/null/a,b");
		
		var route = Router.getRoute("testRoute/fromRouteObj");
		Router.processRoute(route);
		
		Router.registerController("testRoute2", controllerA);
		Router.processRoute("testRoute2/fromDifferentControllerId");
		
		Router.processRoute("testRoute/returnsFalse");
		
		// this should not throw an error because controllerA doesn't implement a method
		// named nonExistentMethod
		Router.processRoute("testRoute/nonExistentMethod");
		
		return (
			test.assertTrue("barCalled should be true", barCalled) &&
			test.assertTrue("bar2Called should be true", bar2Called) &&
			test.assertTrue("fromRouteObjCalled should be true", fromRouteObjCalled) &&
			test.assertTrue("fromDifferentControllerId should be true", fromDifferentControllerId) &&
			test.assertTrue("nonExistentMethod2Called should be true", nonExistentMethod2Called)
		);
	} );
	
	createTest( "destructor", function( test ) {
		Router.destructor();
		Router.destructor();
		
		return (
			test.assertNull("Router.controllers should be null", Router.controllers) &&
			test.assertNull("Router.routes should be null", Router.routes)
		);
	} );
	
} )( TestController.getInstance() );