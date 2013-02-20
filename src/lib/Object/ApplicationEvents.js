Object.ApplicationEvents = {

	eventDispatcher: null,

	self: {

		getEventDispatcher: function() {
			return Object.ApplicationEvents.eventDispatcher;
		},

		checkEventDispatcher: function() {
			if (!this.getEventDispatcher()) {
				throw new Error("No application event dispatcher was found. Please set Object.ApplicationEvents.eventDispatcher.");
			}

			return true;
		},

		publish: function(eventName, publisher, data) {
			this.checkEventDispatcher();
			this.getEventDispatcher().publish(eventName, publisher, data);
		},

		subscribe: function(eventName, context, callback) {
			this.checkEventDispatcher();
			this.getEventDispatcher().subscribe(eventName, context, callback);
		},

		unsubscribe: function(eventName, context, callback) {
			this.checkEventDispatcher();
			this.getEventDispatcher().unsubscribe(eventName, context, callback);
		}

	},

	prototype: {

		destroyApplicationEvents: function() {
			if (this.constructor.getEventDispatcher()) {
				this.constructor.unsubscribe(this);
			}
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
