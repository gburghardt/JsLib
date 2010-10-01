( function( testController ) {
	
	var createTest = testController.createTestSuite( "Delegator" );
	
	createTest( "instantiate", function( test ) {
		var delegator = new Delegator();
		
		return (
			test.assertNotNull( "The delegator.delegates property should not be null", delegator.delegates ) &&
			test.assertObject( "The delegator.delegates property should be an object", delegator.delegates )
		);
	} );
	
	createTest( "addDelegateHappy", function( test ) {
		var delegator = new Delegator();
		var action = "testAction";
		var method = "handleTestAction";
		var delegate = {
			handleTestAction: function() {
				
			}
		};
		
		var success = delegator.addDelegate( action, delegate, method );
		
		return (
			test.assertBoolean( "The addDelegate method should return a boolean", success ) &&
			test.assertTrue( "The addDelegate method should have returned true", success ) &&
			test.assertEquals( "The delegate object in the delegator should be equal to the delegate variable", delegator.delegates[ action ].instance, delegate )
		);
	} );
	
	createTest( "addDelegateUnhappy", function( test ) {
		var delegator = new Delegator();
		var action = "testAction";
		var method = "handleTestAction";
		var delegate = {
			handleTestAction: function() {
				
			}
		};
		var delegate2 = {
			handleTestAction: function() {
				
			}
		};
		
		delegator.addDelegate( action, delegate, method );
		var success = delegator.addDelegate( action, delegate2, method );
		
		return (
			test.assertBoolean( "The addDelegate method should return a boolean", success ) &&
			test.assertFalse( "The addDelegate method should have returned false because a delegate has already been set for action " + action, success )
		);
	} );
	
	createTest( "delegateActionSuccess", function( test ) {
		var delegator = new Delegator();
		var action = "testAction";
		var method = "handleTestAction";
		var delegateSuccess = false;
		var data = {
			foo: "bar"
		};
		var delegate = {
			handleTestAction: function( actionData ) {
				delegateSuccess = test.assertObject( "The actionData should be an object", actionData ) &&
						test.assertEquals( "The actionData should be equal to data", actionData, data );
			}
		};
		
		delegator.addDelegate( action, delegate, method );
		var delegateFound = delegator.delegate( action, data );
		
		return (
			test.assertBoolean( "The delegate method should have return a boolean value", delegateFound ) &&
			test.assertTrue( "The delegate method should have returned true", delegateFound ) &&
			test.assertTrue( "The delegate method should have executed and set delegateSuccess to true", delegateSuccess )
		);
	} );
	
	createTest( "removeDelegate", function( test ) {
		var delegator = new Delegator();
		var action = "testAction";
		var method = "handleTestAction";
		var delegate = {
			handleTestAction: function() {
				test.fail( "The delegate " + method + " method should not have been invoked." );
			}
		};
		
		delegator.addDelegate( action, delegate, method );
		var success = delegator.removeDelegate( action, delegate );
		var delegateFound = delegator.delegate( action );
		
		return (
			test.assertBoolean( "The return value of removeDelegate should be a boolean", success ) &&
			test.assertTrue( "The return value of removeDelegate should be true", success ) &&
			test.assertBoolean( "The delegate method should have returned a boolean value", delegateFound ) &&
			test.assertFalse( "The delegate method should have returned a false value", delegateFound )
		);
	} );
	
	createTest( "destroyDelegator", function( test ) {
		var delegator = new Delegator();
		var action = "testAction";
		var method = "handleTestAction";
		var delegate = {
			handleTestAction: function() {
				test.fail( "The delegate " + method + " method should not have been invoked." );
			}
		};
		
		var error = null;
		
		delegator.addDelegate( action, delegate, method );
		delegator.destructor();
		
		try {
			delegator.delegate( action );
		}
		catch ( err ) {
			error = err;
		}
		
		return test.assertInstanceof( "The error variable should be an instance of Error.", error, Error );
	} );
	
} )( TestController.getInstance() );