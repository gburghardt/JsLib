BaseModel.includeModule("extendedValidation", {

	callbacks: {

		validate: function() {
			this.validateAttributeDataTypes();
			this.validateAttributeLengths();
			this.validateAttributeFormats();
		}

	},

	prototype: {

		validatesNumeric: null,

		validatesMaxLength: null,

		validatesFormatOf: null,

		validateAttributeDataTypes: function() {
			if (!this.validatesNumeric) {
				return;
			}

			var key, type, i = 0, length = this.validatesNumeric.length;

			for (i; i < length; i++) {
				key = this.validatesNumeric[i];

				if (!this.valueIsEmpty(this._attributes[key]) && !this.valueIsNumeric(this._attributes[key])) {
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
					if (!this.valueIsEmpty(this._attributes[key]) && String(this._attributes[key]).length > this.validatesMaxLength[key]) {
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
				if (this.validatesFormatOf.hasOwnProperty(key) && !this.valueIsEmpty(this._attributes[key])) {
					if (this.validatesFormatOf[key] instanceof Array) {
						for (i = 0, length = this.validatesFormatOf[key].length; i < length; i++) {
							if (!this.validatesFormatOf[key][i].test(this._attributes[key])) {
								this.addError(key, "is not in a valid format");
								this.valid = false;
							}
							else {
								break;
							}
						}
					}
					else if (!this.validatesFormatOf[key].test(this._attributes[key])) {
						this.addError(key, "is not in a valid format");
						this.valid = false;
					}
				}
			}
		},

		valueIsNumeric: function(value) {
			return (/^[-.\d]+$/).test(String(value)) && !isNaN(value);
		}
		
	}

});
