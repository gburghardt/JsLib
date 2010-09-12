/**
 * @class This class forms the basis for all data services.
 * 
 * @extends EventPublisher
 */
function Service() {
	this.constructor.apply( this, arguments );
}

Service.superClass = EventPublisher.prototype;
Service.prototype = function() {};
Service.prototype.prototype = Service.superClass;
Service.prototype = new Service.prototype;

/**
 * @constructs
 *
 * @param {Object} eventDispatcher The global event dispatcher used
 *                                 for messaging the entire
 *                                 application. This is required
 */
Service.prototype.constructor = function( eventDispatcher ) {
	Service.superClass.constructor.call( this );
	
	if ( !this.setEventDispatcher( eventDispatcher ) ) {
		throw new Error( "An event dispatcher supporting a publish/subscribe interface must be passed into Service.constructor." );
	}
	
	this.eventDispatcher.subscribe( "startUpdates", this, "enable" );
	this.eventDispatcher.subscribe( "stopUpdates", this, "disable" );
};

/**
 * @desctructs
 */
Service.prototype.destructor = function() {
	Service.superClass.destructor.call( this );
	this.disable();
	this.eventDispatcher.unsubscribe( "startUpdates", this );
	this.eventDispatcher.unsubscribe( "stopUpdates", this );
	this.eventDispatcher = null;
};

/**
 * Initialize this service and ready it for use
 */
Service.prototype.init = function() {
};



/**
 * @property {Boolean} Whether or not this service is enabled
 */
Service.prototype.enabled = true;

/**
 * Disable this service.
 */
Service.prototype.disable = function() {
	this.enabled = false;
};

/**
 * Enable this service.
 */
Service.prototype.enable = function() {
	this.enabled = true;
};

/**
 * Determines whether or not this service is enabled
 *
 * @return {Boolean}
 */
Service.prototype.isEnabled = function() {
	return this.enabled;
};



/**
 * @property {EventPublisher} The event dispatcher object on which
 *                            everyone else in the application
 *                            publishes and subscribes to events.
 *                            This is used to enable/disable this
 *                            service globally.
 */
Service.prototype.eventDispatcher = null;

/**
 * Sets the eventDispatcher property.
 *
 * @param {EventPublisher} The new event dispatcher property
 * @return {Boolean}
 */
Service.prototype.setEventDispatcher = function( eventDispatcher ) {
	if ( typeof eventDispatcher === "object" && eventDispatcher !== null &&
	     typeof eventDispatcher.subscribe === "function" &&
	     typeof eventDispatcher.unsubscribe === "function"
	) {
		this.eventDispatcher = eventDispatcher;
		return true;
	}
	
	return false;
};



// utility methods

/**
 * Returns a wrapped function so that a function gets executed in a
 * different context. It also bundles the wrapped function with a
 * cleanup function that cleans up the function closure, readying
 * the memory for garbage collection.
 *
 * @param {Function} fn The function whose execution should be forced
 *                      in a different context.
 * @param {Object} ctx The context in which fn should be executed
 * @return {Function}
 */
Service.prototype.getFunctionInContext = function( fn, ctx ) {
	var wrapper = function() {
		return fn.apply( ctx, arguments );
	};
	
	wrapper.cleanup = function() {
		fn = null;
		ctx = null;
	};
	
	return wrapper;
};