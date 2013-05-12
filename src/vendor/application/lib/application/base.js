/*

Sample Use:

	var app = new Application.Base();

	jQuery(function() {
		app.init();
	});

	jQuery(window).unload(function() {
		app.teardown();
		app = null;
	});

*/
Application.Base = Object.extend({

	prototype: {

		config: {
			"delegator.eventTypes": ["click", "submit", "keydown", "keypress", "keyup", "domready"]
		},

		delegator: null,

		document: null,

		element: null,

		eventDispatcher: null,

		moduleFactory: null,

		window: null,

		initialize: function() {
			this.config = this.mergePropertyFromPrototypeChain("config");
			this.eventDispatcher = Events.ApplicationEvents.eventDispatcher;
			this.moduleFactory = new Modules.Factory(this.eventDispatcher);
		},

		init: function(element) {
			this.element = element;
			this.document = element.ownerDocument;
			this.window = this.document.defaultView;
			this.window.onerror = this.handleError.bind(this);
			this.delegator = new dom.events.Delegator(this, element);
			this.delegator.addEventTypes( this.config["delegator.eventTypes"] );
			this.delegator.triggerEvent("domready");
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

		createModules: function(event, element, params) {
			var elements = element.getElementsByTagName("*");
			var i = 0, length = elements.length;

			for (i; i < length; i++) {
				if (elements[i].getAttribute("data-action-domready") === "createModule") {
					this.moduleFactory.createModules(elements[i]);
					elements[i].removeAttribute("data-action-domready");
					elements[i].setAttribute("data-module-created", "domready");
				}
			}
		},

		createModule: function(event, element, params) {
			event.stop();
			this.moduleFactory.createModules(element);
			event = element = params = null;
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
