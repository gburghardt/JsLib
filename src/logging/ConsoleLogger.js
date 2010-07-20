/**
 * @class This class provides a wrapper for logging to the native browser
 * console object. It safely caches log messages when the console is not
 * available, and then logs them as soon as it becomes available again.
 *
 * @extends Object
 */
function ConsoleLogger( jsonService ) {
	this.constructor( jsonService );
}

/** @lends ConsoleLogger */
ConsoleLogger.prototype = {
	
	/**
	 * @constructs
	 *
	 * @param {Object} jsonService An object that can recursively convert other
	 *                             objects into a JSON string
	 * @return {void}
	 */
	constructor: function( jsonService ) {
		this.setJsonService( jsonService );
		this.cachedMessages = [];
		this.profiles = {};
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
	cacheMessage: function( message ) {
		if ( this.cachedMessages.length < this.maxCachedMessages ) {
			this.cachedMessages.push( message );
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
			for ( var i = 0, length = this.cachedMessages.length; i < length; i++ ) {
				console.log( this.cachedMessages[ i ] );
			}
			
			this.cachedMessages = [];
		}
		catch ( error ) {
			return false;
		}
		
		return true;
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
		var message = this.formatMessage( type, text, source, data );
		
		if ( this.consoleAvailable() ) {
			this.stopTimer();
			if ( this.displayCachedMessages() ) {
				console.log( message );
			}
			else {
				this.startTimer();
				this.cacheMessage( message );
			}
		}
		else {
			this.startTimer();
			this.cacheMessage( message );
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
		var message = this.pad( type.toUpperCase(), 7 );
		var undef;
		
		if ( source !== undef && source !== null ) {
			message += " " + source;
		}
		
		if ( text ) {
			message += " " + String.fromCharCode( 8212 ) + " " + text;
		}
		
		if ( data !== undef && this.jsonService ) {
			message += "\n" + this.mixedToString( data );
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
	},
	
	/**
	 * Pad a string on the left or right so that it takes up at least X spaces
	 *
	 * @param {String} str The string to pad
	 * @param {Number} length Length to pad str to
	 * @param {String} side Which side the padding should be added to str
	 * @return {String}
	 */
	pad: function( str, length, side ) {
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
	}
	
};
