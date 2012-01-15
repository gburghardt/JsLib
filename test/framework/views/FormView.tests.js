( function( testController ) {
	
	var createTest = testController.createTestSuite( "BaseView" );
	
	createTest("getControlsByName", function(test) {
		var form = document.createElement("form");
		var formView = new FormView(form).init();
		form.innerHTML = [
			'<input type="text" name="test1" size="10">',
			'<select name="test2"></select>',
			'<select name="test2"></select>'
		].join("\n");
		var controls1 = formView.getControlsByName("test1"),
		    controls2 = formView.getControlsByName("test2");

		return (
			test.assertEquals("Should be 1", controls1.length, 1) &&
			test.assertEquals("Should be 2", controls2.length, 2)
		);
	});

} )( TestController.getInstance() );
