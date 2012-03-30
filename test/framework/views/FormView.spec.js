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

	describe("setControlValue", function() {
		describe("input - common", function() {
			var types = ["text", "hidden", "search", "tel", "url", "email"], i = 0, length = types.length;

			for (i; i < length; i++) {
				(function(type) {
					describe("input[type=" + type + "]", function() {
						beforeEach(function() {
							this.textfield = document.createElement("input");
							this.textfield.type = type;
						});
						
						it("sets the value when enabled", function() {
							this.formView.setControlValue(this.textfield, "test");
							expect(this.textfield.value).toEqual("test");
						});

						it("does not set the value when read-only", function() {
							this.textfield.readonly = true;
							this.formView.setControlValue(this.textfield, "test");
							expect(this.textfield.value).toEqual("");
						});

						it("does not set the value when disabled", function() {
							this.textfield.disabled = true;
							this.formView.setControlValue(this.textfield, "test");
							expect(this.textfield.value).toEqual("");
						});
					});
				})(types[i]);
			}
		});

		xit("input[type=datetime]");
		xit("input[type=date]");
		xit("input[type=month]");
		xit("input[type=week]");
		xit("input[type=time]");
		xit("input[type=datetime-local]");
		xit("input[type=range]");
		xit("input[type=color]");

		describe("input[type=number]", function() {
			beforeEach(function() {
				this.field = document.createElement("input");
				this.field.type = "number";
			});

			it("returns a number as a string", function() {
				this.formView.setControlValue(this.field, 34);
				expect(this.field.value).toEqual("34");
			});

			it("returns a NaN value as a string", function() {
				this.formView.setControlValue(this.field, NaN);
				expect(this.field.value).toEqual("NaN");
			});

			it("returns a non numeric value as a string", function() {
				this.formView.setControlValue(this.field, "abc");
				expect(this.field.value).toEqual("abc");
			});
		});

		describe("input[type=checkbox]", function() {
			beforeEach(function() {
				this.checkbox = document.createElement("input");
				this.checkbox.type = "checkbox";
				this.checkbox.value = "testing";
			});

			it("checks the checkbox when the value matches", function() {
				this.formView.setControlValue(this.checkbox, "testing");
				expect(this.checkbox.checked).toBeTrue();
			});

			it("unchecks the checkbox when the value does not match", function() {
				this.formView.setControlValue(this.checkbox, "foo");
				expect(this.checkbox.checked).toBeFalse();
			});

			it("does not check a read-only checkbox", function() {
				this.checkbox.readonly = true;
				this.formView.setControlValue(this.checkbox, "testing");
				expect(this.checkbox.checked).toBeFalse();
			});

			it("does not uncheck a read-only checkbox", function() {
				this.checkbox.checked = true;
				this.checkbox.readonly = true;
				this.formView.setControlValue(this.checkbox, "foo");
				expect(this.checkbox.checked).toBeTrue();
			});

			it("does not check a disabled checkbox", function() {
				this.checkbox.disabled = true;
				this.formView.setControlValue(this.checkbox, "testing");
				expect(this.checkbox.checked).toBeFalse();
			});

			it("does not uncheck a disabled checkbox", function() {
				this.checkbox.checked = true;
				this.checkbox.disabled = true;
				this.formView.setControlValue(this.checkbox, "foo");
				expect(this.checkbox.checked).toBeTrue();
			});
		});

		describe("input[type=radio]", function() {
			beforeEach(function() {
				this.radio = document.createElement("input");
				this.radio.type = "radio";
				this.radio.value = "test";
			});

			it("checks the button when the value matches", function() {
				this.formView.setControlValue(this.radio, "test");
				expect(this.radio.checked).toBeTrue();
			});

			it("unchecks the button when the value doesn't match", function() {
				this.formView.setControlValue(this.radio, "foo");
				expect(this.radio.checked).toBeFalse();
			});

			describe("when read only", function() {
				beforeEach(function() {
					this.radio.readonly = true;
				});

				it("doesn't check a read only button", function() {
					this.formView.setControlValue(this.radio, "test");
					expect(this.radio.checked).toBeFalse();
				});

				it("doesn't uncheck a read only button", function() {
					this.radio.checked = true;
					this.formView.setControlValue(this.radio, "foo");
					expect(this.radio.checked).toBeTrue();
				});
			});

			describe("when disabled", function() {
				beforeEach(function() {
					this.radio.disabled = true;
				});
				
				it("doesn't check a disabled button", function() {
					this.formView.setControlValue(this.radio, "test");
					expect(this.radio.checked).toBeFalse();
				});

				it("doesn't uncheck a disabled button", function() {
					this.radio.checked = true;
					this.formView.setControlValue(this.radio, "foo");
					expect(this.radio.checked).toBeTrue();
				});
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

			it("sets the value, selected index, and selects the option when the value matches", function() {
				this.formView.setControlValue(this.select, "1");
				expect(this.select.value).toEqual("1");
				expect(this.select.options.selectedIndex).toEqual(1);
				expect(this.select.options[1].selected).toBeTrue();
			});

			it("selects the first option with an empty value when the value doesn't match any option", function() {
				this.formView.setControlValue(this.select, "bad-value");
				expect(this.select.value).toEqual("");
				expect(this.select.options.selectedIndex).toEqual(0);
				expect(this.select.options[0].selected).toBeTrue();
			});

			describe("when readonly", function() {
				beforeEach(function() {
					this.select.options[1].selected = true;
					this.select.options.selectedIndex = 1;
					this.select.readonly = true;
				});

				it("does not select anything if the value matches one option", function() {
					this.formView.setControlValue(this.select, "2");
					expect(this.select.value).toEqual("1");
					expect(this.select.options.selectedIndex).toEqual(1);
					expect(this.select.options[1].selected).toBeTrue();
				});

				it("does not deselect anything if the value matches nothing", function() {
					this.formView.setControlValue(this.select, "bad-value");
					expect(this.select.value).toEqual("1");
					expect(this.select.options.selectedIndex).toEqual(1);
					expect(this.select.options[1].selected).toBeTrue();
				});
			});

			describe("when disabled", function() {
				beforeEach(function() {
					this.select.options[1].selected = true;
					this.select.options.selectedIndex = 1;
					this.select.disabled = true;
				});

				it("does not select anything if the value matches one option", function() {
					this.formView.setControlValue(this.select, "2");
					expect(this.select.value).toEqual("1");
					expect(this.select.options.selectedIndex).toEqual(1);
					expect(this.select.options[1].selected).toBeTrue();
				});

				it("does not deselect anything if the value matches nothing", function() {
					this.formView.setControlValue(this.select, "bad-value");
					expect(this.select.value).toEqual("1");
					expect(this.select.options.selectedIndex).toEqual(1);
					expect(this.select.options[1].selected).toBeTrue();
				});
			});
		});

		describe("select[multiple]", function() {
			beforeEach(function() {
				this.select = document.createElement("select");
				this.select.multiple = true;
				this.select.innerHTML = [
					'<option value="1">1</option>',
					'<option value="2">2</option>',
					'<option value="3">3</option>'
				].join("");
			});

			it("selects multiple options when passed an array of values", function() {
				var values = ['1', '2'];
				this.formView.setControlValue(this.select, values);
				expect(this.select.options[0].selected).toBeTrue();
				expect(this.select.options[1].selected).toBeTrue();
				expect(this.select.options[2].selected).toBeFalse();
			});

			it("selects a single option when not passed an array", function() {
				this.formView.setControlValue(this.select, "1");
				expect(this.select.options[0].selected).toBeTrue();
				expect(this.select.options[1].selected).toBeFalse();
				expect(this.select.options[2].selected).toBeFalse();
			});

			it("deselects options not included in the array of values", function() {
				var values = ['1', '2'];
				this.select.options[2].selected = true;
				this.formView.setControlValue(this.select, values);
				expect(this.select.options[0].selected).toBeTrue();
				expect(this.select.options[1].selected).toBeTrue();
				expect(this.select.options[2].selected).toBeFalse();
			});

			it("deselects all options when passed an empty array", function() {
				this.select.options[0].selected = true;
				this.select.options[1].selected = true;
				this.select.options[2].selected = true;
				this.formView.setControlValue(this.select, []);
				expect(this.select.options[0].selected).toBeFalse();
				expect(this.select.options[1].selected).toBeFalse();
				expect(this.select.options[2].selected).toBeFalse();
			});

			it("deselects all options when passed null", function() {
				this.select.options[0].selected = true;
				this.select.options[1].selected = true;
				this.select.options[2].selected = true;
				this.formView.setControlValue(this.select, null);
				expect(this.select.options[0].selected).toBeFalse();
				expect(this.select.options[1].selected).toBeFalse();
				expect(this.select.options[2].selected).toBeFalse();
			});
		});

		describe("textarea", function() {
			beforeEach(function() {
				this.textarea = document.createElement("textarea");
				this.textarea.cols = 60;
				this.textarea.rows = 8;
				this.textarea.value = "testing";
			});

			it("sets the value", function() {
				this.formView.setControlValue(this.textarea, "foo");
				expect(this.textarea.value).toEqual("foo");
			});

			it("does not set the value when read-only", function() {
				this.textarea.readonly = true;
				this.formView.setControlValue(this.textarea, "foo");
				expect(this.textarea.value).toEqual("testing");
			});

			it("does not set the value when disabled", function() {
				this.textarea.disabled = true;
				this.formView.setControlValue(this.textarea, "foo");
				expect(this.textarea.value).toEqual("testing");
			});
		});
	});

});