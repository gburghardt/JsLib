( function( testController ) {
	
	var createTest = testController.createTestSuite( "formModel" );
	
	createTest( "isValidBlowsUp", function( test ) {
		var model = new FormModel();
		
		try {
			model.isValid();
			test.fail( "The FormModel.prototype.isValid() method should have thrown an error." );
		}
		catch ( error ) {
			return true;
		}
	} );
	
	createTest( "addErrorCode", function( test ) {
		var model = new FormModel();
		var errorCodes = null;
		
		model.addErrorCode( "foo", "foo_bar" );
		errorCodes = model.getErrorCodes();
		
		return (
			test.assertNotNull( "The getErrorCodes() method should not return null", errorCodes ) &&
			test.assertObject( "The getErrorCodes() method should return an object", errorCodes ) &&
			test.assertString( "The foo property of the error codes object should be a string", errorCodes.foo ) &&
			test.assertEquals( "The value of the foo property should be foo_bar", errorCodes.foo, "foo_bar" )
		);
	} );
	
	createTest( "empty", function( test ) {
		var model = new FormModel();
		var undef;
		
		return (
			test.assertTrue( "An empty string should be empty", model.empty( "" ) ) &&
			test.assertTrue( "An empty array should be empty", model.empty( [] ) ) &&
			test.assertTrue( "An empty object should be empty", model.empty( {} ) ) &&
			test.assertTrue( "Null should be empty", model.empty( null ) ) &&
			test.assertTrue( "Zero should be empty", model.empty( 0 ) ) &&
			test.assertTrue( "Negative numbers should be empty", model.empty( -1 ) ) &&
			test.assertTrue( "NaN values should be empty", model.empty( NaN ) ) &&
			test.assertTrue( "Undefined values should be empty", model.empty( undef ) ) &&
			test.assertTrue( "False values should be empty", model.empty( false ) ) &&
			
			test.assertFalse( "A non empty string should not be empty", model.empty( "foo" ) ) &&
			test.assertFalse( "An array with one or more elements should not be empty", model.empty( [ 3, "bar" ] ) ) &&
			test.assertFalse( "An object with one or more local properties should not be empty", model.empty( { foo: "bar" } ) ) &&
			test.assertFalse( "Positive numbers should not be empty", model.empty( 1 ) ) &&
			test.assertFalse( "True values should not be empty", model.empty( true ) )
		);
	} );
	
	createTest( "isBool", function( test ) {
		var model = new FormModel();
		var undef;
		
		return (
			test.assertTrue( "A true string should be a boolean", model.isBool( "true" ) ) &&
			test.assertTrue( "A false string should be a boolean", model.isBool( "true" ) ) &&
			test.assertTrue( "A yes string should be a boolean", model.isBool( "yes" ) ) &&
			test.assertTrue( "A Yes string should be a boolean", model.isBool( "Yes" ) ) &&
			test.assertTrue( "A no string should be a boolean", model.isBool( "no" ) ) &&
			test.assertTrue( "A No string should be a boolean", model.isBool( "No" ) ) &&
			test.assertTrue( "A 1 string should be a boolean", model.isBool( "1" ) ) &&
			test.assertTrue( "A 0 string should be a boolean", model.isBool( "0" ) ) &&
			test.assertTrue( "A t string should be a boolean", model.isBool( "t" ) ) &&
			test.assertTrue( "A f string should be a boolean", model.isBool( "f" ) ) &&
			test.assertTrue( "A T string should be a boolean", model.isBool( "T" ) ) &&
			test.assertTrue( "A F string should be a boolean", model.isBool( "F" ) ) &&
			
			test.assertFalse( "An empty string should not be a boolean", model.isBool( "" ) ) &&
			test.assertFalse( "A non empty string should not be a boolean", model.isBool( "asdf" ) ) &&
			test.assertFalse( "An array should not be a boolean", model.isBool( [] ) ) &&
			test.assertFalse( "An object should not be a boolean", model.isBool( {} ) ) &&
			test.assertFalse( "A function should not be a boolean", model.isBool( function() {} ) ) &&
			test.assertFalse( "A NaN value should not be a boolean", model.isBool( NaN ) ) &&
			test.assertFalse( "A number should not be a boolean", model.isBool( 4 ) ) &&
			test.assertFalse( "A raw boolean true should not be a boolean", model.isBool( true ) ) &&
			test.assertFalse( "A raw boolean false should not be a boolean", model.isBool( false ) ) &&
			test.assertFalse( "A null value should not be a boolean", model.isBool( null ) ) &&
			test.assertFalse( "An undefined value should not be a boolean", model.isBool( undef ) )
		);
	} );
	
	createTest( "toBool", function( test ) {
		var model = new FormModel();
		var undef;
		
		return (
			test.assertTrue( "A true string should be true", model.toBool( "true" ) ) &&
			test.assertTrue( "A TRUE string should be true", model.toBool( "TRUE" ) ) &&
			test.assertTrue( "A TrUe string should be true", model.toBool( "TrUe" ) ) &&
			test.assertTrue( "A 1 string should be true", model.toBool( "1" ) ) &&
			test.assertTrue( "A y string should be true", model.toBool( "y" ) ) &&
			test.assertTrue( "A yes string should be true", model.toBool( "yes" ) ) &&
			test.assertTrue( "A YES string should be true", model.toBool( "YES" ) ) &&
			test.assertTrue( "A YeS string should be true", model.toBool( "YeS" ) ) &&
			test.assertTrue( "A t string should be true", model.toBool( "t" ) ) &&
			test.assertTrue( "A T string should be true", model.toBool( "T" ) ) &&
			test.assertTrue( "The number one should be true", model.toBool( 1 ) ) &&
			test.assertTrue( "A raw boolean true should be true", model.toBool( true ) ) &&
			
			test.assertFalse( "A false string should be false", model.toBool( "false" ) ) &&
			test.assertFalse( "A FALSE string should be false", model.toBool( "FALSE" ) ) &&
			test.assertFalse( "A FalSe string should be false", model.toBool( "FalSe" ) ) &&
			test.assertFalse( "A 0 string should be false", model.toBool( "0" ) ) &&
			test.assertFalse( "A n string should be false", model.toBool( "n" ) ) &&
			test.assertFalse( "A N string should be false", model.toBool( "N" ) ) &&
			test.assertFalse( "A no string should be false", model.toBool( "no" ) ) &&
			test.assertFalse( "A NO string should be false", model.toBool( "NO" ) ) &&
			test.assertFalse( "A No string should be false", model.toBool( "No" ) ) &&
			test.assertFalse( "A f string should be false", model.toBool( "f" ) ) &&
			test.assertFalse( "A F string should be false", model.toBool( "F" ) ) &&
			
			test.assertFalse( "A string containing true should be false", model.toBool( "asdftrueqwer" ) ) &&
			test.assertFalse( "A null value should be false", model.toBool( null ) ) &&
			test.assertFalse( "A positive number should be false", model.toBool( 8 ) ) &&
			test.assertFalse( "A positive number should be false", model.toBool( 8 ) ) &&
			test.assertFalse( "Zero should be false", model.toBool( 0 ) ) &&
			test.assertFalse( "A NaN value should be false", model.toBool( NaN ) ) &&
			test.assertFalse( "An array should be false", model.toBool( [] ) ) &&
			test.assertFalse( "An object should be false", model.toBool( {} ) ) &&
			test.assertFalse( "A function should be false", model.toBool( function() {} ) ) &&
			test.assertFalse( "A raw boolean false should be false", model.toBool( false ) ) &&
			test.assertFalse( "The number zero should be false", model.toBool( 0 ) ) &&
			test.assertFalse( "An empty string should be false", model.toBool( "" ) ) &&
			test.assertFalse( "An undefined value should be false", model.toBool( undef ) )
		);
	} );
	
	createTest( "isArray", function( test ) {
		var model = new FormModel();
		var undef;
		
		return (
			test.assertTrue( "An array should be an array", model.isArray( [] ) ) &&

			test.assertFalse( "A string should not be an array", model.isArray( "whsfgdfh" ) ) &&
			test.assertFalse( "A number should not be an array", model.isArray( 36 ) ) &&
			test.assertFalse( "A boolean should not be an array", model.isArray( true ) ) &&
			test.assertFalse( "An object should not be an array", model.isArray( {} ) ) &&
			test.assertFalse( "A function should not be an array", model.isArray( function() {} ) ) &&
			test.assertFalse( "A DOM node collection should not be an array", model.isArray( document.getElementsByTagName( "html" ) ) ) &&
			test.assertFalse( "A NaN value should not be an array", model.isArray( NaN ) ) &&
			test.assertFalse( "A null value should not be an array", model.isArray( null ) ) &&
			test.assertFalse( "An undefined value should not be an array", model.isArray( undef ) )
		);
	} );
	
	createTest( "isInt", function( test ) {
		var model = new FormModel();
		var undef;
		
		return (
			test.assertTrue( "An integer string should be an integer", model.isInt( "1234" ) ) &&
			test.assertTrue( "A negative integer string should be an integer", model.isInt( "-8" ) ) &&

			test.assertFalse( "A floating point string should not be an integer", model.isInt( "32.1" ) ) &&
			test.assertFalse( "An empty string should not be an integer", model.isInt( "" ) ) &&
			test.assertFalse( "A string with mixed numbers and letters should not be an integer", model.isInt( "asd345ygf" ) ) &&
			test.assertFalse( "A mixed string of numbers and letters starting with a number should not be an integer", model.isInt( "1sgsg" ) ) &&
			test.assertFalse( "A mixed string of numbers and letters ending with a number should not be an integer", model.isInt( "adfsasfg3" ) ) &&
			test.assertFalse( "A raw integer should not be an integer", model.isInt( 32 ) ) &&
			test.assertFalse( "A raw floating point should not be an integer", model.isInt( 5563.184 ) ) &&
			test.assertFalse( "A NaN value should not be an integer", model.isInt( NaN ) ) &&
			test.assertFalse( "A null value should not be an integer", model.isInt( null ) ) &&
			test.assertFalse( "A function should not be an integer", model.isInt( function() {} ) ) &&
			test.assertFalse( "An array should not be an integer", model.isInt( [] ) ) &&
			test.assertFalse( "An object should not be an integer", model.isInt( {} ) ) &&
			test.assertFalse( "An undefined value should not be an integer", model.isInt( undef ) )
		);
	} );
	
	createTest( "isNumeric", function( test ) {
		var model = new FormModel();
		var undef;
		
		return (
			test.assertTrue( "1 should be numeric", model.isNumeric( "1" ) ) &&
			test.assertTrue( "1. should be numeric", model.isNumeric( "1." ) ) &&
			test.assertTrue( ".1 should be numeric", model.isNumeric( ".1" ) ) &&
			test.assertTrue( "0.1 should be numeric", model.isNumeric( "0.1" ) ) &&
			test.assertTrue( "1111.2 should be numeric", model.isNumeric( "1111.2" ) ) &&
			test.assertTrue( ".00586 should be numeric", model.isNumeric( ".00586" ) ) &&
			test.assertTrue( "98421.000565 should be numberic", model.isNumeric( "98421.000565" ) ) &&
			test.assertTrue( "1,000 should be numberic", model.isNumeric( "1,000" ) ) &&
			test.assertTrue( "3,000,000.003 should be numberic", model.isNumeric( "3,000,000.003" ) ) &&
			test.assertTrue( "-1 should be numberic", model.isNumeric( "-1" ) ) &&
			test.assertTrue( "-.3 should be numberic", model.isNumeric( "-.3" ) ) &&
			test.assertTrue( "-0.67 should be numberic", model.isNumeric( "-0.67" ) ) &&
			test.assertTrue( "-1,000,000.0 should be numberic", model.isNumeric( "-1,000,000.0" ) ) &&
			test.assertTrue( "-1,000 should be numberic", model.isNumeric( "-1,000" ) )
		);
	} );
	
} )( TestController.getInstance() );