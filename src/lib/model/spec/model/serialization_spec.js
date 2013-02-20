describe("Model", function() {

	var defaultSchema = {
		title: "String",
		description: "String",
		price: "Number"
	};

	describe("Serialization", function() {

		xit("escapes HTML");

		describe("serialize", function() {

			xit("does not require arguments");

			xit("takes a type");

			xit("takes a type and options");

			describe("default serialize options", function() {

				it("sets the default type", function() {
					var TestModel = Model.Base.extend({
						prototype: {
							schema: defaultSchema,

							serializeOptions: {
								format: "xml"
							}
						}
					});

					var o = new TestModel({title: "Testing", price: 10.99});
					spyOn(o, "toXml").andCallThrough();
					var xml = o.serialize();

					expect(o.toXml).wasCalledWith({format: "xml"});
					expect(xml).toEqual('<title>Testing</title><price>10.99</price>');
				});

				it("sets the rootElement", function() {
					var TestModel = Model.Base.extend({
						prototype: {
							schema: defaultSchema,

							serializeOptions: {
								format: "xml",
								rootElement: "test_model"
							}
						}
					});

					var o = new TestModel({title: "Testing", price: 10.99});
					spyOn(o, "toXml").andCallThrough();
					var xml = o.serialize();
					expect(o.toXml).wasCalledWith({format: "xml", rootElement: "test_model"});
					expect(xml).toEqual('<test_model><title>Testing</title><price>10.99</price></test_model>');
				});

				it("sets the shorthand flag", function() {
					var TestModel = Model.Base.extend({
						prototype: {
							schema: defaultSchema,

							serializeOptions: {
								format: "xml",
								rootElement: "test_model",
								shorthand: true
							}
						}
					});

					var o = new TestModel({title: "Testing", price: 10.99});
					spyOn(o, "toXml").andCallThrough();
					var xml = o.serialize();
					expect(o.toXml).wasCalledWith({format: "xml", rootElement: "test_model", shorthand: true});
					expect(xml).toEqual('<test_model title="Testing" price="10.99" />');
				});

				it("merges options from the whole class hierarchy", function() {
					var RootClass = Model.Base.extend({
						prototype: {
							schema: defaultSchema,

							serializeOptions: {
								format: "xml"
							}
						}
					});

					var ParentClass = RootClass.extend({
						prototype: {
							serializeOptions: {
								rootElement: "testing"
							}
						}
					});

					var ChildClass = ParentClass.extend({
						prototype: {
							serializeOptions: {
								shorthand: true
							}
						}
					});

					var o = new ChildClass({title: "Test", price: 10});
					spyOn(o, "toXml").andCallThrough();
					var xml = o.serialize();

					expect(o.toXml).wasCalledWith({format: "xml", rootElement: "testing", shorthand: true});
					expect(xml).toEqual('<testing title="Test" price="10" />');
				});

			});

		});

	});

});
