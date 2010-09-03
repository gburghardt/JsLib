/**
 * @class This class provides a wrapper for the Blackbird open source
 * JavaScript logging utility.
 * 
 * @extends Logger
 */
function BlackbirdLogger() {
	this.constructor.apply( this, arguments );
};

BlackbirdLogger.superClass = Logger.prototype;
BlackbirdLogger.prototype = function() {};
BlackbirdLogger.prototype.prototype = BlackbirdLogger.superClass;
BlackbirdLogger.prototype = new BlackbirdLogger.prototype;

/**
 * @see Logger.constructor
 */
BlackbirdLogger.prototype.constructor = function( logHandle, level, debugMode, enabled ) {
	BlackbirdLogger.superClass.constructor.call( this, logHandle, level, debugMode, enabled );
	
	this.formattedDataPrefix = "<pre>";
	this.formattedDataSuffix = "</pre>";
	
	this.setConsole( window[ BlackbirdLogger.namespace ] );
};

/**
 * @static {String} Set this to the value of the NAMESPACE variable declared at
 *                  the top of your blackbird.js file. By default, it is "log".
 *                  This identifies the property in the window object where the
 *                  blackbird console object resides.
 */
BlackbirdLogger.namespace = "log";