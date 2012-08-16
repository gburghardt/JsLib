BaseModel = Object.extend({

	self: {

		callbacks: {},

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

		newRecord: true,

		previouslyChanged: null,

		primaryKey: "id",

		subscribers: null,

		validAttributes: null,

		initialize: function(attributes) {
			this._attributes = {};
			this._changedAttributes = {};
			this.previouslyChanged = {};

			// Set up default event subscribers.
			//
			// attributes:changed - Triggered once after all attributes have been assigned, and
			//                      after all attribute key specific events have been triggered.
			//
			// attribute:<key>:changed - Triggered for a single attribute key.
			//
			// created - Triggered if this was a new record and was saved. This is triggered
			//           before the "saved" event.
			//
			// updated - Triggered if this was an existing record that got saved. This is
			//           triggered before the "save" event.
			//
			// destroyed - Triggered when this is destroyed, either on the server, on the client,
			//             or after being destroyed on the server AND on the client. The "save"
			//             event is not triggered.
			this.subscribers = {
				"attributes:changed": [],
				created: [],
				updated: [],
				destroyed: [],
				saved: []
			};

			this.applyModuleCallbacks("initialize", [attributes]);
			this.initAttributes();

			if (attributes) {
				this.attributes = attributes;
			}

			this.newRecord = !this._attributes[this.primaryKey];

			attributes = null;
		},

		initAttributes: function() {
			if (this.__proto__.attributesInitialized) {
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
			this.__proto__.attributesInitialized = true;
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

		publish: function(eventName) {
			if (!this.subscribers[eventName]) {
				return;
			}

			var i = 0, length = this.subscribers[eventName].length, subscriber;

			for (i; i < length; i++) {
				subscriber = this.subscribers[eventName][i];

				if (subscriber.instance) {
					if (typeof subscriber.callback === "string") {
						subscriber.instance[ subscriber.callback ](this);
					}
					else {
						subscriber.callback.call(subscriber.instance, this);
					}
				}
				else {
					subscriber.callback(this);
				}
			}

			subscriber = null;
		},

		save: function() {
			if (this.destroyed) {
				throw new Error("Cannot save record after it has been destroyed");
			}
			else if (this.newRecord) {
				this.newRecord = false;
				this.publish("created");
			}
			else {
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

		subscribe: function(eventName, instance, callback) {
			if (typeof instance === "function") {
				callback = instance;
				instance = null;
			}
			else if (callback === undefined) {
				throw new Error("A callback function or instance and callback/method name must be supplied in BaseModel#subscribe");
			}

			this.subscribers[eventName] = this.subscribers[eventName] || [];
			this.subscribers[eventName].push({
				instance: instance,
				callback: callback
			});
		},

		unsubscribe: function(eventName, instance, callback) {
			if (!this.subscribers[eventName]) {
				return;
			}
			else if (typeof instance === "function") {
				callback = instance;
				instance = null;
			}
			else if (callback === undefined) {
				throw new Error("A callback function or instance and callback/method name must be supplied in BaseModel#unsubscribe");
			}

			var i = this.subscribers[eventName].length, subscriber;

			while (i--) {
				subscriber = this.subscribers[eventName][i];

				if (subscriber.instance === instance && subscriber.callback === callback) {
					this.subscribers[eventName].splice(i, 1);
				}
			}

			instance = callback = subscriber = null;
		},

		valueIsEmpty: function(value) {
			return (value === undefined || value === null || String(value).replace(/\s+/g, "") === "") ? true : false;
		}

	}

});
