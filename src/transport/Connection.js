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

/**
 * @property {Object} An object supporting the parse() and stringify() methods
 *                    for safely encoding and decoding JSON text and objects.
 */
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
	
	/**
	 * Set the params used in requests
	 * 
	 * @param {Object} params A hash object of params used as key-value pairs
	 *        {SerializableData} params An object that supports a serialize()
	 *                                  method
	 *        {String} params A query string of request params
	 */
	this.setParams = function( params ) {
		var type = typeof params;
		if ( type === "string" || type === "object" ) {
			_params = params;
		}
		
		params = null;
	};
	
	
	/**
	 * @abstract
	 * 
	 * Abort the current connection
	 */
	this.abort = function() {
		throw new Error("Child classes of Connection must implement abstract method abort()");
	};
	
	/**
	 * @abstract
	 * 
	 * Send a request
	 */
	this.send = function() {
		throw new Error("Child classes of Connection must implement abstract method send()");
	};
	
	/**
	 * @abstract
	 * 
	 * Send a request with a hash object of connection options.
	 * 
	 * @param {Object} options A hash object of connection options
	 */
	this.sendWithOptions = function( options ) {
		throw new Error("Child classes of Connection must implement abstract method sendWithOptions(Object: options)");
	};
	
	/**
	 * @abstract
	 * 
	 * Send with parameters
	 * 
	 * @param {Object} params A hash object of params used as key-value pairs
	 *        {SerializableData} params An object that supports a serialize()
	 *                                  method
	 *        {String} params A query string of request params
	 */
	this.sendWithParams = function( params ) {
		throw new Error("Child classes of Connection must implement abstract method sendWithParams(Object: params)");
	};
	
	/**
	 * Set the actions that delegates will respond to
	 * 
	 * @param {Object} actions A hash object of action names and info
	 *            {Object}
	 *                {Object} instance An object instance
	 *                {String} method The method to call on instance
	 */
	this.setActions = function( actions ) {
		for ( var action in actions ) {
			if ( !actions.hasOwnProperty( action ) ) {
				continue;
			}
			
			this.addDelegate( action, actions[ action ].instance, actions[ action ].method );
		}
		
		actions = null;
	};
	
	/**
	 * @abstract
	 * 
	 * Set options for this connection
	 * 
	 * @param {Object} options A hash object of connection options
	 */
	this.setOptions = function( options ) {
		throw new Error("Child classes of Connection must implement abstract method setOptions(Object: options)");
	};
	
	
	
	/**
	 * @destructs
	 */
	this.destructor = function() {
		Connection.superClass.destructor.call(this);
	};
	
	jsonService = null;
};