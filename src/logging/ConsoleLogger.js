/**
 * @class This class provides a wrapper for logging to the native browser
 * console object. It safely caches log messages when the console is not
 * available, and then logs them as soon as it becomes available again.
 *
 * @extends Logger
 */
function ConsoleLogger() {
	this.constructor.apply( this, arguments );
}

ConsoleLogger.superClass = Logger.prototype;
ConsoleLogger.prototype = function() {};
ConsoleLogger.prototype.prototype = ConsoleLogger.superClass;
ConsoleLogger.prototype = new ConsoleLogger.prototype;

/**
 * @property {Object} The built-in browser logging console
 */
ConsoleLogger.prototype.console = null;

/**
 * @see Logger.constructor
 */
ConsoleLogger.prototype.constructor = function( logHandle, level, debugMode ) {
	ConsoleLogger.superClass.constructor.call( this, logHandle, level, debugMode );
	
	this.cachedMessages = [];
	this.profiles = {};
	
	this.console = ( typeof console === "object" ) ? console : null;
	
	if ( this.consoleAvailable() ) {
		if ( !this.console.info ) {
			this.console.info = function( message ) {
				this.log( ConsoleLogger.pad( "INFO", 7 ) + message );
			};
		}
		
		if ( !this.console.debug ) {
			this.console.debug = function( message ) {
				this.log( ConsoleLogger.pad( "DEBUG", 7 ) + message );
			};
		}
		
		if ( !this.console.warn ) {
			this.console.warn = function( message ) {
				this.log( ConsoleLogger.pad( "WARN", 7 ) + message );
			};
		}
		
		if ( !this.console.error ) {
			this.console.error = function( message ) {
				this.log( ConsoleLogger.pad( "ERROR", 7 ) + message );
			};
		}
	}
};
	
	
	
/**
 * @property {Array} A list of log messages that will be displayed the next
 *                   time the console object becomes available
 */
ConsoleLogger.prototype.cachedMessages = null;

/**
 * @property {Number} The maximum number of log messages to cache
 */
ConsoleLogger.prototype.maxCachedMessages = 800;

/**
 * Cache a log message for display when the console object becomes available
 * again.
 *
 * @param {String} message The log message to cache
 * @return {void}
 */
ConsoleLogger.prototype.cacheMessage = function( type, message ) {
	if ( this.cachedMessages.length < this.maxCachedMessages ) {
		this.cachedMessages.push( {
			type: type,
			message: message
		} );
	}
};

/**
 * Display all cached messages. The console object must be available.
 *
 * @param {void}
 * @return {Boolean} True if all messages displayed properly
 */
ConsoleLogger.prototype.displayCachedMessages = function() {
	try {
		var msg = null;
		
		for ( var i = 0, length = this.cachedMessages.length; i < length; i++ ) {
			msg = this.cachedMessages[ i ];
			
			this.console[ msg.type ]( msg.message );
		}
		
		this.cachedMessages = [];
	}
	catch ( error ) {
		return false;
	}
	
	return true;
};
	
/**
 * @property {Object} Profile labels and their start dates
 */
ConsoleLogger.prototype.profiles = null;
	
/**
 * Start or display profile log statements
 *
 * @param {String} text Log text to display
 * @param {String} source Log message origin: file, function or method name
 * @return {void}
 */
ConsoleLogger.prototype.profile = function( text, source ) {
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
};




/**
 * @property {Number} Id of the timer used to detect the existence of the
 *                    console object
 */
ConsoleLogger.prototype.timerId = null;

/**
 * @property {Number} Milliseconds that should elapse before checking for
 *                    the existence of the console object
 */
ConsoleLogger.prototype.timerPeriod = 200;

/**
 * Start the timer that checks for the existence of the console object
 *
 * @param {void}
 * @return {void}
 */
ConsoleLogger.prototype.startTimer = function() {
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
};

/**
 * Stop the timer that checks for the existence of the console object
 *
 * @param {void}
 * @return {void}
 */
ConsoleLogger.prototype.stopTimer = function() {
	if ( this.timerId === null ) {
		return;
	}
	
	clearInterval( this.timerId );
	this.timerId = null;
};



/**
 * Report a log message
 *
 * @param {String} type The type of log message
 * @param {String} text Log text to display
 * @param {String} source Log message origin: file, function or method name
 * @param {Mixed} data Miscellaneous data to log to the user
 * @return {void}
 */
ConsoleLogger.prototype.report = function( type, text, source, data ) {
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
			this.console[ type ]( message );
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
};




// utility methods

ConsoleLogger.prototype.consoleAvailable = function() {
	return ( this.console !== null );
};

/**
 * Format a message and ready it for display
 *
 * @param {String} type The type of log message
 * @param {String} text Log text to display
 * @param {String} source Log message origin: file, function or method name
 * @param {Mixed} data Miscellaneous data to log to the user
 * @return {String}
 */
ConsoleLogger.prototype.formatMessage = function( type, text, source, data ) {
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
