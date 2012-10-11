describe("BaseModel", function() {

	describe("Serialization", function() {

		xit("escapes HTML");

		describe("mergeOptions", function() {

			it("performs a shallow merge of one argument into the next", function() {
				var model = new BaseModel();
				var a = {
					format: "queryString",
					foo: {bar: 1}
				};
				var b = {
					rootElement: "test",
					foo: {bar: 2}
				};
				var c = model.mergeOptions(a, b);

				expect(c.format).toEqual("queryString");
				expect(c.rootElement).toEqual("test");
				expect(c.foo).toStrictlyEqual(b.foo);
				expect(c.foo.bar).toEqual(b.foo.bar);
			});

		});

		describe("serialize", function() {

			xit("does not require arguments");

			xit("takes a type");

			xit("takes a type and options");

		});

	});

});
