Object.Utils = {

  prototype: {

		attempt: function(methodName) {
			if (this[methodName] && methodName !== "attempt") {
				var args = Array.prototype.slice.call(arguments, 1);

				try {
					return this[methodName].apply(this, args);
				}
				catch (error) {
					return undefined;
				}
			}
		},

		merge: function() {
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
		},

		mergeArrayPropertyFromPrototypeChain: function(key) {
			var compiledProperty = [];
			var proto = this.__proto__, property;

			while (proto) {
				if (proto.hasOwnProperty(key)) {
					property = (proto[key] instanceof Array) ? proto[key] : [ proto[key] ];
					compiledProperty.push.apply(compiledProperty, property);
				}

				proto = proto.__proto__;
			}

			proto = property = null;

			return compiledProperty;
		},

		mergePropertyFromPrototypeChain: function(name) {
			var mergedProperty = {};
			var proto = this.__proto__;

			while(proto) {
				if (proto.hasOwnProperty(name) && proto[name]) {
					mergedProperty.safeMerge( proto[name] );
				}

				proto = proto.__proto__;
			}

			proto = null;

			return mergedProperty;
		},

		safeMerge: function(o) {
			for (var key in o) {
				if (o.hasOwnProperty(key) && !this[key]) {
					this[key] = o[key];
				}
			}

			o = null;
		}

  }

};

Object.include(Object.Utils);
