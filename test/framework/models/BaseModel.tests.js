( function( testController ) {
	
	var createTest = testController.createTestSuite( "BaseModel" );

	window.TestModel = function TestModel(attributes) {
		this.constructor(attributes);
	}
	TestModel.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: "firstName lastName id"
	};
	
	window.Test2Model = function Test2Model(attributes) {
		this.constructor(attributes);
	}
	Test2Model.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: [
		                    "id",
		                    "name",
		                    "description",
		                    "priority"
		                  ]
	};
	
	createTest("isValidAttribute", function(test) {

		var o = new TestModel();

		return (
			test.assertFalse("non_existent should be false", o.isValidAttributeKey("non_existent")) &&
			test.assertFalse("Name should be false", o.isValidAttributeKey("Name")) &&
			test.assertTrue("firstName should be true", o.isValidAttributeKey("firstName")) &&
			test.assertTrue("lastName should be true", o.isValidAttributeKey("lastName")) &&
			test.assertTrue("id should be true", o.isValidAttributeKey("id"))
		);
	});

	createTest("attributes (in the constructor)", function(test) {
		var o = new TestModel({id: 123, firstName: "John", lastName: "Doe"});
		return (
			test.assertEquals("", 123, o.id) &&
			test.assertEquals("", "John", o.firstName) &&
			test.assertEquals("", "Doe", o.lastName)
		);
	});

	createTest("attributes (none in the constructor)", function(test) {
		var o = new TestModel();
		o.id = 123;
		o.firstName = "John";
		o.lastName = "Doe";

		return (
			test.assertEquals("", 123, o.id) &&
			test.assertEquals("", "John", o.firstName) &&
			test.assertEquals("", "Doe", o.lastName)
		);
	});

	createTest("inavlid attributes", function(test) {
		var o, success = true;

		try {
			o = new TestModel({foo: 123});
			success = false;
		}
		catch (error) {
			
		}

		o = new TestModel;
		o.foo = 123;
		success = true;

		return success;
	});

  createTest("changed attributes", function(test) {
    var o = new TestModel({id: 123, firstName: "John"});
    o.firstName = "Billy";
    o.lastName = "Bob";

    return (
      test.assertString("", o.changedAttributes.firstName) &&
      test.assertEquals("", "John", o.changedAttributes.firstName) &&
      test.assertEquals("", "Billy", o.firstName) &&
      test.assertUndefined(o.changedAttributes.lastName) &&
      test.assertUndefined(o.changedAttributes.id)
    );
  });

  createTest("getters", function(test) {
    var o = new Test2Model();
    o.id = 123;
    o.name = "Jim";
    o.description = "Green and fruity";
    o.description = "Jolly";

    return (
      test.assertEquals("", 123, o.id) &&
      test.assertEquals("", "Green and fruity", o.changedAttributes.description) &&
      test.assertEquals("", "Jim", o.name)
    );
  });

} )( TestController.getInstance() );
