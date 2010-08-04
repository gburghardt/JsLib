/**
 * @class This class provides a communication layer between event publishers and
 * event subscribers to facilitate communication between them.
 *
 * @extends Object
 */
function Event( target ) {
	this.constructor( target );
}

/**
 * @lends Event
 */
Event.prototype = {
	
	/**
	 * @property {Date} The timestamp when this event was instantiated in the
	 *                  form of a Date object
	 */
	timeStamp: null,
	
	/**
	 * @constructs
	 *
	 * @param {Object} target The target object, or object publishing the event
	 * 
	 * @return void
	 */
	constructor: function( target ) {
		this.data = {};
		this.setTarget( target );
		this.setCurrentTarget( target );
		this.messages = [];
		this.errors = [];
	},
	
	/**
	 * @description Initializes this event object and readies it for use.
	 *
	 * @param {String} type The type, or event name for this event.
	 *
	 * @param {Boolean} bubbles Whether or not this event bubbles from node to
	 *                          node. This is only useful for DOM events.
	 *
	 * @param {Boolean} cancelable Whether or not event subscribers can cancel
	 *                             the propagation of this event from one
	 *                             subscriber to the next.
	 *
	 * @return void
	 */
	initEvent: function( type, bubbles, cancelable ) {
		this.setType( type );
		this.setBubbles( bubbles );
		this.setCancelable( cancelable );
		this.timeStamp = new Date();
		this.propagating = true;
	},
	
	/**
	 * @destructs
	 *
	 * @param void
	 * @return void
	 */
	destroy: function() {
		this.target = null;
		this.currentTarget = null;
		this.data = null;
		this.messages = null;
		this.errors = null;
	},
	

	
	/**
	 * @property {Boolean} Whether or not this event bubbles from node to node.
	 *                     This is only useful for DOM events.
	 */
	bubbles: true,
	
	/**
	 * @description Determines if this event can bubble from one node to the
	 * next.
	 *
	 * @param void
	 * @return {Boolean}
	 */
	canBubble: function() {
		return ( this.bubbles && ( !this.isCancelable() || this.isPropagating() ) );
	},
	
	/**
	 * @description Sets the bubbles property.
	 *
	 * @param {Boolean} bubbles New value for the bubbles property
	 * @return void
	 */
	setBubbles: function( bubbles ) {
		if ( typeof bubbles === "boolean" ) {
			this.bubbles = bubbles;
		}
	},
	
	
	
	/**
	 * @property {Boolean} Whether or not subscribers can cancel the propagation
	 *                     of this event.
	 */
	cancelable: true,
	
	/**
	 * @description Determines whether or not subscribers can cancel the
	 * propagation of this event.
	 *
	 * @param void
	 * @return {Boolean}
	 */
	isCancelable: function() {
		return this.cancelable;
	},
	
	/**
	 * @description Sets the cancelable property for this event.
	 * 
	 * @param {Boolean} cancelable New value for the cancelable property
	 * @return void
	 */
	setCancelable: function( cancelable ) {
		if ( typeof cancelable === "boolean" ) {
			this.cancelable = cancelable;
		}
	},
	
	
	
	/**
	 * @property {Boolean} Whether or not this event is propagating from one
	 *                     subscriber to the next.
	 */
	propagating: false,
	
	/**
	 * @description Determines if this event is propagating.
	 * 
	 * @param void
	 * @return {Boolean}
	 */
	isPropagating: function() {
		return this.propagating;
	},
	
	/** 
	 * @description Stops the propagation of this event.
	 *
	 * @param void
	 * @return void
	 */
	stopPropagation: function() {
		if ( this.isCancelable() ) {
			this.propagating = false;
		}
	},
	
	
	
	topic: null,
	
	setTopic: function( topic ) {
		if ( typeof topic === "string" && topic !== "" ) {
			this.topic = topic;
		}
	},
	
	
	
	/**
	 * @property {Object} A hash object of data to pass between the subscribers
	 */
	data: null,
	
	/**
	 * @description Sets the event data
	 *
	 * @param {Mixed} value The data to set. If key is omitted, value is treated as a hash object
	 *                      of the event data.
	 * @param {String} key An optional key to store value in. When this parameter is omitted, the
	 *                     value is treated as the whole event data object.
	 * @return void
	 */
	setData: function( key, value ) {
		if ( typeof key === "string" ) {
			this.data[ key ] = value;
		}
		else if ( typeof key === "object" && key !== null ) {
			this.data = key;
		}
	},
	
	/**
	 * @description Get event data from this event object
	 *
	 * @param {String} key An optional key to get the value for. When this parameter is omitted, the
	 *                     the whole event data object is returned.
	 * @return {Mixed} The value at key, the whole data object, or null if key is supplied but not
	 *                 found inside the event data.
	 */
	getData: function( key ) {
		if ( typeof key === "string" ) {
			if ( typeof this.data[ key ] !== "undefined" ) {
				return this.data[ key ];
			}
			else {
				return null;
			}
		}
		else {
			return this.data;
		}
	},
	
	
	
	/**
	 * @property {String} The type of this event, which is equal to this event's name.
	 */
	type: null,
	
	/**
	 * @description Sets the type property for this event
	 *
	 * @param {String} type New value for the type property
	 * @return void
	 */
	setType: function( type ) {
		if ( typeof type === "string" && type !== "" ) {
			this.type = type;
		}
	},
	
	/**
	 * @description Gets the type property for this event
	 *
	 * @param void
	 * @return {String}
	 */
	getType: function() {
		return this.type;
	},
	
	
	
	/**
	 * @property {Object} The event publisher whose subscribers are currently being processed.
	 */
	currentTarget: null,
	
	/**
	 * @description Get the target object/event publisher for this event
	 *
	 * @param void
	 * @return {Object}
	 */
	getCurrentTarget: function() {
		return this.currentTarget;
	},
	
	/**
	 * @description Sets the currentTarget property for this event
	 * 
	 * @param {EventPublisher} target An event publisher currently publising this event
	 * @return void
	 */
	setCurrentTarget: function( target ) {
		if ( typeof target === "object" && target !== null ) {
			this.currentTarget = target;
		}
	},
	
	
	
	/**
	 * @property {Object} The target of this event, also referred to as the event publisher.
	 */
	target: null,
	
	/**
	 * @description Get the target object/event publisher for this event
	 *
	 * @param void
	 * @return {Object}
	 */
	getTarget: function() {
		return this.target;
	},
	
	/**
	 * @description Set the target object/event publisher for this event
	 *
	 * @param {EventPublisher} The target object/event publisher for this event
	 * @return void
	 */
	setTarget: function( target ) {
		if ( typeof target === "object" && target !== null ) {
			this.target = target;
		}
	},
	
	
	
	/**
	 * @property {Boolean} A flag telling whether or not the default action for this event should be
	 *                     prevented from executing after all the subscribers have been notified.
	 */
	defaultPrevented: false,
	
	/**
	 * @description Prevent the default action for this event from executing
	 *
	 * @param void
	 * @return void
	 */
	preventDefault: function() {
		this.defaultPrevented = true;
	},
	
	/**
	 * @description Checks to see if the default action for this event has been cancelled
	 *
	 * @param void
	 * @return {Boolean}
	 */
	isDefaultPrevented: function() {
		return this.defaultPrevented;
	},
	
	
	
	/**
	 * @property {Boolean} Whether or not this event is currently propagating from subscriber to
	 *                     subscriber.
	 */
	propagating: false,
	
	/**
	 * @description Determines whether or not this event is propagating.
	 *
	 * @param void
	 * @return {Boolean}
	 */
	isPropagating: function() {
		return this.propagating;
	},
	
	/**
	 * @description Stop the propagation of this event immediately.
	 *
	 * @param void
	 * @return void
	 */
	stopPropagation: function() {
		this.propagating = false;
	},
	
	
	
	/**
	 * @property {Array} An array of messages that this event's subscribers have added.
	 */
	messages: null,
	
	/**
	 * @description Add a message to this event.
	 *
	 * @param {String} message The message to add
	 * @return void
	 */
	addMessage: function( message ) {
		if ( typeof message === "string" && message !== "" ) {
			this.messages.push( message );
		}
	},
	
	/**
	 * @description Get all messages added to this event.
	 *
	 * @param void
	 * @return {Array}
	 */
	getMessages: function() {
		return this.messages;
	},
	
	/**
	 * @description Determines whether or not this event has any messages.
	 *
	 * @param void
	 * @return {Boolean}
	 */
	hasMessages: function() {
		return ( this.messages.length > 0 );
	},
	
	
	
	/**
	 * @property {Array} An array of errors that this event's subscribers have added.
	 */
	errors: null,
	
	/**
	 * @description Add an error to this event.
	 *
	 * @param {String} error The error to add
	 * @return void
	 */
	addError: function( error ) {
		if ( typeof( error ) === "string" && error !== "" ) {
			this.errors.push( error );
		}
	},
	
	/**
	 * @description Get all errors added to this event.
	 *
	 * @param void
	 * @return {Array}
	 */
	getErrors: function() {
		return this.errors;
	},
	
	/**
	 * @description Determines whether or not this event has any errors.
	 *
	 * @param void
	 * @return {Boolean}
	 */
	hasErrors: function() {
		return ( this.errors.length > 0 );
	}
	
};