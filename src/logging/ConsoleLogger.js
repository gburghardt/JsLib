/**
 * @class This class provides a wrapper for logging to the native browser
 * console object. It safely caches log messages when the console is not
 * available, and then logs them as soon as it becomes available again.
 *
 * @extends Object
 */
function ConsoleLogger() {
	this.constructor.apply( this, arguments );
}

/** @lends ConsoleLogger */
ConsoleLogger.prototype = {
	
	/**
	 * @constructs
	 *
	 * @param {String} logHandle The name of the JavaScript class, function or
	 *                           file generating log statements
	 * @param {Number} level The logging level to start out at
	 * @param {Boolean} debugMode Whether or not to turn all info statements
	 *                            into debug statements
	 * @return {Void}
	 */
	constructor: function( logHandle, level, debugMode ) {
		this.setLogHandle( logHandle );
		this.setLevel( level );
		this.setDebugMode( debugMode );
		
		this.cachedMessages = [];
		this.profiles = {};
		
		if ( this.consoleAvailable() ) {
			if ( !console.info ) {
				console.info = function( message ) {
					console.log( ConsoleLogger.pad( "INFO", 7 ) + message );
				};
			}
			
			if ( !console.debug ) {
				console.debug = function( message ) {
					console.log( ConsoleLogger.pad( "DEBUG", 7 ) + message );
				};
			}
			
			if ( !console.warn ) {
				console.warn = function( message ) {
					console.log( ConsoleLogger.pad( "WARN", 7 ) + message );
				};
			}
			
			if ( !console.error ) {
				console.error = function( message ) {
					console.log( ConsoleLogger.pad( "ERROR", 7 ) + message );
				};
			}
		}
		
		jsonService = null;
	},
	
	
	
	/**
	 * @property {Array} A list of log messages that will be displayed the next
	 *                   time the console object becomes available
	 */
	cachedMessages: null,
	
	/**
	 * @property {Number} The maximum number of log messages to cache
	 */
	maxCachedMessages: 800,
	
	/**
	 * Cache a log message for display when the console object becomes available
	 * again.
	 *
	 * @param {String} message The log message to cache
	 * @return {void}
	 */
	cacheMessage: function( type, message ) {
		if ( this.cachedMessages.length < this.maxCachedMessages ) {
			this.cachedMessages.push( {
				type: type,
				message: message
			} );
		}
	},
	
	/**
	 * Display all cached messages. The console object must be available.
	 *
	 * @param {void}
	 * @return {Boolean} True if all messages displayed properly
	 */
	displayCachedMessages: function() {
		try {
			var msg = null;
			
			for ( var i = 0, length = this.cachedMessages.length; i < length; i++ ) {
				msg = this.cachedMessages[ i ];
				
				console[ msg.type ]( msg.message );
			}
			
			this.cachedMessages = [];
		}
		catch ( error ) {
			return false;
		}
		
		return true;
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
	
	
	
	/**
	 * @property {Object} Profile labels and their start dates
	 */
	profiles: null,
	
	/**
	 * Start or display profile log statements
	 *
	 * @param {String} text Log text to display
	 * @param {String} source Log message origin: file, function or method name
	 * @return {void}
	 */
	profile: function( text, source ) {
		var label = "";
		
		if ( source ) {
			label = source + " " + String.fromCharCode( 8212 ) + " " + text;
		}
		else {
			label = text;
		}
		
		if ( !this.profiles[ label ] ) {
			this.profiles[ label ] = new Date();
		}
		else {
			var now = new Date();
			var elapsedTime = now.getTime() - this.profiles[ label ].getTime();
			this.report( "profile", text + " (" + elapsedTime + " ms)", source );
		}
	},
	
	
	
	
	/**
	 * @property {Number} Id of the timer used to detect the existence of the
	 *                    console object
	 */
	timerId: null,
	
	/**
	 * @property {Number} Milliseconds that should elapse before checking for
	 *                    the existence of the console object
	 */
	timerPeriod: 200,
	
	/**
	 * Start the timer that checks for the existence of the console object
	 *
	 * @param {void}
	 * @return {void}
	 */
	startTimer: function() {
		if ( this.timerId !== null ) {
			return;
		}
		
		var self = this;
		
		var timerCallback = function() {
			if ( self.consoleAvailable() ) {
				self.stopTimer();
				self = null;
			}
		};
		
		this.timerId = setInterval( timerCallback, this.timerPeriod );
	},
	
	/**
	 * Stop the timer that checks for the existence of the console object
	 *
	 * @param {void}
	 * @return {void}
	 */
	stopTimer: function() {
		if ( this.timerId === null ) {
			return;
		}
		
		clearInterval( this.timerId );
		this.timerId = null;
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
		if ( ( type === "info" || type === "debug" ) && this.level < ConsoleLogger.level ) {
			return;
		}
		
		if ( type === "info" && this.debugMode ) {
			type = "debug";
		}

		var message = this.formatMessage( type, text, source, data );
		
		if ( this.consoleAvailable() ) {
			this.stopTimer();
			
			if ( this.displayCachedMessages() ) {
				console[ type ]( message );
			}
			else {
				this.startTimer();
				this.cacheMessage( type, message );
			}
		}
		else {
			this.startTimer();
			this.cacheMessage( type, message );
		}
	},
	
	/**
	 * Log an info message
	 *
	 * @param {String} text Log text to display
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
	 * @param {String} text Log text to display
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
	 * @param {String} text Log text to display
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
	 * @param {String} text Log text to display
	 * @param {String} source Log message origin: file, function or method name
	 * @param {Mixed} data Miscellaneous data to log to the user
	 * @return {void}
	 */
	error: function( message, source, data ) {
		this.report( "error", message, source, data );
	},
	
	
	
	
	// utility methods
	
	consoleAvailable: function() {
		return ( typeof console === "object" );
	},
	
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
			if ( this.jsonService ) {
				message += "\n" + this.mixedToString( data );
			}
			else {
				message += "\n" + data;
			}
		}
		
		return message;
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
		
		if ( "object" === type && type !== null ) {
			str = this.jsonService.stringify( x, null, 4 );
		}
		else {
			str = String( x );
		}
		
		return str;
	}
	
};

/**
 * @static {Number} The log level for the console
 */
ConsoleLogger.level = 0;

/**
 * Set the logging level
 * 
 * @param {Number} level The log level and above that should be shown
 * @return {void}
 */
ConsoleLogger.setLevel = function( level ) {
	if ( typeof level === "number" && !isNaN( level ) ) {
		ConsoleLogger.level = level;
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
ConsoleLogger.pad = function( str, length, side ) {
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
