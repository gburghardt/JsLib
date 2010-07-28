( function( testController ) {
	
	var createTest = testController.createTestSuite( "Container" );
	
	createTest( "instantiate", function( test ) {
		var container = new Container();
		var instance = container.getInstance( "myContainer" );
		
		return (
			test.assertObject( "container should be an object", container ) &&
			test.assertInstanceof( "container should be an instance of the Container class.", container, Container ) &&
			test.assertNotNull( "The instance myContainer should not be null", instance ) &&
			test.assertObject( "The instance myContainer should be an object", instance ) &&
			test.assertInstanceof( "The instance myContainer should be an instance of the Container class.", instance, Container )
		);
	} );
	
	createTest( "instantiateWithInitialConfigs", function( test ) {
		var initialConfigs = {
			object: {
				className: "Object"
			}
		};
		
		var container = new Container( initialConfigs );
		var instance = container.getInstance( "object" );
		var conf = container.getConfig( "object" );
		
		return (
			test.assertNotNull( "The config named 'object' should not be null", conf ) &&
			test.assertObject( "The config named 'object' should be an Object", conf ) &&
			test.assertNotNull( "The instance should not be null", instance ) &&
			test.assertObject( "The instance generated from 'object' should be an Object", instance ) &&
			test.assertInstanceof( "The instance generated from 'object' should be an instance of Object", instance, Object )
		);
	} );
	
	createTest( "getInstanceUnhappy", function( test ) {
		var container = new Container();
		
		return (
			test.assertNull( "A non existent instance Id should return null", container.getInstance( "nonExistent" ) ) &&
			test.assertNull( "Passing null to getInstance should return null", container.getInstance( null ) ) &&
			test.assertNull( "Passing a true value to getInstance should return null", container.getInstance( true ) ) &&
			test.assertNull( "Passing a false value to getInstance should return null", container.getInstance( false ) ) &&
			test.assertNull( "Passing an empty string to getInstance should return null", container.getInstance( "" ) ) &&
			test.assertNull( "Passing an object to getInstance should return null", container.getInstance( {} ) ) &&
			test.assertNull( "Passing an array to getInstance should return null", container.getInstance( [] ) ) &&
			test.assertNull( "Passing a function to getInstance should return null", container.getInstance( function() {} ) ) &&
			test.assertNull( "Passing a number to getInstance should return null", container.getInstance( 42 ) ) &&
			test.assertNull( "Passing a NaN value to getInstance should return null", container.getInstance( NaN ) )
		);
	} );
	
	createTest( "getClassReferenceHappy", function( test ) {
		window.__test = {
			foo: {
				bar: {
					FooBar: function() {}
				},
				single: {}
			}
		};
		
		var container = new Container();
		var className = "__test.foo.bar.FooBar";
		var classReference = container.getClassReference( className );
		var singletonName = "__test.foo.single";
		var singletonReference = container.getClassReference( singletonName );
		
		return (
			test.assertFunction( "The class reference should be a function", classReference ) &&
			test.assertFunction( "The class reference cache should contain " + className, container.classReferenceCache[ className ] ) &&
			
			test.assertObject( "The singleton reference should be an object", singletonReference ) &&
			test.assertObject( "The class reference cache should contain " + className, container.classReferenceCache[ singletonName ] )
		);
	} );
	
	createTest( "getClassReferenceUnhappy", function( test ) {
		var container = new Container();
		var className = "__test.NonExistent";
		var classReference = null;
		
		try {
			container.getClassReference( className );
			test.fail( "Getting the non existent class " + className + " should have thrown an error" );
		}
		catch ( error ) {
			test.pass();
		}
	} );
	
	createTest( "addConfigsHappy", function( test ) {
		var container = new Container();
		var instance = null;
		
		var conf1 = {
			array: {
				className: "Array"
			},
			list: {
				className: "Array",
				singleton: true
			}
		};
		
		var conf2 = {
			objectSingleton: {
				className: "__test.something",
				singleton: true
			}
		};
		
		window.__test = {
			something: {}
		};
		
		container.addConfigs( conf1 );
		container.addConfigs( conf2 );
		
		return (
			test.assertNotNull( "The array instance should not be null", container.getInstance( "array" ) ) &&
			test.assertObject( "The array instance should be an object", container.getInstance( "array" ) ) &&
			test.assertNotEquals( "No two array instances should be equal", container.getInstance( "array" ), container.getInstance( "array" ) ) &&
			
			test.assertNotNull( "The list instance should not be null", container.getInstance( "list" ) ) &&
			test.assertObject( "The list instance should be an object", container.getInstance( "list" ) ) &&
			test.assertEquals( "All list instances should be equal", container.getInstance( "list" ), container.getInstance( "list" ) ) &&
			
			test.assertNotNull( "The objectSingleton instance should not be null", container.getInstance( "objectSingleton" ) ) &&
			test.assertObject( "The objectSingleton instance should be an object", container.getInstance( "objectSingleton" ) ) &&
			test.assertEquals( "All objectSingleton instances should be not equal", container.getInstance( "objectSingleton" ), container.getInstance( "objectSingleton" ) )
		);
		
	} );
	
} )( TestController.getInstance() );
