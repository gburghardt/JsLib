LoginModule = BaseModule.extend({

	prototype: {

		actions: {
			submit: "submit"
		},

		elements: {
			usernameField: "#login-username",
			passwordField: "#login-password"
		},

		run: function() {
			this.usernameField.focus();
		},

		submit: function(event, element, params) {
			event.stop();

			var data = this.view.getFormData();

			if (!data.username) {
				alert("The username is required");
				this.usernameField.focus();
			}
			else if (!data.password) {
				alert("Please enter a password");
				this.passwordField.focus();
			}
			else {
				alert("Welcome!");
				this.destructor();
			}
		}

	}

});
