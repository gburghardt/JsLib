/**
 * @class This class allows you to serialize and deserialize a string of data between a
 * string and an object. This is useful for converting query strings into useful data.
 *
 * @extends Object
 */
function SerializableData() {
	this.constructor.apply( this, arguments );
}

SerializableData.prototype = {
	
	/**
	 * @property {Object} The key-value pairs deserialized from the string
	 */
	data: null,
	
	/**
	 * @constructs
	 *
	 * @param {String} paramSeparate The character separating the key-value pairs
	 * @param {String} valueSeparator The character separating the key from the value
	 * @param {String} arrayValueSeparator The character within a value what should be
	 *                                     used to split that single value into an array
	 *                                     of values.
	 * @return {void}
	 */
	constructor: function( paramSeparator, valueSeparator, arrayValueSeparator ) {
		this.setParamSeparator( paramSeparator );
		this.setValueSeparator( valueSeparator );
		this.setArrayValueSeparator( arrayValueSeparator );
		
		this.data = {};
	},
	
	/**
	 * Get a value from the deserialized data
	 * 
	 * @param {String} key The key to get
	 * @param {mixed} defaultValue The default value to return if the key was not found.
	 *                             The defaultValue is null unless specified.
	 * @return {mixed} The value at key, or the defaultValue.
	 */
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
	
	/**
	 * Sets a value, which can later be serialized.
	 *
	 * @param {String} key The key to set
	 * @param {mixed} value The value to set at key
	 * @return {void}
	 */
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
	
	/**
	 * Deserialize a string and convert it to the key-value pairs.
	 *
	 * @param {String} str The string to deserialize
	 * @return {void}
	 */
	deserialize: function( str ) {
		var wholeParams = str.split( this.paramSeparator );
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
	
	/**
	 * Serialize the data in this object back into a string
	 *
	 * @param {Boolean} useParamSeparator When serializing array values, make each value
	 *                                    its own parameter instead of mashing them
	 *                                    together into one value separated by the
	 *                                    arrayValueSeparator.
	 * @return {String} The serialized data
	 */
	serialize: function( useParamSeparator ) {
		if ( !this.data ) {
			return "";
		}
		
		var params = [];
		var str = "";
		var value = null;
		var arrValue = null;
		
		for ( var key in this.data ) {
			if ( !this.data.hasOwnProperty( key ) ) {
				continue;
			}
			
			params.push( this.serializeParam( key, this.data[ key ], useParamSeparator ) );
		}
		
		str = params.join( this.paramSeparator );
		params = null;
		
		return str;
	},
	
	/**
	 * Serialize an individual parameter and its value.
	 *
	 * @param {String} The key to serialize the data as
	 * @param {String|Array} value The value to serialize
	 * @param {Boolean} useParamSeparator See serialize()
	 * @return {String} The serialized parameter
	 */
	serializeParam: function( key, value, useParamSeparator ) {
		if ( this.isArray( value ) ) {
			return this.serializeArrayParam( key, value, useParamSeparator )
		}
		else {
			return this.serializeStringParam( key, value );
		}
	},
	
	/**
	 * Serialize an array of values
	 *
	 * @param {String} The key to serialize the data as
	 * @param {Array} value The value to serialize
	 * @param {Boolean} useParamSeparator See serialize()
	 * @return {String} The serialized parameter
	 */
	serializeArrayParam: function( key, values, useParamSeparator ) {
		str = "";
		
		if ( useParamSeparator ) {
			var params = [];
			
			for ( var i = 0, length = values.length; i < length; i++ ) {
				params.push( this.serializeStringParam( key, values[ i ] ) );
			}
			
			str = params.join( this.paramSeparator );
		}
		else {
			var encodedValues = [];
			
			for ( var i = 0, length = values.length; i < length; i++ ) {
				encodedValues.push( encodeURIComponent( values[ i ] ) );
			}
			
			str = encodeURIComponent( key ) + this.valueSeparator + encodedValues.join( this.arrayValueSeparator );
		}
		
		return str;
	},
	
	/**
	 * Serialize a single value
	 *
	 * @param {String} The key to serialize the data as
	 * @param {Array} value The value to serialize
	 * @return {String} The serialized parameter
	 */
	serializeStringParam: function( key, value ) {
		return encodeURIComponent( key ) + this.valueSeparator + encodeURIComponent( value );
	},
	
	/**
	 * Converts this object to a string. Overrides Object.prototype.toString.
	 *
	 * @return {String}
	 */
	toString: function() {
		return this.serialize();
	},
	
	
	
	/**
	 * @property {String} The character within a value what should be used to split that
	 *                    single value into an array of values.
	 */
	arrayValueSeparator: ",",
	
	/**
	 * Sets the arrayValueSeparator property
	 * 
	 * @param {String} str The new arrayValueSeparator property
	 */
	setArrayValueSeparator: function( str ) {
		if ( typeof str === "string" && str !== "" ) {
			this.arrayValueSeparator = str;
		}
	},
	
	
	
	/**
	 * @property {String} The character separating the key-value pairs
	 */
	paramSeparator: "&",
	
	/**
	 * Sets the paramSeparator property
	 * 
	 * @param {String} str The new paramSeparator property
	 */
	setParamSeparator: function( str ) {
		if ( typeof str === "string" && str !== "" ) {
			this.paramSeparator = str;
		}
	},
	
	
	
	/**
	 * @property {String} The character separating the key from the value.
	 */
	valueSeparator: "=",
	
	/**
	 * Sets the valueSeparator property
	 * 
	 * @param {String} str The new valueSeparator property
	 */
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