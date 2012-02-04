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

    if (typeof attrs === "string") {
      attrs = attrs.split(/\s+/g);
    }
    else {
      this._validAttributes = attrs.join(" ");
    }

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

		this.__proto__.attributesInitialized = true;
	},

	get attributes() {
		return this._attributes;
	},

	set attributes(o) {
		for (var key in o) {
			if (o.hasOwnProperty(key)) {
				if (this.isValidAttributeKey(key)) {
					this._changedAttributes[key] = this._attributes[key];
					this._attributes[key] = o[key];
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
			return this._attributes[key];
		};
	},

	createSetter: function(key) {
		return function(newValue) {
			this._changedAttributes[key] = this._attributes[key];
			this._attributes[key] = newValue;
		};
	},

	isValidAttributeKey: function(key) {
		return new RegExp("(^|\\s+)" + key + "(\\s+|$)").test(this._validAttributes);
	}

};

if (!Object.defineProperty) {
	if ( ({}).__defineGetter__ ) {
		Object.defineProperty = function(obj, property, descriptor) {
			if (descriptor.readable) {
				obj.__defineGetter__(property, descriptor.get);
			}

			if (descriptor.writable) {
				obj.__defineSetter(property, descriptor.set);
			}

			if (descriptor.value !== undefined) {
				obj[property] = descriptor.value;
			}
		};
	}
	else {
		throw new Error("This browser is incompatible with BaseModel (" + navigator.userAgent + ").");
	}
}
