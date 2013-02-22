// TODO: Is this even useful? Keeping this file in the mean time, but not sure if I will long term.
Modules.ModuleTree = {

	included: function(Klass) {
		Klass.attempt("addCallbacks", {
			afterInit: "initModuleTree",
			beforeDestructor: "destroyModuleTree"
		});
	},

	prototype: {

		childModules: {},

		parentModule: null,

		initModuleTree: function() {
			if (!this.__proto__.compiledChildModules) {
				var compiledChildModules = this.mergePropertyFromPrototypeChain("childModules");

				this.__proto__.compiledChildModules = compiledChildModules;

				for (var property in compiledChildModules) {
					if (compiledChildModules.hasOwnProperty(property) && !this.__proto__.hasOwnProperty(property)) {
						Object.defineProperty(this.__proto__, property, {
							get: this.createChildModuleGetter(property)
						});
					}
				}

			}
		},

		destroyModuleTree: function() {
			// TODO: Destroy all humans--- modules. I mean modules!
		},

		createChildModuleGetter: function(property) {
			if (this.compiledChildModules[property] === null) {
				return function() {
					if (!this.compiledChildModules[property]) {
						var elements = this.element.getElementsByTagName("*");
						this.compiledChildModules[property] = this.createModuleSingleProperty(property, elements);
						elements = null;
					}

					return this.compiledChildModules[property];
				};
			}
			else if (this.compiledChildModules[property] instanceof Array) {
				if (!this.compiledChildModules[property].length) {
					var elements = this.element.getElementsByTagName("*");
					this.compiledChildModules[property] = this.createModuleArrayProperty(property, elements);
					elements = null;
				}

				return this.compiledChildModules[property];
			}
		}

	}

};

Modules.Base.include(Modules.ModuleTree);
