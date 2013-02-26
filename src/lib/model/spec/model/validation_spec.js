describe("Model", function() {

	describe("Validation", function() {

		var TestValidation = Model.Base.extend({
			prototype: {
				schema: {
					name: "String",
					price: "Number",
					description: "String",
					notes: "String",
					phone: "String",
					address: "String"
				},
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
					name: 128,
					description: 400
				},
				validatesFormatOf: {
					address: /^\d+ \w+( [.\w]+)?, \w+, [A-Z]{2} \d{5}$/,
					name: /^testing.*$/,
					phone: /^\s*\d{3}\s*[-.]*\s*\d{3}\s*[-.]*\s*\d{4}\s*$/
				}
			}
		});

		var TestMaxLengthValidation = Model.Base.extend({
			prototype: {
				schema: {
					name: "String",
					description: "String",
					notes: "String"
				},
				validatesMaxLength: {
					name: 10,
					description: 8,
					notes: 4
				}
			}
		});

		describe("getErrorMessage", function() {
			beforeEach(function() {
				this.model = new Model.Base();
			});

			it("returns an empty array when a key has no errors", function() {
				this.model.errors.clear();
				var message = this.model.getErrorMessage("name");
				expect(message.length).toEqual(0);
			});

			it("returns an array of a single human readable message for a key", function() {
				this.model.errors.add("id", "Id is required");
				var message = this.model.getErrorMessage("id");
				expect(message.length).toEqual(1);
				expect(message[0]).toEqual("Id is required");
			});

			it("returns an array of human readable messages for a key", function() {
				this.model.errors.add("name", "Name can only contain letters");
				this.model.errors.add("name", "Name is too long");
				var message = this.model.getErrorMessage("name");

				expect(message.length).toEqual(2);
				expect(message[0]).toEqual("Name can only contain letters");
				expect(message[1]).toEqual("Name is too long");
			});
		});

		describe("validateRequiredAttributes", function() {
			it("marks fields with 'empty'-like values as required", function() {
				var o = new TestValidation({price: null, description: "", notes: "			"});
				o.validateRequiredAttributes();

				expect(o.hasErrors()).toBeTrue();
				expect(o.errors.get("price")).toBeArray();
				expect(o.errors.get("price")[0]).toEqual("Price is required");

				expect(o.errors.get("name")).toBeArray();
				expect(o.errors.get("name")[0]).toEqual("Name is required");

				expect(o.errors.get("notes")).toBeArray();
				expect(o.errors.get("notes")[0]).toEqual("Notes is required");

				expect(o.errors.get("description")).toBeArray();
				expect(o.errors.get("description")[0]).toEqual("Description is required");

				expect(o.errors.get("phone")).toBeArray();
				expect(o.errors.get("phone")[0]).toEqual("Phone is required");
			});

			it("validates when no attributes are passed in the constructor", function() {
				var o = new TestValidation();
				o.validateRequiredAttributes();

				expect(o.hasErrors()).toBeTrue();
				expect(o.errors.get("price")).toBeArray();
				expect(o.errors.get("price")[0]).toEqual("Price is required");

				expect(o.errors.get("name")).toBeArray();
				expect(o.errors.get("name")[0]).toEqual("Name is required");

				expect(o.errors.get("notes")).toBeArray();
				expect(o.errors.get("notes")[0]).toEqual("Notes is required");

				expect(o.errors.get("description")).toBeArray();
				expect(o.errors.get("description")[0]).toEqual("Description is required");

				expect(o.errors.get("phone")).toBeArray();
				expect(o.errors.get("phone")[0]).toEqual("Phone is required");
			});
		});

		describe("valueIsNumeric", function() {

			beforeEach(function() {
				this.model = new TestValidation();
			});

			it("returns true for numbers", function() {
				expect(this.model.valueIsNumeric(100)).toBeTrue();
				expect(this.model.valueIsNumeric(-100)).toBeTrue();
				expect(this.model.valueIsNumeric(0.3)).toBeTrue();
			});

			it("returns true for numeric strings", function() {
				expect(this.model.valueIsNumeric("100")).toBeTrue();
				expect(this.model.valueIsNumeric("-100")).toBeTrue();
				expect(this.model.valueIsNumeric("0.3")).toBeTrue();
			});

			it("returns false for empty strings", function() {
				expect(this.model.valueIsNumeric("")).toBeFalse();
			});

			it("returns false for null values", function() {
				expect(this.model.valueIsNumeric(null)).toBeFalse();
			});

			it("returns false for NaN values", function() {
				expect(this.model.valueIsNumeric(NaN)).toBeFalse();
			});

			it ("returns false for strings without numbers", function() {
				expect(this.model.valueIsNumeric("abc")).toBeFalse();
			});

			it ("returns false for strings with numbers and non numeric characters", function() {
				expect(this.model.valueIsNumeric("$10.05")).toBeFalse();
			});

		});

		describe("validateAttributeDataTypes", function() {

			describe("numeric attributes", function() {

				beforeEach(function() {
					this.model = new TestValidation();
					this.model.valid = true;
				});

				it("return true for empty strings", function() {
					this.model.price = 10;
					this.model.validateAttributeDataTypes();
					expect(this.model.valid).toBeTrue();
				});

				it("return true for null values", function() {
					this.model.price = null;
					this.model.validateAttributeDataTypes();
					expect(this.model.valid).toBeTrue();
				});

				it("return false for NaN values", function() {
					this.model.price = NaN;
					this.model.validateAttributeDataTypes();
					expect(this.model.valid).toBeFalse();
				});

				it("return false for non numeric strings", function() {
					this.model.price = "acb";
					this.model.validateAttributeDataTypes();
					expect(this.model.valid).toBeFalse();
				});

				it("return false for strings with numbers, but other non number characters", function() {
					this.model.price = "$10.99";
					this.model.validateAttributeDataTypes();
					expect(this.model.valid).toBeFalse();
				});

			});

		});

		describe("max length", function() {
			beforeEach(function() {
				this.model = new TestMaxLengthValidation();
				this.model.valid = true;
			});

			it("returns true for string lengths equal to or lesser than the max length", function() {
				this.model.name = "123456789";
				this.model.description = "12345678";
				this.model.notes = "1234";

				this.model.validateAttributeLengths();

				expect(this.model.valid).toBeTrue();
			});

			it("returns false for values greater than the max length", function() {
				this.model.name = "1234567890abc";
				this.model.description = "123456789";
				this.model.notes = "12345";

				this.model.validateAttributeLengths();

				expect(this.model.valid).toBeFalse();
				expect(this.model.errors.get("name")).toBeArray();
				expect(this.model.errors.get("description")).toBeArray();
				expect(this.model.errors.get("notes")).toBeArray();
			});

			it("returns true for empty values", function() {
				this.model.name = undefined;
				this.model.description = null;
				this.model.notes = "									 ";

				expect(this.model.name).toBeNull();
				expect(this.model.description).toBeNull();
				expect(this.model.notes).toEqual("									 ");

				this.model.validateAttributeLengths();

				expect(this.model.valid).toBeTrue();
			});

		});

		describe("attrribute formats", function() {

			beforeEach(function() {
				this.model = new TestValidation();
				this.model.valid = true;
			});

			it("is valid if one of many regular expressions are valid", function() {
				this.model.phone = "123-555-1234";
				this.model.validateAttributeFormats();
				expect(this.model.valid).toBeTrue();
			});

			it("is valid only if a single regular expression is valid", function() {
				this.model.address = "123 James St, Chicago, IL 12345";
				this.model.validateAttributeFormats();
				expect(this.model.valid).toBeTrue();
			});

			it("is invalid if all regular expressions fail", function() {
				this.model.phone = "5555-5-5555";
				this.model.validateAttributeFormats();
				expect(this.model.valid).toBeFalse();
				expect(this.model.errors.get("phone")).toBeArray();
			});

			it("is invalid if the regular expression fails", function() {
				this.model.address = "123 James St, Chicago, IL";
				this.model.validateAttributeFormats();
				expect(this.model.valid).toBeFalse();
				expect(this.model.errors.get("address")).toBeArray();
			});

		});

	});

});
