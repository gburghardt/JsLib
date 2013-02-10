/*

Sample Use:

	var app = new Application();

	jQuery(function() {
		app.init();
	});

	jQuery(window).unload(function() {
		app.teardown();
		app = null;
	});

*/
Application = Object.extend({

	prototype: {

		config: null,

		delegator: null,

		document: null,

		element: null,

		eventDispatcher: null,

		moduleFactory: null,

		window: null,

		initialize: function() {
			this.config = {
				"delegator.eventTypes": ["click", "submit", "keydown", "keypress", "keyup", "domload"]
			};

			this.eventDispatcher = new events.Dispatcher();
			this.moduleFactory = new ModuleFactory(this.eventDispatcher);
		},

		init: function(element) {
			this.element = element;
			this.document = element.ownerDocument;
			this.window.onerror = this.handleError.bind(this);
			this.delegator = new dom.events.Delegator(this, element);
			this.delegator.addEventTypes( this.config["delegator.eventTypes"] );
			this.delegator.triggerEvent("domload");
			element = null;
		},

		destructor: function() {
			this.delegator.destructor();
			this.eventDispatcher.destructor();
			this.moduleFactory.destructor();
			this.window.onerror = this.window = this.document = this.element = this.delegator = this.moduleFactory = this.eventDispatcher = null;
		},

		configure: function(config) {
			var key;

			for (key in config) {
				if (config.hasOwnProperty(key)) {
					this.config[key] = config[key];
				}
			}

			config = null;
		},

		getErrorInfo: function(message, fileName, lineNumber) {
			var regex = /^Error: ([A-Z][a-zA-Z0-9]+Error) - (.*)$/;
			var info = message.match(regex) || [];
			return {
				type: info[1] || "Error",
				message: info[2] || "",
				fileName: fileName || "",
				lineNumber: lineNumber || 0
			};
		},

		handleError: function(message, fileName, lineNumber) {
			var info = this.getErrorInfo(message, fileName, lineNumber);

			if (info.type === "AccessDeniedError") {
				this.handleAccessDeniedError(info);
				return true;
			}
		}

	}

});
