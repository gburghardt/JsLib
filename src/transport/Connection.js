/**
 * @extends Delegator
 */
function Connnection() {
	this.constructor.apply( this, arguments );
}

Connection.superClass = Delegator.prototype;
Connection.prototype = function() {};
Connection.prototype.prototype = Connection.superClass;
Connection.prototype = new Connection.prototype;

/**
 * @static {String} Success delegate is given an XML DOM structure and the XML string
 */
Connection.DATA_TYPE_XML = "XML";

/**
 * @static {String} Success delegate is given the raw response string
 */
Connection.DATA_TYPE_HTML = "HTML";

/**
 * @static {String} Success delegate is given the eval'd object and the response string
 */
Connection.DATA_TYPE_JSON = "JSON";

Connection.METHOD_DELETE = "DELETE";
Connection.METHOD_GET = "GET";
Connection.METHOD_HEAD = "HEAD";
Connection.METHOD_OPTIONS = "OPTIONS";
Connection.METHOD_POST = "POST";
Connection.METHOD_PUT = "PUT";

/**
 * @constructs
 *
 * @param {Object} jsonService The object responsible for converting objects to an from
 *                             JSON strings
 */
Connection.prototype.constructor = function( jsonService ) {
	
	/**
	 * @property {Connection} A static reference to this connection used in function
	 *                        closures
	 */
	var _this = this;
	
	/**
	 * @property {XMLHttpRequest} The same-domain request object
	 */
	var xhr = null;
	
	/**
	 * @property {Object} An options bundle defining common options for this connection
	 */
	var options = {
		
		/**
		 * @property {String} The URL to send requests to. The params are appended to the
		 *                    URL when the method is GET.
		 */
		url: "",
		
		/**
		 * @property {Boolean} Requests get sent asynchronously or not
		 */
		async: true,
		
		 /**
		 * @property {String} The data type to interpret responses as
		 */
		dataType: Connection.DATA_TYPE_JSON,
		
		/**
		 * @property {String} The HTTP method to use
		 */
		method: Connection.METHOD_POST,
		
		/**
		 * @property {Object} A key-value object of params to pass in the request
		 * @property {Object} An object of key-value pairs that supports a serialize() method
		 * @property {String} A pre serialized query string
		 */
		params: null,
		
		/**
		 * @property {Number} The number of miliseconds to wait before declaring a
		 *                    connection timed out.
		 */
		timeout: 30000
		
	};
	
	this.setOptions = function( o ) {
		_this.abort();
		
		if ( typeof o.url === "string" ) {
			options.url = o.url;
		}
		
		if ( typeof o.async === "boolean" ) {
			options.async = o.async;
		}
		
		if ( typeof o.dataType === "string" ) {
			setDataType( o.dataType );
		}
		
		if ( typeof o.method === "string" ) {
			setMethod( o.method );
		}
		
		if ( typeof o.timeout === "number" && !isNaN( o.timeout ) ) {
			options.timeout = o.timeout;
		}
		
		o = null;
	};
	
	/**
	 * @access public
	 *
	 * Gets the options.async property
	 *
	 * @return {Boolean}
	 */
	this.getAsynch = function() {
		return options.asynch;
	};
	
	/**
	 * @access public
	 *
	 * Gets the options.dataType property
	 *
	 * @return {String}
	 */
	this.getDataType = function() {
		return options.dataType;
	};
	
	var setDataType = function( type ) {
		switch( String( type ).toUpperCase() ) {
			case Connection.DATA_TYPE_JSON:
				options.dataType = Connection.DATA_TYPE_JSON;
			break;
			
			case Connection.DATA_TYPE_HTML:
				options.dataType = Connection.DATA_TYPE_HTML;
			break;
			
			case Connection.DATA_TYPE_XML:
				options.dataType = Connection.DATA_TYPE_XML;
			break;
			
			case Connection.DATA_TYPE_JSONP:
				options.dataType = Connection.DATA_TYPE_JSONP;
			break;
			
			default:
				options.dataType = Connection.DATA_TYPE_JSON;
			break;
		}
	};
	
	/**
	 * @access public
	 *
	 * Gets the options.method property
	 *
	 * @return {String}
	 */
	this.getMethod = function() {
		return options.method;
	};
	
	var setMethod = function( str ) {
		switch( str.toUpperCase() ) {
			case Connection.METHOD_POST:
				method = Connection.METHOD_POST;
			break;
			
			case Connection.METHOD_GET:
				method = Connection.METHOD_GET;
			break;
			
			case Connection.METHOD_PUT:
				method = Connection.METHOD_PUT;
			break;
			
			case Connection.METHOD_DELETE:
				method = Connection.METHOD_DELETE;
			break;
			
			case Connection.METHOD_HEAD:
				method = Connection.METHOD_HEAD;
			break;
			
			case Connection.METHOD_OPTIONS:
				method = Connection.METHOD_OPTIONS;
			break;
		
			default:
				method = Connection.METHOD_GET;
			break;
		}
	};
	
	/**
	 * @access private
	 *
	 * Serialize an object of params to be sent in the request
	 *
	 * @param {Object} params An object of key-value pairs of parameters, or an object
	 *                        supporting a serialize() method.
	 *        {String} params A preserialized and URL encoded parameter string
	 * @return {String}
	 */
	var serializeParams = function( params ) {
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
		
		return str;
	};
	
	/**
	 * @access public
	 *
	 * Gets the options.url property
	 *
	 * @return {String}
	 */
	this.getUrl = function() {
		return options.url;
	};
	
	var setUrl = function( str ) {
		if ( typeof str === "string" ) {
			options.url = str;
		}
	};
	
	
	
	/**
	 * @property {String} The password sent with the request
	 */
	var password = null;
	
	var getPassword = function() {
		return password;
	};
	
	var setPassword = function( str ) {
		if ( typeof str === "string" ) {
			password = str;
		}
	};
	
	
	
	/**
	 * @property {String} The username sent with the request
	 */
	var user = null;
	
	var getUser = function() {
		return user;
	};
	
	var setUser = function( str ) {
		if ( typeof str === "string" ) {
			user = str;
		}
	};
	
	var requiresAuthentication = function() {
		return ( user || password );
	};
	
	
	
	/**
	 * @property {Boolean} Whether or not the connection is currently open
	 */
	var opened = false;
	
	var complete = false;
	
	var open = function() {
		if ( opened ) {
			return;
		}
		
		if ( xhr === null ) {
			xhr = new XMLHttpRequest();
		}
		
		var url = options.url;
		
		if ( requiresAuthentication() ) {
			if ( Connection.METHOD_GET === options.method && options.params ) {
				if ( url.indexOf( "?" ) === -1 ) {
					url += "?";
				}
				
				url += serializeParams( options.params );
			}
			
			xhr.open( options.method, url, options.async, getUser(), getPassword() );
		}
		else {
			xhr.open( options.method, url, options.async );
		}
		
		xhr.setRequestHeader( "X-REQUESTED-WITH", "XMLHttpRequest" );
		
		if ( !xhr.onreadystatechange ) {
			xhr.onreadystatechange = handleReadyStateChanged;
		}
		
		opened = true;
	};
	
	var handleReadyStateChanged = function() {
		if ( xhr.readyState !== 4 ) {
			return;
		}
		
		if ( timedOut ) {
			return;
		}
		
		timedOut = false;
		stopTimer();
		
		if ( xhr.status === 200 ) {
			// everything went well
			processSuccessfullResponse();
		}
		else if ( xhr.status >= 400 && xhr.status < 500 ) {
			// 400 error. remote resource not found
			_this.delegate( "4xxResponseStatus", {
				connection: _this,
				status: xhr.status
			} );
		}
		else if ( xhr.status >= 500 && xhr.status < 600 ) {
			// 500 error. the server blew up
			_this.delegate( "5xxResponseStatus", {
				connection: _this,
				status: xhr.status
			} );
		}
		else {
			// unknown status. delegate to someone else
			_this.delegate( "unknownResponseStatus", {
				connection: _this,
				status: xhr.status
			} );
		}
		
		complete = true;
	};
	
	var processSuccessfullResponse = function() {
		switch( options.dataType ) {
			case Connection.DATA_TYPE_JSON:
				processJSONResponse();
			break;
			
			case Connection.DATA_TYPE_XML:
				processXMLResponse();
			break;
			
			case Connection.DATA_TYPE_HTML:
				processHTMLResponse();
			break;
			
			default:
				processJSONResponse();
			break;
		}
	};
	
	var processJSONResponse = function() {
		var data = null;
		
		try {
			data = jsonService.parse( xhr.responseText );
		}
		catch ( err ) {
			_this.delegate( "error", {
				type: "jsonSyntaxError",
				jsonText: xhr.responseText
			} );
			
			return;
		}
		
		_this.delegate( "success", data );
		
		data = null;
	};
	
	var processXMLResponse = function() {
		var doc = xhr.responseXML;
		
		if ( doc === null ) {
			_this.delegate( "error", {
				type: "xmlSyntaxError",
				responseText: xhr.responseText
			} );
		}
		else {
			_this.delegate( "success", doc );
		}
		
		doc = null;
	};
	
	var processHTMLResponse = function() {
		var html = xhr.responseText;
		var metaText = xhr.getResponseHeader( "X-META-JSON" );
		var meta = null;
		
		if ( metaText ) {
			try {
				meta = jsonService.parse( metaText );
			}
			catch ( err ) {
				_this.delegate( "error", {
					type: "jsonSyntaxError",
					jsonText: metaText
				} )
			}
		}
		
		_this.delegate( "success", {
			html: html,
			meta: meta
		} );
		
		meta = null;
	};
	
	/**
	 * @access public
	 *
	 * Aborts a pending request
	 */
	this.abort = function() {
		if ( xhr.readyState === 4 ) {
			return;
		}
		
		stopTimer();
		xhr.abort();
		complete = true;
	};
	
	/**
	 * @access public
	 *
	 * Sends a request to the server
	 */
	this.send = function() {
		open();
		complete = false;
		startTimer();
		
		switch ( options.method.toUpperCase() ) {
			case Connection.METHOD_GET:
				xhr.send( null );
			break;

			case Connection.METHOD_POST:
			case Connection.METHOD_PUT:
			case Connection.METHOD_DELETE:
				xhr.send( serializeParams( options.params ) );
			break;
			
			default:
				throw new Error( "Cannot send a request whose method is " + options.method + " to URL " + options.url );
			break;
		}
		
		if ( !this.getAsync() && !complete ) {
			// fire readystatechange for Firefox in synchronous requests
			handleReadyStateChange();
		}
	};
	
	
	
	/**
	 * @property {Number} The setTimeout Id so we can detect connection time outs
	 */
	var timerId = null;
	
	/**
	 * @property {Boolean} Whether or not the last request timed out
	 */
	var timedOut = false;
	
	/**
	 * @property {Number} Number of times a connection has timed out
	 */
	var timeoutCount = 0;
	
	var startTimer = function() {
		if ( timerId ) {
			return;
		}
		
		timerId = setTimeout( handleTimeout, options.timeout );
	};
	
	var stopTimer = function() {
		if ( !timerId ) {
			return;
		}
		
		clearTimeout( timerId );
		timerId = null;
	};
	
	var handleTimeout = function() {
		timedOut = true;
		timeoutCount++;
		_this.delegate( "timeout", {
			url          : options.url,
			method       : options.method,
			status       : xhr.status,
			readyState   : xhr.readyState,
			timeoutCount : timeoutCount
		} );
		xhr.abort();
		timerId = null;
	};
	
	
	
	/**
	 * @access public
	 * @destructs
	 */
	this.destructor = function() {
		if ( !xhr ) {
			return;
		}
		
		_this.abort();
		xhr.onreadystatechange = null;
		xhr = null;
		
		for ( var key in options ) {
			if ( !options.hasOwnProperty( key ) ) {
				continue;
			}
			
			options[ key ] = null;
		}
		
		options = null;
		_this = null;
		
		Connection.superClass.destructor.call( this );
	};
	
	
	
	Connection.superClass.constructor.call( this );
};