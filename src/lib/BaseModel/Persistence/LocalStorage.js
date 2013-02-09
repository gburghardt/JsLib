BaseModel.Persistence.LocalStorage = {

	included: function(Klass) {
		if (!window.localStorage) {
			throw new Error("Your browser does not support localStorage.");
		}
		else if (!BaseModel.prototype.toJson) {
			throw new Error("BaseModel.Persistence.LocalStorage requires the BaseModel.Serialization.Json module");
		}

		Klass.persistence.types.push("localStorage");
	},

	self: {

		fetchFromLocalStorage: function(id, context, callbacks) {
			var model = this.findFromLocalStorage(id);

			if (model) {
				callbacks.found.call(context, model);
			}
			else {
				callbacks.notFound.call(context, model);
			}

			context = callbacks = model = null;
		},

		findFromLocalStorage: function(id) {
			if (!this.instances[id]) {
				var key = this.createLocalStorageKey({id: id});
				var attributes = localStorage[key];
				var instance = null;

				if (attributes) {
					attributes = JSON.parse(attributes);
					instance = new this(attributes);
				}

				this.instances[id] = instance;
				attributes = instance = null;
			}


			return this.instances[id];
		}

	},

  callbacks: {
    initialize: function(attributes) {
      if (!this.localStorageOptions.frozen) {
        var options = {frozen: true}, proto = this, protos = [], i, length;

        // climb the prototype chain merging in local storage options
        while (proto && proto != Object.prototype) {
          if (proto.hasOwnProperty("localStorageOptions")) {
            protos.unshift(proto)
          }

          proto = proto.__proto__;
        }

        for (i = 0, length = protos.length; i < length; i++) {
          options.merge(protos[i].localStorageOptions);
        }

        this.localStorageOptions = options;

        proto = protos = options = null;
      }

      attributes = null;
    }
  },

	prototype: {

		localStorageOptions: {table: "base_model", key: ":table.:id"},

		createLocalStorageKey: function(x) {
			if (!x) {
				x = {};
				x[this.primaryKey] = this.getPrimaryKey();
			}

			return this.localStorageOptions.key.replace(/:table/g, this.localStorageOptions.table).replace(/:(\w+)/g, function(match, key) {
        var value = x[key];

        if (value === null || value === undefined) {
          throw new Error("Value at " + key + " cannot be null or undefined");
        }
        else {
  				return x[key];
        }
			});
		},

    createNewPrimaryKey: function() {
      return new Date().getTime() + "" + Math.round(Math.random() * 10000000000000000);
    },

		destroyFromLocalStorage: function(context, callbacks) {
			if (!this.getPrimaryKey()) {
				callbacks.notFound.call(context);
			}
			else {
				var key = this.createLocalStorageKey();

				if (!localStorage[key]) {
					callbacks.notFound.call(context);
				}
				else {
					localStorage[key] = null;
					delete localStorage[key];
					callbacks.destroyed.call(context);
				}
			}

			context = callbacks = null;
		},

		saveToLocalStorage: function(context, callbacks) {
			var key;

			if (!this.getPrimaryKey()) {
				this[ this.primaryKey ] = this.createNewPrimaryKey();
			}

			key = this.createLocalStorageKey(this);
			localStorage[key] = this.toJson();
			callbacks.saved.call(context);
			context = callbacks = model = null;
		}

	}

};

BaseModel.include(BaseModel.Persistence.LocalStorage);