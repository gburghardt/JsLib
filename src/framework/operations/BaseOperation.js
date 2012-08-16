BaseOperation = Object.extend({

	prototype: {

		childOperations: null,

		eventDispatcher: null,

		operationFactory: null,

		parentOperation: null,

		initialize: function(operationFactory, eventDispatcher) {
			this.childOperations = {};
			this.operationFactory = operationFactory;
			this.eventDispatcher = eventDispatcher;
			operationFactory = eventDispatcher = null;
		},

		destructor: function() {
			var name;

			if (this.childOperations) {
				for (name in this.childOperations) {
					if (this.childOperations.hasOwnProperty(name)) {
						this.childOperations[name].destructor();
						this.childOperations[name] = null;
					}
				}

				this.childOperations = null;
			}

			if (this.eventDispatcher) {
				this.eventDispatcher.unsubscribeAll(this);
			}

			this.parentOperation = this.operationFactory = this.eventDispatcher = null;
		},

		call: function(parentOperation, runArgs) {
			this.parentOperation = parentOperation;
			this.run.apply(this, runArgs);
			parentOperation = null;
		},

		addChildOperation: function(name, childOperation) {
			if (this.childOperations[name]) {
				throw new Error("Cannot add more than one child operation with name " + name);
			}

			this.childOperations[name] = childOperation;
			childOperation = null;
		},

		getChildOperation: function(name) {
			if (!this.childOperations[name]) {
				this.childOperations[name] = this.operationFactory.getOperation(name);
			}

			return this.childOperations[name];
		},

		map: function(events) {
			var name;

			for (name in events) {
				if (events.hasOwnProperty(name)) {
					this.eventDispatcher.subscribe("operation:" + name, this, events[name]);
				}
			}

			events = null;
		},

		removeChildOperation: function(name) {
			this.childOperations[name] = null;
			delete this.childOperations[name];
		},

		run: function() {
			throw new Error("Child classes must override BaseOperation#run");
		}

	}

});
