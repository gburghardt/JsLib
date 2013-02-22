/* File: src/lib/patches/Function.js */
if (!Function.prototype.bind) {
	Function.prototype.bind = function(context) {
		var self = this;
		var fn = function() {
			return self.apply(context, arguments);
		};

		fn.cleanup = function() {
			self = fn = context = null;
		};

		return fn;
	};
}

if (!Function.prototype.include) {
	Function.prototype.include = function(mixin) {
		var key;

		// include class level methods
		if (mixin.self) {
			for (key in mixin.self) {
				if (mixin.self.hasOwnProperty(key) && !this[key]) {
					this[key] = mixin.self[key];
				}
			}
		}

		// include instance level methods
		if (mixin.prototype) {
			for (key in mixin.prototype) {
				if (mixin.prototype.hasOwnProperty(key) && !this.prototype[key]) {
					this.prototype[key] = mixin.prototype[key];
				}
			}
		}

		if (mixin.included) {
			mixin.included(this);
		}

		mixin = null;
	};
}

if (!Function.prototype.extend) {
	Function.prototype.extend = function(descriptor) {
		descriptor = descriptor || {};
		var key, i, length;

		// Constructor function for our new class
		var Klass = function() {
			this.initialize.apply(this, arguments);
		};

		// Temp class referencing this prototype to avoid calling initialize() when inheriting
		var ProxyClass = function() {};
		ProxyClass.prototype = this.prototype;

		// "inherit" class level methods
		for (key in this) {
			if (this.hasOwnProperty(key)) {
				Klass[key] = this[key];
			}
		}

		// new class level methods
		if (descriptor.self) {
			for (key in descriptor.self) {
				if (descriptor.self.hasOwnProperty(key)) {
					Klass[key] = descriptor.self[key];
				}
			}
		}

		// set up true prototypal inheritance
		Klass.prototype = new ProxyClass();

		// new instance level methods
		if (descriptor.prototype) {
			for (key in descriptor.prototype) {
				if (descriptor.prototype.hasOwnProperty(key)) {
					Klass.prototype[key] = descriptor.prototype[key];
				}
			}
		}

		// apply mixins
		if (descriptor.includes) {
			// force includes to be an array
			descriptor.includes = (descriptor.includes instanceof Array) ? descriptor.includes : [descriptor.includes];

			for (i = 0, length = descriptor.includes.length; i < length; i++) {
				Klass.include(descriptor.includes[i]);
			}
		}

		// ensure new prototype has an initialize method
		Klass.prototype.initialize = Klass.prototype.initialize || function() {};

		// set reference to constructor function in new prototype
		Klass.prototype.constructor = Klass;

		ProxyClass = descriptor = null;

		return Klass;
	};
}

/* File: src/lib/patches/Object.js */
Object.include({
	self: {

		defineProperty: function(obj, property, descriptor) {
			if (descriptor.readable) {
				obj.__defineGetter__(property, descriptor.get);
			}

			if (descriptor.writable) {
				obj.__defineSetter(property, descriptor.set);
			}

			if (descriptor.value !== undefined) {
				obj[property] = descriptor.value;
			}
		}

	},
	prototype: {

		merge: function() {
			var key, args = arguments, i = 0, length = args.length, arg;

			for (i; i < length; i++) {
				arg = args[i];

				for (key in arg) {
					if (arg.hasOwnProperty(key)) {
						this[key] = arg[key];
					}
				}
			}

			arg = args = null;

			return this;
		}

	}
});

/* File: src/lib/patches/String.js */
if (!String.prototype.capitalize) {
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1, this.length);
	};
}

if (!String.prototype.namify) {
	String.prototype.namify = function() {
		return this.replace(/\./g, "-").replace(/([a-z][A-Z][a-z])/g, function(match, $1) {
			return $1.charAt(0) + "_" + $1.charAt(1).toLowerCase() + $1.charAt(2);
		}).toLowerCase();
	};
}

if (!String.prototype.singularize) {
	String.prototype.singularize = function() {
		if (/ies$/.test(this)) {
			// e.g. "dailies" becomes "daily"
			return this.replace(/(ies)$/, "y");
		}
		else if (/[^aeiou]s$/.test(this)) {
			// e.g. "cars" becomes "car"
			return this.replace(/([^aeiou])s$/, "$1");
		}
		else if (/es$/.test(this)) {
			// e.g. "sales" becomes "sale"
			return this.replace(/es$/, "e");
		}
		else {
			// return a direct duplicate of this string
			return this + "";
		}
	};
}

String.prototype.constantize = function() {
  var value;

	if ( this.match( /^[a-zA-Z][-_.a-zA-Z0-9]*$/ ) ) {
    try {
  		value = eval( this.toString() );
    }
    catch (error) {
      
    }
	}

  return value || null;
};

String.prototype.toClassName = function() {
	if (this.match(/[^-_a-zA-Z0-9]/)) {
		return "";
	}

	var pieces = this.split(/-/g);
	var className = pieces[pieces.length - 1];
	pieces = pieces.slice(0, pieces.length - 1);

	className = className.replace(/(^[a-z])|(_[a-z])/g, function($1) {
		return $1.replace(/^_/, "").toUpperCase();
	});

	return pieces.length ? pieces.join(".") + "." + className : className;
};

/* File: src/lib/HTMLElement/Adaptors.js */
(function() {
	var idIndex = 0;

	HTMLElement.Adaptors = {
		self: {
			include: function(mixin) {
				Function.prototype.include.call(this, mixin);
			}
		},
		prototype: {
			addClass: function(className) {
				if (!this.hasClass(className)) {
					this.className += " " + className;
				}
			},
			hasClass: function(className) {
				return new RegExp("(^\\s*|\\s*)" + className + "(\\s*|\\s*$)").test(this.className);
			},
			identify: function() {
				if (!this.id) {
					this.id = this.getAttribute("id") || 'anonoymous-' + this.nodeName.toLowerCase() + '-' + (idIndex++);
					this.setAttribute("id", this.id);
				}

				return this.id;
			},
			querySelector: function(selector) {
				return this.querySelectorAll(selector)[0] || null;
			},
			removeClass: function(className) {
				// TODO: Fix this
				if (this.hasClass(className)) {
					this.className = this.className.replace(new RegExp("(^\\s*|\\s*)" + className + "(\\s*|\\s*$)"), "");
				}
			}
		}
	};
})();

// HTMLElement is a special object which is not instantiable, but has a prototype.
Function.prototype.include.call(HTMLElement, HTMLElement.Adaptors);
document.querySelector = document.querySelector || HTMLElement.Adaptors.querySelector;
/* File: src/lib/dom/events/Delegator.js */
dom = window.dom || {};
dom.events = dom.events || {};

dom.events.Delegator = function() {

// Access: Public

	this.initialize = function(delegate, node, actionPrefix) {
		this.delegate = delegate;
		this.node = node;
		this.setActionPrefix(actionPrefix || "");
		this.eventTypes = [];
		this.eventTypesAdded = {};
		this.eventActionMapping = null;
	};

	this.destructor = function() {
		if (this.node) {
			this.removeEventTypes(this.eventTypes);
			this.node = null;
		}

		this.delegate = self = null;
	};

	this.init = function() {
		if (typeof this.node === "string") {
			this.node = document.getElementById(this.node);
		}

		return this;
	};

	this.addEventType = function(eventType) {
		if (!this.eventTypesAdded[eventType]) {
			this.eventTypes.push(eventType);
			this.node.addEventListener(eventType, handleEvent, false);
			this.eventTypesAdded[eventType] = true;
		}
	};

	this.addEventTypes = function(eventTypes) {
		var i = 0, length = eventTypes.length;

		for (i; i < length; ++i) {
			this.addEventType(eventTypes[i]);
		}
	};

	this.removeEventType = function(eventType) {
		if (this.eventTypesAdded[eventType]) {
			this.node.removeEventListener(eventType, handleEvent, false);
			this.eventTypesAdded[eventType] = false;
		}
	};

	this.removeEventTypes = function(eventTypes) {
		var i = 0, length = eventTypes.length;

		for (i; i < length; ++i) {
			this.removeEventType(eventTypes[i]);
		}
	};

	this.setActionPrefix = function(actionPrefix) {
		if (!actionPrefix) {
			return;
		}

		if (!actionPrefix.match(/\.$/)) {
			actionPrefix += ".";
		}

		this.actionPrefix = actionPrefix;
		this.actionRegex = new RegExp("^" + this.actionPrefix.replace(/\./g, '\\.'));
	};

	this.setEventActionMapping = function(mapping) {
		var actionName;

		if (this.eventActionMapping) {
			for (actionName in this.eventActionMapping) {
				if (this.eventActionMapping.hasOwnProperty(actionName)) {
					this.removeEventType( this.eventActionMapping[actionName] );
				}
			}
		}

		this.eventActionMapping = mapping;

		for (actionName in this.eventActionMapping) {
			if (this.eventActionMapping.hasOwnProperty(actionName)) {
				this.addEventType( this.eventActionMapping[actionName] );
			}
		}

		mapping = null;
	};

	this.triggerEvent = function(type) {
		var event = getDocument().createEvent("CustomEvent");
		event.initCustomEvent(type, true, false, null);
		this.node.dispatchEvent(event);
		event = null;
	};

// Access: Private

	var self = this;

	this.node = null;

	this.eventTypes = null;

	this.eventTypesAdded = null;

	this.delegate = null;

	function getActionParams(element, eventType) {
		var paramsAttr = element.getAttribute("data-actionparams-" + eventType) ||
		                 element.getAttribute("data-actionparams") ||
		                 "{}";

		element = null;

		return JSON.parse(paramsAttr);
	}

	function getDocument() {
		return self.node.ownerDocument;
	}

	function stopPropagationPatch() {
		this._stopPropagation();
		this.propagationStopped = true;
	}

	function patchEvent(event) {
		if (!event._stopPropagation) {
			event._stopPropagation = event.stopPropagation;
			event.stopPropagation = stopPropagationPatch;
			event.propagationStopped = false;
			event.stop = function() {
				this.preventDefault();
				this.stopPropagation();
			};
		}

		return event;
	}

	function handleEvent(event) {
		event = patchEvent(event);

		if (!event.actionTarget) {
			// This event has not been delegated yet. Start the delegation at the target
			// element for the event. Note that event.target !== self.node. The
			// event.target object is the element that got clicked, for instance.
			event.actionTarget = event.target;
		}

		// The default method to call on the delegate is "handleAction". This will only
		// get called if the delegate has defined a "handleAction" method.
		var action = null, actionName = null, method = "handleAction", params;

		// Try inferring the action from the data-action attribute specific to this event...
		actionName = event.actionTarget.getAttribute("data-action-" + event.type);
		
		if (!actionName) {
			// No event specifc data-action attribute was found. Try the generic one...
			actionName = event.actionTarget.getAttribute("data-action");

			if (actionName && self.eventActionMapping && self.eventActionMapping[ actionName ] !== event.type) {
				// An action-to-event mapping was found, but not for this action + event combo. Do nothing.
				// For instance, the action is "foo", and the event is "click", but eventActionMapping.foo
				// is either undefined or maps to a different event type.
				actionName = null;
			}
		}

		if (actionName) {
			// We found an action, so set that as the method name to call on the delegate object.
			// FIXME: if the action prefix doesn't match, the method gets fired anyhow
			actionName = actionName.replace(self.actionRegex, "");
			method = actionName;
		}

		if (self.delegate[method]) {
			// The method exists on the delegate object. Try calling it...
			try {
				params = getActionParams(event.actionTarget, event.type);
				self.delegate[method](event, event.actionTarget, params, actionName);
			}
			catch (error) {
				// The delegate method threw an error. Try to recover gracefully...
				event.preventDefault();
				event.stopPropagation();

				if (self.delegate.handleActionError) {
					// The delegate has a generic error handler, call that, passing in the error object.
					self.delegate.handleActionError(event, event.actionTarget, {error: error}, actionName);
				}
				else if (self.constructor.errorDelegate) {
					// A master error delegate was found (for instance, and application object). Call "handleActionError"
					// so this one object can try handling errors gracefully.
					self.constructor.errorDelegate.handleActionError(event, event.actionTarget, {error: error}, actionName);
				}
				else if (self.constructor.logger) {
					// A class level logger was found, so log an error level message.
					self.constructor.logger.warn("An error was thrown while executing method \"" + method + "\", action \"" + actionName + "\", during a \"" + event.type + "\" event on element " + self.node.nodeName + "." + self.node.className.split(/\s+/g).join(".") + "#" + self.node.identify() + ".");
					self.constructor.logger.error(error);
				}
				else {
					// Give up. Throw the error and let the developer fix this.
					throw error;
				}
			}
		}

		if (!event.propagationStopped && event.actionTarget !== self.node && event.actionTarget.parentNode) {
			// The delegate has not explicitly stopped the event, so keep looking for more data-action
			// attributes on the next element up in the document tree.
			event.actionTarget = event.actionTarget.parentNode;
			handleEvent(event);
		}
		else {
			// Finished calling actions. Return event object to its normal state. Let
			// event continue bubbling up the DOM.
			event.actionTarget = null;
			event.stopPropagation = event._stopPropagation;
			event._stopPropagation = null;
			event.propagationStopped = null;
		}

		event = null;
	}
 
	this.constructor = dom.events.Delegator;
	this.initialize.apply(this, arguments);
};

dom.events.Delegator.logger = window.console || null;


/* File: src/lib/events/Dispatcher.js */
window.events = window.events || {};

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

/* File: src/lib/events/Event.js */
window.events = window.events || {};

Events.Event = function(type, publisher, data) {
	this.type = type;
	this.publisher = publisher;
	this.data = data || {};
	this.dateStarted = (this.INCLUDE_DATE) ? new Date() : null;
	publish = data = null;
};

Events.Event.prototype = {

	INCLUDE_DATE: true,

	cancelled: false,
	data: null,
	dateStarted: null,
	publisher: null,
	type: null,

	destructor: function() {
		this.publisher = this.data = this.dateStarted = null;
	},

	cancel: function() {
		this.cancelled = true;
	}

};

/* File: src/lib/Object/ApplicationEvents.js */
Events.ApplicationEvents = {

	self: {

		eventDispatcher: null,

		getEventDispatcher: function() {
			return this.eventDispatcher;
		},

		checkEventDispatcher: function() {
			if (!this.getEventDispatcher()) {
				throw new Error("No application event dispatcher was found.");
			}

			return true;
		},

		publish: function(eventName, publisher, data) {
			this.checkEventDispatcher();
			this.getEventDispatcher().publish(eventName, publisher, data);
		},

		subscribe: function(eventName, context, callback) {
			this.checkEventDispatcher();
			this.getEventDispatcher().subscribe(eventName, context, callback);
		},

		unsubscribe: function(eventName, context, callback) {
			this.checkEventDispatcher();
			this.getEventDispatcher().unsubscribe(eventName, context, callback);
		}

	},

	prototype: {

		destroyApplicationEvents: function() {
			if (this.constructor.getEventDispatcher()) {
				this.constructor.unsubscribe(this);
			}
		},

		publish: function(eventName, data) {
			this.constructor.publish(eventName, this, data);
		},

		subscribe: function(eventName, context, callback) {
			this.constructor.subscribe(eventName, context, callback);
		},

		unsubscribe: function(eventName, context, callback) {
			this.constructor.unsubscribe(eventName, context, callback);
		}

	}

};

/* File: src/lib/Object/Callbacks.js */
Events.Callbacks = {

	prototype: {

		callbackDispatcher: null,

		callbacks: null,

		initCallbacks: function() {
			if (!this.__proto__.hasOwnProperty("compiledCallbacks")) {
				this.compileCallbacks();
			}

			this.callbackDispatcher = new Events.Dispatcher();

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
			this.callbackDispatcher.publish(message, this, data);
			data = null;
		},

		listen: function(message, context, callback) {
			this.callbackDispatcher.subscribe(message, context, callback);
			context = callback = null;
		},
		
		ignore: function(message, context, callback) {
			this.callbackDispatcher.unsubscribe(message, context, callback);
			context = callback = null;
		}

	}

};

/* File: src/lib/ModuleFactory.js */
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

		createModules: function(element) {
			var classNames = element.getAttribute("data-module").replace(/^\s+|\s+$/g, "").split(/\s+/g);
			var modules = [], moduleInfo, i, length, className;

			moduleInfo = JSON.parse(element.getAttribute("data-module-info") || "{}");

			if (classNames.length === 1) {
				modules.push( this.createModule(classNames[0], element, moduleInfo) );
			}
			else {
				for (i = 0, length = classNames.length; i < length; i++) {
					className = classNames[i];
					modules.push( this.createModule( classNames[i], element, moduleInfo[className] || {} ) );
				}
			}

			element = params = null;

			return modules;
		},

		createModule: function(className, element, moduleInfo) {
			var containerElement = document.getElementsByTagName("body")[0];
			var module, moduleElement;

			if (moduleInfo.container) {
				containerElement = containerElement.querySelectorAll(moduleInfo.container)[0];
				moduleInfo.element = moduleInfo.element || "div";

				if (!containerElement) {
					throw new Error("Could not find module container element with selector " + moduleInfo.container);
				}
			}

			moduleElement = (moduleInfo.element) ? document.createElement(moduleInfo.element) : element;
			module = this.getInstance(className, moduleElement, moduleInfo.options);

			if (!moduleElement.parentNode) {
				if (moduleInfo.insert === "bottom") {
					containerElement.appendChild(module.element);
				}
				else if (containerElement.firstChild) {
					containerElement.insertBefore(module.element, containerElement.firstChild);
				}
				else {
					containerElement.appendChild(module.element);
				}
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
			element.className += " module module-" + className.namify();
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
/* File: src/lib/Template.js */
// <script type="text/html" data-template-name="blog/post_body">
// 	#{include blog/header}
// 
// 	<h1>#{title}</h1>
// 	<p>#{body}</p>
// 	<ol>
// 		<li>#{render blog/post/comments with comments}</li>
// 	</ol>
// 
// 	#{include blog/footer}
// </script>

Template = Object.extend({

	self: {

		cacheBuster: new Date().getTime(),

		document: document,

		REGEX_INCLUDE: /#\{\s*include\s+(.+?)\s*\}/g,
		REGEX_RENDER: /#\{\s*render\s+(.+?)(\s+with\s+(.*?)\s*)?\}/g,

		templates: {},

		fetch: function(name, context, callback) {
			if (Template.templates[name]) {
				callback.call(context, Template.templates[name]);
			}
			else {
				var source = Template.getTemplateSourceNode(name);
				var url = source.getAttribute("data-src");
				var xhr;

				var cleanup = function() {
					context = callback = xhr = source = cleanup = null;
				};

				if (url) {
					url = url + (/\?/.test(url) ? "&" : "?") + "cacheBuster=" + Template.cacheBuster;
					xhr = new XMLHttpRequest();
					xhr.open("GET", url);
					xhr.onreadystatechange = function() {
						if (this.readyState === 4 && this.status === 200) {
							if (this.status === 200) {
								Template.fetchSubTemplates(xhr.responseText, function() {
									Template.templates[name] = new Template(name, xhr.responseText);
									callback.call(context, Template.templates[name]);
									cleanup();
								});
							}
							else if (this.status === 403) {
								cleanup();
								throw new Error("Failed to fetch template from URL: " + url + ". Server returned 403 Not Authorized");
							}
							else if (this.status === 404) {
								cleanup();
								throw new Error("Failed to fetch template from URL: " + url + ". Server returned 404 Not Found.");
							}
							else if (this.status >= 400) {
								cleanup();
								throw new Error("Failed to fetch template from URL: " + url + ". Server returned an error (" + this.status + ")");
							}
						}
					};
					xhr.send(null);
				}
				else {
					Template.templates[name] = new Template(name, source);
					Template.fetchSubTemplates(Template.templates.source, function() {
						callback.call(context, Template.templates[name]);
						cleanup();
					});
				}
			}
		},

		fetchSubTemplates: function(source, callback) {
			var subTemplates = [], total, i = 0, count = 0;

			var handleTemplateFetched = function() {
				count++;

				if (count === total) {
					callback();
				}
			};

			source.replace(this.REGEX_RENDER, function(tag, templateName, dataKey) {
				subTemplates.push(templateName);
			}).replace(this.REGEX_INCLUDE, function(tag, templateName) {
				subTemplates.push(templateName);
			});

			total = subTemplates.length;

			if (total) {
				for (i = 0; i < total; i++) {
					Template.fetch(subTemplates[i], this, handleTemplateFetched);
				}
			}
			else {
				callback();
			}
		},

		find: function(name) {
			if (!Template.templates[name]) {
				var source = Template.getTemplateSourceNode(name);
				Template.templates[name] = new Template(name, source);
				source = null;
			}

			return Template.templates[name];
		},

		getTemplateSourceNode: function(name) {
			var source = Template.document.querySelector("script[data-template-name=" + name.replace(/\//g, "\\/") + "]");

			if (!source) {
				throw new Error('Missing template ' + name + '. Required: <script type="text/html" data-template-name="' + name + '"></script>');
			}

			return source;
		}

	},

	prototype: {

		name: null,

		source: null,

		subTemplatesFetched: false,

		initialize: function(name, source) {
			this.name = name;
			this.setSource(source);
		},

		render: function(data) {
			var key, source = this.source, regexRender = Template.REGEX_RENDER, regexInclude = Template.REGEX_INCLUDE;

			var renderReplacer = function(tag, templateName, withClause, dataKey) {
				var renderData = (!dataKey) ? data : data[ dataKey ];
				if (renderData instanceof Array) {
					var buffer = [], i = 0, length = renderData.length, template = Template.find(templateName), str;
					
					for (i; i < length; i++) {
						buffer.push( template.render( renderData[i] ) );
					}

					str = buffer.join("");

					template = buffer = null;

					return str;
				}
				else {
					return Template.find(templateName).render( renderData );
				}
			};

			var includeReplacer = function(tag, templateName) {
				return Template.find(templateName).render(data);
			};

			var doReplace = function(key) {
				var regex = new RegExp("#\\{\\s*" + key.replace(/\./g, "\\\.", "g") + "\\s*\\}", "g");

				// replace #{foo} tags with value at data[foo]
				source = source.replace(regex, data[key] || "");

				// replace #{render with foo} tags by rendering data[foo]
				if (source.match(regexRender)) {
					source = source.replace(regexRender, renderReplacer);
				}

				// replace #{include} tags
				if (source.match(Template.templates[name])) {
					source = source.replace(regexInclude, includeReplacer);
				}
			};

			if (data.getTemplateKeys) {
				var keys = data.getTemplateKeys(), i = 0, length = keys.length;

				for (i; i < length; i++) {
					doReplace(keys[i]);
				}
			}
			else {
				for (key in data) {
					if (data.hasOwnProperty(key)) {
						doReplace(key);
					}
				}
			}

			// clean up unmatched template tags
			source = source.replace(/#\{.+?\}/g, "");

			data = regexRender = regexInclude = renderReplacer = renderInclude = null;

			return source;
		},

		setSource: function(source) {
			if (typeof source === "string") {
				this.source = source;
			}
			else {
				this.source = source.innerHTML;
				this.name = source.getAttribute("data-template-name");
			}

			source = null;
		}

	}

});

/* File: src/framework/views/BaseView.js */
/*

class BaseView extends Object
	Public:
		constructor(String | HTMLElement id)
		init()
		destructor()
	Protected:
		id <String>
		ownerDocument <Document>
		element <HTMLElement>
		getElementBySiffux(String idSuffix) returns HTMLElement
		querySelector(String selector) returns HTMLElement or undefined
		querySelectorAll(String selector) returns HTMLCollection

*/
BaseView = Object.extend({

	self: {

		getInstance: function(element, templateName) {
			var className = (templateName.replace(/\//g, "-") + "_view").toClassName();
			var ViewClass = className.constantize();
			var view;

			if (!ViewClass) {
				ViewClass = this;
			}

			view = new ViewClass(element, templateName);
			ViewClass = element = null;
			return view;
		}

	},

	prototype: {

// Access: Public

		initialize: function(element, templateName) {
			if (typeof element === "string") {
				if (!this.ownerDocument) {
					this.ownerDocument = document;
				}

				this.element = this.ownerDocument.getElementById(element);
			}
			else {
				this.element = element;
				this.ownerDocument = this.element.ownerDocument;
				this.id = this.element.identify();
			}

			if (templateName) {
				this.templateName = templateName;
			}

			if (!this.element.childNodes.length) {
				this.element.innerHTML = this.getDefaultHTML();
			}

			element = null;
		},

		destructor: function() {
			this.element = this.ownerDocument = null;
		},

		getDefaultHTML: function() {
			return '<div class="view-loading"></div><div class="view-content"></div>';
		},

		render: function(model) {
			this.toggleLoading(true);

			Template.fetch(this.templateName, this, function(template) {
				this.model = model;
				this.querySelector(".view-content").innerHTML = template.render(this.model);
				this.toggleLoading(false);

				var firstField = this.querySelector("input,textarea,select");

				if (firstField) {
					firstField.focus();

					if (firstField.select) {
						firstField.select();
					}
				}

				firstField = template = null;
			});

			return this;
		},

		toggleLoading: function(loading) {
			if (loading) {
				this.querySelector(".view-loading").style.display = "block";
				this.querySelector(".view-content").style.display = "none";
			}
			else {
				this.querySelector(".view-loading").style.display = "none";
				this.querySelector(".view-content").style.display = "block";
			}
		},

// Access: Protected

		id: null,

		ownerDocument: null,

		element: null,

		templateName: null,

		getElementBySuffix: function(idSuffix) {
			return this.ownerDocument.getElementById(this.id + "-" + idSuffix);
		},

		querySelector: function(selector) {
			return this.element.querySelectorAll(selector)[0];
		},

		querySelectorAll: function(selector) {
			return this.element.querySelectorAll(selector);
		}

	}

});

/* File: src/lib/BaseView/Forms.js */
BaseView.Forms = {
	prototype: {
		currentData: null,

		fieldErrorNodeName: "div",

		model: null,

		getFormData: function(fromCache) {
			if (!fromCache || !this.currentData) {
				var inputs = this.element.getElementsByTagName("input");
				var selects = this.element.getElementsByTagName("select");
				var textareas = this.element.getElementsByTagName("textarea");

				this.currentData = {};
				this.extractFormControlsData(inputs, this.currentData);
				this.extractFormControlsData(selects, this.currentData);
				this.extractFormControlsData(textareas, this.currentData);

				inputs = selects = textareas = null;
			}

			return this.currentData;
		},

		extractControlValue: function(control) {
			var nodeName = control.nodeName.toLowerCase(),
					value = null, i, length
			;

			if (!control.disabled) {
				if (nodeName === "input") {
					if (control.type === "checkbox" || control.type === "radio") {
						if (control.checked) {
							value = control.value;
						}
					}
					else {
						value = control.value;
					}
				}
				else if (nodeName === "select") {
					if (control.multiple) {
						value = [];

						for (i = 0, length = control.options.length; i < length; ++i) {
							if (!control.options[i].disabled && control.options[i].selected && control.options[i].value) {
								value.push(control.options[i].value);
							}
						}
					}
					else {
						value = control.value;
					}
				}
				else {
					value = control.value;
				}
			}

			return (value === "") ? null : value;
		},

		extractControlValues: function(controls) {
			var i = 0, length = controls.length, values = [], value;

			for (i; i < length; ++i) {
				value = this.extractControlValue(control);

				if (value !== null) {
					values.push(value);
				}
			}

			return values;
		},

		extractFormControlsData: function(controls, data) {
			var name;
			var i = 0;
			var length = controls.length;
			var value;

			for (i; i < length; i++) {
				name = controls[i].name;
				value = this.extractControlValue(controls[i]);

				if (value === null) {
					continue;
				}
				else if (data.hasOwnProperty(name)) {
					if (data[name] instanceof Array) {
						data[name].push(value);
					}
					else {
						data[name] = [data[name], value];
					}
				}
				else {
					data[name] = value;
				}
			}

			controls = null;

			return data;
		},

		getControlsByName: function(name) {
			var nodes = this.element.getElementsByTagName("*"), i = 0, length = nodes.length, controls = [];

			for (i; i < length; ++i) {
				if (nodes[i].name === name) {
					controls.push(nodes[i]);
				}
			}

			nodes = null;
			return controls;
		},

		hideFieldErrors: function() {
			var errorElements = this.element.querySelectorAll(".form-field-error");
			var formErrorElement = this.element.querySelector(".form-errors");
			var i = 0, length = errorElements.length;

			for (i; i < length; i++) {
				errorElements[i].style.display = "none";
			}

			if (formErrorElement) {
				formErrorElement.style.display = "none";
			}

			errorElements = formErrorElement = null;
		},

		setFieldErrors: function(errors) {
			var errorElement = this.element.querySelector(".form-errors");
			var errorsMarkup, key, control;

			this.hideFieldErrors();

			if (errorElement) {
				errorsMarkup = [];
				errorsMarkup.push('<ul>');

				for (key in errors) {
					if (errors.hasOwnProperty(key)) {
						errorsMarkup.push('<li>' + errors[key].capitalize() + '</li>');
					}
				}

				errorsMarkup.push('</ul>');
				errorElement.innerHTML = errorsMarkup.join("");
				errorElement.style.display = "";
				errorElement = null;
			}
			else {
				errorsMarkup = "";

				for (key in errors) {
					if (errors.hasOwnProperty(key)) {
						errorElement = this.element.querySelector(".form-field-error-" + key);

						if (!errorElement) {
							errorElement = this.ownerDocument.createElement(this.fieldErrorNodeName);
							errorElement.className = "form-field-error-" + key + " form-field-error";
							errorElement.style.display = "none";
							control = this.getControlsByName(key)[0];
							control.parentNode.insertBefore(errorElement, control);
						}

						errorElement.innerHTML = errors[key].capitalize();
						errorElement.style.display = "";
					}
				}
			}
		}

	}
};

BaseView.include(BaseView.Forms);

/* File: src/framework/models/BaseModel.js */
BaseModel = Object.extend({

	self: {

		callbacks: {},

		guidIndex: 0,

		instances: {},

		applyModuleCallbacks: function(instance, name, args) {
			args = args || [];
			var result, results = [], i, length, callbacks = this.callbacks[name];

			if (callbacks) {
				for (i = 0, length = callbacks.length; i < length; i++) {
					result = callbacks[i].apply(instance, args);

					if (result !== undefined) {
						results.push(result);
					}
				}
			}

			instance = args = result = null;
			return results;
		},

		extend: function(descriptor) {
			descriptor = descriptor || {};

			if (descriptor.callbacks) {
				this.extendCallbacks(descriptor.callbacks);
			}

			// New class should manage its own instances
			descriptor.self = descriptor.self || {};
			descriptor.self.instances = {};
			descriptor.self.attributesInitialized = false;

			return Function.prototype.extend.call(this, descriptor);
		},

		extendCallbacks: function(callbacks) {
			var key;

			for (key in callbacks) {
				if (callbacks.hasOwnProperty(key)) {
					this.callbacks[key] = this.callbacks[key] || [];
					this.callbacks[key].push(callbacks[key]);
				}
			}

			callbacks = null;
		},

		find: function(id) {
			return this.instances[id] || null;
		},

		getPrimaryKey: function() {
			return this.prototype.primaryKey;
		},

		include: function(descriptor) {
			if (descriptor.callbacks) {
				this.extendCallbacks(descriptor.callbacks);
			}

			Function.prototype.include.call(this, descriptor);
			descriptor = null;
		},

		register: function(instance) {
			var id = instance.getPrimaryKey();

			if (this.instances[id]) {
				throw new Error("Cannot register two instances to the same Id: " + id);
			}

			this.instances[id] = instance;
			instance = null;
		}

	},

	prototype: {

		_attributes: null,

		_changedAttributes: null,

		guid: null,

		previouslyChanged: null,

		primaryKey: "id",

		subscribers: null,

		validAttributes: null,

		initialize: function(attributes) {
			this.guid = BaseModel.guidIndex++;
			this._attributes = {};
			this._changedAttributes = {};
			this.previouslyChanged = {};
			this.applyModuleCallbacks("initialize", [attributes]);
			this.initAttributes();

			if (attributes) {
				this.attributes = attributes;
			}

			this.newRecord = !this._attributes[this.primaryKey];

			attributes = null;
		},

		initAttributes: function() {
			if (this.constructor.attributesInitialized) {
				return;
			}

			Object.defineProperty(this.__proto__, "attributes", {
				get: this.getAttributes,
				set: this.setAttributes,
				enumerable: true
			});

			Object.defineProperty(this.__proto__, "changedAttributes", {
				get: this.getChangedAttributes,
				set: this.setChangedAttributes,
				enumerable: true
			});

			this.validAttributes = this.validAttributes || [];

			var i = 0, attrs = this.validAttributes, length, key;

			if (attrs.indexOf(this.primaryKey) < 0) {
				attrs.push(this.primaryKey);
			}

			for (i, length = attrs.length; i < length; ++i) {
				key = attrs[i];

				try {
					Object.defineProperty(this.__proto__, key, {
						get: this.createGetter(key),
						set: this.createSetter(key),
						enumerable: true
					});
				}
				catch (error) {
					// a getter/setter has already been defined, fail silently
				}
			}

			this.applyModuleCallbacks("initAttributes");
			this.constructor.attributesInitialized = true;
		},

		applyModuleCallbacks: function(callbackName, args) {
			return BaseModel.applyModuleCallbacks(this, callbackName, args);
		},

		getAttributes: function() {
			return this._attributes;
		},

		setAttributes: function(attrs) {
			var publishChangedEvent = false;

			this.applyModuleCallbacks("attributes", [attrs]);

			for (var key in attrs) {
				if (attrs.hasOwnProperty(key)) {
					this.setAttribute(key, attrs[key]);

					if (this.previouslyChanged[key]) {
						publishChangedEvent = true;
					}
				}
			}

			if (publishChangedEvent) {
				this.publish("attributes:changed");
			}
		},

		getChangedAttributes: function() {
			return this._changedAttributes;
		},

		setChangedAttributes: function(o) {
			for (var key in o) {
				if (o.hasOwnProperty(key)) {
					this._changedAttributes[key] = o[key];
				}
			}
		},

		createGetter: function(key) {
			return function() {
				return this.getAttribute(key);
			};
		},

		createSetter: function(key) {
			return function(newValue) {
				this.setAttribute(key, newValue)

				if (this.previouslyChanged[key]) {
					this.publish("attributes:changed");
				}
			};
		},

		getAttribute: function(key) {
			return (this._attributes[key] === undefined) ? null : this._attributes[key];
		},

		getPrimaryKey: function() {
			return this._attributes[this.primaryKey];
		},

		isValidAttributeKey: function(key) {
			return new RegExp("(^|\\s+)" + key + "(\\s+|$)").test(this.validAttributes.join(" "));
		},

		mergePropertyChain: function(key, defaults) {
			defaults = defaults || {};
      var proto = this, properties = [], i, length;

      // climb the prototype chain and get references to all properties in reverse order
      while (proto && proto != Object.prototype) {
        if (proto.hasOwnProperty(key)) {
          properties.unshift(proto[key])
        }

        proto = proto.__proto__;
      }

			// merge properties together with defaults
      for (i = 0, length = properties.length; i < length; i++) {
        defaults.merge(properties[i]);
      }

      this[key] = defaults;

      proto = protos = options = null;
		},

		setAttribute: function(key, value) {
			if (this.isValidAttributeKey(key) && value !== this._attributes[key] && this._attributes[key] !== undefined) {
				this._changedAttributes[key] = this._attributes[key];
				this._attributes[key] = value;
				this.previouslyChanged[key] = true;
				this.publish("attribute:" + key + ":changed");
			}
			else {
				this._attributes[key] = value;
			}

			if (key == this.primaryKey && !this.previouslyChanged[key]) {
				this.newRecord = false;
			}
		},

		valueIsEmpty: function(value) {
			return (value === undefined || value === null || String(value).replace(/\s+/g, "") === "") ? true : false;
		}

	}

});

/* File: src/lib/BaseModel/TemplateDataKeys.js */
BaseModel.TemplateDataKeys = {
	prototype: {
		getTemplateKeys: function() {
			if (!this._templateKeys) {
				var keys = [], i = 0, length = this.validAttributes.length;

				for (i; i < length; i++) {
					keys.push(this.validAttributes[i]);
				}

				// No need to capture a return value because module callbacks push items
				// onto the keys array.
				this.applyModuleCallbacks("getTemplateKeys", [keys]);
				this._templateKeys = keys;
			}

			return this._templateKeys;
		}
	}
};

BaseModel.include(BaseModel.TemplateDataKeys);
/* File: src/framework/modules/BaseModule.js */
BaseModule = Object.extend({

	includes: [ Events.ApplicationEvents, Events.Callbacks ],

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

			if (this.element && this.element.parentNode) {
				this.element.parentNode.removeChild(this.element);
			}

			this.element = this.actions = this.delegatorEventActionMapping = this.options = null;
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

			if (this[propertyName] === null) {
				this.createModuleSingleProperty(propertyName, elements);
			}
			else if (this[propertyName] instanceof Array && this[propertyName].length === 0) {
				this.createModuleArrayProperty(propertyName, elements);
			}

			elements = null;
		},

		createModuleArrayProperty: function(propertyName, elements) {
			var i = 0, length = elements.length,
			    propertyElement, className, moduleInfo;

			for (i; i < length; i++) {
				if (elements[i].getAttribute("data-module-property") === propertyName) {
					propertyElement = elements[i];
					className = propertyElement.getAttribute("data-module");
					moduleInfo = JSON.parse(propertyElement.getAttribute("data-module-info"));
					this[propertyName].push( BaseModule.factory.createModule(className, propertyElement, moduleInfo) );
				}
			}

			elements = moduleInfo = null;
		},

		createModuleSingleProperty: function(propertyName, elements) {
			var i = 0, length = elements.length,
			    propertyElement, className, moduleInfo;

			for (i; i < length; i++) {
				if (elements[i].getAttribute("data-module-property") === propertyName) {
					propertyElement = elements[i];
					break;
				}
			}

			className = propertyElement.getAttribute("data-module");
			moduleInfo = JSON.parse(propertyElement.getAttribute("data-module-info") || "{}");

			this[propertyName] = BaseModule.factory.createModule(className, propertyElement, moduleInfo);
			elements = moduleInfo = null;
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
/* File: src/framework/application/Application.js */
/*

Sample Use:

	var app = new Application();

	jQuery(function() {
		app.init();
	});

	jQuery(window).unload(function() {
		app.teardown();
		app = null;
	});

*/
Application = Object.extend({

	prototype: {

		config: null,

		delegator: null,

		document: null,

		element: null,

		eventDispatcher: null,

		moduleFactory: null,

		window: null,

		initialize: function() {
			this.config = {
				"delegator.eventTypes": ["click", "submit", "keydown", "keypress", "keyup", "domready"]
			};

			this.eventDispatcher = new Events.Dispatcher();
			this.moduleFactory = new ModuleFactory(this.eventDispatcher);
		},

		init: function(element) {
			this.element = element;
			this.document = element.ownerDocument;
			this.window = this.document.defaultView;
			this.window.onerror = this.handleError.bind(this);
			this.delegator = new dom.events.Delegator(this, element);
			this.delegator.addEventTypes( this.config["delegator.eventTypes"] );
			this.delegator.triggerEvent("domready");
			element = null;
		},

		destructor: function() {
			this.delegator.destructor();
			this.eventDispatcher.destructor();
			this.moduleFactory.destructor();
			this.window.onerror = this.window = this.document = this.element = this.delegator = this.moduleFactory = this.eventDispatcher = null;
		},

		configure: function(config) {
			var key;

			for (key in config) {
				if (config.hasOwnProperty(key)) {
					this.config[key] = config[key];
				}
			}

			config = null;
		},

		createModules: function(event, element, params) {
			var elements = element.getElementsByTagName("*");
			var i = 0, length = elements.length;

			for (i; i < length; i++) {
				if (elements[i].getAttribute("data-action-domready") === "createModule") {
					this.moduleFactory.createModules(elements[i]);
				}
			}
		},

		createModule: function(event, element, params) {
			event.stop();
			this.moduleFactory.createModules(element);
			event = element = params = null;
		},

		getErrorInfo: function(message, fileName, lineNumber) {
			var regex = /^Error: ([A-Z][a-zA-Z0-9]+Error) - (.*)$/;
			var info = message.match(regex) || [];
			return {
				type: info[1] || "Error",
				message: info[2] || "",
				fileName: fileName || "",
				lineNumber: lineNumber || 0
			};
		},

		handleError: function(message, fileName, lineNumber) {
			var info = this.getErrorInfo(message, fileName, lineNumber);

			if (info.type === "AccessDeniedError") {
				this.handleAccessDeniedError(info);
				return true;
			}
		}

	}

});

/* File: demo/store/js/app/models/products/Base.js */
products = window.Products || {};

products.Base = BaseModel.extend({
	prototype: {
		validAttributes: ["id", "name", "description", "created_at", "updated_at"]
	}
});
/* File: demo/store/js/app/modules/products/CreateModule.js */
products = window.products || {};

products.CreateModule = BaseModule.extend({

	prototype: {

		actions: {
			submit: "save",
			click: "cancel",
			change: "markDirty"
		},

		run: function() {
			this.product = new products.Base();
			this.render("products/create_view", this.product);
		},

		cancel: function(event, element, params) {
			event.stop();

			if (!this.dirty || confirm("Are you sure you want to cancel?")) {
				this.destructor();
			}
		},

		markDirty: function(event, element, params) {
			this.dirty = true;
		},

		save: function(event, element, params) {
			event.stop();

			console.info("products.CreateModule#save - Save the new product!");
			this.product.attributes = this.view.getFormData();
			this.view.toggleLoading(true);

			// TODO: The model should make this Ajax call
			var xhr = new XMLHttpRequest(), that = this;
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					var data = eval("(" + this.responseText + ")");
					that.product.attributes = data.product;
					console.info("Finished saving product", that.product);
					that.destructor();
					that = data = xhr = null;
				}
				else if (this.status >= 400) {
					console.error("Network error " + this.status);
					xhr = that = null;
				}
			};
			xhr.open("GET", "/demo/store/js/mocks/products/create.json?_=" + new Date().getTime());
			xhr.send(null);
		}

	}

});

/* File: demo/store/js/app/modules/LoginModule.js */
LoginModule = BaseModule.extend({
	prototype: {
		actions: {
			submit: "submit"
		},

		run: function() {
			document.getElementById("login-username").focus();
			this.view = new BaseView(this.element);
		},

		submit: function(event, element, params) {
			event.stop();

			var data = this.view.getFormData();

			if (!data.username) {
				alert("The username is required");
				document.getElementById("login-username").focus();
			}
			else if (!data.password) {
				alert("Please enter a password");
				document.getElementById("login-password").focus();
			}
			else {
				alert("Welcome!");
				this.destructor();
			}
		}
	}
});

/* File: demo/store/js/app/modules/TaskListModule.js */
TaskListModule = BaseModule.extend({

	prototype: {

		actions: {
			submit: "save",
			click: ["removeTask", "removeSelected"]
		},

		selectionManager: null,

		run: function() {
			this.view = new BaseView(this.element);
			this.createModuleProperty("selectionManager");
		},

		removeSelected: function(event, element, params) {
			event.stop();
			var items= this.selectionManager.getSelectedItems(), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].parentNode.removeChild(items[i]);
			};

			event = element = params = items = null;
		},

		removeTask: function(event, element, params) {
			event.stop();
			var listItem = element.parentNode;

			if (confirm("Are you sure you want to remove this task?")) {
				listItem.parentNode.removeChild(listItem);
			}

			event = element = params = listItem = null;
		},

		save: function(event, element, params) {
			event.stop();
			var data = this.view.getFormData();
			var newItem = document.createElement("li");
			newItem.setAttribute("data-action", "toggleSelection");
			newItem.innerHTML = Template.find("tasks/item").render(data);
			this.element.getElementsByTagName("ol")[0].appendChild(newItem);
			document.getElementById("task-text").value = "";
			document.getElementById("task-text").focus();
		}

	}

});

/* File: demo/store/js/app/modules/SelectionManagerModule.js */
SelectionManagerModule = BaseModule.extend({

	prototype: {

		actions: {
			click: ["deselectAll", "selectAll", "toggleSelection"]
		},

		initialize: function(element, options) {
			options = {
				selectedClass: "selected"
			}.merge(options || {});

			BaseModule.prototype.initialize.call(this, element, options);
		},

		deselectAll: function(event, element, params) {
			event.stop();

			var items = this.element.getElementsByTagName("li"), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].removeClass(this.options.selectedClass);
			}
		},

		getSelectedItems: function() {
			return this.element.querySelectorAll("li." + this.options.selectedClass);
		},

		selectAll: function(event, element, params) {
			event.stop();

			var items = this.element.getElementsByTagName("li"), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].addClass(this.options.selectedClass);
			}
		},

		toggleSelection: function(event, element, params) {
			event.preventDefault();

			if (element.hasClass(this.options.selectedClass)) {
				element.removeClass(this.options.selectedClass);
			}
			else {
				element.addClass(this.options.selectedClass);
			}
		}

	}

});

