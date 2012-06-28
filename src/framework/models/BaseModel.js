function BaseModel(attributes) {
	this.constructor(attributes);
}

BaseModel.prototype = {

	_attributes: null,
	_changedAttributes: null,
	validAttributes: null,

	primaryKey: "id",

	constructor: function(attributes) {
		this._attributes = {};
		this._changedAttributes = {};
		this.applyModuleCallbacks("__constructor", [attributes]);
		this.initAttributes();

		if (attributes) {
			this.attributes = attributes;
		}

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
		this.applyModuleCallbacks("attributes", [attrs]);

		for (var key in attrs) {
			if (attrs.hasOwnProperty(key)) {
				this.setAttribute(key, attrs[key]);
			}
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
			this.setAttribute(key, newValue);
		};
	},

	getAttribute: function(key) {
		return (this._attributes[key] === undefined) ? null : this._attributes[key];
	},

	isValidAttributeKey: function(key) {
		return new RegExp("(^|\\s+)" + key + "(\\s+|$)").test(this.validAttributes.join(" "));
	},

	setAttribute: function(key, value) {
		if (this.isValidAttributeKey(key) && value !== this._attributes[key] && this._attributes[key] !== undefined) {
			this._changedAttributes[key] = this._attributes[key];
		}

		this._attributes[key] = value;
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
