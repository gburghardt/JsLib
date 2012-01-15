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
	
	createTest( "instantiateWithConfigs", function( test ) {
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
	
	createTest( "getInstanceHappy", function( test ) {
		var conf = {
			singletonObj: {
				className: "Array",
				singleton: true
			},
			
			multiObj: {
				className: "Array"
			}
		};
		
		var container = new Container( conf );
		var singletonObj1 = container.getInstance( "singletonObj" );
		var singletonObj2 = container.getInstance( "singletonObj" );
		
		var multiObj1 = container.getInstance( "multiObj" );
		var multiObj2 = container.getInstance( "multiObj" );
		
		return (
			test.assertEquals( "Singleton objects should always be equal", singletonObj1, singletonObj2 ) &&
			test.assertNotEquals( "Non singleton objects should never be equal", multiObj1, multiObj2 )
		);
	} );
	
	createTest( "getInstanceUnhappy", function( test ) {
		var conf = {
			abstractConf: {
				abstract: true
			}
		};
		
		var container = new Container( conf );
		var abstractInstance = null;
		var error = null;
		
		try {
			abstractInstance = container.getInstance( "abstractConf" );
		}
		catch( err ) {
			error = err;
		}
		
		return (
			test.assertError( "The error variable should be an error", error ) &&
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
		var instance = null;
		
		var conf1 = {
			array: {
				className: "Array"
			},
			list: {
				className: "Array",
				singleton: true
			},
			objectSingleton: {
				className: "__test.something",
				singleton: true
			}
		};
		
		window.__test = {
			something: {}
		};
		
		var container = new Container( conf1 );
		
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
	
	createTest( "addConfigsUnhappy", function( test ) {
		var success = true;
		
		var conf1 = {
			nonExistentClassName: {
				className: "foo.bar.FooBar"
			},
			badPropertiesHash: {
				className: "Array",
				properties: {
					foo: 32
				}
			}
		};
		
		var container = new Container( conf1 );
		
		try {
			container.getInstance( "nonExistentClassName" );
			test.fail( "Getting an instance whose config points to a non existent class name should throw an error." );
			success = false;
		}
		catch( err ) {
			test.info( err );
		}
		
		try {
			container.getInstance( "badPropertiesHash" );
		}
		catch ( err ) {
			test.info( err );
			test.fail( "Anything can be thrown into the properties hash, and it should not throw an error." );
			success = false;
		}
		
		if ( success ) {
			return true;
		}
	} );
	
	createTest( "parentConfigsHappy", function( test ) {
		var conf = {
			parentConf: {
				abstract: true,
				properties: {
					foo: {
						value: "bar"
					}
				}
			},
			
			childConf: {
				className: "__test.Example",
				parent: "parentConf",
				properties: {
					bar: {
						value: "foobar"
					}
				}
			}
		};
		
		window.__test = {
			Example: function() {}
		};
		
		window.__test.Example.prototype = {};
		
		var container = new Container( conf );
		var instance = container.getInstance( "childConf" );
		
		return (
			test.assertNotNull( "The instance variable should not be null", instance ) &&
			test.assertInstanceof( "The instance variable should be an instance of __test.Example", instance, window.__test.Example ) &&
			test.assertString( "The instance.foo property should be a string", instance.foo ) &&
			test.assertEquals( "The instance.foo property should be equal to the property set in the parentConf configs", instance.foo, conf.parentConf.properties.foo.value ) &&
			test.assertString( "The instance.bar property should be a string", instance.bar ) &&
			test.assertEquals( "The instance.bar property should be equal to the property set in the parentConf configs", instance.bar, conf.childConf.properties.bar.value )
		);
	} );
	
} )( TestController.getInstance() );
