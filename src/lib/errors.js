BaseError = Error.extend({
	self: {
		create: function(type, descriptor) {
			descriptor = descriptor || {};
			descriptor.self = descriptor.self || {};
			descriptor.self.type = type;
			return this.extend(descriptor);
		}
	},
	prototype: {
		initialize: function(message) {
			Error.apply(this, arguments);
			this.message = this.constructor.type + " - " + (message || "");
		}
	}
});

AccessDeniedError = BaseError.create("AccessDeniedError");