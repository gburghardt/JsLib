BaseModel.BasicValidation = {

	prototype: {

		errors: null,

		valid: false,

		requires: null,

		addError: function(key, message) {
			this.errors[key] = this.errors[key] || [];
			this.errors[key].push(message);
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

		getErrorMessage: function(key) {
			var message = [], words, i, length, errors = this.errors[key];

			if (errors) {
				words = (key === "base") ? "" : this.convertKeyToWords(key).capitalize() + " ";

				for (i = 0, length = errors.length; i < length; i++) {
					message.push(words + errors[i]);
				}
			}

			errors = null;

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

		validate: function() {
			this.errors = {};
			this.valid = true;
			this.validateRequiredAttributes();
			this.applyModuleCallbacks("validate");

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
		}

	}

};

BaseModel.include(BaseModel.BasicValidation);
