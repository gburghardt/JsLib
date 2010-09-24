( function( testController ) {
	
	var createTest = testController.createTestSuite( "SerializableData" );
	
	var queryString = [
		"foo=file%20name.jpg",
		"arrayKey=1,4,6,8,22,90",
		"bar1=foo",
		"bar1=bar",
		"age="
	].join( "&" );
	
	createTest( "instantiateWithQueryString", function( test ) {
		test.info( "Query string is:\n" + queryString );
		
		var request = new SerializableData();
		request.deserialize( queryString );
		
		return (
			test.assertString( "The foo request key should be a string", request.get( "foo" ) )
		);
	} );
	
	createTest( "get", function( test ) {
		var request = new SerializableData();
		request.deserialize( queryString );
		
		return (
			test.assertNull( "The not_there request key should be null", request.get( "not_there" ) ) &&
			test.assertEquals( "The default_val request key should have returned 'default_value'.", "default_value", request.get( "default_val", "default_value" ) ) &&
			test.assertArray( "The arrayKey request key should return an array", request.get( "arrayKey" ) ) &&
			test.assertArray( "The bar1 request key should return an array", request.get( "bar1" ) )
		);
	} );
	
	createTest( "serialize", function( test ) {
		var origQuery = [
			"key1=val%201",
			"key2=1,2,3",
			"key3=a",
			"key3=b"
		].join( "&" );
		
		var serializedQuery = [
			"key1=val%201",
			"key2=1,2,3",
			"key3=a,b"
		].join( "&" );
		
		var request = new SerializableData();
		request.deserialize( origQuery );
		
		var query = request.serialize();
		var request2 = new SerializableData();
		request2.deserialize( origQuery );
		
		return (
			test.assertEquals( "The serialized params are not equal: \n" + query + "\n" + serializedQuery, query, serializedQuery ) &&
			test.assertEquals( "The two serialized requests should be the same", request.serialize(), request2.serialize() )
		);
	} );
	
	createTest( "separators", function( test ) {
		var query = "key1>val1|key2>val2|key3>a.b.c";
		var reserializedQueryOrig = "key1>val1|key2>val2|key3>a.b.c";
		var paramSeparator = "|";
		var valueSeparator = ">";
		var arrayValueSeparator = ".";
		
		var request = new SerializableData( paramSeparator, valueSeparator, arrayValueSeparator );
		request.deserialize( query );
		
		var reserializedQuery = request.serialize();
		
		return (
			test.assertString( "The key1 key should be a string", request.get( "key1" ) ) &&
			test.assertEquals( "The serialized data should be equal:\n" + reserializedQueryOrig + "\n" + reserializedQuery, reserializedQueryOrig, reserializedQuery )
		);
	} );
	
	createTest( "CSV", function( test ) {
		var csv = "key1=val1,key2=val2,key3=1|2|3";
		var reserializedCSVOrig = "key1=val1,key2=val2,key3=1,key3=2,key3=3";
		var paramSeparator = ",";
		var valueSeparator = "=";
		var arrayValueSeparator = "|";
		var request = new SerializableData( paramSeparator, valueSeparator, arrayValueSeparator );
		request.deserialize( csv );
		
		var reserializedCSV = request.serialize();
		
		return (
			test.assertEquals( "The serialized data should be the same\n" + reserializedCSV + "\n" + reserializedCSVOrig, reserializedCSV, reserializedCSV )
		);
	} );
	
	createTest( "oldSchoolURL", function( test ) {
		var origQuery = "key1=val1&key2=1,2&key3=a&key3=b";
		var expectedQuery = "key1=val1&key2=1&key2=2&key3=a&key3=b";
		var paramSeparator = "&";
		var valueSeparator = "=";
		var arrayValueSeparator = ",";
		var request = new SerializableData( paramSeparator, valueSeparator, arrayValueSeparator );
		request.deserialize( origQuery );
		
		var reserializedQuery = request.serialize( true );
		
		return (
			test.assertEquals( "The reserialized and expected queries are not equal", expectedQuery, reserializedQuery )
		);
	} );
	
} )( TestController.getInstance() );