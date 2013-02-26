describe("BaseModel", function() {

	describe("modules", function() {

		describe("extendedValidation", function() {
			// 
			// describe("valueIsNumeric", function() {
			// 	beforeEach(function() {
			// 		this.model = new TestNumericValidation();
			// 	});
			// 
			// 	it("returns true for numbers", function() {
			// 		expect(this.model.valueIsNumeric(100)).toBeTrue();
			// 		expect(this.model.valueIsNumeric(-100)).toBeTrue();
			// 		expect(this.model.valueIsNumeric(0.3)).toBeTrue();
			// 	});
			// 
			// 	it("returns true for numeric strings", function() {
			// 		expect(this.model.valueIsNumeric("100")).toBeTrue();
			// 		expect(this.model.valueIsNumeric("-100")).toBeTrue();
			// 		expect(this.model.valueIsNumeric("0.3")).toBeTrue();
			// 	});
			// 
			// 	it("returns false for empty strings", function() {
			// 		expect(this.model.valueIsNumeric("")).toBeFalse();
			// 	});
			// 
			// 	it("returns false for null values", function() {
			// 		expect(this.model.valueIsNumeric(null)).toBeFalse();
			// 	});
			// 
			// 	it("returns false for NaN values", function() {
			// 		expect(this.model.valueIsNumeric(NaN)).toBeFalse();
			// 	});
			// 
			// 	it ("returns false for strings without numbers", function() {
			// 		expect(this.model.valueIsNumeric("abc")).toBeFalse();
			// 	});
			// 
			// 	it ("returns false for strings with numbers and non numeric characters", function() {
			// 		expect(this.model.valueIsNumeric("$10.05")).toBeFalse();
			// 	});
			// });

			// describe("numeric", function() {
			// 	beforeEach(function() {
			// 		this.model = new TestNumericValidation();
			// 		this.model.errors = {};
			// 		this.model.valid = true;
			// 	});
			// 
			// 	it("returns true for empty strings", function() {
			// 		this.model.price = "";
			// 		this.model.validateAttributeDataTypes();
			// 		expect(this.model.valid).toBeTrue();
			// 	});
			// 
			// 	it("returns true for null values", function() {
			// 		this.model.price = null;
			// 		this.model.validateAttributeDataTypes();
			// 		expect(this.model.valid).toBeTrue();
			// 	});
			// 
			// 	it("returns false for NaN values", function() {
			// 		this.model.price = NaN;
			// 		this.model.validateAttributeDataTypes();
			// 		expect(this.model.valid).toBeFalse();
			// 	});
			// 
			// 	it("returns false for non numeric strings", function() {
			// 		this.model.price = "acb";
			// 		this.model.validateAttributeDataTypes();
			// 		expect(this.model.valid).toBeFalse();
			// 	});
			// 
			// 	it("returns false for strings with numbers, but other non number characters", function() {
			// 		this.model.price = "$10.99";
			// 		this.model.validateAttributeDataTypes();
			// 		expect(this.model.valid).toBeFalse();
			// 	});
			// });

			// describe("max length", function() {
			// 	beforeEach(function() {
			// 		this.model = new TestMaxLengthValidation();
			// 	});
			// 
			// 	it("returns true for string lengths equal to or lesser than the max length", function() {
			// 		this.model.name = "123456789";
			// 		this.model.description = "12345678";
			// 		this.model.notes = "1234";
			// 		expect(this.model.validate()).toBeTrue();
			// 	});
			// 
			// 	it("returns false for values greater than the max length", function() {
			// 		this.model.name = "1234567890abc";
			// 		this.model.description = "123456789";
			// 		this.model.notes = "12345";
			// 		expect(this.model.validate()).toBeFalse();
			// 		expect(this.model.errors.name).toBeArray();
			// 		expect(this.model.errors.description).toBeArray();
			// 		expect(this.model.errors.notes).toBeArray();
			// 	});
			// 
			// 	it("returns true for empty values", function() {
			// 		this.model.name = undefined;
			// 		this.model.descrition = null;
			// 		this.model.notes = "									 ";
			// 		expect(this.model.validate()).toBeTrue();
			// 	});
			// });

			// describe("validateAttributeFormats", function() {
			// 	beforeEach(function() {
			// 		this.model = new TestFormatValidation();
			// 		this.model.valid = true;
			// 		this.model.errors = {};
			// 	});
			// 
			// 	it("is valid if one of many regular expressions are valid", function() {
			// 		this.model.phone = "123-555-1234";
			// 		this.model.validateAttributeFormats();
			// 		expect(this.model.valid).toBeTrue();
			// 	});
			// 
			// 	it("is valid only if a single regular expression is valid", function() {
			// 		this.model.address = "123 James St, Chicago, IL 12345";
			// 		this.model.validateAttributeFormats();
			// 		expect(this.model.valid).toBeTrue();
			// 	});
			// 
			// 	it("is invalid if all regular expressions fail", function() {
			// 		this.model.phone = "5555-5-5555";
			// 		this.model.validateAttributeFormats();
			// 		expect(this.model.valid).toBeFalse();
			// 		expect(this.model.errors.phone).toBeArray();
			// 	});
			// 
			// 	it("is invalid if the regular expression fails", function() {
			// 		this.model.address = "123 James St, Chicago, IL";
			// 		this.model.validateAttributeFormats();
			// 		expect(this.model.valid).toBeFalse();
			// 		expect(this.model.errors.address).toBeArray();
			// 	});
			// });

		});

	});

});
