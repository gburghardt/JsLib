if (!Object.defineProperty) {
	if ( ({}).__defineGetter__ ) {
		Object.defineProperty = function(obj, property, descriptor) {
			if (descriptor.readable) {
				obj.__defineGetter__(property, descriptor.get);
			}

			if (descriptor.writable) {
				obj.__defineSetter(property, descriptor.set);
			}

			if (descriptor.value !== undefined) {
				obj[property] = descriptor.value;
			}
		};
	}
	else {
		throw new Error("This browser is incompatible with Object.defineProperty (" + navigator.userAgent + ").");
	}
}

if (!Object.prototype.merge) {
	Object.prototype.merge = function() {
		var key, args = arguments, i = 0, length = args.length, arg;

		for (i; i < length; i++) {
			arg = args[i];

			for (key in arg) {
				if (arg.hasOwnProperty(key)) {
					this[key] = arg[key];
				}
			}
		}

		arg = args = null;
		return this;
	};
}
