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

ConnectionManager.prototype = {
	
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
	 * @returns {void}
	 */
	constructor: function( connectionFactory, maxConnections ) {
		this.connectionFactory = connectionFactory;
		this.setMaxConnections( maxConnections );
		this.connections = [];
		connectionFactory = null;
	},
	
	destructor: function() {
		this.connectionFactory = null;
		
		if ( this.connections ) {
			for ( var i = 0, length = this.connections.length; i < length; i++ ) {
				this.connections[ i ].instance.abort();
				this.connections[ i ].instance = null;
				this.connections[ i ] = null;
			}
		
			this.connections = null;
		}
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
				instance = this.connections[ i ].instance;
				this.connections[ i ].status = this.STATUS_IN_USE;
				break;
			}
		}
		
		if ( instance === null && ( this.maxConnections < 0 || this.connection.length < this.maxConnections ) ) {
			instance = this.connectionFactory.getInstance();
			this.connections.push( {
				instance: instance,
				status: this.STATUS_IN_USE
			} );
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
		
		for ( var i = 0, length = this.connections.length; i < length; i++ ) {
			if ( instance === this.connections[ i ].instance ) {
				this.connections[ i ].status = this.STATUS_AVAILABLE;
				released = true;
			}
		}
		
		instance = null;
		
		return released;
	},
	
	
	
	/**
	 * @property {Number} The maximum number of allowed connections in this pool. Defaults
	 *                    to -1 (unlimited).
	 */
	maxConnections: -1,
	
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