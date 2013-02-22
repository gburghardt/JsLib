BaseView.Forms = {
	prototype: {
		currentData: null,

		fieldErrorNodeName: "div",

		model: null,

		getFormData: function(fromCache) {
			if (!fromCache || !this.currentData) {
				var inputs = this.element.getElementsByTagName("input");
				var selects = this.element.getElementsByTagName("select");
				var textareas = this.element.getElementsByTagName("textarea");

				this.currentData = {};
				this.extractFormControlsData(inputs, this.currentData);
				this.extractFormControlsData(selects, this.currentData);
				this.extractFormControlsData(textareas, this.currentData);

				inputs = selects = textareas = null;
			}

			return this.currentData;
		},

		extractControlValue: function(control) {
			var nodeName = control.nodeName.toLowerCase(),
					value = null, i, length
			;

			if (!control.disabled) {
				if (nodeName === "input") {
					if (control.type === "checkbox" || control.type === "radio") {
						if (control.checked) {
							value = control.value;
						}
					}
					else {
						value = control.value;
					}
				}
				else if (nodeName === "select") {
					if (control.multiple) {
						value = [];

						for (i = 0, length = control.options.length; i < length; ++i) {
							if (!control.options[i].disabled && control.options[i].selected && control.options[i].value) {
								value.push(control.options[i].value);
							}
						}
					}
					else {
						value = control.value;
					}
				}
				else {
					value = control.value;
				}
			}

			return (value === "") ? null : value;
		},

		extractControlValues: function(controls) {
			var i = 0, length = controls.length, values = [], value;

			for (i; i < length; ++i) {
				value = this.extractControlValue(control);

				if (value !== null) {
					values.push(value);
				}
			}

			return values;
		},

		extractFormControlsData: function(controls, data) {
			var name;
			var i = 0;
			var length = controls.length;
			var value;

			for (i; i < length; i++) {
				name = controls[i].name;
				value = this.extractControlValue(controls[i]);

				if (value === null) {
					continue;
				}
				else if (data.hasOwnProperty(name)) {
					if (data[name] instanceof Array) {
						data[name].push(value);
					}
					else {
						data[name] = [data[name], value];
					}
				}
				else {
					data[name] = value;
				}
			}

			controls = null;

			return data;
		},

		getControlsByName: function(name) {
			var nodes = this.element.getElementsByTagName("*"), i = 0, length = nodes.length, controls = [];

			for (i; i < length; ++i) {
				if (nodes[i].name === name) {
					controls.push(nodes[i]);
				}
			}

			nodes = null;
			return controls;
		},

		hideFieldErrors: function() {
			var errorElements = this.element.querySelectorAll(".form-field-error");
			var formErrorElement = this.element.querySelector(".form-errors");
			var i = 0, length = errorElements.length;

			for (i; i < length; i++) {
				errorElements[i].style.display = "none";
			}

			if (formErrorElement) {
				formErrorElement.style.display = "none";
			}

			errorElements = formErrorElement = null;
		},

		setFieldErrors: function(errors) {
			var errorElement = this.element.querySelector(".form-errors");
			var errorsMarkup, key, control;

			this.hideFieldErrors();

			if (errorElement) {
				errorsMarkup = [];
				errorsMarkup.push('<ul>');

				for (key in errors) {
					if (errors.hasOwnProperty(key)) {
						errorsMarkup.push('<li>' + errors[key].capitalize() + '</li>');
					}
				}

				errorsMarkup.push('</ul>');
				errorElement.innerHTML = errorsMarkup.join("");
				errorElement.style.display = "";
				errorElement = null;
			}
			else {
				errorsMarkup = "";

				for (key in errors) {
					if (errors.hasOwnProperty(key)) {
						errorElement = this.element.querySelector(".form-field-error-" + key);

						if (!errorElement) {
							errorElement = this.ownerDocument.createElement(this.fieldErrorNodeName);
							errorElement.className = "form-field-error-" + key + " form-field-error";
							errorElement.style.display = "none";
							control = this.getControlsByName(key)[0];
							control.parentNode.insertBefore(errorElement, control);
						}

						errorElement.innerHTML = errors[key].capitalize();
						errorElement.style.display = "";
					}
				}
			}
		}

	}
};

BaseView.include(BaseView.Forms);
