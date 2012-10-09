/*

Operation tree:

	init
	- load widgets
		- respond to user events
	- teardown

Sample Use:

	var app = new Application(new OperationFactory(), new events.Dispatcher());

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

		bootOperation: null,

		config: null,

		delegator: null,

		document: null,

		eventDispatcher: null,

		operationFactory: null,

		window: null,

		initialize: function() {
			this.config = {
				"bootOperation.name": "boot",
				"delegator.eventTypes": ["click", "submit", "keydown", "keypress", "keyup", "domload"]
			};
		},

		init: function() {
			this.window.onerror = this.handleError.bind(this);
			this.operationFactory.setEventDispatcher(this.eventDispatcher);
			this.bootOperation = this.operationFactory.getOperation(this.config["bootOperation.name"]);
			this.bootOperation.setApplication(this);
			this.bootOperation.setEventDispatcher(this.eventDispatcher);
			this.bootOperation.setDelegator(this.delegator);
			this.bootOperation.call(null);
			this.delegator.triggerEvent("domload");
		},

		destructor: function() {
			this.delegator.destructor();
			this.bootOperation.destructor();
			this.eventDispatcher.destructor();
			this.operationFactory.destructor();
			this.window.onerror = this.window = this.document = this.delegator = this.bootOperation = this.operationFactory = this.eventDispatcher = null;
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
		},

		handleAccessDeniedError: function(info) {
			if (info.message) {
				console.warn(info.message);
			}
			else {
				console.warn("Access denied!");
			}
		}

	}

});
