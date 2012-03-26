describe("FormView", function() {

	beforeEach(function() {
		this.form = document.createElement("form");
		this.formView = new FormView(this.form).init();
	});

	describe("getControlsByName", function() {
		beforeEach(function() {
			this.form.innerHTML = [
				'<input type="text" name="test1" size="10">',
				'<select name="test2"></select>',
				'<select name="test2"></select>'
			].join("");
		});

		it("gets controls by their name attribute", function() {
			expect(this.formView.getControlsByName("test1").length).toEqual(1);
			expect(this.formView.getControlsByName("test1")[0]).toEqual(this.form.childNodes[0]);
			expect(this.formView.getControlsByName("test2").length).toEqual(2);
			expect(this.formView.getControlsByName("test2")[0]).toEqual(this.form.childNodes[1]);
			expect(this.formView.getControlsByName("test2")[1]).toEqual(this.form.childNodes[2]);
		});
	});

	describe("extractControlValue", function() {
		describe("input[type=text]", function() {
			beforeEach(function() {
				this.textField = document.createElement("input");
				this.textField.value = "test";
			});

			it("returns the value for an enabled text field", function() {
				expect(this.formView.extractControlValue(this.textField)).toEqual("test");
			});

			it("returns null for a disabled text field", function() {
				this.textField.disabled = true;
				expect(this.formView.extractControlValue(this.textField)).toBeNull();
			});
		});

		describe("input[type=checkbox]", function() {
			beforeEach(function() {
				this.checkbox = document.createElement("input");
				this.checkbox.type = "checkbox";
				this.checkbox.value = "test";
			});

			xit("returns the value for an enabled, checked check box", function() {
				
			});

			it("returns null for an unchecked, enabled check box", function() {
				expect(this.formView.extractControlValue(this.checkbox)).toBeNull();
			});

			it("returns null for an unchecked, disabled check box", function() {
				this.checkbox.disabled = true;
				expect(this.formView.extractControlValue(this.checkbox)).toBeNull();
			});
		});

		describe("input[type=radio]", function() {
			beforeEach(function() {
				this.form.innerHTML = [
					'<input type="radio" name="test" value="1" checked>',
					'<input type="radio" name="test" value="2" disabled>',
					'<input type="radio" name="test" value="3">'
				].join("");
			});

			it("returns the value for an enabled, checked radio button", function() {
				expect(this.formView.extractControlValue(this.form.childNodes[0])).toEqual("1");
			});

			it("returns null for a disabled check box", function() {
				expect(this.formView.extractControlValue(this.form.childNodes[1])).toBeNull();
			});

			it("returns null for an unchecked check box", function() {
				expect(this.formView.extractControlValue(this.form.childNodes[2])).toBeNull();
			});
		});
	});

});