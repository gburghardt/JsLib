Model.Validation.Errors = Object.extend({

	prototype: {

		length: 0,

		messages: null,

		initialize: function() {
			this.messages = {};
		},

		add: function(key, text) {
			this.messages[key] = this.messages[key] || [];
			this.messages[key].push(text);
			this.length++;
		},

		clear: function() {
			this.messages = {};
			this.length = 0;
		},

		get: function(key) {
			return this.messages[key] || null;
		},

		getMessage: function(key) {
			var message = [], words, i, length, messages = this.messages[key];

			if (messages) {
				words = "";

				for (i = 0, length = messages.length; i < length; i++) {
					message.push(words + messages[i]);
				}
			}

			messages = null;

			return message;
		},

		getMessages: function() {
			var errorMessages = {}, key;

			for (key in this.messages) {
				if (this.messages.hasOwnProperty(key)) {
					errorMessages[key] = this.getErrorMessage(key);
				}
			}

			return errorMessages;
		},

		remove: function(key) {
			if (this.messages[key]) {
				this.length -= this.messages[key].length;
				this.messages[key] = null;
			}
		}

	}

});
