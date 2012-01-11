/**
 * @class This class provides the basic functionality to allow an object to
 * publish events and manage subscriptions to events this object will publish.
 *
 * @extends Object
 */
function EventPublisher( defaultTopic ) {
	this.constructor( defaultTopic );
}

/**
 * @lends EventPublisher
 */
EventPublisher.prototype = {
	
	/**
	 * @constructs
	 *
	 * @param {String} defaultTopic The default topic on which to publish events
	 *                              when no topic is specified
	 * @return void
	 */
	constructor: function( defaultTopic ) {
		this.setDefaultTopic( defaultTopic );
		this.subscriptions = {};
	},
	
	/**
	 * @destructs
	 *
	 * @param void
	 * @return void
	 */
	destroy: function() {
		var thisSubscriber = null;
		
		for ( var eventName in this.subscriptions ) {
			if ( this.subscriptions.hasOwnProperty( eventName ) ) {
				this.destroyEvent( eventName );
			}
		}
		
		this.subscriptions = null;
	},
	
	destroyEvent: function( eventName ) {
		for ( var topic in this.subscriptions[ eventName ] ) {
			if ( this.subscriptions[ eventName ].hasOwnProperty( topic ) ) {
				this.destroyTopic( eventName, topic );
			}
		}
		
		this.subscriptions[ eventName ] = null;
	},
	
	destroyTopic: function( eventName, topic ) {
		for ( var i = 0, length = this.subscriptions[ eventName ][ topic ].length; i < length; i++ ) {
			this.subscriptions[ eventName ][ topic ][ i ].instance = null;
			this.subscriptions[ eventName ][ topic ][ i ] = null;
		}
		
		this.subscriptions[ eventName ][ topic ] = null;
	},
	
	
	
	/**
	 * @property {String} The default topic to subscribe and publish events on.
	 */
	defaultTopic: "noTopicSpecified",
	
	setDefaultTopic: function( topic ) {
		if ( typeof topic === "string" && topic !== "" ) {
			this.defaultTopic = topic;
			return true;
		}
		
		return false;
	},
	
	topicHasSubscriptions: function( eventName, topic ) {
		return (
			this.eventHasTopics( eventName ) &&
			this.isArray( this.subscriptions[ eventName ][ topic ] ) &&
			this.subscriptions[ eventName ][ topic ].length > 0
		);
	},
	
	
	
	/**
	 * @property {Object} subscriptions A hash object of event names and topics
	 *                                  that contains the subscribers and the
	 *                                  methods to call on them.
	 */
	subscriptions: null,
	
	/**
	 * @description Add an event subscriber object to this event publisher
	 *
	 * @param {String} eventName The event to subscribe to
	 * @param {Object} instance The event subscriber object instance
	 * @param {String} method Name of the method to execute when the event is
	 *                        published
	 * @param {String} topic The topic on which to subscribe
	 * @return void
	 */
	subscribe: function( eventName, instance, method, topic ) {
		topic = topic || this.defaultTopic;
		method = method || "handle" + this.capitalize( eventName );
		
		if ( !this.eventHasTopics( eventName ) ) {
			this.subscriptions[ eventName ] = {};
		}
		
		if ( !this.topicHasSubscriptions( eventName, topic ) ) {
			this.subscriptions[ eventName ][ topic ] = [];
		}
		
		this.subscriptions[ eventName ][ topic ].push( {
			instance: instance,
			method: method
		} );
	},
	
	eventHasTopics: function( eventName ) {
		return this.isObject( this.subscriptions[ eventName ] );
	},
	
	/**
	 * @description Notify subscribers of an event.
	 *
	 * @param {Event} event The event object
	 *
	 * @param {Array} subscribers An array of subscribers who should be notified
	 *                            of the event.
	 *
	 * @return {Boolean} True if the event propagated fully, false if one of the
	 *                   subscribers stopped propagation (canceled the event).
	 */
	notifySubscribers: function( event, subscribers ) {
		var subscriber = null;
		
		for ( var i = 0, length = subscribers.length; i < length; i++ ) {
			subscriber = subscribers[ i ];
			
			if ( !event.isCancelable() || event.isPropagating() ) {
				subscriber.instance[ subscriber.method ]( event );
			}
			else {
				return false;
			}
		}
		
		event = null;
		subscriber = null;
		subscribers = null;
		
		return true;
	},
	
	/**
	 * @description Unsubscribe from an event.
	 *
	 * @param {String} eventName The name of an event this object publishes
	 * @param {Object} instance The instance of the event subscriber
	 * @param {String} topic The topic from which to subscribe
	 * @return {Boolean} True if unsubscribed successfully
	 */
	unsubscribe: function( eventName, instance, topic ) {
		topic = topic || this.defaultTopic;
		
		var subscriber = null;
		var success = false;
		
		if ( !this.topicHasSubscriptions( eventName, topic ) ) {
			return;
		}
		
		for ( var i = 0, length = this.subscriptions[ eventName ][ topic ].length; i < length; i++ ) {
			subscriber = this.subscriptions[ eventName ][ topic ][ i ];
			
			if ( instance === subscriber.instance ) {
				this.subscriptions[ eventName ][ topic ].splice( i, 1 );
				success = true;
				break;
			}
		}
		
		subscriber = null;
		
		return success;
	},
	
	
	
	/**
	 * @description Notify this publishers subscribers of an event created by
	 * another publisher. This allows publishers to chain events from one
	 * publisher to the next, much like how a DOM event bubbles up from the
	 * source node to the document object.
	 *
	 * @param {Event} event The event object to bubble to this publisher's
	 *                      subscribers.
	 *
	 * @return {Boolean} True if the event was bubbled properly
	 */
	bubble: function( event ) {
		if (
			!this.topicHasSubscriptions( event.type, event.topic ) ||
			!event.canBubble()
		) {
			return false;
		}
		
		event.setCurrentTarget( this );
		
		var subscribers = this.subscriptions[ event.type ][ event.topic ];
		var success = this.notifySubscribers( event, subscribers );
		
		event = null;
		subscribers = null;
		
		return success;
	},
	
	/**
	 * @description Publish an event to the event subscribers. After the event
	 * has finished propagating, it is destroyed. Events are a synchronous
	 * process. If any event data is needed for an asychronous process, save the
	 * event data in a local variable or object property. After a handler
	 * function has finished executing, do not count on the event object being
	 * available.
	 *
	 * @param {String} eventName The name of the event to publish
	 *
	 * @param {Object} eventData Data to pass to each subscriber
	 *
	 * @param {String} topic The topic on which to publish this event
	 *
	 * @param {Boolean} bubbles Whether or not this event can bubble through
	 *                          other event publishers who want to propagate
	 *                          this event.
	 *
	 * @param {Boolean} cancelable Whether or not this event can be canceled.
	 *
	 * 
	 * @return {Boolean} True if the default action for this event should be
	 *                   executed, false otherwise.
	 */
	publish: function( eventName, eventData, topic, cancelable, bubbles ) {
		topic = topic || this.defaultTopic;
		
		if ( !this.topicHasSubscriptions( eventName, topic ) ) {
			return false;
		}
		
		var subscriber = null;
		var event = new Event( this );
		var subscribers = this.subscriptions[ eventName ][ topic ];
		var success = false;
		
		event.initEvent( eventName, bubbles, cancelable );
		event.setTopic( topic );
		
		if ( eventData ) {
			event.setData( eventData );
		}
		
		success = this.notifySubscribers( event, subscribers );
		
		event.destroy();
		
		event = null;
		subscribers = null;
		
		return success;
	},
	
	
	
	// Utility methods
	
	capitalize: function( str ) {
		return ( str.charAt( 0 ).toUpperCase() + str.substring( 1, str.length ) );
	},
	
	isArray: function( x ) {
		return ( this.isObject( x ) && x.constructor && x.constructor === Array );
	},
	
	isObject: function( x ) {
		return ( typeof ( x ) === "object" && x !== null );
	}
	
};