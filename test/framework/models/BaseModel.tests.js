( function( testController ) {

	var createTest = testController.createTestSuite( "BaseModel" );

	function TestModel(attributes) {
		this.constructor(attributes);
	}
	TestModel.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: [
			"firstName",
			"lastName",
			"id"
		]
	};

	function Test2Model(attributes) {
		this.constructor(attributes);
	}
	Test2Model.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: [
			"name",
			"description",
			"priority"
		]
	};

	function TestValidation(attributes) {
		this.constructor(attributes);
	}
	TestValidation.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: [
			"name",
			"description",
			"price",
			"notes",
			"phone"
		],
		requires: [
			"price",
			"name",
			"description",
			"notes",
			"phone"
		],
		validatesNumeric: [
			"price"
		],
		validatesMaxLength: {
			name: 40,
			description: 256
		},
		validatesFormatOf: {
			name: /^testing.*$/,
			phone: /^\s*\d{3}\s*[-.]*\s*\d{3}\s*[-.]*\s*\d{4}\s*$/
		}
	};

	function TestNumericValidation(attributes) {
		this.constructor(attributes);
	}
	TestNumericValidation.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: ["price"],
		validatesNumeric: ["price"]
	};

	function TestMaxLengthValidation(attributes) {
		this.constructor(attributes);
	}
	TestMaxLengthValidation.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: ["name", "description", "notes"],
		validatesMaxLength: {name: 10, description: 8, notes: 4}
	};

	function TestFormatValidation(attributes) {
		this.constructor(attributes);
	}
	TestFormatValidation.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: ["phone", "address"],
		validatesFormatOf: {
			phone: [
				/^\d{3}-\d{3}-\d{4}$/,
				/^\(\d{3}\) \d{3}-\d{4}$/
			],
			address: /^\d+ \w+( [.\w]+)?, \w+, [A-Z]{2} \d{5}$/
		}
	};

	window.TestModel = TestModel;
	window.Test2Model = Test2Model;
	window.TestValidation = TestValidation;
	window.TestNumericValidation = TestNumericValidation;
	window.TestMaxLengthValidation = TestMaxLengthValidation;
	window.TestFormatValidation = TestFormatValidation;

	// createTest("isValidAttribute", function(test) {
	// 
	// 	var o = new TestModel();
	// 
	// 	return (
	// 		test.assertFalse("non_existent should be false", o.isValidAttributeKey("non_existent")) &&
	// 		test.assertFalse("Name should be false", o.isValidAttributeKey("Name")) &&
	// 		test.assertTrue("firstName should be true", o.isValidAttributeKey("firstName")) &&
	// 		test.assertTrue("lastName should be true", o.isValidAttributeKey("lastName")) &&
	// 		test.assertTrue("id should be true", o.isValidAttributeKey("id"))
	// 	);
	// });

	// createTest("attributes (in the constructor)", function(test) {
	// 	var o = new TestModel({id: 123, firstName: "John", lastName: "Doe"});
	// 	return (
	// 		test.assertEquals("", 123, o.id) &&
	// 		test.assertEquals("", "John", o.firstName) &&
	// 		test.assertEquals("", "Doe", o.lastName)
	// 	);
	// });

	// createTest("attributes (none in the constructor)", function(test) {
	// 	var o = new TestModel();
	// 	o.id = 123;
	// 	o.firstName = "John";
	// 	o.lastName = "Doe";
	// 
	// 	return (
	// 		test.assertEquals("", 123, o.id) &&
	// 		test.assertEquals("", "John", o.firstName) &&
	// 		test.assertEquals("", "Doe", o.lastName)
	// 	);
	// });

	// createTest("inavlid attributes", function(test) {
	// 	var o, success = true;
	// 
	// 	try {
	// 		o = new TestModel({foo: 123});
	// 		success = false;
	// 	}
	// 	catch (error) {
	// 
	// 	}
	// 
	// 	o = new TestModel;
	// 	o.foo = 123;
	// 	success = true;
	// 
	// 	return success;
	// });

	// createTest("changed attributes", function(test) {
	// 	var o = new TestModel({id: 123, firstName: "John"});
	// 	o.firstName = "Billy";
	// 	o.lastName = "Bob";
	// 
	// 	return (
	// 		test.assertString("", o.changedAttributes.firstName) &&
	// 		test.assertEquals("", "John", o.changedAttributes.firstName) &&
	// 		test.assertEquals("", "Billy", o.firstName) &&
	// 		test.assertUndefined(o.changedAttributes.lastName) &&
	// 		test.assertUndefined(o.changedAttributes.id)
	// 	);
	// });

	// createTest("getters", function(test) {
	// 	var o = new Test2Model();
	// 	o.id = 123;
	// 	o.name = "Jim";
	// 	o.description = "Green and fruity";
	// 	o.description = "Jolly";
	// 
	// 	return (
	// 		test.assertEquals("", 123, o.id) &&
	// 		test.assertEquals("", "Green and fruity", o.changedAttributes.description) &&
	// 		test.assertEquals("", "Jim", o.name) &&
	// 		test.assertUndefined(o.changedAttributes.name) &&
	// 		test.assertNull("priority should be null", o.priority)
	// 	);
	// });

	createTest("validation - requires", function(test) {
		var o = new TestValidation({price: null, description: "", notes: "			"});
		o.errors = {};
		o.validateRequiredAttributes();

		return (
			test.assertTrue("", o.hasErrors()) &&
			test.assertArray("", o.errors.price) &&
			test.assertEquals("", "is required", o.errors.price[0]) &&
			test.assertArray("", o.errors.name) &&
			test.assertEquals("", "is required", o.errors.name[0]) &&
			test.assertArray("notes should be an array", o.errors.notes) &&
			test.assertEquals("", "is required", o.errors.notes[0]) &&
			test.assertArray("description should be an array", o.errors.description) &&
			test.assertEquals("", "is required", o.errors.description[0]) &&
			test.assertArray("phone should be an array", o.errors.phone) &&
			test.assertEquals("", "is required", o.errors.phone[0])
		);
	});

	createTest("validation - requires (everything missing)", function(test) {
		var o = new TestValidation();
		o.errors = {};
		o.validateRequiredAttributes();

		return (
			test.assertTrue("", o.hasErrors()) &&
			test.assertArray("", o.errors.price) &&
			test.assertEquals("", "is required", o.errors.price[0]) &&
			test.assertArray("", o.errors.name) &&
			test.assertEquals("", "is required", o.errors.name[0]) &&
			test.assertArray("notes should be an array", o.errors.notes) &&
			test.assertEquals("", "is required", o.errors.notes[0])
		);
	});

	createTest("validation - validatesNumeric", function(test) {
		var valid = [
			new TestNumericValidation({price: 100}),
			new TestNumericValidation({price: "100.3"}),
			new TestNumericValidation({price: ""}),
			new TestNumericValidation({price: null})
		];
		var invalid = [
			new TestNumericValidation({price: NaN}),
			new TestNumericValidation({price: "abc"}),
			new TestNumericValidation({price: "$100.35"})
		];
		var i, length, success = true;

		for (i = 0, length = valid.length; i < length; i++) {
			if (!valid[i].validate()) {
				test.fail("Model " + i + "should be valid.");
				test.info(valid[i].errors);
				success = false;
			}
		}

		for (i = 0, length = invalid.length; i < length; i++) {
			if (invalid[i].validate()) {
				test.fail("Model " + i + " should be invalid.");
				test.info(invalid[i].attributes);
				success = false;
			}
		}

		return success;
	});

	createTest("validation - validatesMaxLength", function(test) {
		var o = new TestMaxLengthValidation();
		o.name = "123456789";
		o.description = "12345678";
		o.notes = "12345";

		return (
			test.assertFalse("validate() should return false", o.validate()) &&
			test.assertTrue("hasErrors() should return true", o.hasErrors()) &&
			test.assertUndefined(o.errors.name) &&
			test.assertUndefined(o.errors.description) &&
			test.assertArray("errors.notes should be an array", o.errors.notes)
		);
	});

	createTest("validation - validatesAttributeFormats - valid", function(test) {
		var o = new TestFormatValidation();
		o.phone = "123-555-1234";
		o.address = "123 James St, Chicago, IL 12345";

		return (
			test.assertTrue("validate() should return true", o.validate())
		);
	});

	createTest("validation - validatesAttributeFormats - invalid", function(test) {
		var o = new TestFormatValidation();
		o.phone = "5555-5-5555";
		o.address = "123 James St, Chicago, IL";

		return (
			test.assertFalse("validate() should return false", o.validate()) &&
			test.assertTrue("hasErrors() should return true", o.hasErrors()) &&
			test.assertArray("errors.phone should be an array", o.errors.phone) &&
			test.assertArray("errors.address should be an array", o.errors.address)
		);
	});

	createTest("toXML", function(test) {
		var o = new TestValidation({
			id: 1234,
			name: "Paint",
			description: "Red<br>matte",
			price: 15.99,
			notes: "Per gallon",
			phone: null
		});
		var xmlCorrect1 = [
			'<id>1234</id>',
			'<name>Paint</name>',
			'<description>Red&lt;br&gt;matte</description>',
			'<price>15.99</price>',
			'<notes>Per gallon</notes>'
		].join("");
		var xmlCorrect2 = '<test_validation>' + xmlCorrect1 + '</test_validation>';

		return (
			test.assertEquals("", xmlCorrect1, o.toXML()) &&
			test.assertEquals("", xmlCorrect2, o.toXML({rootElement: "test_validation"}))
		);
	});

	createTest("toXML - shorthand", function(test) {
		var o = new TestValidation({
			id: 1234,
			name: "Paint",
			description: "Red<br>\"matte\"",
			price: 15.99,
			notes: "Per gallon",
			phone: null
		});
		var xmlCorrect = '<test_validation id="1234" name="Paint" description="Red&lt;br&gt;&quot;matte&quot;" price="15.99" notes="Per gallon" />';

		return test.assertEquals("", xmlCorrect, o.toXML({shorthand: true, rootElement: "test_validation"}));
	});

	createTest("toJSON", function(test) {
		var o = new TestValidation({
			id: 1234,
			name: "Paint",
			description: "Red<br>matte",
			price: 15.99,
			notes: "Per gallon",
			phone: null
		});
		var jsonCorrect1 = [
			'{',
				'"name":"Paint",',
				'"description":"Red<br>matte",',
				'"price":15.99,',
				'"notes":"Per gallon",',
				'"phone":null,',
				'"id":1234',
			'}'
		].join("");
		var jsonCorrect2 = '{"test_validation":' + jsonCorrect1 + '}';

		return (
			test.assertEquals("o.toJSON() should be equal to jsonCorrect1", jsonCorrect1, o.toJSON()) &&
			test.assertEquals("o.toJSON({rootElement: 'test_validation'}) should be equal to jsonCorrect2", jsonCorrect2, o.toJSON({rootElement: "test_validation"}))
		);
	});

	createTest("toQueryString", function(test) {
		var o = new TestValidation({
			id: 1234,
			name: "Paint",
			description: "Red<br>matte",
			price: 15.99,
			notes: "Per gallon",
			phone: null
		});
		var qsCorrect1 = [
				'id=1234',
				'name=Paint',
				'description=Red%3Cbr%3Ematte',
				'price=15.99',
				'notes=Per%20gallon'
		].join("&");
		var qsCorrect2 = [
				'test_validation[id]=1234',
				'test_validation[name]=Paint',
				'test_validation[description]=Red%3Cbr%3Ematte',
				'test_validation[price]=15.99',
				'test_validation[notes]=Per%20gallon'
		].join("&");

		return (
			test.assertEquals("qs #1", qsCorrect1, o.toQueryString()) &&
			test.assertEquals("qs #2", qsCorrect2, o.toQueryString({rootElement: "test_validation"}))
		);
	});

	createTest = testController.createTestSuite("BaseModel (relations)");

	createTest("getClassReference", function(test) {
		window.__classReferenceTest__ = {
			foo: {
				bar: {
					Test: function() {}
				}
			}
		};

		return (
			test.assertFunction("", BaseModel.modules.relations.self.getClassReference("__classReferenceTest__.foo.bar.Test"))
		);
	});

	createTest("getClassReference - invalid", function(test) {
		var e;

		try {
			test.assertFunction("", BaseModel.modules.relations.self.getClassReference("non.existent.Class"));
			test.fail("A non existent class name should throw an error");
		}
		catch (error) {
			e = error;
		}

		return (
			test.assertError("", e)
		);
	});

	function TestRelations(attributes) {
		this.constructor(attributes);
	}
	TestRelations.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: ['name', 'description', 'price', 'quantity', 'category_id'],
		hasOne: {
			category: {className: 'Category'}
		}
	};

	function Category(attributes) {
		this.constructor(attributes);
	}
	Category.prototype = {
		__proto__: BaseModel.prototype,
		_validAttributes: ['id', 'name']
	};

	window.TestRelations = TestRelations;
	window.Category = Category;

	createTest("hasOne - no attributes", function(test) {
		var o = new TestRelations();

		return (
			test.assertNull("o.category should be null", o.category)
		);
	});

	createTest("hasOne - with attributes", function(test) {
		var o = new TestRelations({
			id: 1234,
			name: "Chainsaw",
			description: "Cuts wood",
			price: 135.99,
			quantity: 8,
			category_id: 98,
			category: {
				id: 98,
				name: "Outdoors"
			}
		});

		var category = o.category;

		return (
			test.assertInstanceof("o.category should be an isntance of Category", o.category, Category) &&
			test.assertEquals("o.category.id should be 98", 98, o.category.id) &&
			test.assertEquals("o.category.name should be 'Outdoors'", "Outdoors", o.category.name)
		);
	});

	createTest("hasOne - setting to null", function(test) {
		var o = new TestRelations({
			id: 1234,
			name: "Chainsaw",
			description: "Cuts wood",
			price: 135.99,
			quantity: 8,
			category_id: 98,
			category: {
				id: 98,
				name: "Outdoors"
			}
		});
		
		o.category = null;

		return (
			test.assertNull("o.category should be null", o.category) &&
			test.assertNull("o.category_id should be null", o.category_id) &&
			test.assertEquals("o.changedAttributes.category_id should be 98", 98, o.changedAttributes.category_id)
		);
	});

	createTest("hasOne - assigning by instance, originally null", function(test) {
		var o = new TestRelations();
		var category = new Category({id: 123, name: "Pets"});
		o.category = category;

		return (
			test.assertEquals("o.category_id should be 123", 123, o.category_id) &&
			test.assertEquals("o.category should be the same object as category", category, o.category)
		);
	});

} )( TestController.getInstance() );
