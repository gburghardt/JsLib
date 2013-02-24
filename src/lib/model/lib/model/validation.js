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
		},

		initRequiredValidations: function() {
			if (this.__proto__.hasOwnProperty("compiledRequires")) {
				return;
			}

			var compiledRequires = [];
			var proto = this.__proto__, requires;

			while (proto) {
				if (proto.hasOwnProperty("requires")) {
					requires = proto.requires;
					compiledRequires.push.apply(compiledRequires, requires);
				}

				proto = proto.__proto__;
			}

			this.__proto__.compiledRequires = compiledRequires;

			requires = proto = compiledRequires = null;
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

		validate: function(context, callbacks) {
			if (this.notify("beforeValidate")) {
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
			if (!this.validatesNumeric) {
				return;
			}

			var key, type, i = 0, length = this.validatesNumeric.length;

			for (i; i < length; i++) {
				key = this.validatesNumeric[i];

				if (!this.valueIsEmpty(this._attributes[key]) && !this.valueIsNumeric(this._attributes[key])) {
					this.errors.add(key, this.convertKeyToWords(key) + " must be a number");
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
					if (!this.valueIsEmpty(this._attributes[key]) && String(this._attributes[key]).length > this.validatesMaxLength[key]) {
						this.errors.add(key, this.convertKeyToWords(key) + " cannot exceed " + this.validatesMaxLength[key] + " characters");
						this.valid = false;
					}
				}
			}
		},

		validateAttributeFormats: function() {
			if (!this.validatesFormatOf) {
				return;
			}

			var key, i, length, valid = true;

			for (key in this.validatesFormatOf) {
				if (this.validatesFormatOf.hasOwnProperty(key) && !this.valueIsEmpty(this._attributes[key])) {
					if (this.validatesFormatOf[key] instanceof Array) {
						for (i = 0, length = this.validatesFormatOf[key].length; i < length; i++) {
							if (!this.validatesFormatOf[key][i].test(this._attributes[key])) {
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
					else if (!this.validatesFormatOf[key].test(this._attributes[key])) {
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
