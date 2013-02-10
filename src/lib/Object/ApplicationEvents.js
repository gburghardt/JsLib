Object.ApplicationEvents = {

	self: {

		eventDispatcher: null,

		checkEventDispatcher: function() {
			if (!this.eventDispatcher) {
				throw new Error("No application event dispatcher was found.");
			}

			return true;
		},

		publish: function(eventName, publisher, data) {
			this.checkEventDispatcher();
			this.eventDispatcher.publish(eventName, publisher, data);
		},

		setEventDispatcher: function(eventDispatcher) {
			if (typeof eventDispatcher.publish !== "function" ||
			    typeof eventDispatcher.subscribe !== "function" ||
			    typeof eventDispatcher.unsubscribe !== "function")
			{
				throw new TypeError("Invalid interface for BaseModule.eventDispatcher. Must have publish, publishOnce, subscribe and unsubscribe methods.");
			}
			else {
				BaseModule.eventDispatcher = eventDispatcher;
			}
		},

		subscribe: function(eventName, context, callback) {
			this.checkEventDispatcher();
			this.eventDispatcher.subscribe(eventName, context, callback);
		},

		unsubscribe: function(eventName, context, callback) {
			this.checkEventDispatcher();
			this.eventDispatcher.unsubscribe(eventName, context, callback);
		}

	},

	prototype: {

		destroyApplicationEvents: function() {
			this.constructor.unsubscribe(this);
		},

		publish: function(eventName, data) {
			this.constructor.publish(eventName, this, data);
		},

		subscribe: function(eventName, context, callback) {
			this.constructor.subscribe(eventName, context, callback);
		},

		unsubscribe: function(eventName, context, callback) {
			this.constructor.unsubscribe(eventName, context, callback);
		}

	}

};
