ModuleFactory = Object.extend({

	prototype: {

		eventDispatcher: null,

		modules: null,

		initialize: function(eventDispatcher) {
			this.eventDispatcher = eventDispatcher;
			BaseModule.eventDispatcher = eventDispatcher;
			BaseModule.factory = this;
			this.modules = {};
			eventDispatcher = null;
		},

		destructor: function() {
			this.eventDispatcher = null;
		},

		createModule: function(className, element, moduleInfo) {
			var containerElement = document.getElementsByTagName("body")[0];
			var module, moduleElement;

			if (moduleInfo.container) {
				containerElement = containerElement.querySelectorAll(moduleInfo.container)[0];

				if (!containerElement) {
					throw new Error("Could not find module container element with selector " + moduleInfo.container);
				}
			}

			moduleElement = (moduleInfo.element) ? document.createElement(moduleInfo.element) : element;
			module = this.getInstance(className, moduleElement, moduleInfo.options);

			if (moduleInfo.insert === "bottom") {
				containerElement.appendChild(module.element);
			}
			else if (containerElement.firstChild) {
				containerElement.insertBefore(module.element, containerElement.firstChild);
			}
			else {
				containerElement.appendChild(module.element);
			}

			module.init();

			element = moduleInfo = containerElement = moduleElement = element = null;

			return module;
		},

		getClassReference: function(className) {
			if ( /^[a-zA-Z][a-zA-z0-9.]+[a-zA-z0-9]$/.test(className) ) {
				return eval(className);
			}
			else {
				throw new Error(className + " is an invalid class name");
			}
		},

		getInstance: function(className, element, options) {
			var Klass = this.getClassReference(className);
			element.className = "module module-" + className.namify();
			var module = new Klass(element, options);

			this.registerModule(className, module);

			return module;
		},

		registerModule: function(className, module) {
			this.modules[className] = this.modules[className] || [];
			this.modules[className].push(module);
			module = null;
		},

		unregisterModule: function(module) {
			var className, i, length, modules;

			for (className in this.modules) {
				if (this.modules.hasOwnProperty(className)) {
					modules = this.modules[className];

					for (i = 0, length = modules.length; i < length; i++) {
						if (modules[i] === module) {
							modules.splice(i, 1);
							break;
						}
					}
				}
			}

			modules = module = null;
		}

	}

});

// TODO: Create method to find a module, instantiate it and inject it into another module as a property.