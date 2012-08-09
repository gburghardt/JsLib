BaseOperation = Object.extend({

	includes: events.Publisher,

	prototype: {

		eventDispatcher: null,

		operationFactory: null,

		parentOperation: null,

		initialize: function(operationFactory, eventDispatcher) {
			this.operationFactory = operationFactory;
			this.eventDispatcher = eventDispatcher;
		},

		destructor: function() {
			this.parentOperation = null;
		},

		call: function(parentOperation) {
			if (parentOperation) {
				this.parentOperation = parentOperation;
			}

			this.run();
		},

		map: function(events) {
			var name;

			for (name in events) {
				if (events.hasOwnProperty(name)) {
					this.eventDispatcher.subscribe("operation:" + name, this, events[name]);
				}
			}
		},

		run: function() {
			throw new Error("Child classes must override BaseOperation#run");
		}

	}

});
