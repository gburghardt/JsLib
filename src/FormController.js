/**
 * @class This class controls submitting a form, creating a model to encompass
 * the data in the form and performing error handling.
 * 
 * @extends Object
 */
function FormController() {
	this.constructor.apply( this, arguments );
}

FormController.prototype = {
	
	/**
	 * @constructs
	 * 
	 * @param {Object} lang A hash object of keys and values for readable text
	 * @param {Object} propertyTranslator A hash object containing property
	 *                                    names in the form model, and their
	 *                                    form field names on the page.
	 * @param {Object} modelFactory A factory object responsible for churning
	 *                              out instances of a model for this form.
	 * @returns {void}
	 */
	constructor: function( lang, propertyTranslator, modelFactory ) {
		if ( !this.setLang( lang ) ) {
			throw new Error( "No lang object was found, which is used to translate error codes from the form model into readable text, '" + lang + "' given." );
		}
		
		if ( !this.setPropertyTranslater( propertyTranslator ) ) {
			throw new Error( "No model to form field property translator was detected, '" + propertyTranslator + "' given." );
		}
		
		if ( !this.setModelFactory( modelFactory ) ) {
			throw new Error( "No modelFactory was detected, '" + modelFactory + "' given." );
		}
	},
	
	/**
	 * @destructs
	 * 
	 * @returns {void}
	 */
	destructor: function() {
		this.form.onsubmit.cleanup();
		this.form.onsubmit = null;
		
		for ( var name in this.errorNodes ) {
			if ( !this.errorNodes.hasOwnProperty( name ) ) {
				continue;
			}
			
			this.errorNodes[ name ] = null;
		}
		
		this.errorNodes = null;
		this.modelFactory = null;
		this.formErrorNode = null;
		this.lang = null;
		this.propertyTranslator = null;
	},
	
	/**
	 * Initialize this controller and ready it for use.
	 * 
	 * @param {String} form An Id of a FORM element
	 * @param {Object} form A raw reference to a FORM element
	 * @returns {void}
	 */
	init: function( form ) {
		if ( typeof form === "string" ) {
			form = document.getElementById( form );
		}
		
		if ( !this.setForm( form ) ) {
			throw new Error( "No valid form was detected in FormController.init(): '" + form + "' given." );
		}
		
		var controller = this;
		
		this.form.onsubmit = function( evt ) {
			try {
				var fields = controller.getFields();
				var values = controller.getValues( fields );
				
				controller.handleSubmit( values, fields );
				
				fields = null;
				values = null;
				
				return false;
			}
			catch ( error ) {
				return true;
			}
			
			evt = null;
		};
		
		this.form.onsubmit.cleanup = function() {
			controller = null;
		};
		
		node = null;
	},

	
	
	/**
	 * @property {Object} A hash object for form field names and the nodes
	 *                    responsible for displaying error messages relating to
	 *                    that form field
	 */
	errorNodes: null,
	
	getErrorNode: function( name, field ) {
		if ( !this.errorNodes[ name ] ) {
			if ( this.isArray( field ) ) {
				field = field[ 0 ];
			}
			
			var node = document.createElement( "div" );
			node.className = "error form-field-error";
			node.style.display = "none";
			
			this.errorNodes[ name ] = node;
			this.insertNodeAfter( node, field );
		}
		
		return this.errorNodes[ name ];
	},

	hideAllErrorNodes: function() {
		for ( var name in this.errorNodes ) {
			if ( !this.errorNodes.hasOwnProperty( name ) ) {
				continue;
			}
			
			this.errorNodes[ name ].style.display = "none";
		}
	},
	
	showErrorNode: function( name, field, msg ) {
		var node = this.getErrorNode( name, field );
		
		node.style.display = "";
		
		if ( typeof msg === "string" ) {
			node.innerHTML = msg;
		}
		
		node = null;
	},
	
	
	
	/**
	 * @property {HTMLFORMElement} The form this controller is managing
	 */
	form: null,
	
	setForm: function( form ) {
		if ( typeof form === "object" && form !== null && form.nodeName && form.nodeName === "FORM" ) {
			this.form = form;
			
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 * @property {HTMLDIVElement} Reference to the node at the top of the form
	 *                            displaying form-wide error messages
	 */
	formErrorNode: null,
	
	getFormErrorNode: function() {
		if ( this.formErrorNode === null ) {
			var node = document.createElement( "div" );
			node.style.display = "none";
			node.className = "error form-error";
			
			this.form.insertBefore( node, this.form.firstChild );
			
			this.formErrorNode = node;
		}
		
		node = null;
		
		return this.formErrorNode;
	},

	hideFormErrorNode: function() {
		this.getFormErrorNode().style.display = "none";
	},

	showFormErrorNode: function( msg ) {
		var node = this.getFormErrorNode();
		
		node.style.display = "";
		
		if ( typeof msg === "string" ) {
			node.innerHTML = msg;
		}
		
		node = null;
	},
	
	
	
	/**
	 * @property {Object} A key-value object storing readable text
	 */
	lang: null,
	
	setLang: function( lang ) {
		if ( typeof lang === "object" && lang !== null ) {
			this.lang = lang;
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 * @property {Object} A factory object responsible for instantiating a new
	 *                    model instance for this form, and inserting the form
	 *                    field values into the model
	 */
	modelFactory: null,
	
	setModelFactory: function( modelFactory ) {
		if ( this.isObject( modelFactory ) ) {
			this.modelFactory = modelFactory;
			return true;
		}
		
		return false;
	},
	
	
	
	/**
	 * @property {Object} Associates form model property names with form field
	 *                    names in the HTML document.
	 */
	propertyTranslator: null,
	
	setPropertyTranslator: function( propertyTranslator ) {
		if ( typeof propertyTranslator === "object" && propertyTranslator !== null ) {
			this.propertyTranslator = propertyTranslator;
		}
	},
	
	

	addFieldToCollection: function( fields, field, name ) {
		if ( !fields[ name ] ) {
			if ( field.nodeName === "INPUT" && field.type === "checkbox" ) {
				fields[ name ] = [ field ];
			}
			else {
				fields[ name ] = field;
			}
		}
		else if ( this.isArray( fields[ name ] ) ) {
			fields[ name ].push( field );
		}
		else {
			fields[ name ] = field;
		}
		
		field = null;
		
		return fields;
	},
	
	getFields: function() {
		var fields = {};
		
		fields = this.getFieldsByTagName( "input", fields );
		fields = this.getFieldsByTagName( "select", fields );
		fields = this.getFieldsByTagName( "textarea", fields );
		
		return fields;
	},
	
	getFieldsByTagName: function( tagName, fields ) {
		var nodes = this.form.getElementsByTagName( tagName );
		
		for ( var i = 0, length = nodes.length; i < length; i++ ) {
			this.addFieldToCollection( fields, nodes[ i ], nodes[ i ].name );
		}
		
		nodes = null;
		
		return fields;
	},
	
	getValueFromNode: function( node ) {
		var nodeName = node.nodeName.toLowerCase();
		var value = null;
		var type = "";
		
		switch ( nodeName ) {
		
		case "input":
			type = node.type.toLowerCase();
			
			if ( ( "radio" === type || "checkbox" === type ) ) {
				value = ( node.checked ) ? node.value : null;
			}
			else {
				value = node.value;
			}
			
			break;
		
		case "select":
			if ( node.multiple ) {
				value = [];
				
				for ( var i = 0, length = node.options.length; i < length; i++ ) {
					if ( node.options[ i ].selected ) {
						value.push( node.options.value );
					}
				}
			}
			else {
				value = node.value;
			}
			break;
		
		case "textarea":
			value = node.value;
			break;
			
		}
		
		return value;
	},
	
	getValues: function( fields ) {
		var node = null;
		var value = null;
		var values = {};
		
		for ( var name in fields ) {
			if ( !fields.hasOwnProperty( name ) ) {
				continue;
			}
			
			node = fields[ name ];
			
			if ( this.isArray( node ) ) {
				for ( var i = 0, length = node.length; i < length; i++ ) {
					value = this.getValueFromNode( node[ i ] );
					values = this.addValueToCollection( values, value, name );
				}
			}
			else {
				value = this.getValueFromNode( node );
				values = this.addValueToCollection( values, value, name );
			}
		}
		
		return values;
	},
	
	handleSubmit: function( values, fields ) {
		var model = this.modelFactory.getInstance( values );
		
		if ( model.isValid() ) {
			this.processValidForm( model, values, fields );
		}
		else {
			this.processInvalidForm( model, values, fields );
		}
	},
	
	insertNodeAfter: function( insertNode, afterNode ) {
		if ( afterNode.nextSibling ) {
			afterNode.nextSibling.insertBefore( insertNode );
		}
		else {
			afterNode.parentNode.appendChild( insertNode );
		}
		
		afterNode = null;
		insertNode = null;
	},
	
	isArray: function( x ) {
		return ( this.isObject( x ) && x.constructor && x.constructor === Array );
	},

	isObject: function( x ) {
		return ( typeof x === "object" && x !== null );
	},
	
	/**
	 * Process the form when model validation has failed. Most child classes
	 * won't need to override this method, as its behavior is pretty generic.
	 * 
	 * @param {Object} model The model for this form
	 * @param {Object} values A hash object of the raw form data
	 * @param {Object} fields A hash object of references to all form fields
	 * @returns {void}
	 */
	processInvalidForm: function( model, values, fields ) {
		var errorCodes = model.getErrorCodes();
		var fieldName = "";
		var errorLangName = "";
		
		this.showFormErrorNode( this.lang[ "error.errorsInForm" ] );
		
		for ( var property in errorCodes ) {
			if ( !errorCodes.hasOwnProperty( property ) ) {
				continue;
			}
			
			fieldName = this.propertyTranslator[ property ];
			errorLangName = "error." + property;
			
			this.showErrorNode( fieldName, fields[ fieldName ], this.lang[ errorLangName ] );
		}
		
		errorCodes = null;
		model = null;
		values = null;
		fields = null;
	},
	
	/**
	 * Process the form when model validation has succeeded. Child classes may
	 * override this method to prevent the form from being submitted.
	 * 
	 * @param {Object} model The model for this form
	 * @param {Object} values A hash object of the raw form data
	 * @param {Object} fields A hash object of references to all form fields
	 * @returns {void}
	 */
	processValidForm: function( model, values, fields ) {
		this.hideFormErrorNode();
		this.hideAllErrorNodes();
		this.form.submit();
	}
	
};