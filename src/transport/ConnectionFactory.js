/**
 * @class This class churns out new instances of Connection, a wrapper for the
 * XMLHttpRequest object. This does not provide support for Internet Explorer 5 & 6.
 * 
 * @extends Object
 * @depends Connection
 */
function ConnectionFactory() {
	this.constructor.apply( this, arguments );
}

ConnectionFactory.prototype = {
	
	jsonService: null,
	
	constructor: function( jsonService ) {
		this.jsonService = jsonService;
		jsonService = null;
	},
	
	destructor: function() {
		this.jsonService = null;
	},
	
	getInstance: function() {
		return new Connection( this.jsonService );
	}
	
};