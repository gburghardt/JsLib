( function( testController ) {
	
	var createTest = testController.createTestSuite( "BasePresenter" );
	
	createTest("setModelToViewMap (Array)", function(test) {
		var map = ["id", "title", "body"];
		var presenter = new BasePresenter();
		presenter.setModelToViewMap(map);

		return (
			test.assertEquals("Should be id",    "id",    presenter.modelToViewMap.id) &&
			test.assertEquals("Should be title", "title", presenter.modelToViewMap.title) &&
			test.assertEquals("Should be body",  "body",  presenter.modelToViewMap.body) &&

			test.assertEquals("Should be id",    "id",    presenter.viewToModelMap.id) &&
			test.assertEquals("Should be title", "title", presenter.viewToModelMap.title) &&
			test.assertEquals("Should be body",  "body",  presenter.viewToModelMap.body)
		);
	});
	
	createTest("setModelToViewMap (Object)", function(test) {
		var map = {
			id: "blog[id]",
			title: "blog[title]",
			body: "blog[body]"
		};
		var presenter = new BasePresenter();
		presenter.setModelToViewMap(map);
	
		return (
			test.assertEquals("Should be id",    map.id,    presenter.modelToViewMap.id) &&
			test.assertEquals("Should be title", map.title, presenter.modelToViewMap.title) &&
			test.assertEquals("Should be body",  map.body,  presenter.modelToViewMap.body) &&

			test.assertEquals("Should be id",    "id",    presenter.viewToModelMap["blog[id]"]) &&
			test.assertEquals("Should be title", "title", presenter.viewToModelMap["blog[title]"]) &&
			test.assertEquals("Should be body",  "body",  presenter.viewToModelMap["blog[body]"])
		);
	});

} )( TestController.getInstance() );
