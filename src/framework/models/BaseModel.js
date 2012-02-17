function BaseModel(attributes) {
	this.constructor(attributes);
}

BaseModel.prototype = {

	_attributes: null,
	_changedAttributes: null,
	_validAttributes: null,

	constructor: function(attributes) {
		this._attributes = {};
		this._changedAttributes = {};
		this.initAttributes();

		if (attributes) {
			this.attributes = attributes;
		}

		attributes = null;
	},

	initAttributes: function() {
		if (this.__proto__.attributesInitialized || !this._validAttributes) {
			return;
		}

		var i = 0, attrs = this._validAttributes, length = attrs.length, key;

		for (i; i < length; ++i) {
			key = attrs[i];

			try {
				Object.defineProperty(this.__proto__, key, {
					get: this.createGetter(key),
					set: this.createSetter(key)
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
				if (this.isValidAttributeKey(key)) {
					this._changedAttributes[key] = this._attributes[key];
					this._attributes[key] = attrs[key];
				}
				else {
					throw new Error("Failed to assign invalid attribute " + key);
				}
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
			if (this._attributes[key] === undefined) {
				return null;
			}
			else {
				return this._attributes[key];
			}
		};
	},

	createSetter: function(key) {
		return function(newValue) {
			if (!this.valueIsEmpty(this.attributes[key]) && newValue !== this.attributes[key]) {
				this._changedAttributes[key] = this._attributes[key];
			}

			this._attributes[key] = newValue;
		};
	},

	isValidAttributeKey: function(key) {
		return new RegExp("(^|\\s+)" + key + "(\\s+|$)").test(this._validAttributes.join(" "));
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
