/**
 * @class This class provides a wrapper for logging to the native browser
 * console object.
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
 * @see Logger.constructor
 */
ConsoleLogger.prototype.constructor = function( logHandle, level, debugMode, enabled ) {
	ConsoleLogger.superClass.constructor.call( this, logHandle, level, debugMode );
	
	if ( typeof console === "object" ) {
		this.setConsole( console );
	}
};

ConsoleLogger.prototype.report = function( type, text, data ) {
	ConsoleLogger.superClass.report.call( this, type, text );
	
	if ( data ) {
		this.console.debug(data);
	}
};

ConsoleLogger.isSupported = function() {
	return (typeof console === "object" && console);
};