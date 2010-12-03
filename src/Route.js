/**
 * @class This class encapsulates information about a "route" through a JavaScript
 * application. It allows routers to determine which controllers should handle this route.
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
	 * @property {String} The raw string used for this route. It must be in a specific
	 *                    format: [/]controllerId/methodName[[/]value1[/]valueN]
	 *                    Example: /details/show
	 *                             details/show
	 *                             details/show/1234 <-- numeric arguments are converted to numbers
	 *                             details/show/null <-- "null" strings are converted to actual null values, case insensitive
	 *                             details/show/true <-- "true" and "false" are converted to actual boolean values, case insensitive
	 *                             details/show/a,b  <-- Values containing commas are converted to arrays, allowing you to pass arrays as arguments to controllers
	 *                             details/show/foo%20bar <-- Because "foo bar". All string values are decoded via decodeURIComponent
	 *                             details/show/1/null/false <-- Pass multiple arguments to the controllers: 1, null and false. An unlimited number of arguments are supported
	 */
	rawRoute: null,
	
	/**
	 * @constructs
	 *
	 * @param {String} rawRoute The rawRoute property
	 */
	constructor: function(rawRoute) {
		this.rawRoute = rawRoute;
		
		var pieces = rawRoute.replace(/^\/+/, "").split("/");
		
		if (pieces.length < 2) {
			throw new Error("No controller Id and method name was found. Could not process invalid route: " + rawRoute);
		}
		else if (pieces[0] === "") {
			throw new Error("No controller Id was found. Could not process invalid route: " + rawRoute);
		}
		else if (pieces[1] === "") {
			throw new Error("No method name was found for controllerId " + this.controllerId + " in route " + rawRoute);
		}
		
		this.controllerId = pieces[0];
		this.methodName = pieces[1];
		this.args = (pieces.length > 2) ? this.convertArgs(pieces.slice(2)) : [];
		
		pieces = null;
	},
	
	convertArgs: function(args) {
		var value = "";
		
		for (var i = 0, length = args.length; i < length; i++) {
			value = args[i];
			
			if (this.dataTypes["array"].test(value)) {
				value = this.convertArgs(value.split(","));
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
			
			args[i] = value;
		}
		
		return args;
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
	
	getRawRoute: function() {
		return this.rawRoute;
	}
	
};