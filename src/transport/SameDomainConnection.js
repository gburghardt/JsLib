/**
 * @class This class provides a wrapper for the native XMLHttpRequest object, doing all
 * the legwork to make connection handling easy and standardized. This class is not
 * compatible with Internet Explorer 5 & 6.
 *
 * @extends Delegator
 * @depends XMLHttpRequest
 *
 * @todo - Add support for the XMLHttpRequestFactory class to make this cross-browser.
 */
function Connection() {
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
	 * @property {Boolean} Requests get sent asynchronously or not
	 */
	var _async = true;
	
	/**
	 * @access public
	 *
	 * Gets the _asynch property
	 *
	 * @return {Boolean}
	 */
	this.getAsync = function() {
		return _async;
	};
	
	var setAsync = function( async ) {
		if ( typeof async === "boolean" ) {
			_async = async;
		}
	};
	
	
	
	/**
	 * @property {String} The data type to interpret responses as
	 */
	var _dataType = Connection.DATA_TYPE_JSON;
	
	/**
	 * @access public
	 *
	 * Gets the _dataType property
	 *
	 * @return {String}
	 */
	this.getDataType = function() {
		return _dataType;
	};
	
	this.setDataType = function( dataType ) {
		switch( String( dataType ).toUpperCase() ) {
			case Connection.DATA_TYPE_JSON:
				_dataType = Connection.DATA_TYPE_JSON;
			break;
			
			case Connection.DATA_TYPE_HTML:
				_dataType = Connection.DATA_TYPE_HTML;
			break;
			
			case Connection.DATA_TYPE_XML:
				_dataType = Connection.DATA_TYPE_XML;
			break;
		}
	};
	
	
	
	/**
	 * @property {String} The HTTP method to use
	 */
	var _method = Connection.METHOD_POST;
	
	/**
	 * @access public
	 *
	 * Gets the _method property
	 *
	 * @return {String}
	 */
	this.getMethod = function() {
		return _method;
	};
	
	var setMethod = function( str ) {
		switch( String( str ).toUpperCase() ) {
			case Connection.METHOD_POST:
				_method = Connection.METHOD_POST;
			break;
			
			case Connection.METHOD_GET:
				_method = Connection.METHOD_GET;
			break;
			
			case Connection.METHOD_PUT:
				_method = Connection.METHOD_PUT;
			break;
			
			case Connection.METHOD_DELETE:
				_method = Connection.METHOD_DELETE;
			break;
			
			case Connection.METHOD_HEAD:
				_method = Connection.METHOD_HEAD;
			break;
			
			case Connection.METHOD_OPTIONS:
				_method = Connection.METHOD_OPTIONS;
			break;
		}
	};
	
	
	
	/**
	 * @property {Object} A key-value object of params to pass in the request
	 * @property {Object} An object of key-value pairs that supports a serialize() method
	 * @property {String} A pre serialized query string
	 */
	var _params = null;
	
	var getParams = function() {
		return _params;
	};
	
	var haveParams = function() {
		return (_params !== null && _params !== "" );
	};
	
	/**
	 * @access private
	 *
	 * Serialize an object of params to be sent in the request
	 *
	 * @param {Object} p An object of key-value pairs of parameters, or an object
	 *                        supporting a serialize() method.
	 *        {String} p A preserialized and URL encoded parameter string
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
	
	
	
	/**
	 * @property {String} The URL to send requests to. The params are appended to the
	 *                    URL when the method is GET.
	 */
	var _url = "";
	
	/**
	 * @access public
	 *
	 * Gets the _url property
	 *
	 * @return {String}
	 */
	this.getUrl = function() {
		var url = _url;
		
		if ( Connection.METHOD_GET === this.getMethod() && haveParams() ) {
			var params = getParams();
			
			if ( url.indexOf( "?" ) === -1 ) {
				url += "?";
			}
			
			url += serializeParams( params );
		}
		
		return url;
	};
	
	var setUrl = function( str ) {
		if ( typeof str === "string" ) {
			_url = str;
		}
	};
	
	
	
	/**
	 * @property {XMLHttpRequest} The same-domain request object
	 */
	var _xhr = null;
	
	
	
	/**
	 * @property {String} The password sent with the request
	 */
	var _password = null;
	
	var getPassword = function() {
		return _password;
	};
	
	var setPassword = function( str ) {
		if ( typeof str === "string" ) {
			_password = str;
		}
	};
	
	
	
	/**
	 * @property {String} The username sent with the request
	 */
	var _user = null;
	
	var getUser = function() {
		return _user;
	};
	
	var setUser = function( str ) {
		if ( typeof str === "string" ) {
			_user = str;
		}
	};
	
	var requiresAuthentication = function() {
		return ( _user || _password );
	};
	
	
	
	var _complete = false;
	
	
	
	var open = function() {
		if ( _xhr === null ) {
			_xhr = new XMLHttpRequest();
		}
		
		if ( requiresAuthentication() ) {
			_xhr.open( _this.getMethod(), _this.getUrl(), _this.getAsync(), getUser(), getPassword() );
		}
		else {
			_xhr.open( _this.getMethod(), _this.getUrl(), _this.getAsync() );
		}
		
		if ( !_xhr.onreadystatechange ) {
			_xhr.setRequestHeader( "X-REQUESTED-WITH", "XMLHttpRequest" );
			_xhr.onreadystatechange = handleReadyStateChanged;
		}
	};
	
	var handleReadyStateChanged = function() {
		if ( _xhr.readyState !== 4 ) {
			return;
		}
		
		if ( _timedOut ) {
			return;
		}
		
		_timedOut = false;
		stopTimer();
		
		if ( _xhr.status === 200 ) {
			// everything went well
			processSuccessfullResponse();
		}
		else if ( _xhr.status !== 0 ) {
			var errorDelegateFound = false;
			
			// 400 level error. remote resource not found
			if ( _xhr.status >= 400 && _xhr.status < 500 ) {
				errorDelegateFound = _this.delegate( "error4xx", {
					connection: _this,
					status: _xhr.status
				} );
			}
			
			// 500 level error. the server blew up
			if ( !errorDelegateFound && _xhr.status >= 500 && _xhr.status < 600 ) {
				errorDelegateFound = _this.delegate( "error5xx", {
					connection: _this,
					status: _xhr.status
				} );
			}
			
			if ( !errorDelegateFound ) {
				_this.delegate( "error", {
					connection: _this,
					status: _xhr.status
				} );
			}
		}
		
		_complete = true;
	};
	
	var processSuccessfullResponse = function() {
		switch( _this.getDataType() ) {
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
		var error = null;
		
		if ( !jsonService ) {
			error = new Error( "No jsonService is available to parse the response text for this Connection (" + _url + ")" );
			
			_this.delegate( "error", {
				type: "missingJsonServiceError",
				responseText: _xhr.responseText,
				error: error
			} );
		}
		else {
			try {
				data = jsonService.parse( _xhr.responseText );
			}
			catch ( err ) {
				error = err;
			
				_this.delegate( "error", {
					type: "jsonSyntaxError",
					responseText: _xhr.responseText,
					error: err
				} );
			}
		}
		
		
		if ( !error ) {
			_this.delegate( "success", data );
		}
		
		error = null;
		data = null;
	};
	
	var isXMLParseError = function( doc ) {
		var valid = (
			doc === null ||
			( doc.childNodes && doc.childNodes.length === 0 ) ||
			( doc.documentElement && doc.documentElement.nodeName.toLowerCase() === "parsererror" )
		);
		
		doc = null;
		
		return valid;
	};
	
	var processXMLResponse = function() {
		var doc = _xhr.responseXML;
		
		if ( isXMLParseError( doc ) ) {
			_this.delegate( "error", {
				type: "xmlSyntaxError",
				responseText: _xhr.responseText
			} );
		}
		else {
			_this.delegate( "success", doc );
		}
		
		doc = null;
	};
	
	var processHTMLResponse = function() {
		var html = _xhr.responseText;
		var metaText = _xhr.getResponseHeader( "X-META-JSON" );
		var meta = null;
		var error = null;
		
		if ( metaText ) {
			try {
				meta = jsonService.parse( metaText );
			}
			catch ( err ) {
				error = err;
				
				_this.delegate( "error", {
					type: "jsonSyntaxError",
					responseText: html,
					metaText: metaText,
					error: err
				} )
			}
		}
		
		if ( !error ) {
			_this.delegate( "success", {
				html: html,
				meta: meta
			} );
		}
		
		error = null;
		meta = null;
	};
	
	/**
	 * @access public
	 *
	 * Aborts a pending request
	 */
	this.abort = function() {
		if ( _xhr.readyState === 4 ) {
			return;
		}
		
		stopTimer();
		_xhr.abort();
		_complete = true;
	};
	
	/**
	 * @access public
	 *
	 * Sends a request to the server
	 */
	this.send = function() {
		_complete = false;
		open();
		startTimer();
		
		switch ( this.getMethod().toUpperCase() ) {
			case Connection.METHOD_GET:
				_xhr.send( null );
			break;
			
			default:
				_xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
				_xhr.send( serializeParams( getParams() ) );
			break;
		}
		
		if ( !this.getAsync() && !_complete ) {
			// fire readystatechange for Firefox in synchronous requests
			handleReadyStateChanged();
		}
	};
	
	this.sendWithOptions = function( options ) {
		this.setOptions( options );
		this.send();
		options = null;
	};
	
	this.sendWithParams = function( params ) {
		this.setParams( params );
		this.send();
		params = null;
	};
	
	this.setOptions = function( o ) {
		setMethod( o.method );
		this.setParams( o.params );
		setUrl( o.url );
		this.setDataType( o.dataType );
		setUser( o.user );
		setPassword( o.password );
		setActions( o.actions );
		setTimeoutPeriod( o.timeoutPeriod );
		setAsync( o.async );
		
		o = null;
	};
	
	var setActions = function( actions ) {
		for ( var action in actions ) {
			if ( !actions.hasOwnProperty( action ) ) {
				continue;
			}
			
			_this.addDelegate( action, actions[ action ].instance, actions[ action ].method );
		}
		
		actions = null;
	};
	
	
	
	/**
	 * @property {Number} The setTimeout Id so we can detect connection time outs
	 */
	var _timerId = null;
	
	/**
	 * @property {Boolean} Whether or not the last request timed out
	 */
	var _timedOut = false;
	
	/**
	 * @property {Number} Number of times a connection has timed out
	 */
	var _timeoutCount = 0;
	
	/**
	 * @property {Number} The number of miliseconds to wait before declaring a
	 *                    connection timed out.
	 */
	var _timeoutPeriod = 30000;
	
	var setTimeoutPeriod = function( timeoutPeriod ) {
		if ( typeof timeoutPeriod === "number" && !isNaN( timeoutPeriod ) && timeoutPeriod > 0 ) {
			_timeoutPeriod = timeoutPeriod;
		}
	};
	
	var startTimer = function() {
		if ( _timerId ) {
			return;
		}
		
		_timerId = setTimeout( handleTimeout, _timeoutPeriod );
	};
	
	var stopTimer = function() {
		if ( !_timerId ) {
			return;
		}
		
		clearTimeout( _timerId );
		_timerId = null;
	};
	
	var handleTimeout = function() {
		_timedOut = true;
		_timeoutCount++;
		_this.delegate( "timeout", {
			url          : _this.getUrl(),
			method       : _this.getMethod(),
			readyState   : _xhr.readyState,
			timeoutCount : _timeoutCount
		} );
		_xhr.abort();
		_timerId = null;
	};
	
	
	
	/**
	 * @access public
	 * @destructs
	 */
	this.destructor = function() {
		if ( !_xhr ) {
			return;
		}
		
		_this.abort();
		_xhr.onreadystatechange = null;
		_xhr = null;
		_this = null;
		
		Connection.superClass.destructor.call( this );
	};
	
	
	
	Connection.superClass.constructor.call( this );
};