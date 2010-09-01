/**
 * @class This class provides the backbone of all model classes that are used
 * by the FormController class.
 * 
 * @extends Object
 */
function FormModel() {
	this.constructor.apply( this, arguments );
}

FormModel.prototype = {
	
	REGEX_BOOL: /^(true|t|false|f|1|0|yes|y|no|n){1}$/i,

	REGEX_BOOL_TRUE: /^(true|t|1|yes|y){1}$/i,
	
	REGEX_INT: /^-?[0-9]{1,}$/,
	
	REGEX_NULL: /^null$/i,
	
	REGEX_NUMERIC: /^[-.,0-9]{1,}$/,
	
	REGEX_NOT_NUMERIC: /^[^-.,0-9]$/,
	
	constructor: function() {
		this.errorCodes = {};
	},
	
	
	
	errorCodes: null,
	
	addErrorCode: function( name, code ) {
		this.errorCodes[ name ] = code;
	},
	
	getErrorCodes: function() {
		return this.errorCodes;
	},
	
	
	
	/**
	 * @abstract
	 * 
	 * Checks this model to see if all the data is valid. Child classes must
	 * implement this method. Errors encountered should cause error codes to be
	 * added.
	 * 
	 * @returns {Boolean}
	 */
	isValid: function() {
		throw new Error( "Child classes of FormController must implement an isValid() method." );
	},
	
	
	
	// utility methods
	
	/**
	 * A generic function to test if a value is ideologically "empty".
	 * 
	 * @param {mixed} x The value to test
	 * @returns {Boolean}
	 */
	empty: function( x ) {
		var type = typeof( x );
		
		if ( type === "string" ) {
			return ( x === "" );
		}
		else if ( type === "number" ) {
			return ( isNaN( x ) || x <= 0 );
		}
		else if ( type === "boolean" ) {
			return ( x === false );
		}
		else if ( type === "function" ) {
			return false;
		}
		else {
			return (
				x === null ||
				this.emptyArray( x ) ||
				this.emptyObject( x ) ||
				type === "undefined"
			);
		}
	},
	
	emptyArray: function( x ) {
		return ( this.isArray( x ) && x.length === 0 );
	},
	
	emptyObject: function( x ) {
		if ( !this.isObject( x ) ) {
			return true;
		}
		
		for ( var key in x ) {
			if ( x.hasOwnProperty( key ) ) {
				return false;
			}
		}
		
		return true;
	},
	
	isArray: function( x ) {
		return ( this.isObject( x ) && x.constructor && x.constructor === Array );
	},
	
	isBool: function( str ) {
		return ( typeof str === "string" && str !== "" && this.REGEX_BOOL.test( str ) );
	},
	
	isInt: function( str ) {
		return ( typeof str === "string" && this.REGEX_INT.test( str ) );
	},
	
	isNull: function( x ) {
		return this.REGEX_NULL.test( x );
	},
	
	isNumber: function( x ) {
		return ( typeof x === "number" && !isNaN( x ) );
	},
	
	isNumeric: function( str ) {
		return ( this.REGEX_NUMERIC.test( str ) && !isNaN( str ) );
	},
	
	isObject: function( x ) {
		return ( x !== null && typeof x === "object" );
	},
	
	isString: function( x ) {
		return ( typeof x === "string" );
	},
	
	toBool: function( x ) {
		return this.REGEX_BOOL_TRUE.test( x );
	},
	
	toNumber: function( str ) {
		str = str.replace( this.REGEX_NOT_NUMERIC, "" );
		
		if ( this.isNumeric( str ) ) {
			return Number( str );
		}
		else {
			return NaN;
		}
	}
	
};