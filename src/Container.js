/**
 * @class This class provides a container for your entire JavaScript
 * application. It manages a set of configs that allow you to easily and
 * seamlessly glue your entire application together by providing setter and
 * constructor dependency injection, and the ability to manage singletons. This
 * provides the foundation for Inversion of Control in JavaScript.
 *
 * Reference: http://martinfowler.com/articles/injection.html
 * 
 * @extends Object
 */
function Container( initialConfigs ) {
	this.constructor( initialConfigs );
};

/** @lends Container */
Container.prototype = {
	
	/**
	 * @constructs
	 *
	 * @param {Object} initialConfigs The initial configs for this container
	 * @return {void}
	 */
	constructor: function( initialConfigs ) {
		this.configs = {};
		this.singletons = {
			myContainer: this
		};
		
		if ( !this.isObject( initialConfigs ) ) {
			initialConfigs = {};
		}
		
		initialConfigs.myContainer = {
			className: "Container",
			singleton: true
		};
		
		this.addConfigs( initialConfigs );
	},
	
	
	
	/**
	 * @property {Boolean} Whether or not this container is being destroyed
	 */
	destructing: false,
	
	/**
	 * @destructs
	 *
	 * @param {void}
	 * @return {void}
	 */
	destructor: function() {
		if ( this.destructing ) {
			return;
		}
		
		this.destructing = true;
		
		this.destroyConfigs();
		this.destroySingletons();
		this.classReferenceCache = null;
	},
	
	/**
	 * Destroy the instance configuration data
	 *
	 * @param {void}
	 * @return {void}
	 */
	destroyConfigs: function() {
		for ( var id in this.configs ) {
			if ( this.configs.hasOwnProperty( id ) ) {
				this.configs[ id ] = null;
			}
		}
		
		this.configs = null;
	},
	
	
	
	/**
	 * @property {Object} A hash object associating fully qualified class names
	 *                    with constructor functions. This is shared by all
	 *                    instances of this class.
	 */
	classReferenceCache: {},
	
	/**
	 * Get a reference to an object constructor function by a fully qualified
	 * class name. This method starts searching the window object first, and
	 * then goes deeper.
	 *
	 * @param {String} className The fully qualified class name for which you
	 *                           want the constructor function reference.
	 * @return {Mixed} A constructor function that can be instantiated, or an
	 *                 object in the case you want a reference to a singleton.
	 *                 Throws an error if the class name is not found.
	 *
	 * @throws Error
	 */
	getClassReference: function( className ) {
		if ( !this.classReferenceCache[ className ] ) {
			var classPieces = className.split( "." );
			var thisObject = window;
			var thisClass = "";
			
			for ( var i = 0, length = classPieces.length; i < length; i++ ) {
				thisClass = classPieces[i];
				
				currentObject = thisObject[ thisClass ];
				
				if ( this.isObject( currentObject ) || this.isFunction( currentObject ) ) {
					thisObject = currentObject;
				}
				else {
					throw new Error( "Class " + className + " was not found." );
				}
			}
			
			this.classReferenceCache[ className ] = thisObject;
		}
		
		baseObject = null;
		currentObject = null;
		thisObject = null;
		
		return this.classReferenceCache[ className ];
	},
	
	
	
	
	/**
	 * @property {Object} A hash object of configuration data for objects in
	 *                    this container. Each key is associated with an Id in
	 *                    the instances object identifying a unique object
	 *                    instance.
	 */
	configs: null,
	
	/**
	 * Add object configuration data to this container in bulk. Takes as many
	 * config objects as you can throw at it.
	 *
	 * @params {Object} config Object configuration data to add to this
	 *                         container
	 * @return {void}
	 */
	addConfigs: function( configs ) {
		for ( var id in configs ) {
			if ( configs.hasOwnProperty( id ) ) {
				this.configs[ id ] = configs[ id ];
			}
		}
		
		configs = null;
	},
	
	/**
	 * Get configuration data
	 *
	 * @param {String} id The Id of an object config
	 * @return {Object} The config or null if not found
	 */
	getConfig: function( id ) {
		if ( this.configs[ id ] ) {
			return this.configs[ id ];
		}
		
		return null;
	},
	
	
	
	/**
	 * @property {Object} A hash object of singletons in this container
	 */
	singletons: null,
	
	/**
	 * Destroy all the singletons in this container
	 *
	 * @param {void}
	 * @return {void}
	 */
	destroySingletons: function() {
		for ( var id in this.singletons ) {
			if ( this.singletons.hasOwnProperty( id ) ) {
				if ( this.isFunction( this.singletons[ id ].destructor ) ) {
					this.singletons[ id ].destructor();
				}
				
				this.singletons[ id ] = null;
			}
		}
		
		this.singletons = null;
	},
	
	/**
	 * Get a singleton instance
	 *
	 * @param {String} id The Id of a singleton managed by this container
	 * @param {Object} config The config data for the singleton
	 * @return {Object} The singleton instance or null if not found
	 */
	getSingletonInstance: function( id, config ) {
		var instance = null;
		
		if ( this.singletons[ id ] ) {
			instance = this.singletons[ id ];
		}
		else {
			instance = this.createInstanceFromConfig( id, config );
			this.singletons[ id ] = instance;
		}
		
		return instance;
	},
	
	
	
	/**
	 * Create an object instance from the config data
	 *
	 * @param {String} id Id of an instance config
	 * @param {Object} config The config for an instance
	 * @return {Object} A new instance as described in its config
	 */
	createInstanceFromConfig: function( id, config ) {
		var instance = null;
		var ClassToInstantiate = this.getClassReference( config.className );
		var ProxyClass = null;
		var constructorArgs = null;
		
		if ( this.isFunction( ClassToInstantiate ) ) {
			if ( config.constructorArgs ) {
				// TODO - test how this handles Base.js classes
				ProxyClass = function() {};
				ProxyClass.prototype = ClassToInstantiate.prototype;
				
				instance = new ProxyClass();
				constructorArgs = this.getConstructorArgs( config.constructorArgs );
				ClassToInstantiate.apply( instance, constructorArgs );
			}
			else {
				instance = new ClassToInstantiate();
			}
		}
		else {
			instance = ClassToInstantiate;
		}
		
		if ( config.properties ) {
			this.injectDependencies( instance, config.properties );
		}
		
		ProxyClass = null;
		ClassToInstantiate = null;
		config = null;
		
		return instance;
	},
	
	/**
	 * Get an object instance by an Id. If specified, an object instance can be
	 * lazy loaded, delaying instantiation until called upon by this method.
	 *
	 * @param {String} id The Id of an object instance in this container.
	 * @return {Object} The object instance, or null if the Id isn't found.
	 */
	getInstance: function( id ) {
		var config = this.getConfig( id );
		var instance;
		
		if ( !config ) {
			instance = null;
		}
		else if ( config.singleton ) {
			instance = this.getSingletonInstance( id, config );
		}
		else {
			instance = this.createInstanceFromConfig( id, config );
		}
		
		return instance;
	},
	
	/**
	 * Get an array of constructor arguments used for constructor dependency
	 * injection.
	 *
	 * @param {Array} constructorArgsConfig An array of properties to inject
	 *                                      using an object's constructor
	 *                                      method.
	 * @return {Array} An array of constructor method arguments.
	 */
	getConstructorArgs: function( constructorArgsConfig ) {
		var constructorArgs = [];
		
		for ( var i = 0, length = constructorArgsConfig.length; i < length; i++ ) {
			constructorArgs.push( this.getDependencyValue( constructorArgsConfig[ i ] ) );
		}
		
		return constructorArgs;
	},
	
	/**
	 * Get the value of an object dependency from the property config.
	 *
	 * @param {Object} propertyConfig A hash object that defines the name and
	 *                                value of a property.
	 * @return {Mixed} The dependency value to inject into an instance
	 */
	getDependencyValue: function( propertyConfig ) {
		var value = null;
		
		if ( propertyConfig.id ) {
			value = this.getInstance( propertyConfig.id );
		}
		else if ( typeof propertyConfig.value !== "undefined" ) {
			value = propertyConfig.value;
		}
		else {
			value = null;
		}
		
		propertyConfig = null;
		
		return value;
	},
	
	/**
	 * Inject the dependencies into an instance via setter or adder injection,
	 * or set the property name by brute force.
	 *
	 * @param {Object} instance The instance into which property values should
	 *                          be injected
	 * @param {Object} properties A hash object of property names and their
	 *                            raw values, or Ids of other instances in this
	 *                            container
	 * @return {void}
	 */
	injectDependencies: function( instance, properties ) {
		var setterName = "";
		var adderName = "";
		var name = "";
		var value = null;
		var thisProperty = null;
		
		for ( name in properties ) {
			if ( !properties.hasOwnProperty( name ) ) {
				continue;
			}
			
			thisProperty = properties[ name ];
			value = this.getDependencyValue( thisProperty );
			
			setterName = "set" + this.capitalize( name );
			adderName = "add" + this.capitalize( name );
			
			if ( this.isFunction( instance[ setterName ] ) ) {
				// inject foo property via setFoo()
				instance[ setterName ]( value );
			}
			else if ( this.isFunction( instance[ adderName ] ) ) {
				// inject foo property via addFoo()
				instance[ adderName ]( value );
			}
			else {
				// inject foo via property name
				instance[ name ] = value;
			}
		}
		
		thisProperty = null;
		properties = null;
		instance = null;
		value = null;
	},
	
	
	
	// utility functions
	
	isFunction: function( x ) {
		return ( Object.prototype.toString.call( x ) === "[object Function]" );
	},
	
	isObject: function( x ) {
		return ( typeof x === "object" && x !== null );
	},
	
	capitalize: function( str ) {
		return str.charAt( 0 ).toUpperCase() + str.substring( 1, str.length )
	}
	
};