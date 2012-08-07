if (!Function.prototype.bind) {
	Function.prototype.bind = function(context) {
		var self = this;
		var fn = function() {
			return self.apply(context, arguments);
		};

		fn.cleanup = function() {
			self = fn = context = null;
		};

		return fn;
	};
}

if (!Function.prototype.include) {
	Function.prototype.include = function(mixin) {
		var key;

		// include class level methods
		if (mixin.self) {
			for (key in mixin.self) {
				if (mixin.self.hasOwnProperty(key) && !this[key]) {
					this[key] = mixin.self[key];
				}
			}
		}

		// include instance level methods
		if (mixin.prototype) {
			for (key in mixin.prototype) {
				if (mixin.prototype.hasOwnProperty(key) && !this.prototype[key]) {
					this.prototype[key] = mixin.prototype[key];
				}
			}
		}

		mixin = null;
	};
}

if (!Function.prototype.extend) {
	Function.prototype.extend = function(descriptor) {
		descriptor = descriptor || {};
		var key, i, length;

		// Constructor function for our new class
		var Klass = function() {
			this.initialize.apply(this, arguments);
		};

		// Temp class referencing this prototype to avoid calling initialize() when inheriting
		var ProxyClass = function() {};
		ProxyClass.prototype = this.prototype;

		// "inherit" class level methods
		for (key in this) {
			if (this.hasOwnProperty(key)) {
				Klass[key] = this[key];
			}
		}

		// new class level methods
		if (descriptor.self) {
			for (key in descriptor.self) {
				if (descriptor.self.hasOwnProperty(key)) {
					Klass[key] = descriptor.self[key];
				}
			}
		}

		// set up true prototypal inheritance
		Klass.prototype = new ProxyClass();

		// new instance level methods
		if (descriptor.prototype) {
			for (key in descriptor.prototype) {
				if (descriptor.prototype.hasOwnProperty(key)) {
					Klass.prototype[key] = descriptor.prototype[key];
				}
			}
		}

		// apply mixins
		if (descriptor.includes) {
			// force includes to be an array
			descriptor.includes = (descriptor.includes instanceof Array) ? descriptor.includes : [descriptor.includes];

			for (i = 0, length = descriptor.includes.length; i < length; i++) {
				Klass.include(descriptor.includes[i]);
			}
		}

		// ensure new prototype has an initialize method
		Klass.prototype.initialize = Klass.prototype.initialize || function() {};

		// set reference to constructor function in new prototype
		Klass.prototype.constructor = Klass;

		ProxyClass = descriptor = null;

		return Klass;
	};
}
