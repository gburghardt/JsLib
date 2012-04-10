window.events = window.events || {};

events.Dispatcher = function() {
	this.subscribers = {};
};

events.Dispatcher.prototype = {

	subscribers: null,

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
			subscriber.instance[ subscriber.method ](event);
		}

		return true;
	},

	subscribe: function(type, instance, method) {
		this.subscribers[type] = this.subscribers[type] || [];
		this.subscribers[type].push({instance: instance, method: method});
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
