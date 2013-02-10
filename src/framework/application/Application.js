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
				"delegator.eventTypes": ["click", "submit", "keydown", "keypress", "keyup", "domready"]
			};

			this.eventDispatcher = new events.Dispatcher();
			this.moduleFactory = new ModuleFactory(this.eventDispatcher);
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
			console.info("Application#createModules - called");
			// console.dir({event: event, element: element, params: params});
			// var elements = element.querySelectorAll("[data-action-domready=createModule]");
			// console.info("Application#createModules - elements");
			// console.dir(elements);
		},

		createModule: function(event, element, params) {
			event.stop();

			// console.info("Application#createModule - called");
			// console.dir({event: event, element: element, params: params});

			var moduleClassName = element.getAttribute("data-module");
			var containerElement = element;
			var moduleOptions = JSON.parse( element.getAttribute("data-module-options") || "{}" );

			if (params.containerSelector) {
				containerElement = this.element.querySelectorAll(params.containerSelector)[0];
			}

			var module = this.moduleFactory.getInstance(moduleClassName, moduleOptions);

			if (params.insert === "bottom") {
				containerElement.appendChild(module.element);
			}
			else if (containerElement.firstChild) {
				containerElement.insertBefore(module.element, containerElement.firstChild);
			}
			else {
				containerElement.appendChild(module.element);
			}

			module.init();

			containerElement = module = event = element = params = options = null;
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
