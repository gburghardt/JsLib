/**
 * @class This class encapsulates information about a "route" through a JavaScript
 * application. It allows routers to determine which controllers should handle this route.
 * Routes exist in the DOM as HTML 5 data-route-foo attributes. The complimentary class to
 * this is DOMEventRouter, where data-route-click is a route for a click event. These
 * route strings come in the form:
 *
 * [/]controllerId/methodName[[/]arg1[/]argN]
 *
 * Example: /details/show
 *          details/show
 *          details/show/1234 <-- numeric arguments are converted to numbers
 *          details/show/null <-- "null" strings are converted to actual null values, case insensitive
 *          details/show/true <-- "true" and "false" are converted to actual boolean values, case insensitive
 *          details/show/a,b  <-- Values containing commas are converted to arrays, allowing you to pass arrays as arguments to controllers
 *          details/show/foo%20bar <-- Becomes "foo bar". All string values are decoded via decodeURIComponent
 *          details/show/1/null/false <-- Pass multiple arguments to the controllers: 1, null and false. An unlimited number of arguments are supported
 * 
 * These routes can even be included in the anchor portion of the URL to a page.
 * 
 * http://www.foo.com/#details/display/arg1
 * |________________|  |_____| |_____| |__|
 *         |              |       |     |
 *         1              2       3     4
 * 
 * 1) URL to your web page
 * 2) Route controller Id
 * 3) Route controller method name
 * 4) First argument to the route controller method
 * 
 * This can enable Ajax applications to utilize the browser's back button.
 * 
 * @extends Object
 */
function Route() {
	this.constructor.apply(this, arguments);
}

Route.prototype = {
	
	/**
	 * @property {Array} The array of arguments passed to the controllers' methods
	 */
	args: null,
	
	/**
	 * @property {String} A unique Id that controllers may use to identify which routes
	 *                    they want to handle.
	 */
	controllerId: null,
	
	/**
	 * @property {Object} A hash object of regular expressions used to convert strings to
	 *                    certain data types.
	 */
	dataTypes: {
		"array": /,/,
		"bool": /^true|false$/i,
		"null": /^null$/i,
		"numeric": /^[-.0-9]+$/
	},
	
	/**
	 * @property {String} Name of a method to call on a controller
	 */
	methodName: null,
	
	/**
	 * Class constructor. This supports two interfaces. In the first, a raw route string
	 * is provided and parsed. In the second interface, you must pass a controller Id and
	 * a method name, with the optional third argument being the args propery.
	 *
	 * @param {String} controllerId The raw route string, which gets parsed into the
	 *                              controller Id, method name and arguments.
	 * 
	 * @param {String} controllerId The Id for a controller
	 * @param {String} method The method to call on a controller
	 * @param {Array} args The optional arguments to the controller method
	 * 
	 * @throws Error
	 */
	constructor: function(controllerId, method, args) {
		var rawRoute = null;
		
		if (arguments.length === 1) {
			// assume controllerId contains full route string
			rawRoute = controllerId;
			
			var info = this.parseRouteString(rawRoute);
			
			controllerId = info.controllerId;
			method = info.methodName;
			args = info.args;
			
			info = null;
		}
		else {
			rawRoute = controllerId + "/" + method;
		}
		
		if (!controllerId) {
			throw new Error("No controller Id was found. Could not process invalid route: " + rawRoute);
		}
		else if (!method) {
			throw new Error("No method name was found for controllerId " + controllerId + " in route " + rawRoute);
		}
		
		this.controllerId = controllerId;
		this.methodName = method;
		this.args = args || [];
	},
	
	addArg: function(value) {
		this.args.push(value);
	},
	
	decodeArg: function(value) {
		if (this.dataTypes["array"].test(value)) {
			value = this.decodeArgs(value.split(","));
		}
		else if (this.dataTypes["bool"].test(value)) {
			value = (value.toLowerCase() === "true");
		}
		else if (this.dataTypes["null"].test(value)) {
			value = null;
		}
		else if (this.dataTypes["numeric"].test(value) && !isNaN(value)) {
			value = Number(value);
		}
		
		if (typeof value === "string") {
			value = decodeURIComponent(value);
		}
		
		return value;
	},
	
	decodeArgs: function(args) {
		for (var i = 0, length = args.length; i < length; i++) {
			args[i] = this.decodeArg(args[i]);
		}
		
		return args;
	},
	
	encodeArg: function(value) {
		var s = "";
		var type = typeof value;
		
		if (type === "object" && value !== null && value.constructor === Array) {
			s += this.encodeArgs(value);
		}
		else {
			s += encodeURIComponent(String(value));
		}
		
		return s;
	},
	
	encodeArgs: function(args) {
		var s = "";
		
		for (var i = 0, length = args.length; i < length; i++) {
			s += "/" + this.encodeArg(args[i]);
		}
		
		return s;
	},
	
	getArgs: function() {
		return this.args;
	},
	
	getControllerId: function() {
		return this.controllerId;
	},
	
	getMethodName: function() {
		return this.methodName;
	},
	
	parseRouteString: function(rawRoute) {
		var pieces = rawRoute.replace(/^\/+/, "").split("/");
		var info = {
			controllerId: null,
			methodName: null,
			args: []
		};
		
		if (pieces.length > 0) {
			info.controllerId = pieces[0];
			
			if (pieces.length > 1) {
				info.methodName = pieces[1];
			}
			
			if (pieces.length > 2) {
				info.args = this.decodeArgs(pieces.slice(2));
			}
		}
		
		pieces = null;
		
		return info;
	},
	
	removeArg: function(i) {
		if (i >= 0 && i < this.args.length) {
			this.args.splice(i, 0);
		}
	},
	
	toString: function() {
		var s = this.controllerId + "/" + this.methodName;
		
		if (this.args.length) {
			s += this.encodeArgs(this.args);
		}
		
		return s;
	}
	
};