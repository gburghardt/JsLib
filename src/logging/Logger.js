/**
 * @class This class allows for flexible logging to a console.
 * 
 * @extends Object
 */
function Logger() {
	throw new Error( "Cannot instantiate a Logger object directly. Must instantiat a subclass." );
}

/** @lends Logger */
Logger.prototype = {
	
	formattedDataPrefix: "\n",
	
	formattedDataSuffix: "",
	
	/**
	 * @constructs
	 *
	 * @param {String} logHandle The name of the JavaScript class, function or
	 *                           file generating log statements
	 * @param {Number} level The logging level to start out at
	 * @param {Boolean} debugMode Whether or not to turn all info statements
	 *                            into debug statements
	 * @param {Boolean} enabled Whether or not logging is enabled.
	 * @return {Void}
	 */
	constructor: function( logHandle, level, debugMode, enabled ) {
		this.setLogHandle( logHandle );
		this.setLevel( level );
		this.setDebugMode( debugMode );
		this.setEnabled( enabled );
	},
	
	/**
	 * @property {Function} Used by this class to retain a reference to the
	 *                      original log() function after its initial
	 *                      invocation. The first time log() is called, it
	 *                      determines whether or not this logger is in debug
	 *                      mode, and then replaces log() with the proper method
	 *                      (info or debug). When setDebugMode() is called, it
	 *                      reverts the log() function to its original state,
	 *                      where it resets itself to info or debug the next
	 *                      time log() gets called.
	 */
	__log: null,
	
	/**
	 * Log an info or debug statement to the console, depending on the
	 * debugMode.
	 * 
	 * @param {String} message The message to log
	 * @param {String} source The log source
	 * @param {Object} data Data to log
	 * @return {Void}
	 */
	log: function( message, source, data ) {
		this.__log = this.log;
		
		if ( this.debugMode ) {
			this.log = this.debug;
		}
		else {
			this.log = this.info;
		}
	},
	
	/**
	 * Log an info message
	 *
	 * @param {String} message Log text to display
	 * @param {String} source Log message origin: file, function or method name
	 * @param {Mixed} data Miscellaneous data to log to the user
	 * @return {void}
	 */
	info: function( message, source, data ) {
		this.report( "info", message, source, data );
	},
	
	/**
	 * Log a debug message
	 *
	 * @param {String} message Log text to display
	 * @param {String} source Log message origin: file, function or method name
	 * @param {Mixed} data Miscellaneous data to log to the user
	 * @return {void}
	 */
	debug: function( message, source, data ) {
		this.report( "debug", message, source, data );
	},
	
	/**
	 * Log a warning message
	 *
	 * @param {String} message Log text to display
	 * @param {String} source Log message origin: file, function or method name
	 * @param {Mixed} data Miscellaneous data to log to the user
	 * @return {void}
	 */
	warn: function( message, source, data ) {
		this.report( "warn", message, source, data );
	},
	
	/**
	 * Log an error message
	 *
	 * @param {String} message Log text to display
	 * @param {String} source Log message origin: file, function or method name
	 * @param {Mixed} data Miscellaneous data to log to the user
	 * @return {void}
	 */
	error: function( message, source, data ) {
		this.report( "error", message, source, data );
	},
	
	/**
	 * Start or display profile log statements
	 *
	 * @param {String} text Log text to display
	 * @param {String} source Log message origin: file, function or method name
	 * @return {void}
	 */
	profile: function( text, source ) {
		if ( !this.consoleAvailable() ) {
			return;
		}
		
		var label = "";
		
		if ( source ) {
			label = source + " " + String.fromCharCode( 8212 ) + " " + text;
		}
		else {
			label = text;
		}
		
		this.console.profile( label );
	},
	
	/**
	 * Report a log message
	 *
	 * @param {String} type The type of log message
	 * @param {String} text Log text to display
	 * @param {String} source Log message origin: file, function or method name
	 * @param {Mixed} data Miscellaneous data to log to the user
	 * @return {void}
	 */
	report: function( type, text, source, data ) {
		if ( !this.canLog( type ) ) {
			return;
		}
		
		var message = this.formatMessage( type, text, source, data );
		
		this.console[ type ]( message );
	},
	
	/**
	 * Determines whether this logger can currently display a given log message
	 * type.
	 * 
	 * @param {String} type Log message type (info, debug, warn, error)
	 * @returns {Boolean}
	 */
	canLog: function( type ) {
		return ( this.consoleAvailable() && (
			type === "warn" || type === "error" || this.level > this.getMinLogLevel()
		) );
	},
	
	/**
	 * Gets the minimum log level
	 * 
	 * @returns {Number}
	 */
	getMinLogLevel: function() {
		return Logger.level;
	},
	
	/**
	 * Sets the minimum log level for all instances of Logger objects
	 * 
	 * @param {Number} level The new global log level
	 * @returns {Void}
	 */
	setMinLogLevel: function( level ) {
		Logger.setLevel( level );
	},
	
	
	
	/**
	 * @property {Object} The logging console. In the very least, it must
	 *                    support a log() method that accepts a single string
	 *                    argument. Other methods used are info, debug, warn,
	 *                    error and profile.
	 */
	console: null,
	
	/**
	 * Determines whether or not the logging console is available
	 * 
	 * @returns {Boolean}
	 */
	consoleAvailable: function() {
		return ( this.console !== null );
	},
	
	/**
	 * Sets the console property. If no info, debug, warn or error method
	 * exists, this class injects methods by those names. If no profile method
	 * exists, a profile method is injected that logs a warning each time
	 * profile is called.
	 * 
	 * @param {Object} console The new console property
	 * @return {Void}
	 */
	setConsole: function( console ) {
		if ( typeof console === "object" && console !== null ) {
			this.console = console;
			
			if ( !this.console.info ) {
				this.console.info = function( message ) {
					this.log( Logger.pad( "INFO", 7 ) + message );
				};
			}
			
			if ( !this.console.debug ) {
				this.console.debug = function( message ) {
					this.log( Logger.pad( "DEBUG", 7 ) + message );
				};
			}
			
			if ( !this.console.warn ) {
				this.console.warn = function( message ) {
					this.log( Logger.pad( "WARN", 7 ) + message );
				};
			}
			
			if ( !this.console.error ) {
				this.console.error = function( message ) {
					this.log( Logger.pad( "ERROR", 7 ) + message );
				};
			}
			
			if ( !this.console.profile ) {
				this.warn( Logger.pad( "WARN", 7 ) + " Profiling is disabled in this console." );
			}
		}
		
		console = null;
	},
	
	
	
	/**
	 * @property {Boolean} Whether or not all info statements should appear as
	 *                     debug statements
	 */
	debugMode: false,
	
	/**
	 * Sets the debugMode property
	 * 
	 * @param {Boolean} mode The new debugMode
	 * @returns {Void}
	 */
	setDebugMode: function( mode ) {
		if ( typeof mode === "boolean" ) {
			this.debugMode = mode;
		}
		
		if ( this.__log !== null ) {
			this.log = this.__log;
		}
	},
	
	
	
	/**
	 * @property {Boolean} Whether or not info and debug statements are
	 *                     enabled for this instance. If false, error and warn
	 *                     statements are still visible. Leave this true unless
	 *                     you want to disable logging for this instance only.
	 */
	enabled: true,
	
	/**
	 * Disables this logger. Only warn and error statements get logged
	 */
	disable: function() {
		this.enabled = false;
	},
	
	/**
	 * Enables this logger.
	 */
	enable: function() {
		this.enabled = true;
	},
	
	/**
	 * Determines whether or not this logger is enabled.
	 * 
	 * @returns {Boolean}
	 */
	isEnabled: function() {
		return ( Logger.enabled && this.enabled );
	},
	
	/**
	 * Sets the enabled property
	 * 
	 * @param {Boolean} enabled
	 */
	setEnabled: function( enabled ) {
		if ( typeof enabled === "boolean" ) {
			this.enabled = enabled;
		}
	},
	
	
	
	/**
	 * @property {Object} The service that converts JavaScript objects to JSON
	 *                    text, and JSON text into JavaScript objects
	 */
	jsonService: null,
	
	/**
	 * Sets the jsonService property
	 *
	 * @param {Object} jsonService
	 * @return {Boolean} True if set properly
	 */
	setJsonService: function( jsonService ) {
		if ( jsonService && typeof jsonService === "object" ) {
			this.jsonService = jsonService;
			
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 * @property {Number} The logging level
	 */
	level: 0,
	
	/**
	 * Set the level property
	 * @param {Number} level The new log level
	 * @return {void}
	 */
	setLevel: function( level ) {
		if ( typeof level === "number" && !isNaN( level ) ) {
			this.level = level;
		}
	},
	
	
	
	/**
	 * @property {String} The JavaScript class, object, function or file
	 *                    generating log statements.
	 */
	logHandle: null,
	
	/**
	 * Sets the logHandle property
	 * 
	 * @param {String} handle The new log handle
	 * @returns {Void}
	 */
	setLogHandle: function( handle ) {
		if ( typeof handle === "string" && handle !== "" ) {
			this.logHandle = handle;
		}
	},
	
	
	
	// utility functions
	
	/**
	 * Format a message and ready it for display
	 *
	 * @param {String} type The type of log message
	 * @param {String} text Log text to display
	 * @param {String} source Log message origin: file, function or method name
	 * @param {Mixed} data Miscellaneous data to log to the user
	 * @return {String}
	 */
	formatMessage: function( type, text, source, data ) {
		var message = "";
		var undef;
		var hasSource = false;
		
		if ( this.logHandle ) {
			message += this.logHandle;
			hasSource = true;
		}
		
		if ( source !== undef && source !== null ) {
			message += "." + source;
			hasSource = true;
		}
		
		if ( text ) {
			if ( hasSource ) {
				message += " " + String.fromCharCode( 8212 ) + " " + text;
			}
			else {
				message += " " + text;
			}
		}
		
		if ( data !== undef ) {
			message += this.formatMessageData( data );
		}
		
		return message;
	},
	
	/**
	 * Format the message data
	 *
	 * @param {mixed} data The data to convert to a string
	 * @return {String}
	 */
	formatMessageData: function( data ) {
		return this.formattedDataPrefix + this.mixedToString( data ) + this.formattedDataSuffix;
	},
	
	/**
	 * Convert any variable to a string
	 *
	 * @param {Mixed} x The variable to convert
	 * @return {String}
	 */
	mixedToString: function( x ) {
		var type = typeof x;
		var str = "";
		
		if ( "object" === type && type !== null && this.jsonService ) {
			str = this.jsonService.stringify( x, null, 4 );
		}
		else {
			str = String( x );
		}
		
		return str;
	}
	
};



/**
 * @static {Boolean} Whether or not info and debug statements should show up for
 *                   all Logger instances. Setting this to false will globally
 *                   disable info and debug statements, regardless of whether
 *                   or not logging is enabled in individual instances. Set this
 *                   to true for development and false for production. All
 *                   instances will still log error and warn statements.
 */
Logger.enabled = false;

/**
 * Sets the enabled static property
 * 
 * @param {Boolean} enabled
 */
Logger.setEnabled = function( enabled ) {
	if ( typeof enabled === "boolean" ) {
		Logger.enabled = enabled;
	}
};



/**
 * @static {Number} The log level for the console
 */
Logger.level = 0;

/**
 * Set the logging level
 * 
 * @param {Number} level The log level and above that should be shown
 * @return {void}
 */
Logger.setLevel = function( level ) {
	if ( typeof level === "number" && !isNaN( level ) ) {
		Logger.level = level;
	}
};

/**
 * Pad a string on the left or right so that it takes up at least X spaces
 *
 * @param {String} str The string to pad
 * @param {Number} length Length to pad str to
 * @param {String} side Which side the padding should be added to str
 * @return {String}
 */
Logger.pad = function( str, length, side ) {
	var numChars = length - str.length;
	var padding = "";
	
	if ( !side ) {
		side = "left";
	}
	
	if ( numChars > 0 ) {
		for ( var i = 0; i < numChars; i++ ) {
			padding += " ";
		}
	}
	
	if ( side === "left" ) {
		return padding + str;
	}
	else {
		return str + padding;
	}
};
