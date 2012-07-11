function BaseModel(attributes) {
	this.constructor(attributes);
}

BaseModel.prototype = {

	_attributes: null,

	_changedAttributes: null,

	destroyed: false,

	newRecord: true,

	previouslyChanged: null,

	primaryKey: "id",

	subscribers: null,

	validAttributes: null,

	constructor: function(attributes) {
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

		this.applyModuleCallbacks("__constructor", [attributes]);
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

	get attributes() {
		return this._attributes;
	},

	set attributes(attrs) {
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

	get changedAttributes() {
		return this._changedAttributes;
	},

	set changedAttributes(o) {
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

};

BaseModel.modules = {};

BaseModel.moduleCallbacks = {};

BaseModel.includeModule = function(moduleName, forceOverride, module) {
	if (this.modules[moduleName]) {
		return;
	}

	if (forceOverride && !module) {
		module = forceOverride;
		forceOverride = false;
	}

	var key;

	for (key in module.prototype) {
		if (module.prototype.hasOwnProperty(key) && (!this.prototype.hasOwnProperty(key) || forceOverride)) {
			this.prototype[key] = module.prototype[key];
		}
	}

	if (module.callbacks) {
		for (key in module.callbacks) {
			if (module.callbacks.hasOwnProperty(key)) {
				this.moduleCallbacks[key] = this.moduleCallbacks[key] || [];
				this.moduleCallbacks[key].push(module.callbacks[key]);
			}
		}
	}

	this.modules[moduleName] = module;
	module = null;
};

BaseModel.extendModule = function(moduleName, forceOverride, extensions) {
	if (forceOverride && !extensions) {
		extensions = forceOverride;
		forceOverride = false;
	}

	if (!this.modules[moduleName]) {
		throw new Error("Module " + moduleName + " has not been included. Cannot extend this module.");
	}

	var module = this.modules[moduleName];

	if (extensions.prototype) {
		this.extendModulePrototype(module, extensions.prototype, forceOverride);
	}

	if (extensions.callbacks) {
		this.extendModuleCallbacks(module, extensions.callbacks);
	}

	module = null;
};

BaseModel.extendModulePrototype = function(module, prototype, forceOverride) {
	var key;

	for (key in prototype) {
		if (prototype.hasOwnProperty(key) && (!this.prototype.hasOwnProperty(key) || forceOverride)) {
			this.prototype[key] = prototype[key];
		}
	}

	module = prototype = null;
};

BaseModel.extendModuleCallbacks = function(module, callbacks) {
	var key;

	for (key in callbacks) {
		if (callbacks.hasOwnProperty(key)) {
			this.moduleCallbacks[key] = this.moduleCallbacks[key] || [];
			this.moduleCallbacks[key].push(callbacks[key]);
		}
	}

	module = callbacks = null;
};

BaseModel.applyModuleCallbacks = function(instance, callbackName, args) {
	args = args || [];
	var result, results = [], i, length, callbacks = this.moduleCallbacks[callbackName];

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
};
