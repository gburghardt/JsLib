BaseModule = Object.extend({

	includes: [ Object.ApplicationEvents, Object.Callbacks ],

	self: {
		factory: null,

		getEventDispatcher: function() {
			return BaseModule.eventDispatcher;
		}
	},

	prototype: {

		actions: null,

		delegator: null,

		delegatorEventActionMapping: null,

		element: null,

		options: null,

		view: null,

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
			this.run();

			return this;
		},

		destructor: function() {
			this.notify("beforeDestroy", this);

			if (BaseModule.factory) {
				BaseModule.factory.unregisterModule(this);
			}

			if (this.delegator) {
				this.delegator.destructor();
				this.delegator = null;
			}

			this.destroyApplicationEvents();
			this.destroyCallbacks();

			if (this.element) {
				this.element.parentNode.removeChild(this.element);
				this.element = null;
			}

			this.actions = this.delegatorEventActionMapping = this.options = null;
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

		render: function(templateName, context) {
			if (!this.view) {
				this.view = BaseView.getInstance(this.element, templateName);
			}

			this.view.templateName = templateName;
			this.view.render(context);
		},

		run: function() {
			// Child classes can define a method called run to begin the life cycle of a module. This is just a stub.
		}

	}

});

// TODO: Make sub module properties a dynamic getter property.