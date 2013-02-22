describe("Views", function() {

	describe("Forms", function() {

		beforeEach(function() {
			this.form = document.createElement("form");
			this.formView = new Views.Base(this.form);
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

				it("returns null for an enabled text field with no value", function() {
					this.textField.value = "";
					expect(this.formView.extractControlValue(this.textField)).toBeNull();
				});
			});

			describe("input[type=checkbox]", function() {
				beforeEach(function() {
					this.checkbox = document.createElement("input");
					this.checkbox.type = "checkbox";
					this.checkbox.value = "test";
				});

				it("returns the value for an enabled, checked check box", function() {
					this.checkbox.checked = true;
					expect(this.formView.extractControlValue(this.checkbox)).toEqual("test");
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

			xit("input[type=datetime]");
			xit("input[type=date]");
			xit("input[type=month]");
			xit("input[type=week]");
			xit("input[type=time]");
			xit("input[type=datetime-local]");
			xit("input[type=range]");
			xit("input[type=color]");

			describe("textarea", function() {
				beforeEach(function() {
					this.textarea = document.createElement("textarea");
					this.textarea.value = "test";
				});

				it("returns the value for an enabled textarea", function() {
					expect(this.formView.extractControlValue(this.textarea)).toEqual("test");
				});

				it("returns null for a disabled textarea", function() {
					this.textarea.disabled = true;
					expect(this.formView.extractControlValue(this.textarea)).toBeNull();
				});

				it("returns null for an enabled textarea with no value", function() {
					this.textarea.value = "";
					expect(this.formView.extractControlValue(this.textarea)).toBeNull();
				});
			});

			describe("select", function() {
				beforeEach(function() {
					this.select = document.createElement("select");
					this.select.innerHTML = [
						'<option value="">Choose</option>',
						'<option value="1">1</option>',
						'<option value="2">2</option>',
						'<option value="3">3</option>'
					].join("");
				});

				it("returns the value of the selected option", function() {
					this.select.options[1].selected = true;
					this.select.options.selectedIndex = 1;
					expect(this.formView.extractControlValue(this.select)).toEqual("1");
				});

				it("returns null when an option with no value is selected", function() {
					this.select.options[0].selected = true;
					this.select.options.selectedIndex = 0;
					expect(this.formView.extractControlValue(this.select)).toBeNull();
				});

				it("returns null for a disabled select box", function() {
					this.select.disabled = true;
					expect(this.formView.extractControlValue(this.select)).toBeNull();
				});
			});

			describe("select[multiple]", function() {
				beforeEach(function() {
					this.select = document.createElement("select");
					this.select.multiple = true;
					this.select.innerHTML = [
						'<option value="">Choose</option>',
						'<option value="1">1</option>',
						'<option value="2">2</option>',
						'<option value="3">3</option>'
					].join("");
				});

				it("returns an array of selected values", function() {
					this.select.options[1].selected = true;
					this.select.options[2].selected = true;
					var values = this.formView.extractControlValue(this.select);
					expect(values).toBeArray();
					expect(values.length).toEqual(2);
					expect(values[0]).toEqual("1");
					expect(values[1]).toEqual("2");
				});

				it("returns an empty array when nothing is selected", function() {
					var values = this.formView.extractControlValue(this.select);
					expect(values).toBeArray();
					expect(values.length).toEqual(0);
				});

				it("returns null for a disabled select box", function() {
					this.select.options[1].selected = true;
					this.select.options[2].selected = true;
					this.select.disabled = true;
					var values = this.formView.extractControlValue(this.select);
					expect(values).toBeNull();
				});

				it("does not return values for options with no value", function() {
					this.select.options[0].selected = true;
					this.select.options[1].selected = true;
					this.select.options[2].selected = true;
					var values = this.formView.extractControlValue(this.select);
					expect(values).toBeArray();
					expect(values.length).toEqual(2);
					expect(values[0]).toEqual("1");
					expect(values[1]).toEqual("2");
				});

				it("returns empty array if the only option selected has no value", function() {
					this.select.options[0].selected = true;
					var values = this.formView.extractControlValue(this.select);
					expect(values).toBeArray();
					expect(values.length).toEqual(0);
				});
			});
		});

		describe("getFormData", function() {
			it("returns an empty object when no form fields exist", function() {
				this.form.innerHTML = '<p>Non form fields only</p>';
				var data = this.formView.getFormData();
			});

			xit("returns an object of form field names and values as strings");
		});

	});

});