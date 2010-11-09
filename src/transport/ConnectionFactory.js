/**
 * @class This class churns out new instances of Connection, a wrapper for the
 * XMLHttpRequest object. This does not provide support for Internet Explorer 5 & 6.
 * 
 * @extends Object
 * @depends Connection
 * @depends SameDomainConnection
 * @depends CrossDomainConnection
 */
function ConnectionFactory() {
	this.constructor.apply( this, arguments );
}

ConnectionFactory.prototype = {
	
	/**
	 * @property {Object} A service object responsible for convering JSON string into
	 *                    native JavaScript objects, and turning objects into JSON strings
	 */
	jsonService: null,
	
	/**
	 * @property {Number} A same-domain connection used for AJAX requests
	 */
	TYPE_SAME_DOMAIN: 0,
	
	/**
	 * @property {Number} A cross domain connection used for jsonp requests
	 */
	TYPE_CROSS_DOMAIN: 1,
	
	/**
	 * @constructs
	 * @param {Object} jsonService The jsonService property
	 * @returns {void}
	 */
	constructor: function( jsonService ) {
		this.jsonService = jsonService || null;
		jsonService = null;
	},
	
	destructor: function() {
		this.jsonService = null;
	},
	
	/**
	 * Get a new instance of a connection object
	 *
	 * @param {Number} type The type of connection to create
	 * @returns {Connection}
	 */
	getInstance: function( type ) {
		if ( this.TYPE_CROSS_DOMAIN === type ) {
			return new CrossDomainConnection( this.jsonService );
		}
		else {
			return new SameDomainConnection( this.jsonService );
		}
	}
	
};