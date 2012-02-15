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

	convertKeyToWords: function(key) {
		key = key.replace(/_/g, " ").replace(/[A-Z]+/g, function(match, index, wholeString) {
			if (match.length > 1) {
				return (index === 0) ? match : " " + match;
			}
			else {
				return (index === 0) ? match.toLowerCase() : " " + match.toLowerCase();
			}
		});

		return key;
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

	escapeHTML: function(x) {
		return String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	},

	getErrorMessage: function(key) {
		var message = "", words;

		if (this.errors[key]) {
			words = this.convertKeyToWords(key);
			message = words + " " + this.errors[key].join("\n" + words + " ");
		}

		return message;
	},

	getErrorMessages: function() {
		var errorMessages = {}, key;

		if (this.hasErrors()) {
			for (key in this.errors) {
				if (this.errors.hasOwnProperty(key)) {
					errorMessages[key] = this.getErrorMessage(key);
				}
			}
		}

		return errorMessages;
	},

	hasErrors: function() {
		return !this.valid;
	},

	isValidAttributeKey: function(key) {
		return new RegExp("(^|\\s+)" + key + "(\\s+|$)").test(this._validAttributes.join(" "));
	},

	serialize: function(type, options) {
		type = type || "queryString";
		options = options || {};
		var x = "";

		switch (type) {
			case "xml":
				x = this.toXML(options);
				break;
			case "json":
				x = this.toJSON(options);
				break;
			default:
				x = this.toQueryString(options);
				break;
		}

		return x;
	},

	toJSON: function(options) {
		options = options || {};
		var key, json = "";

		if (options.rootElement) {
			json += '{"' + options.rootElement + '":';
		}

		json += JSON.stringify(this.attributes);

		if (options.rootElement) {
			json += '}';
		}

		return json;
	},

	toQueryString: function(options) {
		options = options || {};
		var attrs = this.attributes, key, queryString = [];

		if (options.rootElement) {
			for (key in attrs) {
				if (attrs.hasOwnProperty(key) && !this.valueIsEmpty(attrs[key])) {
					queryString.push(options.rootElement + "[" + escape(key) + "]=" + escape(attrs[key]));
				}
			}
		}
		else {
			for (key in attrs) {
				if (attrs.hasOwnProperty(key) && !this.valueIsEmpty(attrs[key])) {
					queryString.push(escape(key) + "=" + escape(attrs[key]));
				}
			}
		}

		return queryString.join("&");
	},

	toXML: function(options) {
		options = options || {};
		var attrs = this.attributes, key, xml = [];

		if (options.rootElement) {
			xml.push("<" + options.rootElement.replace(/\[/g, ":").replace(/\]/g, "") + ">");
		}

		for (key in attrs) {
			if (attrs.hasOwnProperty(key) && !this.valueIsEmpty(attrs[key])) {
				xml.push("<" + key + ">" + this.escapeHTML(attrs[key]) + "</" + key + ">");
			}
		}

		if (options.rootElement) {
			xml.push("</" + options.rootElement.replace(/\[/g, ":").replace(/\]/g, "") + ">");
		}

		return xml.join("");
	},

	validate: function() {
		this.valid = true;
		this.validateRequiredAttributes();
		this.validateAttributeDataTypes();
		this.validateAttributeLengths();
		this.validateAttributeFormats();

		return this.valid;
	},

	validateRequiredAttributes: function() {
		if (!this.requires) {
			return;
		}

		var key, i = 0, length = this.requires.length;

		for (i; i < length; i++) {
			key = this.requires[i];

			if (this.valueIsEmpty(this.attributes[key])) {
				this.addError(key, "is required");
				this.valid = false;
			}
		}
	},

	validateAttributeDataTypes: function() {
		if (!this.validatesNumeric) {
			return;
		}

		var key, type, i = 0, length = this.validatesNumeric.length;

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
		if (!this.validatesMaxLength) {
			return;
		}

		var key;

		for (key in this.validatesMaxLength) {
			if (this.validatesMaxLength.hasOwnProperty(key)) {
				if (!this.valueIsEmpty(this.attributes[key]) && String(this.attributes[key]).length > this.validatesMaxLength[key]) {
					this.addError(key, "cannot exceed " + this.validatesMaxLength[key] + " characters");
					this.valid = false;
				}
			}
		}
	},

	validateAttributeFormats: function() {
		if (!this.validatesFormatOf) {
			return;
		}

		var key, i, length;

		for (key in this.validatesFormatOf) {
			if (this.validatesFormatOf.hasOwnProperty(key) && !this.valueIsEmpty(this.attributes[key])) {
				if (this.validatesFormatOf[key] instanceof Array) {
					for (i = 0, length = this.validatesFormatOf[key].length; i < length; i++) {
						if (!this.validatesFormatOf[key][i].test(this.attributes[key])) {
							this.addError(key, "is not in a valid format");
							this.valid = false;
						}
						else {
							break;
						}
					}
				}
				else if (!this.validatesFormatOf[key].test(this.attributes[key])) {
					this.addError(key, "is not in a valid format");
					this.valid = false;
				}
			}
		}
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
