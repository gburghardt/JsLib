function SerializableData() {
	this.constructor.apply( this, arguments );
}

SerializableData.prototype = {
	
	data: null,
	
	constructor: function( paramSeparator, valueSeparator, arrayValueSeparator ) {
		this.setParamSeparator( paramSeparator );
		this.setValueSeparator( valueSeparator );
		this.setArrayValueSeparator( arrayValueSeparator );
		
		this.data = {};
	},
	
	get: function( key, defaultValue ) {
		if ( defaultValue === undefined ) {
			defaultValue = null;
		}
		
		if ( this.data[ key ] !== undefined ) {
			return this.data[ key ];
		}
		else {
			return defaultValue;
		}
	},
	
	set: function( key, value ) {
		if ( this.data[ key ] === undefined ) {
			this.data[ key ] = value;
		}
		else if ( this.isArray( this.data[ key ] ) ) {
			this.data[ key ].push( value );
		}
		else {
			this.data[ key ] = [ this.data[ key ], value ];
		}
		
		value = null;
	},
	
	deserialize: function( queryString ) {
		var wholeParams = queryString.split( this.paramSeparator );
		var param = null;
		
		for ( var i = 0, length = wholeParams.length; i < length; i++ ) {
			param = wholeParams[ i ].split( this.valueSeparator );
			
			if ( param[ 1 ].indexOf( this.arrayValueSeparator ) > -1 ) {
				param[ 1 ] = param[ 1 ].split( this.arrayValueSeparator );
				
				for ( var j = 0, jlength = param[ 1 ].length; j < jlength; j++ ) {
					param[ 1 ][ i ] = decodeURIComponent( param[ 1 ][ i ] );
				}
			}
			else {
				param[ 1 ] = decodeURIComponent( param[ 1 ] );
			}
			
			this.set( decodeURIComponent( param[ 0 ] ), param[ 1 ] );
		}
		
		wholeParams = null;
		param = null;
	},
	
	serialize: function() {
		if ( !this.data ) {
			return "";
		}
		
		var params = [];
		var str = "";
		
		for ( var key in this.data ) {
			if ( !this.data.hasOwnProperty( key ) ) {
				continue;
			}
			
			params.push( this.serializeParam( key, this.data[ key ] ) );
		}
		
		str = params.join( this.paramSeparator );
		params = null;
		
		return str;
	},
	
	serializeParam: function( key, value, encodedKey ) {
		var str = "";
		
		if ( this.isArray( value ) ) {
			var params = [];
			
			for ( var i = 0, length = value.length; i < length; i++ ) {
				params.push( this.serializeParam( key, value[ i ], encodeURIComponent( key ) ) );
			}
			
			str = params.join( this.paramSeparator );
			params = null;
		}
		else {
			if ( encodedKey ) {
				str = encodedKey;
			}
			else {
				str = encodeURIComponent( key );
			}
			
			str += this.valueSeparator + encodeURIComponent( value );
		}
		
		return str;
	},
	
	toString: function() {
		return this.serialize();
	},
	
	
	
	arrayValueSeparator: ",",
	
	setArrayValueSeparator: function( str ) {
		if ( typeof str === "string" && str !== "" ) {
			this.arrayValueSeparator = str;
		}
	},
	
	
	
	paramSeparator: "&",
	
	setParamSeparator: function( str ) {
		if ( typeof str === "string" && str !== "" ) {
			this.paramSeparator = str;
		}
	},
	
	
	
	valueSeparator: "=",
	
	setValueSeparator: function( str ) {
		if ( typeof str === "string" && str !== "" ) {
			this.valueSeparator = str;
		}
	},
	
	
	
	// utility methods
	
	isArray: function( x ) {
		return ( typeof x === "object" && x !== null && x.constructor && x.constructor === Array );
	}
	
};