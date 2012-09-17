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

		initialize: function(id, templateName) {
			BaseView.prototype.initialize.call(this, id);
			this.template = Template.find(templateName);
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

		getFormData: function(force) {
			if (force || !this.currentData) {
				var inputs = this.rootNode.getElementsByTagName("input");
				var selects = this.rootNode.getElementsByTagName("select");
				var textareas = this.rootNode.getElementsByTagName("textarea");

				this.currentData = {};
				this.extractFormControlsData(inputs, this.currentData);
				this.extractFormControlsData(selects, this.currentData);
				this.extractFormControlsData(textareas, this.currentData);

				inputs = selects = textareas = null;
			}

			return this.currentData;
		},

		getLabelValue: function(idSuffix) {
			return this.getNode(idSuffix).innerHTML;
		},

		render: function(model) {
			this.model = model;
			this.rootNode.innerHTML = this.template.render(this.model);
			this.model.subscribe("attributes:changed", this, "handleAttributesChanged");
			return this;
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

		setFieldErrors: function(errors) {
			// TODO: Write me
		},

		setLabelValue: function(idSuffix, value) {
			return this.getNode(idSuffix).innerHTML = value;
		},

// Access: Protected

		currentData: null,

		model: null,

		template: null,

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
			var nodes = this.rootNode.getElementsByTagName("*"), i = 0, length = nodes.length, controls = [];

			for (i; i < length; ++i) {
				if (nodes[i].name === name) {
					controls.push(nodes[i]);
				}
			}

			nodes = null;
			return controls;
		},

		handleAttributesChanged: function(model) {
			console.info("FormView#handleAttributesChanged");
		}

	}

});
 