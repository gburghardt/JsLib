/**
 * @extends Object
 * @depends Connection
 */
function ConnectionManager() {
	this.constructor.apply( this, arguments );
}

ConnectionManager.prototype = {
	
	constructor: function() {
		this.connections = [];
	},
	
	destructor: function() {
		
	},
	
	init: function() {
		
	},
	
	
	
	connections: null,
	
	getConnection: function() {
		
	}
	
};