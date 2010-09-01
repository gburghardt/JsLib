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
};