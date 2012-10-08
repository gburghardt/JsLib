BaseCollection = Array.extend({

	self: {

		classReferences: {},

		getModelInstance: function(className, attributes) {
			if (!BaseCollection.classReferences[className]) {
				BaseCollection.classReferences[className] = className.constantize();
			}

			return new BaseCollection.classReferences[className](attributes);
		}

	},

	prototype: {

		model: {primaryKey: "id"},

		initialize: function() {
			this.mergeModelOptions();
			Array.apply(this, arguments);
		},

		add: function(modelOrAttrs) {
			if (modelOrAttrs.__proto__ === Object.prototype) {
				this.push(this.constructor.getModelInstance(this.model.className, modelOrAttrs));
			}
			else {
				this.push(modelOrAttrs);
			}
		},

		mergeModelOptions: function() {
			var key, defaultModelOptions = BaseCollection.prototype.model;

			for (key in defaultModelOptions) {
				if (defaultModelOptions.hasOwnProperty(key) && !this.model.hasOwnProperty(key)) {
					this.model[key] = defaultModelOptions[key];
				}
			}
		}

	}
});
