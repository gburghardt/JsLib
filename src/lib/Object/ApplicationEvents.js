Object.ApplicationEvents = {

	self: {

		eventDispatcher: null,

		getEventDispatcher: function() {
			throw new Error("Classes including Object.ApplicationEvents must define Klass.getEventDispatcher()");
		},

		checkEventDispatcher: function() {
			if (!this.getEventDispatcher()) {
				throw new Error("No application event dispatcher was found.");
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
