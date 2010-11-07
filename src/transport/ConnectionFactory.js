/**
 * @class This class churns out new instances of Connection, a wrapper for the
 * XMLHttpRequest object. This does not provide support for Internet Explorer 5 & 6.
 * 
 * @extends Object
 * @depends Connection
 * @depends SameDomainConnection
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
	 * @param {void}
	 * @returns {Connection}
	 */
	getInstance: function() {
		return new SameDomainConnection( this.jsonService );
	}
	
};