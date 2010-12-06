/**
 * @class This class provides a generic method for loading chunks of HTML from a middle
 * tier on the server and injecting it into the DOM. You may sub class this class if you
 * wish to use any of the popular JavaScript libraries and frameworks, such as jQuery,
 * Prototype, Dojo or Sizzle.
 *
 * @extends Object
 */
function RemoteViewLoader() {
	this.constructor.apply( this, arguments );
}

RemoteViewLoader.prototype = {
	
	/**
	 * @property {Object} The object encapsulating the remote API to retrieve the views
	 */
	api: null,
	
	/**
	 * Class constructor
	 *
	 * @param {Object} api The api property
	 */
	constructor: function( api ) {
		this.api = api;
		
		api = null;
	},
	
	/**
	 * Create the API request parameters from the array of keys and values
	 *
	 * @param {Array} arr The array of keys and values, where the keys are even numbered
	 *                    indexes and values are odd indexes.
	 * @return {Object} A hash object of parameters.
	 */
	createParams: function( arr ) {
		var obj = {};
		
		for ( var i = 0, length = arr.length; i < length; i += 2 ) {
			obj[ arr[ i ] ] = arr[ i + 1 ];
		}
		
		arr = null;
		
		return obj;
	},
	
	/**
	 * Insert the HTML from the server into the specified DOM node.
	 *
	 * @param {String} html The html to insert
	 * @param {String} selector The Id of a DOM node
	 *
	 * @throws Error
	 */
	insertHTML: function( html, selector ) {
		var node = document.getElementById( selector );
		
		if ( node ) {
			node.innerHTML = html;
		}
		else {
			throw new Error("No node was found for Id " + selector);
		}
		
		node = null;
	},
	
	/**
	 * Load a remote view via the API with the specified params
	 *
	 * @param {String} method The method name to call on the API object.
	 * @param {String} selector The Id of a DOM node
	 * @param {Array} paramsArray An array of parameter keys and values
	 *
	 * @throws Error
	 */
	load: function( method, selector, paramsArray ) {
		var params = this.createParams( paramsArray );
		var _this = this;
		var options = {
			success: function( html ) {
				_this.insertHTML(html, selector);
				cleanup();
			},
			
			error: function() {
				cleanup();
			}
		};
		
		var cleanup = function() {
			_this = paramsArray = params = options = null;
		};
		
		if ( this.api[ method ] ) {
			this.api[ method ]( params, options );
		}
		else {
			throw new Error("Method " + method + " does not exist in this.api.");
		}
	}
	
};