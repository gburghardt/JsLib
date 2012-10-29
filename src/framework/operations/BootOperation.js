BootOperation = BaseOperation.extend({
	prototype: {

		application: null,

		config: null,

		delegator: null,

		element: null,

		destructor: function() {
			if (this.delegator) {
				this.delegator.destructor();
				this.delegator = null;
			}

			this.application = this.config = this.element = null;

			BaseOperation.prototype.destructor.call(this);
		},

		handleAction: function(action) {
			if ("domload" === action.event.type) {
				// TODO: Get all *[data-action-domload] elements and run "init" operations on them
				this.runDomloadOperations(action);
			}
			else if ("init" === action.name) {
				this.runChildOperation(action);
			}
			else {
				this.eventDispatcher.publish("operation:" + action.name, this, action);
			}
		},

		run: function() {
			this.config = this.application.config;
			this.element = this.application.document.documentElement;
			this.delegator.node = this.element;
			this.delegator.delegate = this;
			this.delegator.addEventTypes( this.config["delegator.eventTypes"] );
		},

		runChildOperation: function(action) {
			var name = action.element.getAttribute("data-operation")
			var childOperation = this.getChildOperation(name);

			if (!childOperation) {
				throw new Error("No child operation found for name '" + name + "'");
			}
			else {
				childOperation.call(this, action);
				childOperation = null;
			}
		},

		domload: function(action) {
			var actionElement = action.element;
			var i = 0, elements = action.element.querySelectorAll("[data-action-domload=init]"), length = elements.length;

			for (i; i < length; i++) {
				action.element = elements[i];
				this.runChildOperation(action);
			}

			action.element = actionElement;
		},

		setApplication: function(application) {
			this.application = application;
		},

		setDelegator: function(delegator) {
			this.delegator = delegator;
		},

		setEventDispatcher: function(eventDispatcher) {
			this.eventDispatcher = eventDispatcher;
		}

	}
});
