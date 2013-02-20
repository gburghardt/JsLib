BaseModule = Object.extend({

	includes: [
		Object.ApplicationEvents,
		Object.Callbacks
	],

	self: {
		factory: null
	},

	prototype: {

		actions: null,

		delegator: null,

		delegatorEventActionMapping: null,

		document: null,

		element: null,

		options: {
			delegatorActionPrefix: null
		},

		template: null,

		view: null,

		initialize: function(element, options) {
			if (this.__proto__ === BaseModule.prototype) {
				throw new Error("BaseModule is an abstract class and cannot be instantiated directly.");
			}

			this.element = element;
			this.options = this.mergePropertyFromPrototypeChain("options");

			if (options) {
				this.options.merge(options);
			}

			this.initCallbacks();
			this.notify("afterInitialize", this);

			element = options = null;
		},

		init: function() {
			this.element = (typeof this.element === "string") ? document.getElementById(this.element) : this.element;
			this.document = this.element.ownerDocument;

			if (!this.__proto__.hasOwnProperty("delegatorEventActionMapping")) {
				this.compileDelegatorEventActionMapping();
			}

			this.delegator = new dom.events.Delegator(this, this.element, this.options.delegatorActionPrefix || null);
			this.delegator.setEventActionMapping(this.delegatorEventActionMapping);

			if (!this.template) {
				this.view = new BaseView(this.element);
			}

			this.notify("afterInit", this);
			this.run();

			return this;
		},

		destructor: function() {
			this.notify("beforeDestructor", this);

			if (BaseModule.factory) {
				BaseModule.factory.unregisterModule(this);
			}

			if (this.delegator) {
				this.delegator.destructor();
				this.delegator = null;
			}

			this.destroyApplicationEvents();
			this.destroyCallbacks();

			if (this.element && this.element.parentNode) {
				this.element.parentNode.removeChild(this.element);
			}

			this.document = this.element = this.actions = this.delegatorEventActionMapping = this.options = null;
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

		createModuleProperty: function(propertyName) {
			if (!BaseModule.factory) {
				throw new Error("Cannot create property " + propertyName + ", because no module factory exists in BaseModule.factory");
			}

			var propertyElement, elements = this.element.getElementsByTagName("*");
			var module;

			if (this[propertyName] === null) {
				module = this.createModuleSingleProperty(propertyName, elements);
			}
			else if (this[propertyName] instanceof Array && this[propertyName].length === 0) {
				module = this.createModuleArrayProperty(propertyName, elements);
			}

			this[propertyName] = module;

			module = elements = null;
		},

		createModuleArrayProperty: function(propertyName, elements) {
			var i = 0, length = elements.length, modules = [],
					propertyElement, className, moduleInfo;

			for (i; i < length; i++) {
				if (elements[i].getAttribute("data-module-property") === propertyName) {
					propertyElement = elements[i];
					className = propertyElement.getAttribute("data-module");
					moduleInfo = JSON.parse(propertyElement.getAttribute("data-module-info"));
					modules.push( BaseModule.factory.createModule(className, propertyElement, moduleInfo) );
					elements[i].removeAttribute("data-module-property");
					elements[i].setAttribute("data-module-property-created", propertyName);
				}
			}

			elements = moduleInfo = null;

			return modules;
		},

		createModuleSingleProperty: function(propertyName, elements) {
			var i = 0, length = elements.length, module,
					propertyElement, className, moduleInfo;

			for (i; i < length; i++) {
				if (elements[i].getAttribute("data-module-property") === propertyName) {
					propertyElement = elements[i];
					break;
				}
			}

			if (!propertyElement) {
				throw new Error("Cannot instantiate " + propertyName + " module. No element with data-module-property=" + propertyName + " was found.");
			}

			className = propertyElement.getAttribute("data-module");
			moduleInfo = JSON.parse(propertyElement.getAttribute("data-module-info") || "{}");

			module = BaseModule.factory.createModule(className, propertyElement, moduleInfo);
			propertyElement.removeAttribute("data-module-property");
			propertyElement.setAttribute("data-module-property-created", propertyName);

			elements = moduleInfo = propertyElement = null;

			return module;
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
