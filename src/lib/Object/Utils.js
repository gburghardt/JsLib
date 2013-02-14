Object.Utils = {

  prototype: {

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
