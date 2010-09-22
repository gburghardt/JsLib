function TestApplication() {
	this.constructor.apply( this, arguments );
}

TestApplication.prototype = {
	
	constructor: function( request, testFactoryGenerator, logType, viewIdSuffix, jsonService ) {
		
	},
	
	init: function() {
		
	},
	
	appendScript: function( src ) {
		var script = document.createElement( "script" );
		script.type = "text/javascript";
		script.src = src;
		
		document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
		
		script = null;
	}
	
};