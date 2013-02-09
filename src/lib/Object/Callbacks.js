Object.Callbacks = {

	prototype: {

		callbacks: null,

		initCallbacks: function() {
			if (this.__proto__.hasOwnProperty("compiledCallbacks")) {
				return;
			}

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
			console.info("Object.Callbacks#destroyCallbacks - Implement me!");
		},

		notify: function(message, data) {
			console.info("Object.Callbacks#notify (" + message + ") - Implement me!", data);
		},

		listen: function(message, context, callback) {
			console.info("Object.Callbacks#listen (" + message + ") - Implement me!", {context: context, callback: callback});
		},
		
		ignore: function(message, context, callback) {
			console.info("Object.Callbacks#ignore (" + message + ") - Implement me!", {context: context, callback: callback});
		}

	}

};
