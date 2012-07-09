describe("BaseModel", function() {

	describe("modules", function() {

		describe("basicValidation", function() {

			describe("validateRequiredAttributes", function() {
				it("marks fields with 'empty'-like values as required", function() {
					var o = new TestValidation({price: null, description: "", notes: "			"});
					o.errors = {};
					o.validateRequiredAttributes();

					expect(o.hasErrors()).toBeTrue();
					expect(o.errors.price).toBeArray();
					expect(o.errors.price[0]).toEqual("is required");

					expect(o.errors.name).toBeArray();
					expect(o.errors.name[0]).toEqual("is required");

					expect(o.errors.notes).toBeArray();
					expect(o.errors.notes[0]).toEqual("is required");

					expect(o.errors.description).toBeArray();
					expect(o.errors.description[0]).toEqual("is required");

					expect(o.errors.phone).toBeArray();
					expect(o.errors.phone[0]).toEqual("is required");
				});

				it("validates when no attributes are passed in the constructor", function() {
					var o = new TestValidation();
					o.errors = {};
					o.validateRequiredAttributes();

					expect(o.hasErrors()).toBeTrue();
					expect(o.errors.price).toBeArray();
					expect(o.errors.price[0]).toEqual("is required");

					expect(o.errors.name).toBeArray();
					expect(o.errors.name[0]).toEqual("is required");

					expect(o.errors.notes).toBeArray();
					expect(o.errors.notes[0]).toEqual("is required");

					expect(o.errors.description).toBeArray();
					expect(o.errors.description[0]).toEqual("is required");

					expect(o.errors.phone).toBeArray();
					expect(o.errors.phone[0]).toEqual("is required");
				});
			});

		});

	});

});
