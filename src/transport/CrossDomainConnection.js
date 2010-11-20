function CrossDomainConnection() {
	this.constructor.apply( this, arguments );
}

CrossDomainConnection.superClass = Delegator.prototype;
CrossDomainConnection.prototype = function() {};
CrossDomainConnection.prototype.prototype = CrossDomainConnection.superClass;
CrossDomainConnection.prototype = new CrossDomainConnection.prototype;

CrossDomainConnection.prototype.constructor = function( jsonService ) {
	
	CrossDomainConnection.superClass.constructor.call( this, jsonService );
	
	
	
	/**
	 * @property {CrossDomainConnection} A static reference to this connection
	 *                                   used in function closures
	 */
	var _this = this;
	
	
	
	/**
	 * @property {String} The data type to interpret responses as
	 */
	var _dataType = this.DATA_TYPE_JSON;
	
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
			case this.DATA_TYPE_JSON:
				_dataType = this.DATA_TYPE_JSON;
			break;
			
			case this.DATA_TYPE_HTML:
				_dataType = this.DATA_TYPE_HTML;
			break;
			
			case this.DATA_TYPE_XML:
				_dataType = this.DATA_TYPE_XML;
			break;
		}
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
		
		if ( this.haveParams() ) {
			var params = this.getParams();
			
			if ( url.indexOf( "?" ) === -1 ) {
				url += "?";
			}
			
			url += this.serializeParams( params );
		}
		
		return url;
	};
	
	var setUrl = function( str ) {
		if ( typeof str === "string" ) {
			_url = str;
		}
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
		
		_timerId = setTimeout( _handleTimeout, _timeoutPeriod );
	};
	
	var stopTimer = function() {
		if ( !_timerId ) {
			return;
		}
		
		clearTimeout( _timerId );
		_timerId = null;
	};
	
	var _handleTimeout = null;
	
	
	
	this.abort = function() {};
	
	this.send = function() {
		var url = this.getUrl();
		var script = document.createElement("script");
		var processResponseName = getResponseHandlerName();
		var head = document.getElementsByTagName("head")[0];
		var _this = this;
		var requestComplete = false;
		var requestProcessed = false;
		
		var processResponse = window[ processResponseName ] = function( response ) {
			requestProcessed = true;
			cleanup();
			
			var data = null;
			
			// detect dataType and process response accordingly
			// TODO - move process*Response function to class methods in Connection
			
			response = null;
		};
		
		var handleRequestComplete = script.onload = script.onreadystatechange = function() {
			requestComplete = true;
			cleanup();
		};
		
		var handleTimeout = function() {
			requestComplete = true;
			requestProcessed = true;
			cleanup();
			
			_timedOut = true;
			_timeoutCount++;
			
			_this.delegate( "timeout", {
				url          : _this.getUrl(),
				method       : _this.getMethod(),
				timeoutCount : _timeoutCount
			} );
			
			_timerId = null;
		};
		
		var cleanup = function() {
			if (!requestComplete || !requestProcessed) {
				return;
			}
			
			_this.stopTimer();
			script.onload = script.onreadystatechange = null;
			script = null;
			head.removeChild( script );
			head = null;
			window[ processResponseName ] = null;
			_this = null;
			
			try {
				delete window[ processResponseName ];
			}
			catch( err ) {
				// fail silently
			}
		};
		
		// set class timeout handler so that it remains in closure scope
		_handleTimeout = handleTimeout;
		
		// set the callback=? parameter in the URL
		if ( url.indexOf("callback=?") > -1 ) {
			url.replace( "callback=?", "callback=" + processResponseName );
		}
		else {
			url += ( ( url.indexOf("?") > -1 ) ? "&" : "?" ) + "callback=" + processResponseName;
		}
		
		// send request
		script.setAttribute( "type", "text/javascript" );
		script.setAttribute( "href", url );
		head.insertBefore( head.firstChild, script );
		
		// start timeout
		_this.startTimer();
	};
	
	var handlerCount = 0;
	
	var getResponseHandlerName = function() {
		return "jsonp" + handlerCount++;
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
		this.setParams( o.params );
		this.setDataType( o.dataType );
		this.setActions( o.actions );
		setTimeoutPeriod( o.timeoutPeriod );
		
		o = null;
	};
	
};