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
			if ("init" === action.name) {
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
			childOperation.call(this, action.element);
			childOperation = null;
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
