describe("BaseModel", function() {

	describe("BasicValidation", function() {

		describe("getErrorMessage", function() {
			beforeEach(function() {
				this.model = new BaseModel();
			});

			it("returns an empty array when a key has no errors", function() {
				this.model.errors = {};
				var message = this.model.getErrorMessage("name");
				expect(message.length).toEqual(0);
			});

			it("returns an array of a single human readable message for a key", function() {
				this.model.errors = {id: ["is required"]};
				var message = this.model.getErrorMessage("id");
				expect(message.length).toEqual(1);
				expect(message[0]).toEqual("Id is required");
			});

			it("returns an array of human readable messages for a key", function() {
				this.model.errors = {
					name: ["can only contain letters", "is too long"]
				};
				var message = this.model.getErrorMessage("name");

				expect(message.length).toEqual(2);
				expect(message[0]).toEqual("Name can only contain letters");
				expect(message[1]).toEqual("Name is too long");
			});
		});

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
