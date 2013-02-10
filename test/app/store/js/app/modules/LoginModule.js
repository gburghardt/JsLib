LoginModule = BaseModule.extend({
	prototype: {
		actions: {
			submit: "submit"
		},

		run: function() {
			document.getElementById("login-username").focus();
			this.view = new BaseView(this.element);
		},

		submit: function(event, element, params) {
			event.stop();

			var data = this.view.getFormData();

			if (!data.username) {
				alert("The username is required");
				document.getElementById("login-username").focus();
			}
			else if (!data.password) {
				alert("Please enter a password");
				document.getElementById("login-password").focus();
			}
			else {
				alert("Welcome!");
				this.destructor();
			}
		}
	}
});
