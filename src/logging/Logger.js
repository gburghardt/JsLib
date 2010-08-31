function Logger() {
	throw new Error( "Cannot instantiate a Logger object directly. Must instantiat a subclass." );
}

Logger.prototype = {
	
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
	
	report: function( type, message, source, data ) {
		throw new Error( "Sub classes of Logger must implement report(type:String, message:String, source:String: data:Object)" );
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
	
	
	
	// utility functions

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
		ConsoleLogger.level = level;
	}
};
