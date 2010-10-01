function Delegator() {
	this.constructor.apply( this, arguments );
}

Delegator.prototype = {
	
	constructor: function() {
		this.delegates = {};
	},
	
	destructor: function() {
		for ( var action in this.delegates ) {
			if ( !this.delegates.hasOwnProperty( action ) ) {
				continue;
			}
			
			this.delegates[ action ].instance = null;
			this.delegates[ action ] = null;
		}
		
		this.delegates = null;
	},
	
	
	
	delegates: null,
	
	addDelegate: function( action, instance, method ) {
		var added = false;
		
		if ( !this.delegates[ action ] ) {
			this.delegates[ action ] = {
				instance: instance,
				method: method
			};
			
			added = true;
		}
		
		instance = null;
		
		return added;
	},
	
	delegate: function( action, data ) {
		var delegateFound = false;
		
		if ( this.delegates[ action ] ) {
			var instance = this.delegates[ action ].instance;
			var method = this.delegates[ action ].method;
			
			if ( typeof instance[ method ] === "function" ) {
				instance[ method ]( data );
				delegateFound = true;
			}
			else {
				throw new Error( "A method named " + method + " was not found in the delegate for the " + action + " action." );
			}
		}
		
		instance = null;
		data = null;
		
		return delegateFound;
	},
	
	removeDelegate: function( action, instance ) {
		var success = false;
		
		if ( this.delegates[ action ] && instance === this.delegates[ action ].instance ) {
			this.delegates[ action ].instance = null;
			delete this.delegates[ action ];
			success = true;
		}
		
		instance = null;
		
		return success;
	}
	
};