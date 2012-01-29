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

	this.setControlValue = function(control, value) {
		var i, length;

		if (control.disabled || control.getAttribute("data-control-disabled") || control.readonly || control.getAttribute("data-control-readonly")) {
			return;
		}

		if (control.nodeName === "INPUT") {
			if (control.type === "checkbox" || control.type === "radio") {
				control.checked = (control.value === value);
			}
			else {
				control.value = value;
			}
		}
		else if (control.nodeName === "SELECT") {
			if (control.multiple) {
				if ( !(value instanceof Array) ) {
					value = [value];
				}

				for (i = 0, length = control.options.length; i < length; ++i) {
					control.options[i].selected = (value.indexOf(control.options[i].value) > -1) ? true : false;
				}
			}
			else {
				for (i = 0, length = control.options.length; i < length; ++i) {
					if (control.options[i].value === value) {
						control.options[i].selected = true;
					}
				}

				control.value = value;
			}
		}
		else if (control.nodeName === "TEXTAREA") {
			control.value = value;
		}
		else {
			control.setAttribute("data-control-value", value);
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
		var nodes = this.rootNode.getElementsByTagName("*"), i = 0, length = nodes.length, controls = [];

		for (i; i < length; ++i) {
			if (nodes[i].name === name) {
				controls.push(nodes[i]);
			}
		}

		nodes = null;
		return controls;
	};

	this.constructor.apply(this, arguments);
}

FormView.prototype = new BaseView();