/* File: src/lib/patches/Object.js */
if (!Object.defineProperty) {
	if ( ({}).__defineGetter__ ) {
		Object.defineProperty = function(obj, property, descriptor) {
			if (descriptor.readable) {
				obj.__defineGetter__(property, descriptor.get);
			}

			if (descriptor.writable) {
				obj.__defineSetter(property, descriptor.set);
			}

			if (descriptor.value !== undefined) {
				obj[property] = descriptor.value;
			}
		};
	}
	else {
		throw new Error("This browser is incompatible with Object.defineProperty (" + navigator.userAgent + ").");
	}
}

if (!Object.prototype.merge) {
	Object.prototype.merge = function() {
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
	};
}

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

/* File: src/lib/patches/String.js */
if (!String.prototype.capitalize) {
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1, this.length);
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

/* File: src/lib/errors.js */
BaseError = Error.extend({
	self: {
		create: function(type, descriptor) {
			descriptor = descriptor || {};
			descriptor.self = descriptor.self || {};
			descriptor.self.type = type;
			return this.extend(descriptor);
		}
	},
	prototype: {
		initialize: function(message) {
			Error.apply(this, arguments);
			this.message = this.constructor.type + " - " + (message || "");
		}
	}
});

AccessDeniedError = BaseError.create("AccessDeniedError");
/* File: src/lib/dom/events/Delegator.js */
window.dom = window.dom || {};
window.dom.events = window.dom.events || {};

dom.events.Delegator = function() {

// Access: Public

	this.constructor = function(delegate, node, actionPrefix) {
		this.delegate = delegate;
		this.node = node;
		this.setActionPrefix(actionPrefix || "");
		this.eventTypes = [];
		this.eventTypesAdded = {};
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
		var paramsAttr = element.getAttribute("data-actionParams-" + eventType) || element.getAttribute("data-actionParams");
		element = null;
		return (paramsAttr) ? JSON.parse(paramsAttr) : {};
	}

	function getDocument() {
		return self.node.ownerDocument;
	}

	function stopPropagationPatch() {
		this._stopPropagation();
		this.propagationStopped = true;
	}

	function handleEvent(event) {
		if (!event._stopPropagation) {
			event._stopPropagation = event.stopPropagation;
			event.stopPropagation = stopPropagationPatch;
			event.propagationStopped = false;
		}

		if (!event.actionTarget) {
			event.actionTarget = event.target;
		}

		var action = null, actionName = null, method, params;
		
		if (event.actionTarget.getAttribute) {
			// DOM node
			actionName = event.actionTarget.getAttribute("data-action-" + event.type) ||
							     event.actionTarget.getAttribute("data-action");
		}
		else if (event.actionTarget.documentURI) {
			// document object
			actionName = event.actionTarget["data-action-" + event.type] ||
							     event.actionTarget["data-action"];
		}

		if (actionName) {
			actionName = actionName.replace(self.actionRegex, "");
			method = self.delegate[actionName] ? actionName : "handleAction";
		}

		if (self.delegate[method]) {
			try {
				params = getActionParams(event.actionTarget, event.type);
				action = new dom.events.Action(event, event.actionTarget, params, actionName);
				self.delegate[method](action);
			}
			catch (error) {
				event.preventDefault();
				event.stopPropagation();

				if (self.delegate.handleActionError) {
					action = new dom.events.Action(event, event.actionTarget, {error: error}, actionName);
					self.delegate.handleActionError(action);
				}
				else if (self.constructor.errorDelegate) {
					self.constructor.errorDelegate.handleActionError(action);
				}
				else {
					// Give up. Throw the error and let the developer fix this.
					throw error;
				}
			}
		}

		if (!event.propagationStopped && event.actionTarget !== self.node && event.actionTarget.parentNode) {
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

	this.constructor.apply(this, arguments);
};

/* File: src/lib/dom/events/action.js */
window.dom = window.dom || {};
dom.events = dom.events || {};

dom.events.Action = Object.extend({
	prototype: {
		name: null,
		params: null,
		event: null,
		element: null,

		initialize: function(event, element, params, name) {
			this.event = event;
			this.element = element;
			this.params = params;
			this.name = name;
			event = element = params = null;
		},

		destructor: function() {
			this.params = this.event = this.element = null;
		},

		cancel: function() {
			this.event.preventDefault();
			this.event.stopPropagation();
		}
	}
});

/* File: src/lib/OperationFactory.js */
OperationFactory = Object.extend({

	prototype: {

		eventDispatcher: null,

		destructor: function() {
			this.eventDispatcher = null;
		},

		getOperation: function(name) {
			var Klass = null, KlassName;
			
			try {
        KlassName = (name + "_operation").toClassName();
				Klass = KlassName.constantize();
			}
			catch (e) {
				Klass = null;
			}

			return Klass ? new Klass(this, this.eventDispatcher) : null;
		},

		setEventDispatcher: function(eventDispatcher) {
			this.eventDispatcher = eventDispatcher;
			eventDispatcher = null;
		}

	}

});

/* File: src/lib/events/Dispatcher.js */
window.events = window.events || {};

events.Dispatcher = function() {
	this.subscribers = {};
};

events.Dispatcher.logger = null;

events.Dispatcher.prototype = {

	subscribers: null,

	destructor: function() {
		var type, i, length, subscribers;

		if (this.subscribers) {
			for (type in this.subscribers) {
				if (this.subscribers.hasOwnProperty(type)) {
					subscribers = this.subscribers[type];

					for (i = 0, length = subscribers.length; i < length; i++) {
						subscribers[i] = null;
					}

					this.subscribers[type] = null;
				}
			}

			this.subscribers = null;
		}
	},

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

			try {
				subscriber.instance[ subscriber.method ](event, event.data);
			}
			catch (error) {
				if (events.Dispatcher.logger) {
					events.Dispatcher.logger.error("events.Dispatcher#publish - An error was thrown while publishing event " + type);
					events.Dispatcher.logger.error(error);
				}
				else {
					event = publisher = data = subscribers = null;
					throw error;
				}
			}
		}

		event = publisher = data = subscribers = null;

		return true;
	},

	subscribe: function(type, instance, method) {
		this.subscribers[type] = this.subscribers[type] || [];
		this.subscribers[type].push({instance: instance, method: method || "handleEvent"});
		instance = null;
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
	},

	unsubscribeAll: function(instance) {
		var type, i;

		for (type in this.subscribers) {
			if (this.subscribers.hasOwnProperty(type)) {
				i = this.subscribers[type].length;

				while (i--) {
					if (this.subscribers[type][i].instance === instance) {
						this.subscribers[type].splice(i, 1);
					}
				}
			}
		}
	}

};

/* File: src/lib/events/Publisher.js */
window.events = window.events || {};

events.Publisher = {

	prototype: {

		dispatcher: null,
		
		initEventPublishing: function() {
			if (this.dispatcher) {
				return;
			}

			this.dispatcher = new events.Dispatcher();
		},
		
		destroyEventPublishing: function() {
			if (!this.dispatcher) {
				return;
			}

			this.dispatcher.destructor();
			this.dispatcher = null;
		},
		
		publish: function(type, data) {
			this.dispatcher.publish(type, this, data);
		},
		
		subscribe: function(type, instance, method) {
			this.dispatcher.subscribe(type, instance, method);
		},
		
		unsubscribe: function(type, instance) {
			this.dispatcher.unsubscribe(type, instance);
		}

	}

};

/* File: src/lib/events/Event.js */
window.events = window.events || {};

events.Event = function(type, publisher, data) {
	this.type = type;
	this.publisher = publisher;
	this.data = data || {};
	this.dateStarted = (this.INCLUDE_DATE) ? new Date() : null;
	publish = data = null;
};

events.Event.prototype = {

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
		static disableNodeCaching()
		static enableNodeCaching()
		constructor(String | HTMLElement id)
		init()
		destructor()
	Protected:
		delegator <dom.events.Delegator>
		id <String>
		ownerDocument <Document>
		rootNode <HTMLElement>
		getDelegatorEventTypes() returns Array
		getNode(String idSuffix) returns HTMLElement
		handleNodeEvent(Event event)
		purgeNodeCache()
		querySelector(String selector) returns HTMLElement or undefined
		querySelectorAll(String selector) returns HTMLCollection
	Private:
		static generateNodeId() returns String
		nodeCache <Object>
		getNodesFromCache(String key) returns HTMLElement or HTMLCollection or null
		nodeCachingEnabled() returns Boolean

*/
BaseView = Object.extend({

	self: {

		nodeCachingEnabled: false,

		nodeIdIndex: 0,

		disableNodeCaching: function() {
			this.nodeCachingEnabled = false;
		},

		enableNodeCaching: function() {
			this.nodeCachingEnabled = true;
		},

		generateNodeId: function() {
			return "anonymous-node-" + (BaseView.nodeIdIndex++);
		},

		getInstance: function(rootNode, delegate, templateName) {
			var className = (templateName.replace(/\//g, "-") + "_view").toClassName();
			var ViewClass = className.constantize();
			var view;

			if (!ViewClass) {
				ViewClass = BaseView;
			}

			view = new ViewClass(rootNode, delegate, templateName);
			ViewClass = rootNode = delegate = null;
			return view;
		}

	},

	prototype: {

// Access: Public

		initialize: function(rootNode, delegate, templateName) {
			this.nodeCache = {};

			if (typeof rootNode === "string") {
				if (!this.ownerDocument) {
					this.ownerDocument = document;
				}

				this.rootNode = this.ownerDocument.getElementById(rootNode);
			}
			else {
				this.rootNode = rootNode;
				this.ownerDocument = this.rootNode.ownerDocument;

				if (!this.rootNode.getAttribute("id")) {
					this.rootNode.setAttribute("id", BaseView.generateNodeId());
					this.id = this.rootNode.getAttribute("id");
				}
			}

			if (templateName) {
				this.templateName = templateName;
			}

			this.delegator = new dom.events.Delegator(delegate, this.rootNode, this.delegatorActionPrefix);
			rootNode = delegate = null;
		},

		init: function() {
			this.delegator.addEventTypes(this.getDelegatorEventTypes());
			this.delegator.init();
			return this;
		},

		destructor: function() {
			if (this.delegator) {
				this.delegator.destructor();
				this.delegator = null;
			}

			this.rootNode = this.ownerDocument = null;
		},

		render: function(model) {
			Template.fetch(this.templateName, this, function(template) {
				if (this.model && this.model.unsubscribe) {
					this.model.unsubscribe("attributes:changed", this);
				}

				this.model = model;
				this.rootNode.innerHTML = template.render(this.model);

				if (this.model.subscribe) {
					this.model.subscribe("attributes:changed", this, "handleAttributesChanged");
				}

				template = null;
			});

			return this;
		},

// Access: Protected

		delegateActionPrefix: "",

		delegatorEventTypes: "",

		delegator: null,

		id: null,

		ownerDocument: null,

		rootNode: null,

		templateName: null,

		getDelegatorEventTypes: function() {
			return this.delegatorEventTypes.split(/[ ,]+/g);
		},

		getNode: function(idSuffix) {
			return this.ownerDocument.getElementById(this.id + "-" + idSuffix);
		},

		purgeNodeCache: function() {
			this.nodeCache = {};
		},

		querySelector: function(selector) {
			if (this.nodeCachingEnabled()) {
				var node = this.getNodesFromCache("selector-" + selector);

				if (!node) {
					node = this.rootNode.querySelector(selector);
					this.nodeCache["selector-" + selector] = node;
				}

				return node;
			}
			else {
				return this.rootNode.querySelector(selector);
			}
		},

		querySelectorAll: function(selector) {
			var nodes = [];

			if (this.nodeCachingEnabled()) {
				nodes = this.getNodesFromCache("selectorAll-" + selector);

				if (!nodes) {
					nodes = this.rootNode.querySelectorAll(selector);
					this.nodeCache["selectorAll-" + selector] = nodes;
				}
			}
			else {
				nodes = this.rootNode.querySelectorAll(selector);
			}

			return nodes;
		},

// Access: Private

		nodeCache: null,

		getNodesFromCache: function(key) {
			return (this.nodeCache[key]) ? this.nodeCache[key] : null;
		},

		handleAttributesChanged: function(model) {
			console.info("FormView#handleAttributesChanged");
		},

		nodeCachingEnabled: function() {
			return BaseView.nodeCachingEnabled;
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
				var inputs = this.rootNode.getElementsByTagName("input");
				var selects = this.rootNode.getElementsByTagName("select");
				var textareas = this.rootNode.getElementsByTagName("textarea");

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
			var nodes = this.rootNode.getElementsByTagName("*"), i = 0, length = nodes.length, controls = [];

			for (i; i < length; ++i) {
				if (nodes[i].name === name) {
					controls.push(nodes[i]);
				}
			}

			nodes = null;
			return controls;
		},

		hideFieldErrors: function() {
			var errorElements = this.rootNode.querySelectorAll(".form-field-error");
			var formErrorElement = this.rootNode.querySelector(".form-errors");
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
			var errorElement = this.rootNode.querySelector(".form-errors");
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
						errorElement = this.rootNode.querySelector(".form-field-error-" + key);

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

/* File: src/framework/models/BaseCollection.js */
BaseCollection = Array.extend({

	prototype: {

		className: null,

		classReference: null,

		pointer: 0,

		initialize: function(className) {
			this.className = className || null;
			Array.apply(this, arguments);
		},

		contains: function(x) {
			if (typeof x === "object") {
				if (x.__proto__ === Object.prototype) {
					return this.containsId( x[ this.getClassReference().getPrimaryKey() ] );
				}
				else if (x.getPrimaryKey() ) {
					return this.containsId( x.getPrimaryKey() );
				}
				else {
					return this.containsInstance(x);
				}
			}
			else {
				return this.containsId(x);
			}
		},

		containsId: function(id) {
			if (!id) {
				return false;
			}

			var i = this.length;

			while (i--) {
				if (this[i].getPrimaryKey() == id) {
					return true;
				}
			}

			return false;
		},

		containsInstance: function(instance) {
			var i = this.length;

			while(i--) {
				if (this[i] === instance) {
					return true;
				}
			}

			return false;
		},

		create: function(attributesOrInstance) {
			if (!attributesOrInstance || attributesOrInstance.__proto__ === Object.prototype) {
				attributesOrInstance = this.getModelInstance(attributesOrInstance);
			}
			else {
				throw new Error("Attributes passed to BaseCollection#create must be a direct instance of Object");
			}

			return this.push(attributesOrInstance);
		},

		each: function(context, callback) {
			var i = 0, length = this.length;

			if (!callback) {
				callback = context;
				context = this;
			}

			for (i; i < length; i++) {
				callback.call(context, this[i], i);
			}
		},

		fastForward: function() {
			this.pointer = this.length;
		},

		getClassReference: function() {
			if (!this.classReference) {
				this.classReference = this.className.constantize();
			}

			return this.classReference;
		},

		getModelInstance: function(attributes) {
			var Klass = this.getClassReference();
			var model = null;
			
			if ( attributes && attributes[ Klass.getPrimaryKey() ] ) {
				model = Klass.find( attributes[ Klass.getPrimaryKey() ] ) || new Klass();
			}
			else {
				model = new Klass();
			}

			model.attributes = attributes;
			Klass = null;

			return model;
		},

		isCorrectType: function(model) {
			return (model.__proto__ === this.getClassReference().prototype);
		},

		next: function() {
			var model = null;

			if (this.pointer < this.length) {
				model = this[this.pointer];
				this.pointer++;
			}
			else {
				this.rewind();
			}

			return model;
		},

		pop: function() {
			return (this.length === 0) ? null : Array.prototype.pop.call(this);
		},

		prev: function() {
			var model = null;

			this.pointer--;

			if (this.pointer > -1) {
				model = this[this.pointer];
			}
			else {
				this.rewind();
			}

			return model;
		},

		push: function(model) {
			if (!this.isCorrectType(model)) {
				throw new Error("Item must be a direct instance of " + this.className);
			}
			else if (this.contains(model)) {
				return null;
			}
			else {
				Array.prototype.push.call(this, model);
				return model;
			}
		},

		rewind: function() {
			this.pointer = 0;
		},

		sort: function(columns, direction) {
			columns = (columns instanceof Array) ? columns : [columns];
			direction = (direction || "asc").toLowerCase();

			var getPropertyValues = function(a, b) {
				var i = 0, length = columns.length, values = null, key;

				if (length === 1) {
					values = [ a[ columns[0] ], b[ columns[0] ] ];
				}
				else {
					for (i; i < length; i++) {
						key = columns[i];

						if (a[key] !== b[key]) {
							values = [ a[key], b[key] ];
							break;
						}
					}

					if (!values) {
						values = [ a[ columns[0] ], b[columns[0] ] ];
					}
				}

				a = b = null;

				return values;
			};

			var ascendingSorter = function(a, b) {
				var values = getPropertyValues(a, b);

				a = b = null;

				if (values[0] > values[1]) {
					return 1;
				}
				else if (values[0] < values[1]) {
					return -1;
				}
				else {
					return 0;
				}
			};

			var descendingSorter = function(a, b) {
				var values = getPropertyValues(a, b);

				a = b = null;

				if (values[0] < values[1]) {
					return 1;
				}
				else if (values[0] > values[1]) {
					return -1;
				}
				else {
					return 0;
				}
			};

			var sorter = (direction === "asc") ? ascendingSorter : descendingSorter;

			Array.prototype.sort.call(this, sorter);
			return this;
		}

	}
});

/* File: src/lib/BaseModel/Publisher.js */
BaseModel.Publisher = {

	self: {

		dispatcher: null,

		publish: function(eventName, data) {
			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.publish(eventName, this, data);
			}

			data = null;
		},

		subscribe: function(eventName, instance, callback) {
			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.subscribe(eventName, instance, callback);
			}

			instance = callback = null;
		},

		unsubscribe: function(eventName, instance) {
			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.unsubscribe(eventName, instance);
			}

			instance = null;
		},

		unsubscribeAll: function(instance) {
			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.unsubscribeAll(instance);
			}

			instance = null;
		}

	},

	prototype: {

		publish: function(eventName) {
			BaseModel.publish(eventName, this);
		},

		subscribe: function(eventName, instance, callback) {
			BaseModel.subscribe(eventName, instance, callback);
			instance = callback = null;
		},

		unsubscribe: function(eventName, instance, callback) {
			BaseModel.unsubscribe(eventName, instance, callback);
			instance = callback = null;
		}

	}

};

BaseModel.include(BaseModel.Publisher);

/* File: src/lib/BaseModel/BasicValidation.js */
BaseModel.BasicValidation = {

	prototype: {

		errors: null,

		valid: false,

		requires: null,

		addError: function(key, message) {
			this.errors[key] = this.errors[key] || [];
			this.errors[key].push(message);
		},

		convertKeyToWords: function(key) {
			key = key.replace(/_/g, " ").replace(/[A-Z]+/g, function(match, index, wholeString) {
				if (match.length > 1) {
					return (index === 0) ? match : " " + match;
				}
				else {
					return (index === 0) ? match.toLowerCase() : " " + match.toLowerCase();
				}
			});

			return key;
		},

		getErrorMessage: function(key) {
			var message = [], words, i, length, errors = this.errors[key];

			if (errors) {
				words = (key === "base") ? "" : this.convertKeyToWords(key).capitalize() + " ";

				for (i = 0, length = errors.length; i < length; i++) {
					message.push(words + errors[i]);
				}
			}

			errors = null;

			return message;
		},

		getErrorMessages: function() {
			var errorMessages = {}, key;

			if (this.hasErrors()) {
				for (key in this.errors) {
					if (this.errors.hasOwnProperty(key)) {
						errorMessages[key] = this.getErrorMessage(key);
					}
				}
			}

			return errorMessages;
		},

		hasErrors: function() {
			return !this.valid;
		},

		validate: function() {
			this.errors = {};
			this.valid = true;
			this.validateRequiredAttributes();
			this.applyModuleCallbacks("validate");

			return this.valid;
		},

		validateRequiredAttributes: function() {
			if (!this.requires) {
				return;
			}

			var key, i = 0, length = this.requires.length;

			for (i; i < length; i++) {
				key = this.requires[i];

				if (this.valueIsEmpty(this.attributes[key])) {
					this.addError(key, "is required");
					this.valid = false;
				}
			}
		}

	}

};

BaseModel.include(BaseModel.BasicValidation);

/* File: src/lib/BaseModel/ExtendedValidation.js */
BaseModel.ExtendedValidation = {

	callbacks: {

		validate: function() {
			this.validateAttributeDataTypes();
			this.validateAttributeLengths();
			this.validateAttributeFormats();
		}

	},

	prototype: {

		validatesNumeric: null,

		validatesMaxLength: null,

		validatesFormatOf: null,

		validateAttributeDataTypes: function() {
			if (!this.validatesNumeric) {
				return;
			}

			var key, type, i = 0, length = this.validatesNumeric.length;

			for (i; i < length; i++) {
				key = this.validatesNumeric[i];

				if (!this.valueIsEmpty(this._attributes[key]) && !this.valueIsNumeric(this._attributes[key])) {
					this.addError(key, "must be a number");
					this.valid = false;
				}
			}
		},

		validateAttributeLengths: function() {
			if (!this.validatesMaxLength) {
				return;
			}

			var key;

			for (key in this.validatesMaxLength) {
				if (this.validatesMaxLength.hasOwnProperty(key)) {
					if (!this.valueIsEmpty(this._attributes[key]) && String(this._attributes[key]).length > this.validatesMaxLength[key]) {
						this.addError(key, "cannot exceed " + this.validatesMaxLength[key] + " characters");
						this.valid = false;
					}
				}
			}
		},

		validateAttributeFormats: function() {
			if (!this.validatesFormatOf) {
				return;
			}

			var key, i, length, valid = true;

			for (key in this.validatesFormatOf) {
				if (this.validatesFormatOf.hasOwnProperty(key) && !this.valueIsEmpty(this._attributes[key])) {
					if (this.validatesFormatOf[key] instanceof Array) {
						for (i = 0, length = this.validatesFormatOf[key].length; i < length; i++) {
							if (!this.validatesFormatOf[key][i].test(this._attributes[key])) {
								valid = false;
							}
							else {
								valid = true;
								break
							}
						}

						if (!valid) {
							this.addError(key, "is not in a valid format");
							this.valid = false;
						}
					}
					else if (!this.validatesFormatOf[key].test(this._attributes[key])) {
						this.addError(key, "is not in a valid format");
						this.valid = false;
					}
				}
			}
		},

		valueIsNumeric: function(value) {
			return (/^[-.\d]+$/).test(String(value)) && !isNaN(value);
		}
		
	}

};

BaseModel.include(BaseModel.ExtendedValidation);

/* File: src/lib/BaseModel/Serialization.js */
BaseModel.Serialization = {

	prototype: {

		serializeOptions: {
			format: "queryString"
		},

		escapeHTML: function(x) {
			return String(x).replace(/&/g, "&amp;")
			                .replace(/</g, "&lt;")
			                .replace(/>/g, "&gt;")
			                .replace(/"/g, "&quot;")
			                .replace(/'/g, "&apos;");
		},

		mergeOptions: function() {
			var options = {}, key, overrides;

			for (i = 0, length = arguments.length; i < length; i++) {
				overrides = arguments[i];

				for (key in overrides) {
					if (overrides.hasOwnProperty(key)) {
						options[key] = overrides[key];
					}
				}
			}

			return options;
		},

		serialize: function(options) {
			options = this.mergeOptions(BaseModel.Serialization.prototype.serializeOptions, this.serializeOptions, options || {});
			var methodName = "to" + options.format.capitalize();
			var x = this[methodName](options);
			return x;
		}

	}

};

BaseModel.include(BaseModel.Serialization);

/* File: src/lib/BaseModel/Serialization/Json.js */
BaseModel.Serialization.Json = {

	prototype: {

		objectIsEmpty: function(o) {
			var empty = true, key;

			if (o) {
				for (key in o) {
					if (o.hasOwnProperty(key)) {
						empty = false;
						break;
					}
				}
			}

			o = null;

			return empty;
		},

		toJson: function(options) {
			options = options || {};
			var json = "", moduleCallbacksResult, attrs = {}, i, length, key, hasAttrs = false;

			if (options.rootElement) {
				json += '{"' + options.rootElement + '":';
			}

			if (options.changedAttributesOnly) {
				for (key in this._changedAttributes) {
					if (this._changedAttributes.hasOwnProperty(key) && this._changedAttributes[key]) {
						attrs[key] = this._attributes[key];
					}
				}

				hasAttrs = true;
				attrs[this.primaryKey] = this.attributes[this.primaryKey];
			}
			else {
				length = this.validAttributes.length;

				for (i = 0; i < length; i++) {
					key = this.validAttributes[i];

					if (this._attributes.hasOwnProperty(key)) {
						hasAttrs = true;
						attrs[key] = this._attributes[key];
					}
				}
			}

			json += JSON.stringify(attrs);
			moduleCallbacksResult = this.applyModuleCallbacks("toJson", [options]);

			if (moduleCallbacksResult.length) {
				json = json.replace(/\}$/, "");

				if (hasAttrs) {
					json += "," + moduleCallbacksResult.join("") + "}";
				}
				else {
					json += moduleCallbacksResult.join("") + "}";
				}
			}

			if (options.rootElement) {
				json += '}';
			}

			return json;
		}

	}

};

BaseModel.include(BaseModel.Serialization.Json);

/* File: src/lib/BaseModel/Serialization/QueryString.js */
BaseModel.Serialization.QueryString = {

	prototype: {

		toQueryString: function(options) {
			options = options || {};
			var attrs = null, key, queryString = [], moduleCallbacksResult;

			if (options.changedAttributesOnly) {
				attrs = {};

				for (key in this.changedAttributes) {
					if (this._changedAttributes.hasOwnProperty(key) && this._changedAttributes[key]) {
						attrs[key] = this._attributes[key];
					}
				}

				attrs[this.primaryKey] = this.attributes[this.primaryKey];
			}
			else {
				attrs = this._attributes;
			}

			if (options.rootElement) {
				for (key in attrs) {
					if (attrs.hasOwnProperty(key) && !this.valueIsEmpty(attrs[key])) {
						queryString.push(options.rootElement + "[" + escape(key) + "]=" + escape(attrs[key]));
					}
				}
			}
			else {
				for (key in attrs) {
					if (attrs.hasOwnProperty(key) && !this.valueIsEmpty(attrs[key])) {
						queryString.push(escape(key) + "=" + escape(attrs[key]));
					}
				}
			}

			moduleCallbacksResult = this.applyModuleCallbacks("toQueryString", [options]);

			if (moduleCallbacksResult.length) {
				queryString.push(moduleCallbacksResult.join(""));
			}

			return queryString.join("&");
		}

	}

};

BaseModel.include(BaseModel.Serialization.QueryString);

/* File: src/lib/BaseModel/Persistence.js */
BaseModel.Persistence = {

	included: function(Klass) {
		Klass.persistence = {types: []};
		Klass.prototype.persistence = {};
		Klass = null;
	},

	prototype: {

		destroyed: false,

		newRecord: true,

		destroy: function(context, callbacks) {
			if (this.destroyed) {
				callbacks.notFound.call(context);
			}
			else {
				this.doDestroy(context, callbacks);
			}
		},

		doDestroy: function(context, callbacks) {
			var types = this.constructor.persistence.types;
			var length = types.length, i = 0, type, method, count = 0;

			var callbacks = {
				destroyed: function() {
					
				},
				notFound: function() {
					
				}
			};

			for (i; i < length; i++) {
				type = types[i];
				method = "destroyFrom" + type.capitalize();

				if (this[method]) {
					this[method](this, callbacks);
				}
				else {
					throw new Error("No method " + method + " found for persistence type " + type);
				}
			}
		},

		getPersistenceTypes: function() {
			return this.constructor.persistence.types;
		},

		save: function(context, callbacks) {
			if (this.destroyed) {
				callbacks.invalid.call(context, {base: "has been deleted"});
			}
			else if (!this.validate()) {
				callbacks.invalid.call(context, this.getErrorMessages());
			}
			else {
				this.doSave(context, callbacks);
			}

			context = callbacks = null;
		},

		doSave: function(context, externalCallbacks) {
			var types = this.getPersistenceTypes();
			var length = types.length, type, method, count = 0, model = this;

			var cleanup = function() {
				types = externalCallbacks = doSaveCallbacks = context = model = null;
			};

			var performSave = function() {
				if (count === length) {
					if (model.newRecord) {
						model.applyModuleCallbacks("save");
						model.newRecord = false;
						externalCallbacks.saved.call(context);
						model.constructor.register(model);
						model.publish("created");
					}
					else {
						model.applyModuleCallbacks("update");
						externalCallbacks.saved.call(context);
						model.publish("updated");
					}

					cleanup();
				}
				else {
					type = types[count];
					method = "saveTo" + type.capitalize();
					count++;

					if (model[method]) {
						model[method](model, doSaveCallbacks);
					}
					else {
						throw new Error("No method " + method + " found for persistence type " + type);
					}
				}
			};

			var doSaveCallbacks = {
				saved: function() {
					performSave.call(model);
				},
				invalid: function(errors) {
					externalCallbacks.invalid.call(context, errors);
				}
			};

			performSave.call(model);
		}

	}

};

BaseModel.include(BaseModel.Persistence);
/* File: src/lib/BaseModel/Persistence/RestClient.js */
BaseModel.Persistence.RestClient = {

	included: function(Klass) {
		Klass.persistence.types.push("restClient");
		Klass = null;
	},

	callbacks: {
		initialize: function(attributes) {
			var defaultOptions = BaseModel.Persistence.RestClient.prototype.restClientOptions;
			var options = {};

			if (this.restClientOptions !== defaultOptions) {
				this.restClientOptions = options.merge(defaultOptions, this.restClientOptions);
			}
			else {
				this.restClientOptions = options.merge(defaultOptions);
			}

			options = defaultOptions = attributes = null;
		}
	},

	prototype: {

		restClientOptions: {
			authorizationRequiredError: "You must be logged in to complete this operation.",
			baseUrl: null,
			create: "POST :baseUrl",
			destroy: "DELETE :baseUrl/:id",
			show: "GET :baseUrl/:id",
			update: "PUT :baseUrl/:id",
			generalError: "An error occurred, please try again.",
			rootElement: null
		},

		createRequest: function() {
			return new XMLHttpRequest();
		},

		createRestClientUri: function(type, data) {
			var uri, method, path, uriString = this.restClientOptions[type];

			uriString = uriString.replace(/:baseUrl/, this.restClientOptions.baseUrl);
			uriString = uriString.replace(/:(\w+)/g, function(match, key) {
				return data[key];
			});

			uri = uriString.split(" ");
			method = uri[0];
			path = uri[1];
			data = null;

			return {method: method, path: path};
		},

		getErrorsFromResponse: function(xhr) {
			var errors = null;

			try {
				errors = JSON.parse(xhr.responseBody);
			}
			catch (error) {
				// fail silently
			}

			return errors;
		},

		saveToRestClient: function(context, callbacks) {
			var uri = this.createRestClientUri((this.persisted) ? "update" : "create", this.attributes);

			this.sendRequest(uri.method, uri.path, this, {
				created: function(xhr) {
					var attributes = JSON.parse(xhr.responseText);
					this.attributes = (this.restClientOptions.rootElement) ? attributes[ this.restClientOptions.rootElement ] : attributes;
					callbacks.saved.call(context);
				},
				updated: function(xhr) {
					var attributes = JSON.parse(xhr.responseText);
					this.attributes = (this.restClientOptions.rootElement) ? attributes[ this.restClientOptions.rootElement ] : attributes;
					callbacks.saved.call(context);
				},
				invalid: function(xhr) {
					this.errors = this.getErrorsFromResponse(xhr);
					callbacks.invalid.call(context, this.errors);
					errors = null;
				},
				notAuthorized: function(xhr) {
					this.addError("base", this.authorizationRequiredError);
					callbacks.invalid.call(context, this.errors);
				},
				notFound: function(xhr) {
					callbacks.notFound.call(context);
				},
				error: function(xhr) {
					this.addError("base", this.generalError);
					callbacks.error.call(context, this.errors);
				}
			});
		},

		sendRequest: function(method, url, context, callbacks) {
			var onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status === 200) {
						if (method === "DELETE") {
							callbacks.destroyed.call(context, this);
						}
						else {
							callbacks.updated.call(context, this);
						}
					}
					else if (this.status === 201) {
						callbacks.created.call(context, this);
					}
					else if (this.status === 403) {
						// not authorized
						callbacks.notAuthorized.call(context, this);
					}
					else if (this.status === 404) {
						// not found
						callbacks.notFound.call(context, this);
					}
					else if (this.status === 412) {
						// validation failed
						callbacks.invalid.call(context, this);
					}
					else if (this.status > 399) {
						// unhandled client or server error
						callbacks.error.call(context, this);
					}
				}
			};
			var async = true;
			var data = this.serialize();
			var xhr = this.createRequest(), model = this;

			if (method === "GET" || method === "DELETE") {
				url += ( url.indexOf("?") < 0 ? "?" : "&" ) + data;
				data = null;
			}

			xhr.onreadystatechange = onreadystatechange;
			xhr.open(method, url, async);
			xhr.setRequestHeader("x-requested-with", "XMLHTTPREQUEST");
			xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
			xhr.send(data);
		}

	}

};

BaseModel.include(BaseModel.Persistence.RestClient);
/* File: src/lib/BaseModel/Persistence/LocalStorage.js */
BaseModel.Persistence.LocalStorage = {

	included: function(Klass) {
		if (!window.localStorage) {
			throw new Error("Your browser does not support localStorage.");
		}
		else if (!BaseModel.prototype.toJson) {
			throw new Error("BaseModel.Persistence.LocalStorage requires the BaseModel.Serialization.Json module");
		}

		Klass.persistence.types.push("localStorage");
	},

	self: {

		fetchFromLocalStorage: function(id, context, callbacks) {
			var model = this.findFromLocalStorage(id);

			if (model) {
				callbacks.found.call(context, model);
			}
			else {
				callbacks.notFound.call(context, model);
			}

			context = callbacks = model = null;
		},

		findFromLocalStorage: function(id) {
			if (!this.instances[id]) {
				var key = this.createLocalStorageKey({id: id});
				var attributes = localStorage[key];
				var instance = null;

				if (attributes) {
					attributes = JSON.parse(attributes);
					instance = new this(attributes);
				}

				this.instances[id] = instance;
				attributes = instance = null;
			}


			return this.instances[id];
		}

	},

	prototype: {

		localStorageOptions: {key: "base_model.:id"},

		createLocalStorageKey: function(x) {
			if (!x) {
				x = {};
				x[this.primaryKey] = this.getPrimaryKey();
			}

			return this.localStorageKey.replace(/:(\w+)/g, function(match, key) {
				return x[key];
			});
		},

		destroyFromLocalStorage: function(context, callbacks) {
			if (!this.getPrimaryKey()) {
				callbacks.notFound.call(context);
			}
			else {
				var key = this.createLocalStorageKey();

				if (!localStorage[key]) {
					callbacks.notFound.call(context);
				}
				else {
					localStorage[key] = null;
					delete localStorage[key];
					callbacks.destroyed.call(context);
				}
			}

			context = callbacks = null;
		},

		saveToLocalStorage: function(context, callbacks) {
			var key;

			if (!this.getPrimaryKey()) {
				this[ this.primaryKey ] = new Date().getTime() + "" + Math.round(Math.random() * 10000000000000000);
			}

			key = this.createLocalStorageKey(this);
			localStorage[key] = this.toJson();
			callbacks.saved.call(context);
			context = callbacks = model = null;
		}

	}

};

BaseModel.include(BaseModel.Persistence.LocalStorage);
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
/* File: src/framework/operations/BaseOperation.js */
BaseOperation = Object.extend({

	prototype: {

		childOperations: null,

		eventDispatcher: null,

		operationFactory: null,

		parentOperation: null,

		initialize: function(operationFactory, eventDispatcher) {
			this.childOperations = {};
			this.operationFactory = operationFactory;
			this.eventDispatcher = eventDispatcher;
			operationFactory = eventDispatcher = null;
		},

		destructor: function() {
			var name;

			if (this.childOperations) {
				for (name in this.childOperations) {
					if (this.childOperations.hasOwnProperty(name) && this.childOperations[name]) {
						this.childOperations[name].destructor();
						this.childOperations[name] = null;
					}
				}

				this.childOperations = null;
			}

			if (this.eventDispatcher) {
				this.eventDispatcher.unsubscribeAll(this);
			}

			this.parentOperation = this.operationFactory = this.eventDispatcher = null;
		},

		call: function(parentOperation, runArgs) {
			this.parentOperation = parentOperation;
			this.run.apply(this, runArgs);
			parentOperation = null;
		},

		addChildOperation: function(name, childOperation) {
			if (this.childOperations[name]) {
				throw new Error("Cannot add more than one child operation with name " + name);
			}

			this.childOperations[name] = childOperation;
			childOperation = null;
		},

		getChildOperation: function(name) {
			if (!this.childOperations[name]) {
				this.childOperations[name] = this.operationFactory.getOperation(name);
			}

			return this.childOperations[name];
		},

		map: function(events) {
			var name;

			for (name in events) {
				if (events.hasOwnProperty(name)) {
					this.eventDispatcher.subscribe("operation:" + name, this, events[name]);
				}
			}

			events = null;
		},

		removeChildOperation: function(childOperation) {
			var name;

			for (name in this.childOperations) {
				if (this.childOperations.hasOwnProperty(name) && childOperation === this.childOperations[name]) {
					this.childOperations[name] = null;
				}
			}

			childOperation = null;
		},

		run: function() {
			throw new Error("Child classes must override BaseOperation#run");
		}

	}

});

/* File: src/framework/operations/BootOperation.js */
BootOperation = BaseOperation.extend({
	prototype: {

		application: null,

		config: null,

		delegator: null,

		element: null,

		destructor: function() {
			if (this.delegator) {
				this.delegator.destructor();
				this.delegator = null;
			}

			this.application = this.config = this.element = null;

			BaseOperation.prototype.destructor.call(this);
		},

		handleAction: function(action) {
			if ("domload" === action.event.type) {
				// TODO: Get all *[data-action-domload] elements and run "init" operations on them
				this.runDomloadOperations(action);
			}
			else if ("init" === action.name) {
				this.runChildOperation(action);
			}
			else {
				this.eventDispatcher.publish("operation:" + action.name, this, action);
			}
		},

		run: function() {
			this.config = this.application.config;
			this.element = this.application.document.documentElement;
			this.delegator.node = this.element;
			this.delegator.delegate = this;
			this.delegator.addEventTypes( this.config["delegator.eventTypes"] );
		},

		runChildOperation: function(action) {
			var name = action.element.getAttribute("data-operation")
			var childOperation = this.getChildOperation(name);

			if (!childOperation) {
				throw new Error("No child operation found for name '" + name + "'");
			}
			else {
				childOperation.call(this, action);
				childOperation = null;
			}
		},

		domload: function(action) {
			var actionElement = action.element;
			var i = 0, elements = action.element.querySelectorAll("[data-action-domload=init]"), length = elements.length;

			for (i; i < length; i++) {
				action.element = elements[i];
				this.runChildOperation(action);
			}

			action.element = actionElement;
		},

		setApplication: function(application) {
			this.application = application;
		},

		setDelegator: function(delegator) {
			this.delegator = delegator;
		},

		setEventDispatcher: function(eventDispatcher) {
			this.eventDispatcher = eventDispatcher;
		}

	}
});

/* File: src/framework/operations/InitOperation.js */
InitOperation = BaseOperation.extend({

	prototype: {

		containerElement: null,

		containerOptions: {
			className: "init",
			location: "bottom"
		},

		delegatorEventTypes: "click submit",

		element: null,

		operationMap: null,

		destructor: function() {
			if (this.element) {
				this.element.parentNode.removeChild(this.element);
			}

			this.element = null;
		},

		destroyOperationChain: function() {
			this.parentOperation.removeChildOperation(this);
			this.destructor();
		},

		call: function(parentOperation, action) {
			this.containerElement = this.getContainerElement(action.element);
			this.createElement();

			if (this.operationMap) {
				this.map(this.operationMap);
			}

			BaseOperation.prototype.call.call(this, parentOperation, [action]);
			parentOperation = action = null;
		},

		cancel: function(action) {
			action.cancel();
			this.destroyOperationChain();
		},

		createElement: function() {
			this.element = this.getDocument().createElement("div");
			this.element.setAttribute("class", this.containerOptions.className);

			if (this.containerOptions.location === "top") {
				if (this.containerElement.childNodes[0]) {
					this.containerElement.insertBefore(this.containerElement.childNodes[0], this.element);
				}
				else {
					this.containerElement.appendChild(this.element);
				}
			}
			else {
				this.containerElement.appendChild(this.element);
			}
		},

		getContainerElement: function(element) {
			var containerElement = element;

			if (containerElement.getAttribute("data-operation-container")) {
				containerElement = document.getElementById( containerElement.getAttribute("data-operation-container") );
			}
			else {
				while (containerElement && containerElement.getAttribute("data-layout-role") != "container") {
					containerElement = containerElement.parentNode;
				}
			}

			event = null;

			return containerElement;
		},

		getDocument: function() {
			return this.containerElement ? this.containerElement.ownerDocument : null;
		},

		render: function(templateName, data) {
			if (!this.view) {
				this.view = BaseView.getInstance(this.element, this, templateName);
				this.view.delegatorEventTypes = this.delegatorEventTypes;
				this.view.init();
			}
			else {
				this.view.templateName = templateName;
			}

			this.view.render(data);
			data = null;
		}

	}

});

/* File: src/framework/operations/SubOperation.js */
SubOperation = BaseOperation.extend({
	prototype: {

		destroyOperationChain: function() {
			if (this.parentOperation) {
				this.parentOperation.destroyOperationChain();
			}
		}

	}
});

/* File: src/framework/application/Application.js */
/*

Operation tree:

	init
	- load widgets
		- respond to user events
	- teardown

Sample Use:

	var app = new Application(new OperationFactory(), new events.Dispatcher());

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

		bootOperation: null,

		config: null,

		delegator: null,

		document: null,

		eventDispatcher: null,

		operationFactory: null,

		window: null,

		initialize: function() {
			this.config = {
				"bootOperation.name": "boot",
				"delegator.eventTypes": ["click", "submit", "keydown", "keypress", "keyup", "domload"]
			};
		},

		init: function() {
			this.window.onerror = this.handleError.bind(this);
			this.operationFactory.setEventDispatcher(this.eventDispatcher);
			this.bootOperation = this.operationFactory.getOperation(this.config["bootOperation.name"]);
			this.bootOperation.setApplication(this);
			this.bootOperation.setEventDispatcher(this.eventDispatcher);
			this.bootOperation.setDelegator(this.delegator);
			this.bootOperation.call(null);
			this.delegator.triggerEvent("domload");
		},

		destructor: function() {
			this.delegator.destructor();
			this.bootOperation.destructor();
			this.eventDispatcher.destructor();
			this.operationFactory.destructor();
			this.window.onerror = this.window = this.document = this.delegator = this.bootOperation = this.operationFactory = this.eventDispatcher = null;
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
		},

		handleAccessDeniedError: function(info) {
			if (info.message) {
				console.warn(info.message);
			}
			else {
				console.warn("Access denied!");
			}
		}

	}

});

