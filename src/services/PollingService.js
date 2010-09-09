/**
 * @class This class provides the groundwork for all polling services
 * that utilize a setTimeout timer, and generally poll for remote or
 * local data.
 *
 * @extends Service
 */
function PollingService() {
	this.constructor.apply( this, arguments );
}

PollingService.superClass = Service.prototype;
PollingService.prototype = function() {};
PollingService.prototype.prototype = PollingService.superClass;
PollingService.prototype = new PollingService.prototype;

/**
 * @constructs
 * @see Service.constructor
 * @param {String} periodChangedKey The name of the key in the event
 *                                  object for the
 *                                  pollingPeriodChanged event
 *                                  published by the event
 *                                  dispatcher. This parameter is
 *                                  required.
 * @param {Number} period Number of milliseconds that should elapse
 *                        before requesting the next update.
 */
PollingService.prototype.constructor = function( eventDispatcher, periodChangedKey, period ) {
	PollingService.superClass.constructor.call( this, eventDispatcher );
	
	if ( !this.setPeriodChangedKey( periodChangedKey ) ) {
		throw new Error( "A valid periodChangedKey must be passed into PollingService.constructor. '" + periodChangedKey + "' given." );
	}
	
	this.setPeriod( period );
	this.handleTimerExpired = this.getFunctionInContext( this.handleTimerExpired, this );
};

/**
 * @destructs
 */
PollingService.prototype.destructor = function() {
	PollingService.superClass.destructor.call( this );
	this.handleTimerExpired.cleanup();
};

/**
 * Initialize this service and ready it for use
 * @see Service.init
 */
PollingService.prototype.init = function() {
	PollingService.superClass.init.call( this );
	
	this.eventDispatcher.subscribe( "pollingPeriodChanged", this, "handlePollingPeriodChanged" );
	
	this.startTimer();
};

/**
 * Disable this service and stop the timer
 * @see Service.disable
 */
PollingService.prototype.disable = function() {
	PollingService.superClass.disable.call( this );
	this.stopTimer();
};

/**
 * Enable this service and start the timer
 * @see Service.enable
 */
PollingService.prototype.enable = function() {
	PollingService.superClass.enable.call( this );
	this.startTimer();
};

/**
 * Handles the pollingPeriodChanged event published by the event
 * dispatcher. Uses the periodChangedKey to grab the new polling
 * period from the event object.
 *
 * @param {Event} event The event object
 * @return {Void}
 */
PollingService.prototype.handlePollingPeriodChanged = function( event ) {
	var newPeriod = event.getData( this.periodChangedKey );
	this.setPeriod( newPeriod );
	event = null;
};

/**
 * Do something when the timer expires, usually making an AJAX
 * request for fresh data from the server
 */
PollingService.prototype.handleTimerExpired = function() {
	
};



/**
 * @property {Number} Number of milliseconds that should elapse
 *                    before the next update is requested
 */
PollingService.prototype.period = 10000;

/**
 * Sets the period property
 *
 * @param {Number} period
 */
PollingService.prototype.setPeriod = function( period ) {
	if ( typeof period === "number" && !isNaN( period ) && period > 0 ) {
		this.period = period;
	}
};



/**
 * @property {String} The key in the event object data that holds the
 *                    new polling period during the
 *                    pollingPeriodChanged event.
 */
PollingService.prototype.periodChangedKey = null;

/**
 * Sets the periodChangedKey property
 *
 * @param {String} key The new periodChangedKey value
 * @return {Boolean}
 */
PollingService.prototype.setPeriodChangedKey = function( key ) {
	if ( typeof key === "string" && key !== "" ) {
		this.periodChangedKey = key;
		return true;
	}
	
	return false;
};



/**
 * @property {Number} The setTimeout Id for this service
 */
PollingService.prototype.timerId = null;

/**
 * Start the update timer
 */
PollingService.prototype.startTimer = function() {
	if ( !this.isEnabled() || this.timerId ) {
		return;
	}

	this.timerId = setTimeout( this.handleTimerExpired, this.period );
};

/**
 * Stop the update timer
 */
PollingService.prototype.stopTimer = function() {
	if ( this.timerId === null ) {
		return;
	}

	clearTimeout( this.timerId );
	this.timerId = null;
};
