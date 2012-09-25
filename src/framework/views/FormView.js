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
FormView = BaseView.extend({

	prototype: {

// Access: Public

		initialize: function(rootNode, delegate, templateName) {
			BaseView.prototype.initialize.call(this, rootNode, delegate);

			if (templateName) {
				this.templateName = templateName;
			}

			rootNode = delegate = null;
		},

		getControlValue: function(name) {
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
		},

		getDelegatorEventTypes: function() {
			return ["click", "submit", "change"];
		},

		getLabelValue: function(idSuffix) {
			return this.getNode(idSuffix).innerHTML;
		},

		setControlValue: function(control, value) {
			var i, length;

			if (control.disabled || control.readonly) {
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
		},

		setLabelValue: function(idSuffix, value) {
			return this.getNode(idSuffix).innerHTML = value;
		},

// Access: Protected

		template: null,

	}

});
 