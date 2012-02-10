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
		this.errors = {};
		this.initAttributes();
		var _valid = null;

		if (attributes) {
			this.attributes = attributes;
		}

		Object.defineProperty(this, "valid", {
			get: function() {
				return _valid;
			},
			set: function(valid) {
				_valid = valid;

				if (_valid !== false) {
					this.errors = {};
				}
			}
		});

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

		this.__proto__.attributesInitialized = true;
	},

	addError: function(key, message) {
		this.errors[key] = this.errors[key] || [];
		this.errors[key].push(message);
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
			if (!this.valueIsEmpty(this.attributes[key]) && newValue !== this.attributes[key]) {
				this._changedAttributes[key] = this._attributes[key];
			}

			this._attributes[key] = newValue;
		};
	},

	hasErrors: function() {
		return !this.valid;
	},

	isValidAttributeKey: function(key) {
		return new RegExp("(^|\\s+)" + key + "(\\s+|$)").test(this._validAttributes.join(" "));
	},

	validate: function() {
		this.valid = null;
		this.validateRequiredAttributes();
		this.validateAttributeDataTypes();
		this.validateAttributeLengths();
		this.validateAttributeFormats();

		return this.valid;
	},

	validateRequiredAttributes: function() {
		if (!this.requires || this.valid === false) {
			return;
		}

		var key, i = 0, length = this.requires.length;

		for (i; i < length; i++) {
			key = this.requires[i];

			if (this.valueIsEmpty(this.attributes[key])) {
				this.addError(key, "is required");
			}
		}
	},

	validateAttributeDataTypes: function() {
		if (!this.validatesNumeric || this.valid === false) {
			return;
		}

		var key, type, i = 0, length = this.validatesNumeric.length;

		this.valid = true;

		for (i; i < length; i++) {
			key = this.validatesNumeric[i];
			type = typeof this.attributes[key];

			if (!this.valueIsEmpty(this.attributes[key]) && !this.valueIsNumeric(this.attributes[key])) {
				this.addError(key, "must be a number");
				this.valid = false;
			}
		}
	},

	validateAttributeLengths: function() {
		
	},

	validateAttributeFormats: function() {
		
	},

	valueIsEmpty: function(value) {
		return (value === undefined || value === null || String(value).replace(/\s+/g, "") === "") ? true : false;
	},

	valueIsNumeric: function(value) {
		return (/^[-.\d]+$/).test(String(value)) && !isNaN(value);
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
