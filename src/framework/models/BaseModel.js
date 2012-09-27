BaseModel = Object.extend({

	self: {

		callbacks: {},

		guidIndex: 0,

		instances: {},

		applyModuleCallbacks: function(instance, name, args) {
			args = args || [];
			var result, results = [], i, length, callbacks = this.callbacks[name];

			if (callbacks) {
				for (i = 0, length = callbacks.length; i < length; i++) {
					result = callbacks[i].apply(instance, args);

					if (result !== undefined) {
						results.push(result);
					}
				}
			}

			instance = args = result = null;
			return results;
		},

		extend: function(descriptor) {
			descriptor = descriptor || {};

			if (descriptor.callbacks) {
				this.extendCallbacks(descriptor.callbacks);
			}

			// New class should manage its own instances
			descriptor.self = descriptor.self || {};
			descriptor.self.instances = {};
			descriptor.self.attributesInitialized = false;

			return Function.prototype.extend.call(this, descriptor);
		},

		extendCallbacks: function(callbacks) {
			var key;

			for (key in callbacks) {
				if (callbacks.hasOwnProperty(key)) {
					this.callbacks[key] = this.callbacks[key] || [];
					this.callbacks[key].push(callbacks[key]);
				}
			}

			callbacks = null;
		},

		find: function(id) {
			return this.instances[id] || null;
		},

		include: function(descriptor) {
			if (descriptor.callbacks) {
				this.extendCallbacks(descriptor.callbacks);
			}

			Function.prototype.include.call(this, descriptor);
			descriptor = null;
		}

	},

	prototype: {

		_attributes: null,

		_changedAttributes: null,

		destroyed: false,

		guid: null,

		newRecord: true,

		previouslyChanged: null,

		primaryKey: "id",

		subscribers: null,

		validAttributes: null,

		initialize: function(attributes) {
			this.guid = BaseModel.guidIndex++;
			this._attributes = {};
			this._changedAttributes = {};
			this.previouslyChanged = {};
			this.applyModuleCallbacks("initialize", [attributes]);
			this.initAttributes();

			if (attributes) {
				this.attributes = attributes;
			}

			this.newRecord = !this._attributes[this.primaryKey];

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

			this.validAttributes = this.validAttributes || [];

			var i = 0, attrs = this.validAttributes, length, key;

			if (attrs.indexOf(this.primaryKey) < 0) {
				attrs.push(this.primaryKey);
			}

			for (i, length = attrs.length; i < length; ++i) {
				key = attrs[i];

				try {
					Object.defineProperty(this.__proto__, key, {
						get: this.createGetter(key),
						set: this.createSetter(key),
						enumerable: true
					});
				}
				catch (error) {
					// a getter/setter has already been defined, fail silently
				}
			}

			this.applyModuleCallbacks("initAttributes");
			this.constructor.attributesInitialized = true;
		},

		applyModuleCallbacks: function(callbackName, args) {
			return BaseModel.applyModuleCallbacks(this, callbackName, args);
		},

		getAttributes: function() {
			return this._attributes;
		},

		setAttributes: function(attrs) {
			var publishChangedEvent = false;

			this.applyModuleCallbacks("attributes", [attrs]);

			for (var key in attrs) {
				if (attrs.hasOwnProperty(key)) {
					this.setAttribute(key, attrs[key]);

					if (this.previouslyChanged[key]) {
						publishChangedEvent = true;
					}
				}
			}

			if (publishChangedEvent) {
				this.publish("attributes:changed");
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
				this.setAttribute(key, newValue)

				if (this.previouslyChanged[key]) {
					this.publish("attributes:changed");
				}
			};
		},

		destroy: function() {
			if (!this.destroyed) {
				this.applyModuleCallbacks("destroy", []);
				this.destroyed = true;
				this.publish("destroyed");
			}
		},

		getAttribute: function(key) {
			return (this._attributes[key] === undefined) ? null : this._attributes[key];
		},

		isValidAttributeKey: function(key) {
			return new RegExp("(^|\\s+)" + key + "(\\s+|$)").test(this.validAttributes.join(" "));
		},

		save: function(context, callbacks) {
			// TODO: Actually save this to something
			if (this.destroyed) {
				callbacks.invalid.call(context, {base: "has been deleted"});
			}
			else if (!this.validate()) {
				callbacks.invalid.call(context, this.getErrorMessages());
			}
			else if (this.newRecord) {
				this.applyModuleCallbacks("create");
				this.newRecord = false;
				callbacks.saved.call(context);
				this.publish("created");
			}
			else {
				this.applyModuleCallbacks("update");
				callbacks.saved.call(context);
				this.publish("updated");
			}
		},

		setAttribute: function(key, value) {
			if (this.isValidAttributeKey(key) && value !== this._attributes[key] && this._attributes[key] !== undefined) {
				this._changedAttributes[key] = this._attributes[key];
				this._attributes[key] = value;
				this.previouslyChanged[key] = true;
				this.publish("attribute:" + key + ":changed");
			}
			else {
				this._attributes[key] = value;
			}

			if (key == this.primaryKey && !this.previouslyChanged[key]) {
				this.newRecord = false;
			}
		},

		valueIsEmpty: function(value) {
			return (value === undefined || value === null || String(value).replace(/\s+/g, "") === "") ? true : false;
		}

	}

});
