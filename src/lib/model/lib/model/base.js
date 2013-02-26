'@import Function';
'@import Object.Utils';
'@import Events.Callbacks';
'@import String';
'@import Model';

Model.Base = Object.extend({

	includes: [
		Object.Utils,
		Events.ApplicationEvents,
		Events.Callbacks
	],

	self: {

		attributesInitialized: false,

		extend: function(descriptor) {
			descriptor = descriptor || {};
			// New class should manage its own instances
			descriptor.self = descriptor.self || {};
			descriptor.self.instances = {};
			descriptor.self.attributesInitialized = false;

			return Function.prototype.extend.call(this, descriptor);
		}

	},

	prototype: {

		_attributes: null,

		_changedAttributes: null,

		guid: null,

		newRecord: true,

		previouslyChanged: null,

		primaryKey: "id",

		schema: null,

		initialize: function(attributes) {
			this._attributes = {};
			this.previouslyChanged = {};
			this._changedAttributes = {};
			this.initCallbacks();
			this.initAttributes();
			this.attributes = attributes;
			this.newRecord = !this.getPrimaryKey();
			this.notify("afterInitialize");

			attributes = null;
		},

		initAttributes: function() {
			if (this.constructor.attributesInitialized) {
				return;
			}

			Object.defineProperty(this.__proto__, "attributes", {
				get: this.getAttributes,
				set: this.setAttributes,
				enumerable: true
			});

			Object.defineProperty(this.__proto__, "changedAttributes", {
				get: this.getChangedAttributes,
				set: this.setChangedAttributes,
				enumerable: true
			});

			var compiledSchema = this.mergePropertyFromPrototypeChain("schema");

			if (!compiledSchema.hasOwnProperty(this.primaryKey)) {
				compiledSchema[this.primaryKey] = 'Number';
			}

			for (var key in compiledSchema) {
				if (compiledSchema.hasOwnProperty(key) && !this.__proto__.hasOwnProperty(key)) {
					Object.defineProperty(this.__proto__, key, {
						get: this.createGetter(key),
						set: this.createSetter(key),
						enumerable: true
					});
				}
			}

			this.__proto__.compiledSchema = compiledSchema;
			this.constructor.attributesInitialized = true;
			this.notify("attributes.initialized");
		},

		getAttributes: function() {
			return this._attributes;
		},

		setAttributes: function(attrs) {
			var publishChangedEvent = false;
			var keysChanged = [];

			for (var key in attrs) {
				if (attrs.hasOwnProperty(key)) {
					keysChanged.push(key);
					this.setAttribute(key, attrs[key]);

					if (this.previouslyChanged[key]) {
						publishChangedEvent = true;
					}
				}
			}

			if (publishChangedEvent) {
				this.publish("attributes.changed", { attributes: keysChanged });
			}
		},

		getChangedAttributes: function() {
			return this._changedAttributes;
		},

		setChangedAttributes: function(o) {
			for (var key in o) {
				if (o.hasOwnProperty(key)) {
					this._changedAttributes[key] = o[key];
				}
			}
		},

		createGetter: function(key) {
			return function() {
				return this.getAttribute(key);
			};
		},

		createSetter: function(key) {
			return function(newValue) {
				this.setAttribute(key, newValue);

				if (this.previouslyChanged[key]) {
					this.publish("attributes.changed", { attributes: [key] });
				}
			};
		},

		getAttribute: function(key) {
			return (this._attributes[key] === undefined) ? null : this._attributes[key];
		},

		getPrimaryKey: function() {
			return this._attributes[this.primaryKey];
		},

		convertAttributeValue: function(attributeClass, value) {
			// TODO: Support date formats
			if (value === null || value === undefined) {
				return null;
			}

			switch (attributeClass) {
			case "Number":
				return this.valueIsEmpty(value) ? null : Number(value);
				break;

			case "Boolean":
				return (/^(true|1)$/i).test(value);
				break;

			case "Date":
				return (value instanceof Date) ? value : new Date(value);

			default:
				return String(value);
				break;
			}
		},

		setAttribute: function(key, value) {
			if (this.isValidAttributeKey(key) && value !== this._attributes[key] && this._attributes[key] !== undefined) {
				this._changedAttributes[key] = this._attributes[key];
				this._attributes[key] = this.convertAttributeValue(this.compiledSchema[key], value);
				this.previouslyChanged[key] = true;
				this.publish("attribute." + key + ".changed");
			}
			else {
				this._attributes[key] = this.convertAttributeValue(this.compiledSchema[key], value);
			}

			if (key == this.primaryKey && !this.previouslyChanged[key]) {
				this.newRecord = false;
			}
		},

		isValidAttributeKey: function(key) {
			return this.compiledSchema.hasOwnProperty(key);
		},

		valueIsEmpty: function(value) {
			return (value === undefined || value === null || (/^\s*$/).test(value)) ? true : false;
		}

	}

});
