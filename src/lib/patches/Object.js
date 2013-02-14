Object.include({

	self: {

		defineProperty: function(obj, property, descriptor) {
			if (descriptor.readable) {
				obj.__defineGetter__(property, descriptor.get);
			}

			if (descriptor.writable) {
				obj.__defineSetter(property, descriptor.set);
			}

			if (descriptor.value !== undefined) {
				obj[property] = descriptor.value;
			}
		}

	}

});
