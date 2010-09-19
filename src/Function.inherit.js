Function.inherit = function( parentClass, newProto ) {
	var newConstructor = null;
	try {
		newConstructor = Function.inherit.native( parentClass, newProto );
		Function.inherit = Function.inherit.native;
	}
	catch ( err ) {
		newConstructor = Function.inherit.merge( parentClass, newProto );
		Function.inherit = Function.inherit.merge;
	}
	
	parentClass = null;
	newProto = null;
	
	return newConstructor;
};

Function.inherit.native = function( parentClass, newProto ) {
	var newConstructor = function() {
		this.constructor.apply( this, arguments );
	};
	
	newConstructor.superClass = parentClass.prototype;
	newConstructor.prototype = newProto;
	newConstructor.prototype.__proto__ = parentClass.prototype;
	
	parentClass = null;
	newProto = null;
	
	return newConstructor;
};

Function.inherit.merge = function( parentClass, newProto ) {
	var undef;
	
	var newConstructor = function() {
		this.constructor.apply( this, arguments );
	};
	
	newConstructor.superClass = parentClass.prototype;
	
	for ( var key in parentClass.prototype ) {
		if ( !parentClass.prototype.hasOwnProperty( key ) ) {
			continue;
		}
		
		if ( newProto[ key ] === undef ) {
			newProto[ key ] = parentClass.prototype[ key ];
		}
	}
	
	newProto = null;
	parentClass = null;
	
	return newConstructor;
};