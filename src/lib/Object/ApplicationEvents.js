Object.ApplicationEvents = {

	self: {

		eventDispatcher: null,

		checkEventDispatcher: function() {
			if (!BaseModule.eventDispatcher) {
				throw new Error("No application event dispatcher was found in BaseModule.eventDispatcher");
			}

			return true;
		},

		publish: function(eventName, data) {
			this.checkEventDispatcher();
			this.eventDispatcher.publish(eventName, data);
		},

		publishOnce: function(eventName, data) {
			this.checkEventDispatcher();
			this.eventDispatcher.publishOnce(eventName, data);
		},

		setEventDispatcher: function(eventDispatcher) {
			if (typeof eventDispatcher.publish !== "function" ||
			    typeof eventDispatcher.publishOnce !== "function" ||
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
			this.constructor.publish(eventName, data);
		},

		publishOnce: function(eventName, data) {
			this.constructor.publishOnce(eventName, data);
		},

		subscribe: function(eventName, context, callback) {
			this.constructor.subscribe(eventName, context, callback);
		},

		unsubscribe: function(eventName, context, callback) {
			this.constructor.unsubscribe(eventName, context, callback);
		}

	}

};
