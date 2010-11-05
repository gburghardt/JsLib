/**
 * @class This class provides the capability to manage a pool of connection objects. Use
 * this when you have a long running AJAX application and you want to avoid a slow memory
 * leak in Internet Explorer.
 *
 * This class also provides a way to abort all connections by calling destructor() in a
 * window.onunload event handler.
 *
 * @extends Object
 * @depends Connection
 * @depends XMLHttpRequest
 */
function ConnectionPool() {
	this.constructor.apply( this, arguments );
}

ConnectionPool.prototype = {
	
	/**
	 * @const {String} Used to mark a connection as available in the pool
	 */
	STATUS_AVAILABLE: "AVAILABLE",
	
	/**
	 * @const {String} Used to mark a connection as in use and not available in the pool.
	 */
	STATUS_IN_USE: "IN_USE",
	
	/**
	 * @constructs
	 * @param {Object} connectionFactory A factory object responsible for churning out new
	 *                                   instances of Connection or XMLHttpRequest objects
	 *                                   (or any object supporting the same public
	 *                                   interface as XMLHttpRequest).
	 * @param {Number} maxConnections The maximum number of allowed connections.
	 * @param {Object} eventDispatcher An optional event dispatcher used to notify the
	 *                                 application when connection requests exceed the
	 *                                 connections available in this pool.
	 * @returns {void}
	 */
	constructor: function( connectionFactory, maxConnections, eventDispatcher ) {
		if ( !this.setConnectionFactory( connectionFactory ) ) {
			throw new Error( "A connectionFactory is required, which returns new connection objects supporting the XMLHttpRequest interface." );
		}
		
		this.setMaxConnections( maxConnections );
		this.setEventDispatcher( eventDispatcher );
		this.connectionRequests = [];
		this.connections = [];
		connectionFactory = null;
		eventDispatcher = null;
	},
	
	destructor: function() {
		this.connectionFactory = null;
		this.eventDispatcher = null;
		
		if ( this.connections ) {
			for ( var i = 0, length = this.connections.length; i < length; i++ ) {
				this.connections[ i ].instance.abort();
				this.connections[ i ].instance = null;
				this.connections[ i ] = null;
			}
		
			this.connections = null;
		}
		
		if ( this.connectionRequests ) {
			for ( var i = 0, length = this.connectionRequests.length; i < length; i++ ) {
				this.connectionsRequests[ i ].instance = null;
				this.connectionsRequests[ i ].callback = null;
				this.connectionsRequests[ i ] = null;
			}
			
			this.connectionsRequests = null;
		}
	},
	
	
	
	/**
	 * @property {Object} Factory object responsible for generating new connection objects
	 *                    that support the XMLHttpRequest interface.
	 */
	connectionFactory: null,
	
	setConnectionFactory: function( connectionFactory ) {
		var isSet = false;
		
		if ( typeof connectionFactory === "object" && connectionFactory !== null ) {
			this.connectionFactory = connectionFactory;
			isSet = true;
		}
		
		connectionFactory = null;
		
		return isSet;
	},
	
	
	
	/**
	 * @property {Array} A list of objects that want to be notified when requests become
	 *                   available.
	 */
	connectionRequests: null,
	
	processConnectionRequests: function() {
		if ( this.connectionRequests.length < 1 ) {
			return;
		}
		
		var request = null;
		var instance = null;
		var callback = null;
		var method = "";
		var connection = null;
		
		while ( this.connectionRequests.length && this.connectionsAvailable() ) {
			connection = this.getConnection();
			request = this.connectionRequests.shift();
			instance = request.instance;
			callback = request.callback;
			method = request.method;
			
			if ( request.method ) {
				instance[ method ]( connection );
			}
			else if ( typeof instance === "object" ) {
				callback.call( instance, connection );
			}
			else {
				callback( connection );
			}
		}
		
		request = instance = callback = connection = null;
	},
	
	/**
	 * Allows objects or functions to be notified when a connection becomes available.
	 * This method has several interfaces. It can take a callback function, an object
	 * instance and the name of a method to call, or an object instance and a function
	 * object where 'this' inside the function refers to instance.
	 *
	 * @param {Object} instance An object instance
	 * @param {String}   callback Name of a method to call on object
	 *        {Function} callback A function to be called with 'this' pointing to instance
	 *
	 * @param {Function} instance A function to call
	 * @returns {void}
	 */
	waitForAvailableConnection: function( instance, callback ) {
		var request = {};
		
		if ( arguments.length === 1 ) {
			// assume instance is a function
			request.callback = instance;
		}
		else if ( typeof callback === "function" ) {
			// assume callback is a function and instance is object callback should be
			// bound to when executed
			request.callback = callback;
			request.instance = instance;
		}
		else {
			// Assume callback is the name of a method to call on instance
			request.method = callback;
			request.instance = instance;
		}
		
		this.connectionRequests.push( request );
		request = null;
		instance = null;
		callback = null;
	},
	
	
	
	/**
	 * @property {Array} An array of connection objects
	 */
	connections: null,
	
	/**
	 * Get a connection object from the pool
	 *
	 * @param {void}
	 * @returns {Object} A connection object or null if no more connection objects were
	 *                   allowed.
	 */
	getConnection: function() {
		var instance = null;
		
		for ( var i = 0, length = this.connections.length; i < length; i++ ) {
			if ( this.STATUS_AVAILABLE === this.connections[ i ].status ) {
				this.inUseCount++;
				instance = this.connections[ i ].instance;
				this.connections[ i ].status = this.STATUS_IN_USE;
				break;
			}
		}
		
		if ( instance === null ) {
			if ( this.connections.length < this.maxConnections ) {
				this.inUseCount++;
				instance = this.connectionFactory.getInstance();
				this.connections.push( {
					instance: instance,
					status: this.STATUS_IN_USE
				} );
			}
			else if ( this.eventDispatcher ) {
				this.eventDispatcher.publish( "connectionPoolEmpty", {
					connectionPool: this,
					maxSize: this.maxConnections
				} );
			}
		}
		
		return instance;
	},
	
	/**
	 * Release a connection to the pool.
	 *
	 * @param {void}
	 * @returns {Boolean} True if released successfuly, false otherwise
	 */
	release: function( instance ) {
		var released = false;
		var maxConnectionsMet = !this.connectionsAvailable();
		
		for ( var i = 0, length = this.connections.length; i < length; i++ ) {
			if ( instance === this.connections[ i ].instance ) {
				this.connections[ i ].status = this.STATUS_AVAILABLE;
				this.inUseCount--;
				released = true;
				break;
			}
		}
		
		if ( maxConnectionsMet && this.eventDispatcher ) {
			this.eventDispatcher.publish( "connectionPoolAvailable", {
				connectionPool: this,
				maxSize: this.maxConnections
			} );
		}
		
		instance = null;
		
		this.processConnectionRequests();
		
		return released;
	},
	
	
	
	/**
	 * @property {Object} An event dispatcher supporting the publish/subscribe interface.
	 */
	eventDispatcher: null,
	
	setEventDispatcher: function( eventDispatcher ) {
		if ( typeof eventDispatcher === "object" ) {
			this.eventDispatcher = eventDispatcher;
		}
		
		eventDispatcher = null;
	},
	
	
	
	/**
	 * @property {Number} The maximum number of allowed connections in this pool. Defaults
	 *                    to -1 (unlimited).
	 */
	maxConnections: -1,
	
	inUseCount: 0,
	
	connectionsAvailable: function() {
		if ( this.maxConnections < 0 ) {
			return true;
		}
		else if ( this.connections.length - this.inUseCount > 0 ) {
			return true;
		}
		else if ( this.connections.length < this.maxConnections ) {
			return true;
		}
		else {
			return false;
		}
	},
	
	getAvailableConnections: function() {
		return this.connections.length - this.maxConnections - this.inUseCount;
	},
	
	/**
	 * Sets the maxConnections property
	 *
	 * @property {Number} maxConnections New maxConnections value
	 * @returns {void}
	 */
	setMaxConnections: function( maxConnections ) {
		if ( typeof maxConnections === "number" && !isNaN( maxConnections ) ) {
			this.maxConnections = maxConnections;
		}
	}
	
};