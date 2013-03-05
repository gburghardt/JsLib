Model.Validation = {

	included: function(Klass) {
		Klass.attempt("addCallbacks", {
			afterInitialize: "initValidation"
		});
	},

	prototype: {

		errors: null,

		valid: false,

		validations: null,

		initValidation: function() {
			this.errors = new Model.Validation.Errors();
			this.initRequiredValidations();
			this.initValidatesFormatOf();
			this.initValidatesMaxLength();
			this.initValidatesNumeric();
			this.notify("afterInitValidation");
		},

		initRequiredValidations: function() {
			if (!this.__proto__.hasOwnProperty("compiledRequires")) {
				this.__proto__.compiledRequires = this.mergeArrayPropertyFromPrototypeChain("requires");
			}
		},

		initValidatesFormatOf: function() {
			if (!this.__proto__.hasOwnProperty("compiledValidatesFormatOf")) {
				this.__proto__.compiledValidatesFormatOf = this.mergePropertyFromPrototypeChain("validatesFormatOf");
			}
		},

		initValidatesMaxLength: function() {
			if (!this.__proto__.hasOwnProperty("compiledValidatesMaxLength")) {
				this.__proto__.compiledValidatesMaxLength = this.mergePropertyFromPrototypeChain("validatesMaxLength");
			}
		},

		initValidatesNumeric: function() {
			if (!this.__proto__.hasOwnProperty("compiledValidatesNumeric")) {
				this.__proto__.compiledValidatesNumeric = this.mergeArrayPropertyFromPrototypeChain("validatesNumeric");
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
			}).capitalize();

			return key;
		},

		getErrorMessage: function(key) {
			return this.errors.getMessage(key);
		},

		getErrorMessages: function() {
			return this.errors.getMessages();
		},

		hasErrors: function() {
			return !this.valid;
		},

		setErrorMessages: function(errors) {
			var key, i, length;

			for (key in errors) {
				if (errors.hasOwnProperty(key)) {
					for (i = 0, length = errors[key].length; i < length; i++) {
						this.errors.add(key, errors[key][i]);
					}
				}
			}
		},

		validate: function(context, callbacks) {
			if (this.notify("beforeValidate") !== false) {
				this.errors.clear();
				this.valid = true;
				this.validateRequiredAttributes();
				this.validateAttributeDataTypes();
				this.validateAttributeLengths();
				this.validateAttributeFormats();
				this.validateServerRequirements(this, function() {
					if (this.valid) {
						this.notify("afterValidate");
						callbacks.valid.call(context, this);
					}
					else {
						callbacks.invalid.call(context, this);
					}
				});
			}
		},

		validateRequiredAttributes: function() {
			if (!this.compiledRequires) {
				return;
			}

			var key, i = 0, length = this.compiledRequires.length;

			for (i; i < length; i++) {
				key = this.compiledRequires[i];

				if (this.valueIsEmpty(this.attributes[key])) {
					this.errors.add(key, this.convertKeyToWords(key) + " is required");
					this.valid = false;
				}
			}
		},

		validateAttributeDataTypes: function() {
			if (!this.compiledValidatesNumeric) {
				return;
			}

			var key, type, i = 0, length = this.compiledValidatesNumeric.length;

			for (i; i < length; i++) {
				key = this.compiledValidatesNumeric[i];

				if (!this.valueIsEmpty(this._attributes[key]) && !this.valueIsNumeric(this._attributes[key])) {
					this.errors.add(key, this.convertKeyToWords(key) + " must be a number");
					this.valid = false;
				}
			}
		},

		validateAttributeLengths: function() {
			if (!this.compiledValidatesMaxLength) {
				return;
			}

			var key;

			for (key in this.compiledValidatesMaxLength) {
				if (this.compiledValidatesMaxLength.hasOwnProperty(key)) {
					if (!this.valueIsEmpty(this._attributes[key]) && this._attributes[key].length > this.compiledValidatesMaxLength[key]) {
						this.errors.add(key, this.convertKeyToWords(key) + " cannot exceed " + this.compiledValidatesMaxLength[key] + " characters");
						this.valid = false;
					}
				}
			}
		},

		validateAttributeFormats: function() {
			if (!this.compiledValidatesFormatOf) {
				return;
			}

			var key, i, length, valid = true;

			for (key in this.compiledValidatesFormatOf) {
				if (this.compiledValidatesFormatOf.hasOwnProperty(key) && !this.valueIsEmpty(this._attributes[key])) {
					if (this.compiledValidatesFormatOf[key] instanceof Array) {
						for (i = 0, length = this.compiledValidatesFormatOf[key].length; i < length; i++) {
							if (!this.compiledValidatesFormatOf[key][i].test(this._attributes[key])) {
								valid = false;
							}
							else {
								valid = true;
								break;
							}
						}

						if (!valid) {
							this.errors.add(key, this.convertKeyToWords(key) + " is not in a valid format");
							this.valid = false;
						}
					}
					else if (!this.compiledValidatesFormatOf[key].test(this._attributes[key])) {
						this.errors.add(key, this.convertKeyToWords(key) + " is not in a valid format");
						this.valid = false;
					}
				}
			}
		},

		validateServerRequirements: function(context, callback) {
			// TODO: Set up a queue of methods to process
			callback.call(context);
			context = callback = null;
		},

		valueIsNumeric: function(value) {
			return (/^[-.\d]+$/).test(String(value)) && !isNaN(value);
		}

	}

};

Model.Base.include(Model.Validation);
