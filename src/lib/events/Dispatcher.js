window.events = window.events || {};

events.Dispatcher = function() {
	this.subscribers = {};
};

events.Dispatcher.logger = null;

events.Dispatcher.prototype = {

	subscribers: null,

	destructor: function() {
		var type, i, length, subscribers;

		if (this.subscribers) {
			for (type in this.subscribers) {
				if (this.subscribers.hasOwnProperty(type)) {
					subscribers = this.subscribers[type];

					for (i = 0, length = subscribers.length; i < length; i++) {
						subcribers[i] = null;
					}

					this.subscribers[type] = null;
				}
			}

			this.subscribers = null;
		}
	},

	publish: function(type, publisher, data) {
		if (!this.subscribers[type]) {
			return false;
		}

		var event = new events.Event(type, publisher, data);
		var subscribers = this.subscribers[type], i = 0, length = subscribers.length, subscriber;

		for (i; i < length; i++) {
			if (event.cancelled) {
				break;
			}

			subscriber = subscribers[i];

			try {
				subscriber.instance[ subscriber.method ](event);
			}
			catch (error) {
				if (events.Dispatcher.logger) {
					events.Dispatcher.logger.error("events.Dispatcher#publish - An error was thrown while publishing event " + type);
					events.Dispatcher.logger.error(error);
				}
				else {
					event = publisher = data = subscribers = null;
					throw error;
				}
			}
		}

		event = publisher = data = subscribers = null;

		return true;
	},

	subscribe: function(type, instance, method) {
		this.subscribers[type] = this.subscribers[type] || [];
		this.subscribers[type].push({instance: instance, method: method || "handleEvent"});
		instance = null;
	},

	unsubscribe: function(type, instance) {
		if (this.subscribers[type]) {
			var subscribers = this.subscribers[type], i = subscribers.length;

			while (i--) {
				if (subscribers[i].instance === instance) {
					subscribers.splice(i, 1);
				}
			}

			subscribers = instance = null;
		}
	}

};
