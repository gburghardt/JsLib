( function( testController ) {
	
	var createTest = testController.createTestSuite( "BaseView" );
	
	createTest("generateNodeId", function(test) {
	  var expectedIds = ["anonymous-node-0", "anonymous-node-1"];

	  return (
	    test.assertEquals("Should be " + expectedIds[0], BaseView.generateNodeId(), expectedIds[0]) &&
	    test.assertEquals("Should be " + expectedIds[1], BaseView.generateNodeId(), expectedIds[1])
	  );
	});

} )( TestController.getInstance() );
