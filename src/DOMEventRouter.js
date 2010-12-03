/**
 * @class This class bridges the Router with the Document Object Model and DOM events. It
 * hijacks the process by adding the target element of the DOM event as the last argument
 * to the controller methods.
 * 
 * @requires Router
 * @extends Object
 */
function DOMEventRouter() {
	this.constructor.apply(this, arguments);
}

DOMEventRouter.prototype = {
	
	events: null,
	
	router: null,
	
	constructor: function(router) {
		this.router = router;
		this.events = {};
		this.handleDOMEvent = this.bindFunction(this.handleDOMEvent);
		
		router = null;
	},
	
	destructor: function() {
		this.router = null;
		
		if (this.events) {
			for (var type in this.events) {
				if (!this.events.hasOwnProperty(type)) {
					continue;
				}
				
				for (var i = 0, length = this.events[type].length; i < length; i++) {
					this.events[type][i].unbind(type, this.handleDOMEvent);
					this.events[type][i] = null;
				}
				
				this.events[type] = null;
			}
			
			this.events = null;
		}
	},
	
	/**
	 * A hack to add a route to a document object. You cannot set attributes on the
	 * #document node, so instead we add a property called data-route-<type> to the
	 * object itself.
	 * 
	 * If you call registerRoutes(jQuery(document) ...), be sure to call addDocumentRoute
	 * to ensure the route actually gets processed.
	 *
	 * @param {String} type The type of route to add, e.g. click, mousedown, etc.
	 * @param {String} rawRoute A raw route string.
	 * @param {HTMLDocumentObject} doc The document to add the route to. Defaults to the
	 *                                 global document variable.
	 */
	addDocumentRoute: function(type, rawRoute, doc) {
		doc = doc || document;
		doc["data-route-" + type] = rawRoute;
		doc = null;
	},
	
	addEvent: function(type, node) {
		if (!this.events[type]) {
			this.events[type] = [];
		}
		
		this.events[type].push(node);
		node = null;
	},
	
	controllerExists: function(id, instance) {
		return this.router.controllerExists(id, instance);
	},
	
	handleDOMEvent: function(event) {
		var type = event.type;
		var node = event.target;
		var propagate = this.processRoutes(type, node, event);
		
		event = node = null;
		
		return propagate;
	},
	
	/**
	 * Process routes starting in the DOM tree at node. If no route was found at node,
	 * then traverse up the DOM tree until one is found or the top of the tree is reached.
	 *
	 * @param {String} type The type of route to process. Cooresponds to a DOM event name.
	 * @param {HTMLElement} node The DOM node to start processing routes at
	 * @return {Boolean} True if all routes were processed, or no routes were found.
	 */
	processRoutes: function(type, node, event) {
		var rawRoute = null;
		var propagate = true;
		var route = null;
		
		if (node.nodeName === "#document") {
			// treat the #document node specially because we cannot add data-foo attributes. See addDocumentRoute().
			if (node["data-route-" + type]) {
				// grab the raw route from a property on the document object
				rawRoute = node["data-route-" + type];
			}
		}
		else {
			// grab the raw route from an attribute on the HTML tag.
			rawRoute = node.getAttribute("data-route-" + type);
		}
		
		if (rawRoute) {
			// get the route object from the router
			route = this.router.getRoute(rawRoute);
			
			// make target DOM element second to last argument to the controller method
			route.args.push(node);
			
			// make event object last argument to controller method
			route.args.push(event);
			
			// process the route like normal
			propagate = this.router.processRoute(route);
			
			// remove the event object from the route arguments
			route.args.pop();
			
			// remove the DOM element from the route arguments
			route.args.pop();
		}
		else if (node.parentNode) {
			// try the next node up the tree
			propagate = this.processRoutes(type, node.parentNode);
		}
		
		return propagate;
	},
	
	/**
	 * Register routes on a DOM node. The first argument is the DOM node for which routes
	 * should be registered. Remaining parameters are DOM event names.
	 *
	 * var router = new DOMEventRouter(Router);
	 * var el = document.getElementById("foo");
	 * 
	 * router.registerRoutes(el, "click", "mousedown", "mouseup");
	 * 
	 * @param {HTMLElement} 0 The DOM node for which routes should be registered
	 * @params {String} 1 - n DOM event names
	 */
	registerRoutes: function() {
		var node = arguments[0];
		var types = Array.prototype.slice.call(arguments, 1);
		
		for (var i = 0, length = types.length; i < length; i++) {
			node.bind(types[i], this.handleDOMEvent);
			this.addEvent(types[i], node);
		}
		
		node = null;
	},
	
	removeEvent: function(type, node) {
		if (this.events[type]) {
			for (var i = 0, length = this.events[type].length; i < length; i++) {
				if (node === this.events[type][i]) {
					this.events[type].splice(i, 0);
				}
			}
		}
		
		node = null;
	},
	
	/**
	 * Unregister routes on a DOM node. The first argument is the DOM node for which
	 * routes should be registered. Remaining parameters are DOM event names.
	 * 
	 * @param {HTMLElement} 0 The DOM node for which routes should be unregistered
	 * @params {String} 1 - n DOM event names
	 */
	unregisterRoutes: function() {
		var node = arguments[0];
		var types = Array.prototype.slice.call(arguments, 1);
		
		for (var i = 0, length = types.length; i < length; i++) {
			node.unbind(type, this.handleDOMEvent);
			this.removeEvent(type, node);
		}
		
		node = null;
	},
	
	
	
	bindFunction: function(fn, ctx) {
		ctx = ctx || this;
		
		return function() {
			return fn.apply(ctx, arguments);
		};
	}
	
};