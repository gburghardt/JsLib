describe("Modules.Base", function() {

	beforeEach(function() {
		this.element = document.createElement("div");
	});

	describe("initialize", function() {

		it("throws an error if you instantiate Modules.Base directly", function() {
			expect(function() {
				new Modules.Base(this.element);
			}).toThrowError();
		});

	});

	describe("compileDelegatorEventActionMapping", function() {

		it("creates an empty mapping if a sub class does not define one", function() {
			var TestModule = Modules.Base.extend();
			var module = new TestModule(this.element);
			module.compileDelegatorEventActionMapping();
			expect(module.delegatorEventActionMapping).toBeEmptyObject();
		});

		it("creates a mapping from a concrete class", function() {
			var TestModule = Modules.Base.extend({
				prototype: {
					actions: {
						click: ["cancel", "destroy"],
						submit: "save"
					}
				}
			});

			var module = new TestModule(this.element);
			module.compileDelegatorEventActionMapping();

			expect(module.delegatorEventActionMapping.cancel).toEqual("click");
			expect(module.delegatorEventActionMapping.destroy).toEqual("click");
			expect(module.delegatorEventActionMapping.save).toEqual("submit");
		});

		it("merges the mappings of all the sub classes", function() {
			var ParentModule = Modules.Base.extend({
				prototype: {
					actions: {
						click: ["cancel", "destroy"],
						submit: "save"
					}
				}
			});

			var ChildModule = ParentModule.extend({
				prototype: {
					actions: {
						click: "select",
						change: ["markDirty", "loadRegions"]
					}
				}
			});

			expect(ParentModule.prototype).toNotHaveProperty("delegatorEventActionMapping");
			expect(ChildModule.prototype).toNotHaveProperty("delegatorEventActionMapping");

			var module1 = new ChildModule(this.element);
			var module2 = new ParentModule(this.element);

			module1.compileDelegatorEventActionMapping();

			expect(ParentModule.prototype).toNotHaveProperty("delegatorEventActionMapping");
			expect(ChildModule.prototype).toHaveProperty("delegatorEventActionMapping");

			module2.compileDelegatorEventActionMapping();

			var mapping1 = module1.delegatorEventActionMapping;
			var mapping2 = module2.delegatorEventActionMapping;

			expect(ParentModule.prototype).toHaveProperty("delegatorEventActionMapping");
			expect(ChildModule.prototype.delegatorEventActionMapping).toStrictlyEqual(mapping1);

			// mapping from child class as all combined actions
			expect(mapping1.cancel).toEqual("click");
			expect(mapping1.destroy).toEqual("click");
			expect(mapping1.select).toEqual("click");
			expect(mapping1.save).toEqual("submit");
			expect(mapping1.markDirty).toEqual("change");
			expect(mapping1.loadRegions).toEqual("change");

			// mapping from parent class only has mappings in parent class
			expect(mapping2.cancel).toEqual("click");
			expect(mapping2.destroy).toEqual("click");
			expect(mapping2.save).toEqual("submit");

			// mapping from parent class does NOT have mappings included in a child class
			expect(mapping2.select).toBeUndefined();
			expect(mapping2.markDirty).toBeUndefined();
			expect(mapping2.loadRegions).toBeUndefined();
		});

	});

	describe("init", function() {

		it("does not compile the event action mapping after the first instance is generated", function() {
			var TestModule = Modules.Base.extend({
				prototype: {
					actions: {
						click: ["cancel", "destroy"],
						submit: "save"
					},
					cancel: function(event, element, params) {},
					save: function(event, element, params) {},
					destroy: function(event, element, params) {}
				}
			});

			var module1, module2;

			expect(TestModule.prototype.hasOwnProperty("delegatorEventActionMapping")).toBeFalse();

			module1 = new TestModule(this.element);
			expect(TestModule.prototype.hasOwnProperty("delegatorEventActionMapping")).toBeFalse();
			spyOn(module1, "compileDelegatorEventActionMapping").andCallThrough();
			module1.init();
			expect(module1.compileDelegatorEventActionMapping).wasCalled();
			expect(TestModule.prototype.hasOwnProperty("delegatorEventActionMapping")).toBeTrue();

			var module2 = new TestModule(this.element);
			spyOn(module2, "compileDelegatorEventActionMapping").andCallThrough();
			module2.init();
			expect(module2.compileDelegatorEventActionMapping).wasNotCalled();
		});

		it("creates a DOM event delegator", function() {
			var TestModule = Modules.Base.extend();
			var module = new TestModule(this.element);
			module.init();

			expect(module.delegator).toBeInstanceof(dom.events.Delegator);
		});

		it("triggers the afterInit callback", function() {
			var callOrder = [];

			var TestModule = Modules.Base.extend({
				prototype: {
					callbacks: {
						afterInit: ["foo", "bar"]
					},
					foo: function() {
						callOrder.push("foo");
					},
					bar: function() {
						callOrder.push("bar");
					}
				}
			});

			var module = new TestModule(this.element);

			spyOn(module, "notify").andCallThrough();
			spyOn(module, "foo").andCallThrough();
			spyOn(module, "bar").andCallThrough();

			module.init();

			expect(module.notify).wasCalled();
			expect(module.foo).wasCalled();
			expect(module.bar).wasCalled();
			expect(callOrder.join(",")).toEqual("foo,bar");
		});

	});

});
