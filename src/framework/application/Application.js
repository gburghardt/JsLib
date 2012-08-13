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

		eventDispatcher: null,

		operationFactory: null,

		initialize: function() {
			this.config = {
				"bootOperation.name": "boot",
				"delegator.eventTypes": ["click", "submit", "keydown", "keypress", "keyup"]
			};
		},

		init: function() {
			this.operationFactory.setEventDispatcher(this.eventDispatcher);
			this.bootOperation = this.operationFactory.getOperation(this.config["bootOperation.name"]);
			this.bootOperation.setApplication(this);
			this.bootOperation.setEventDispatcher(this.eventDispatcher);
			this.bootOperation.setDelegator(this.delegator);
			this.bootOperation.call(null);
		},

		destructor: function() {
			this.delegator.destructor();
			this.bootOperation.destructor();
			this.eventDispatcher.destructor();
			this.operationFactory.destructor();
			this.document = this.delegator = this.bootOperation = this.operationFactory = this.eventDispatcher = null;
		},

		configure: function(config) {
			var key;

			for (key in config) {
				if (config.hasOwnProperty(key)) {
					this.config[key] = config[key];
				}
			}

			config = null;
		}

	}

});
