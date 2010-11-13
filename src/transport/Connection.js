/**
 * @class An abstract base class for connection objects
 * 
 * @abstract
 * @extends Delegator
 */
function Connection() {
	throw new Error("The Connection class is an abstract class and cannot be instantiated.");
}

Connection.superClass = Delegator.prototype;
Connection.prototype = function() {};
Connection.prototype.prototype = Connection.superClass;
Connection.prototype = new Connection.prototype;

/**
 * @static {String} Success delegate is given an XML DOM structure and the XML string
 */
Connection.prototype.DATA_TYPE_XML = "XML";

/**
 * @static {String} Success delegate is given the raw response string
 */
Connection.prototype.DATA_TYPE_HTML = "HTML";

/**
 * @static {String} Success delegate is given the eval'd object and the response string
 */
Connection.prototype.DATA_TYPE_JSON = "JSON";

Connection.prototype.jsonService = null;

Connection.prototype.constructor = function( jsonService ) {
	
	Connection.superClass.constructor.call(this);
	
	this.jsonService = jsonService;
	
	
	
	/**
	 * @property {Object} A key-value object of params to pass in the request
	 * @property {Object} An object of key-value pairs that supports a serialize() method
	 * @property {String} A pre serialized query string
	 */
	var _params = null;
	
	this.getParams = function() {
		return _params;
	};
	
	this.haveParams = function() {
		return (_params !== null && _params !== "" );
	};
	
	/**
	 * @access public
	 *
	 * Serialize an object of params to be sent in the request
	 *
	 * @param {Object} params An object of key-value pairs of parameters, or an object
	 *                        supporting a serialize() method.
	 *        {String} params A preserialized and URL encoded parameter string
	 * @return {String}
	 */
	this.serializeParams = function( params ) {
		var str = "";
		var tempParams = [];
		var encodedKey = "";
		
		if ( typeof params === "string" ) {
			str = params;
		}
		else if ( typeof params === "object" && params !== null ) {
			if ( typeof params.serialize === "function" ) {
				str = params.serialize();
			}
			else {
				for ( var key in params ) {
					if ( !params.hasOwnProperty( key ) ) {
						continue;
					}
					
					encodedKey = encodeURIComponent( key );
					
					if ( typeof params[ key ] === "object" && params[ key ] instanceof Array ) {
						for ( var i = 0, length = params[ key ].length; i < length; i++ ) {
							tempParams.push( encodedKey + "=" + encodeURIComponent( params[ key ][ i ] ) );
						}
					}
					else {
						tempParams.push( encodedKey + "=" + encodeURIComponent( params[ key ] ) );
					}
				}
				
				str = tempParams.join( "&" );
			}
		}
		
		params = null;
		tempParams = null;
		
		return str;
	};
	
	this.setParams = function( params ) {
		var type = typeof params;
		if ( type === "string" || type === "object" ) {
			_params = params;
		}
		
		params = null;
	};
	
	
	
	this.abort = function() {
		throw new Error("Child classes of Connection must implement abstract method abort()");
	};
	
	this.send = function() {
		throw new Error("Child classes of Connection must implement abstract method send()");
	};
	
	this.sendWithOptions = function( options ) {
		throw new Error("Child classes of Connection must implement abstract method sendWithOptions(Object: options)");
	};
	
	this.sendWithParams = function( params ) {
		throw new Error("Child classes of Connection must implement abstract method sendWithParams(Object: params)");
	};
	
	this.setActions = function( actions ) {
		for ( var action in actions ) {
			if ( !actions.hasOwnProperty( action ) ) {
				continue;
			}
			
			this.addDelegate( action, actions[ action ].instance, actions[ action ].method );
		}
		
		actions = null;
	};
	
	this.setOptions = function( options ) {
		throw new Error("Child classes of Connection must implement abstract method setOptions(Object: options)");
	};
	
	
	
	this.destructor = function() {
		Connection.superClass.destructor.call(this);
	};
	
	jsonService = null;
};