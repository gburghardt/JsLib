BaseModule = Object.extend({

	includes: [ Object.ApplicationEvents, Object.Callbacks ],

	prototype: {

		actions: null,

		delegator: null,

		delegatorEventActionMapping: null,

		element: null,

		options: null,

		initialize: function(element, options) {
			if (this.__proto__ === BaseModule.prototype) {
				throw new Error("BaseModule is an abstract class and cannot be instantiated directly.");
			}

			this.element = element;
			this.options = {
				delegatorActionPrefix: null
			};

			if (options) {
				this.options.merge(options);
			}

			this.initCallbacks();
			this.setUpCallbacks();
			this.notify("afterInitialize", this);

			element = options = null;
		},

		init: function() {
			this.element = (typeof this.element === "string") ? document.getElementById(this.element) : this.element;

			if (!this.__proto__.hasOwnProperty("delegatorEventActionMapping")) {
				this.compileDelegatorEventActionMapping();
			}

			this.delegator = new dom.events.Delegator(this, this.element, this.options.delegatorActionPrefix || null);
			this.delegator.setEventActionMapping(this.delegatorEventActionMapping);
			this.notify("afterInit", this);

			return this;
		},

		destructor: function() {
			this.notify("beforeDestroy", this);

			if (this.delegator) {
				this.delegator.destructor();
				this.delegator = null;
			}

			this.destroyApplicationEvents();
			this.destroyCallbacks();

			this.actions = this.delegatorEventActionMapping = this.options = this.element = null;
		},

		compileDelegatorEventActionMapping: function() {
			var mapping = {}, callbackName, i, length, actions, proto = this.__proto__;

			while (proto) {
				if (proto.hasOwnProperty("actions") && proto.actions) {
					actions = proto.actions;

					for (callbackName in actions) {
						if (actions.hasOwnProperty(callbackName)) {
							// force actions[callbackName] to be an Array
							actions[callbackName] = actions[callbackName] instanceof Array ? actions[callbackName] : [ actions[callbackName] ];

							for (i = 0, length = actions[callbackName].length; i < length; i++) {
								mapping[ actions[callbackName][i] ] = callbackName;
							}
						}
					}
				}

				proto = proto.__proto__;
			}

			this.__proto__.delegatorEventActionMapping = mapping;

			mapping = actions = null;
		},

		setUpCallbacks: function() {
			// Child classes may override this to do something special with adding callbacks.
		}

	}

});
