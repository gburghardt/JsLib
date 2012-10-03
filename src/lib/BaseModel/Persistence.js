BaseModel.Persistence = {

	included: function(Klass) {
		Klass.persistence = {
			types: []
		};
		Klass = null;
	},

	prototype: {

		destroyed: false,

		newRecord: true,

		destroy: function(context, callbacks) {
			if (this.destroyed) {
				callbacks.notFound.call(context);
			}
			else {
				this.doDestroy(context, callbacks);
			}
		},

		doDestroy: function(context, callbacks) {
			var types = this.constructor.persistence.types;
			var length = types.length, i = 0, type, method, count = 0;

			var callbacks = {
				destroyed: function() {
					
				},
				notFound: function() {
					
				}
			};

			for (i; i < length; i++) {
				type = types[i];
				method = "destroyFrom" + type.capitalize();

				if (this[method]) {
					this[method](this, callbacks);
				}
				else {
					throw new Error("No method " + method + " found for persistence type " + type);
				}
			}
		},

		getPersistenceTypes: function() {
			return this.constructor.persistence.types;
		},

		save: function(context, callbacks) {
			if (this.destroyed) {
				callbacks.invalid.call(context, {base: "has been deleted"});
			}
			else if (!this.validate()) {
				callbacks.invalid.call(context, this.getErrorMessages());
			}
			else {
				this.doSave(context, callbacks);
			}

			context = callbacks = null;
		},

		doSave: function(context, externalCallbacks) {
			var types = this.getPersistenceTypes();
			var length = types.length, type, method, count = 0, model = this;

			var cleanup = function() {
				types = externalCallbacks = doSaveCallbacks = context = model = null;
			};

			var performSave = function() {
				if (count === length) {
					if (model.newRecord) {
						model.applyModuleCallbacks("save");
						model.newRecord = false;
						externalCallbacks.saved.call(context);
						model.constructor.register(model);
						model.publish("created");
					}
					else {
						model.applyModuleCallbacks("update");
						externalCallbacks.saved.call(context);
						model.publish("updated");
					}

					cleanup();
				}
				else {
					type = types[count];
					method = "saveTo" + type.capitalize();
					count++;

					if (model[method]) {
						model[method](model, doSaveCallbacks);
					}
					else {
						throw new Error("No method " + method + " found for persistence type " + type);
					}
				}
			};

			var doSaveCallbacks = {
				saved: function() {
					performSave.call(model);
				},
				invalid: function(errors) {
					externalCallbacks.invalid.call(context, errors);
				}
			};

			performSave.call(model);
		}

	}

};

BaseModel.include(BaseModel.Persistence);