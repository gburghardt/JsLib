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

/**
 * @static {String} Success delegate is given the response string
 */
Connection.DATA_TYPE_PLAIN = "PLAIN";

Connection.METHOD_DELETE = "DELETE";
Connection.METHOD_GET = "GET";
Connection.METHOD_HEAD = "HEAD";
Connection.METHOD_OPTIONS = "OPTIONS";
Connection.METHOD_POST = "POST";
Connection.METHOD_PUT = "PUT";

Connection.prototype.constructor = function( responseDataType ) {
	
	var asynch = true;
	
	this.getAsynch = function() {
		return asynch;
	};
	
	var setAsync = function( bool ) {
		if ( typeof bool === "boolean" ) {
			asynch = bool;
		}
	};
	
	
	
	var dataType = Connection.DATA_TYPE_JSON;
	
	this.getDataType = function() {
		return dataType;
	};
	
	this.setDataType = function( type ) {
		switch( String( type ).toUpperCase() ) {
			case Connection.DATA_TYPE_JSON:
				dataType = Connection.DATA_TYPE_JSON;
			break;
			
			case Connection.DATA_TYPE_HTML:
				dataType = Connection.DATA_TYPE_HTML;
			break;
			
			case Connection.DATA_TYPE_XML:
				dataType = Connection.DATA_TYPE_XML;
			break;
			
			case Connection.DATA_TYPE_JSONP:
				dataType = Connection.DATA_TYPE_JSONP;
			break;
			
			case Connection.DATA_TYPE_PLAIN:
				dataType = Connection.DATA_TYPE_PLAIN;
			break;
			
			default:
				dataType = Connection.DATA_TYPE_JSON;
			break;
		}
	};
	
	
	
	var method = Connection.METHOD_GET;
	
	this.getMethod = function() {
		return method;
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
	
	
	
	var opened = false;
	
	this.close = function() {
		if ( !opened ) {
			return;
		}
		
		xhr.abort();
		opened = false;
	};
	
	var open = function( method, url, async, user, password ) {
		if ( opened ) {
			return;
		}
		
		if ( xhr === null ) {
			xhr = new XMLHttpRequest();
		}
		
		setMethod( method );
		setUrl( url );
		setAsync( async );
		setUser( user );
		setPassword( password );
		
		xhr.open( this.getMethod(), this.getUrl(), this.getAsync(), getUser(), getPassword() );
		xhr.setRequestHeader( "X-REQUESTED-WITH", "XMLHttpRequest" );
		opened = true;
	};
	
	this.send = function( options ) {
		
		if ( !opened ) {
			open( this.getMethod(), options.url )
		}
	};
	
	
	
	var password = "";
	
	var getPassword = function() {
		return password;
	};
	
	var setPassword = function( str ) {
		if ( typeof str === "string" ) {
			password = str;
		}
	};
	
	
	
	var url = "";
	
	this.getUrl = function() {
		return url;
	};
	
	var setUrl = function( str ) {
		if ( typeof str === "string" ) {
			url = str;
		}
	};
	
	
	
	var user = "";
	
	var getUser = function() {
		return user;
	};
	
	var setUser = function( str ) {
		if ( typeof str === "string" ) {
			user = str;
		}
	};
	
	
	
	var xhr = null;
	
	this.setDataType( responseDataType );
	
	Connection.superClass.constructor.call( this );
};
