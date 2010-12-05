/**
 * @class This static class provides the capability to route URL-style strings to
 * controllers. This is similar in concept to a "Front Controller" in traditional
 * applications. This class may not be instantiated, instead pass the raw reference to
 * this class to other objects that require this functionality.
 *
 * @requires Route
 * @extends Object
 */
var Router = {
	
	/**
	 * @property {Object} A hash object of controller Ids and controllers that respond to
	 *                   routes.
	 */
	controllers: {},
	
	/**
	 * @property {Object<Route>} A hash object of route objects
	 */
	routes: {},
	
	destructor: function() {
		var i = 0;
		
		if (this.controllers) {
			for (var id in this.controllers) {
				if (!this.controllers.hasOwnProperty(id)) {
					continue;
				}
				
				for (i = 0, length = this.controllers[id].length; i < length; i++) {
					this.controllers[id][i] = null;
				}
				
				this.controllers[id] = null;
			}
			
			this.controllers = null;
		}
	},
	
	controllerExists: function(id, instance) {
		var found = false;
		
		if (this.controllers[id]) {
			for (var i = 0, length = this.controllers[id].length; i < length; i++) {
				if (instance === this.controllers[id][i]) {
					found = true;
					break; // break out of for loop
				}
			}
		}
		
		instance = null;
		
		return found;
	},
	
	getControllers: function(id) {
		if (this.controllers[id]) {
			return this.controllers[id];
		}
		
		return [];
	},
	
	getRoute: function(rawRoute) {
		if (!this.routeExists(rawRoute)) {
			this.routes[rawRoute] = new Route(rawRoute);
		}
		
		return this.routes[rawRoute];
	},
	
	/**
	 * Process a route
	 * 
	 * @param {mixed} route The raw route string or a Route object
	 * @return {Boolean} True if the route was propagated to all controllers.
	 */
	processRoute: function(route) {
		route = (typeof route === "string") ? this.getRoute(route) : route;
		var controllers = this.getControllers(route.getControllerId());
		var controller = null;
		var method = route.getMethodName();
		var propagate = true;
		
		for (var i = 0, length = controllers.length; i < length; i++) {
			controller = controllers[i];
			
			if (controller[method]) {
				propagate = controller[method].apply(controller, route.getArgs());
				
				if (!propagate) {
					break; // this route should not be forwarded to the next controller
				}
			}
		}
		
		controller = controllers = route = null;
		
		return propagate;
	},
	
	/**
	 * Register a controller to respond to routes.
	 *
	 * @param {String} id The Id this controller should register itself as. This is the
	 *                    first slot in a route string.
	 * @param {Object} instance An object acting as a controller that will respond to
	 *                          routes.
	 */ 
	registerController: function(id, instance) {
		if (this.controllerExists(id, instance)) {
			return;
		}
		
		if (!this.controllers[id]) {
			this.controllers[id] = [];
		}
		
		this.controllers[id].push(instance);
		instance = null;
	},
	
	routeExists: function(rawRoute) {
		return (this.routes[rawRoute]) ? true : false;
	},
	
	/**
	 * Unregister, or remove, a controller from this router. This method provides two
	 * interfaces. In the first, a controller instance is removed from all controller
	 * ids. In the second, a controller instance is removed from a specific id.
	 *
	 * @param {Object} instance A controller instance to remove from all ids.
	 * @return {void}
	 *
	 * @param {String} id The controller id from which to remove a controller instance
	 * @param {Object} instance The controller instance to remove
	 * @return {Boolean} True if removed, false otherwise
	 */
	unregisterController: function() {
		var id, instance;
		var unregistered;
		
		if (arguments.length === 1) {
			instance = arguments[0];
			
			for (id in this.controllers) {
				if (!this.controllers.hasOwnProperty(id)) {
					continue;
				}
				
				this.unregisterController(id, instance);
			}
		}
		else {
			unregistered = false;
			id = arguments[0];
			instance = arguments[1];
			
			if (this.controllers[id] && this.controllers[id].length) {
				for (var i = 0, length = this.controllers[id].length; i < length; i++) {
					if (instance === this.controllers[id][i]) {
						this.controllers[id][i] = null;
						this.controllers[id].splice(i, 1);
						unregistered = true;
						
						break;
					}
				}
			}
		}
		
		instance = null;
		
		return unregistered;
	}
	
};