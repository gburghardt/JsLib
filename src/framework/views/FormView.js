/*

class FormView extends BaseView
	Public:
		getControlValue(String name) returns String or null
		getLabelValue(String idSuffix) returns String
		setControlValue(String name, String value)
		setLabelValue(String idSuffix, String value)
	Protected:
		extractControlValue(HTMLElement control) returns String or Array[String] or null
		extractControlValues(HTMLCollection | Array controls) returns Array
		getControlsByName(String name) returns HTMLCollection
	Private:

*/
function FormView() {

// Access: Public

	this.getControlValue = function(name) {
		var controls = this.getControlsByName(name);

		if (controls.length === 0) {
			return null;
		}
		else if (controls.length === 1) {
			return this.extractControlValue(control);
		}
		else {
			return this.extractControlValues(controls);
		}
	};

	this.getLabelValue = function(idSuffix) {
		return this.getNode(idSuffix).innerHTML;
	};

	this.setControlValue = function(name, value) {
		var controls = this.getControlsByName(name);

		if (value instanceof Array) {
			
		}
		else {
			controls[0].value = value;
		}
	};

	this.setLabelValue = function(idSuffix, value) {
		return this.getNode(idSuffix).innerHTML = value;
	};

// Access: Protected

	this.extractControlValue = function(control) {
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
						if (!control.options[i].disabled && control.options[i].selected) {
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

		return value;
	};

	this.extractControlValues = function(controls) {
		var i = 0, length = controls.length, values = [], value;

		for (i; i < length; ++i) {
			value = this.extractControlValue(control);

			if (value !== null) {
				values.push(value);
			}
		}

		return values;
	};

	this.getControlsByName = function(name) {
		return this.querySelectorAll("[name=" + name + "]");
	};

	this.constructor.apply(this, arguments);

}

FormView.prototype = new BaseView();