Events.Dispatcher = Object.extend({

	self: {
		logger: null
	},

	prototype: {

		subscribers: null,

		initialize: function() {
			this.subscribers = {};
		},

		destructor: function() {
			if (!this.subscribers) {
				return;
			}

			var subscribers = this.subscribers, subscriber, eventType, i, length;

			for (eventType in subscribers) {
				if (subscribers.hasOwnProperty(eventType)) {
					for (i = 0, length = subscribers[eventType].length; i < length; i++) {
						subscriber = subscribers[eventType][i];
						subscriber.callback = subscriber.context = null;
					}

					subscribers[eventType] = null;
				}
			}

			subscriber = subscribers = this.subscribers = null;
		},

		dispatchEvent: function(event, subscribers) {
			var subscriber;

			for (var i = 0, length = subscribers.length; i < length; i++) {
				subscriber = subscribers[i];

				if (subscriber.type === "function") {
					subscriber.callback.call(subscriber.context, event, event.publisher, event.data);
				}
				else if (subscriber.type === "string") {
					subscriber.context[ subscriber.callback ]( event, event.publisher, event.data );
				}

				if (event.cancelled) {
					break;
				}
			}

			subscribers = subscriber = event = null;
		},

		publish: function(eventType, publisher, data) {
			if (!this.subscribers[eventType]) {
				return false;
			}

			var event = new Events.Event(eventType, publisher, data);
			var subscribers = this.subscribers[eventType];
			var cancelled = false;

			this.dispatchEvent(event, subscribers);
			cancelled = event.cancelled;
			event.destructor();

			event = publisher = data = subscribers = null;

			return !cancelled;
		},

		subscribe: function(eventType, context, callback) {
			var contextType = typeof context;
			var callbackType = typeof callback;
			
			this.subscribers[eventType] = this.subscribers[eventType] || [];
			
			if (contextType === "function") {
				this.subscribers[eventType].push({
					context: null,
					callback: context,
					type: "function"
				});
			}
			else if (contextType === "object") {
				if (callbackType === "string" && typeof context[ callback ] !== "function") {
					throw new Error("Cannot subscribe to " + eventType + " because " + callback + " is not a function");
				}
			
				this.subscribers[eventType].push({
					context: context || null,
					callback: callback,
					type: callbackType
				});
			}
		},

		unsubscribe: function(eventType, context, callback) {
			if (this.subscribers[eventType]) {
				var contextType = typeof context;
				var callbackType = typeof callback;
				var subscribers = this.subscribers[eventType];
				var i = subscribers.length;
				var subscriber;

				if (contextType === "undefined" && callbackType === "undefined") {
					// assume message is an object that wants all of its listeners removed
				}
				else if (contextType === "function") {
					callback = context;
					context = null;
					callbackType = "function";
				}
				else if (contextType === "object" && callbackType === "undefined") {
					callbackType = "any";
				}

				while (i--) {
					subscriber = subscribers[i];

					if (
					    (callbackType === "any" && subscriber.context === context) ||
							(subscriber.type === callbackType && subscriber.context === context && subscriber.callback === callback)
					) {
						subscribers.splice(i, 1);
					}
				}
			}

			context = callback = subscribers = subscriber = null;
		}
	}

});
