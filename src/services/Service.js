/**
 * @class This class forms the basis for all data services.
 * 
 * @extends EventPublisher
 */
function Service() {
	this.constructor.apply( this, arguments );
}

Service.prototype = function() {};
Service.superClass = EventPublisher;
Service.prototype.prototype = EventPublisher.prototype;
Service.prototype = new Service.prototype;

Service.prototype.constructor = function( eventDispatcher ) {
	Service.superClass.constructor.call( this );
	this.setEventDispatcher( eventDispatcher );
};

Service.prototype.destructor = function() {
	Service.superClass.destructor.call( this );
	this.eventDispatcher.unsubscribe( "startUpdates", this );
	this.eventDispatcher.unsubscribe( "stopUpdates", this );
	this.eventDispatcher = null;
};

Service.prototype.init = function() {
	this.eventDispatcher.subscribe( "startUpdates", this, "enable" );
	this.eventDispatcher.subscribe( "stopUpdates", this, "disable" );
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



Service.prototype.eventDispatcher = null;

Service.prototype.setEventDispatcher = function( eventDispatcher ) {
	if ( typeof eventDispatcher === "object" && eventDispatcher !== null &&
	     typeof eventDispatcher.subscribe === "function" &&
	     typeof eventDispatcher.unsubscribe === "function"
	) {
		this.eventDispatcher = eventDispatcher;
	}
};



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