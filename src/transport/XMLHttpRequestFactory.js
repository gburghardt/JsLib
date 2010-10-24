/**
 * @class This class churns out new instances of native browser AJAX objects, taking care
 * to resolve cross browser issues with the various versions of Internet Explorer.
 *
 * @extends Object
 * @depends XMLHttpRequest
 * @depends ActiveXObject
 */
function XMLHttpRequestFactory() {
	this.constructor.apply( this, arguments );
}

XMLHttpRequestFactory.prototype = {
	
	constructor: function() {
		
	},
	
	/**
	 * @property {Array} An array of AJAX object factory methods tailored to certain
	 *                   browsers.
	 */
	factoryMethods: [
		function() { return new XMLHttpRequest(); },                     // standards browsers and Internet Explorer 7+
		function() { return new ActiveXObject( "Msxml2.XMLHTTP" ); },    // Internet Explorer 6
		function() { return new ActiveXObject( "Microsoft.XMLHTTP" ); }, // Internet Explorer 5
		function() { return null; }                                      // AJAX is not supported by this browser
	],
	
	/**
	 * Get a new instance of an AJAX object. After a successful call, the proper factory
	 * method is memoized to speed up future calls.
	 *
	 * @param {void}
	 * @returns {Object} New AJAX object or null if the browser doesn't support AJAX.
	 */
	getInstance: function() {
		var instance = null;
		
		for ( var i = 0, length = this.factoryMethods.length; i < length; i++ ) {
			try {
				instance = this.factoryMethods[ i ]();
				this.getInstance = this.factoryMethods[ i ];
				break;
			}
			catch ( error ) {
				// fail silently to continue to next factory method
			}
		}
		
		return instance;
	}
	
};