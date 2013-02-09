Object.Callbacks = {

	prototype: {

		callbackListeners: null,

		callbacks: null,

		initCallbacks: function() {
			if (!this.__proto__.hasOwnProperty("compiledCallbacks")) {
				this.compileCallbacks();
			}

			this.callbackListeners = {};

			var name, i, length, callbacks;

			for (name in this.compiledCallbacks) {
				if (this.compiledCallbacks.hasOwnProperty(name)) {
					callbacks = this.compiledCallbacks[name];

					for (i = 0, length = callbacks.length; i < length; i++) {
						this.listen( name, this, callbacks[i] );
					}
				}
			}

			this.setUpCallbacks();
		},

		compileCallbacks: function() {
			var compiledCallbacks = {}, name, i, length, callbacks, proto = this.__proto__;

			while (proto) {
				if (proto.hasOwnProperty("callbacks") && proto.callbacks) {
					callbacks = proto.callbacks;

					for (name in callbacks) {
						if (callbacks.hasOwnProperty(name)) {
							compiledCallbacks[name] = compiledCallbacks[name] || [];
							callbacks[name] = callbacks[name] instanceof Array ? callbacks[name] : [ callbacks[name] ];

							// To keep callbacks executing in the order they were defined in the classes,
							// we loop backwards and place the new callbacks at the top of the array.
							i = callbacks[name].length;
							while (i--) {
								compiledCallbacks[name].unshift( callbacks[name][i] );
							}
						}
					}
				}

				proto = proto.__proto__;
			}

			this.__proto__.compiledCallbacks = compiledCallbacks;

			proto = callbacks = compiledCallbacks = null;
		},

		destroyCallbacks: function() {
			if (!this.callbackListeners) {
				return;
			}

			var listeners = this.callbackListeners, listener, message, i, length;

			for (message in listeners) {
				if (listeners.hasOwnProperty(message)) {
					for (i = 0, length = listeners[message].length; i < length; i++) {
						listener = listeners[message][i];
						listener.callback = listener.context = null;
					}

					listeners[message] = null;
				}
			}

			listener = listeners = this.callbackListners = null;
		},

		setUpCallbacks: function() {
			// Child classes may override this to do something special with adding callbacks.
		},

		notify: function(message, data) {
			if (!this.callbackListeners[message]) {
				return false;
			}

			var listeners = this.callbackListeners[message], listener, result;

			for (var i = 0, length = listeners.length; i < length; i++) {
				listener = listeners[i];

				if (listener.type === "function") {
					result = listener.callback.call(listener.context, data);
				}
				else if (listener.type === "string") {
					result = listener.context[ listener.callback ]( data );
				}

				if (result === false) {
					break;
				}
			}

			listeners = listener = null;

			return result !== false;
		},

		listen: function(message, context, callback) {
			var contextType = typeof context;
			var callbackType = typeof callback;

			this.callbackListeners[message] = this.callbackListeners[message] || [];

			if (contextType === "function") {
				this.callbackListeners[message].push({
					context: null,
					callback: context,
					type: "function"
				});
			}
			else if (contextType === "object") {
				if (callbackType === "string" && typeof context[ callback ] !== "function") {
					throw new Error("Cannot listen for " + message + " because " + callback + " is not a function");
				}

				this.callbackListeners[message].push({
					context: context || null,
					callback: callback,
					type: callbackType
				});
			}
		},
		
		ignore: function(message, context, callback) {
			if (this.callbackListeners[message]) {
				var contextType = typeof context;
				var callbackType = typeof callback;
				var listeners = this.callbackListeners[message];
				var i = listeners.length;
				var listener;

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
					listener = listeners[i];

					if (
					    (callbackType === "any" && listener.context === context) ||
							(listener.type === callbackType && listener.context === context && listener.callback === callback)
					) {
						listeners.splice(i, 1);
					}
				}
			}

			context = callback = null;
		}

	}

};
