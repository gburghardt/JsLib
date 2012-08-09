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

		delegator: null,

		eventDispatcher: null,

		initOperation: null,

		operationFactory: null,

		init: function() {
			this.delegator.addEventTypes(["click", "submit", "keydown", "keypress", "keyup"]);
			this.operationFactory.setEventDispatcher(this.eventDispatcher);
			this.initOperation = this.operationFactory.getOperation(this.document.body.getAttribute("data-operation-init") || "init");
			this.initOperation.call(null);
		},

		destructor: function() {
			if (this.delegator) {
				this.delegator.destructor();
			}

			this.initOperation.destructor();
			this.eventDispatcher.destructor();
			this.operationFactory.destructor();

			if (this.teardownOperation) {
				this.teardownOperation.destructor();
			}

			this.document = this.initOperation = this.teardownOperation = this.operationFactory = this.eventDispatcher = null;
		},

		handleAction: function(event, element, params, actionName) {
			var action = new dom.events.Action();
			action.name = actionName;
			action.event = event;
			action.element = element;
			action.params = params;
			this.eventDispatcher.publish("operation:" + actionName, this, action);
		},

		teardown: function() {
			this.teardownOperation = this.operationFactory.getOperation("teardown");

			if (this.teardownOperation) {
				this.teardownOperation.call(this.initOperation);
			}

			this.destructor();
		}

	}

});
