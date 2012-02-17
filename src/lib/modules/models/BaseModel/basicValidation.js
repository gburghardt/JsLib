BaseModel.includeModule("basicValidation", {

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

});
