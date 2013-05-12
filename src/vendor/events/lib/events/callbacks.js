'@import Events.ApplicationEvents';

Events.Callbacks = {

	includes: Events.ApplicationEvents,

	guid: 0,

	self: {

		addCallbacks: function(newCallbacks) {
			var name, callbacks = this.prototype.callbacks || {};

			for (name in newCallbacks) {
				if (newCallbacks.hasOwnProperty(name)) {
					if (callbacks[name]) {
						callbacks[name] = (callbacks[name] instanceof Array) ? callbacks[name] : [ callbacks[name] ];
					}
					else {
						callbacks[name] = [];
					}

					callbacks[name].push( newCallbacks[name] );
				}
			}

			this.prototype.callbacks = callbacks;
			callbacks = newCallbacks = null;
		}

	},

	prototype: {

		callbackDispatcher: null,

		callbackId: null,

		callbackIdPrefix: "callbacks",

		callbacks: null,

		initCallbacks: function() {
			if (!this.__proto__.hasOwnProperty("compiledCallbacks")) {
				this.compileCallbacks();
			}

			this.callbackId = Events.Callbacks.guid++;

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
			if (this.callbackDispatcher) {
				this.callbackDispatcher.destructor();
				this.callbackDispatcher = null;
			}
		},

		setUpCallbacks: function() {
			// Child classes may override this to do something special with adding callbacks.
		},

		notify: function(message, data) {
			var success = this.publish(this.callbackIdPrefix + "." + this.callbackId + "." + message, this, data);
			data = null;
			return success;
		},

		listen: function(message, context, callback) {
			this.subscribe(this.callbackIdPrefix + "." + this.callbackId + "." + message, context, callback);
			context = callback = null;
		},
		
		ignore: function(message, context, callback) {
			this.unsubscribe(this.callbackIdPrefix + "." + this.callbackId + "." + message, context, callback);
			context = callback = null;
		}

	}

};
