( function() {
	
	var enableConsoleHack = false;
	
	if ( enableConsoleHack && typeof console !== "object" ) {
		console = {
			messages: [],
		
			node: null,
		
			init: function() {
				this.node = document.createElement( "pre" );
				this.node.style.backgroundColor = "#000";
				this.node.style.color = "#0f0";
				this.node.style.border = "3px inset #0f0";
				this.node.style.padding = "8px 2px";
				this.node.style.overflow = "scroll";
				this.node.style.maxWidth = "900px";
				this.node.style.height = "600px";
			
				document.getElementsByTagName( "body" )[ 0 ].appendChild( this.node );
			
				this.displayCachedMessages();
			},
		
			appendMessage: function( message ) {
				this.node.innerHTML += message + "<br /><br />";
			},
		
			displayCachedMessages: function() {
				for ( var i = 0, length = this.messages.length; i < length; i++ ) {
					this.appendMessage( this.messages[ i ] );
				}
			
				this.messages = [];
			},

			info: function( message ) {
				this.log( this.pad( "INFO", 5 ) + " " + message );
			},

			debug: function( message ) {
				this.log( this.pad( "DEBUG", 5 ) + " " + message );
			},

			warn: function( message ) {
				this.log( this.pad( "WARN", 5 ) + " " + message );
			},

			error: function( message ) {
				this.log( this.pad( "ERROR", 5 ) + " " + message );
			},
		
			log: function( message ) {
				if ( !this.node ) {
					this.messages.push( message );
				}
				else {
					this.appendMessage( message );
				}
			},
		
			pad: function( str, len ) {
				var diff = len - str.length;
			
				for ( var i = 0, length = diff; i < length; i++ ) {
					str = " " + str;
				}
			
				return str;
			}
		};
	
		jQuery( function() {
			console.init();
		} );
	}
	
} )();