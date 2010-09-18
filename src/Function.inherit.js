Object.extend = function( parentClass, newProto ) {
	try {
		Object.extend.native( parentClass, newProto );
	}
};

Object.extend.native = function( parentClass, newProto ) {
	var newConstructor = function() {
		this.constructor.apply( this, arguments );
	};
	
	newConstructor.prototype = newProto;
	newConstructor.prototype.__proto__ = parentClass.prototype;
	
	parentClass = null;
	newProto = null;
};