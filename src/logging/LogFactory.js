function LogFactory() {
	this.constructor.apply( this, arguments );
}

LogFactory.prototype = {
	
	jsonService: null,
	
	type: null,
	
	constructor: function( type, jsonService ) {
		this.type = type || "console";
		
		if ( jsonService ) {
			this.jsonService = jsonService;
		}
		
		jsonService = null;
	},
	
	getInstance: function( logHandle, level, debugMode, enabled ) {
		var className = this.capitalize( this.type ) + "Logger";
		var classReference = window[ className ];
		var instance = null;
		
		if ( typeof classReference === "function" ) {
			instance = new classReference( logHandle, level, debugMode, enabled );
			
			if ( this.jsonService ) {
				instance.setJsonService( this.jsonService );
			}
			
			return instance;
		}
		else {
			throw new Error( "No logging object constructor function was found in window." + className + " for type " + this.type );
		}
	},
	
	
	
	// utility methods
	
	capitalize: function( str ) {
		return str.charAt( 0 ).toUpperCase() + str.substring( 1, str.length );
	}
	
};