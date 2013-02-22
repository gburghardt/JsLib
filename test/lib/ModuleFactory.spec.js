describe("ModuleFactory", function() {

	window.ModuleFactoryTest = window.ModuleFactoryTest || {};
	var namespace = window.ModuleFactoryTest;

	describe("getInstance", function() {

		ModuleFactoryTest.TestModule = Modules.Base.extend();

		beforeEach(function() {
			this.factory = new ModuleFactory();
		});

		it("instantiates a module based on the class and registers it with the factory", function() {
			spyOn(this.factory, "registerModule").andCallThrough();
			var element = document.createElement("div");
			var className = "ModuleFactoryTest.TestModule";
			var module = this.factory.getInstance(className, element);

			expect(module.element.className).toEqual("module module-module_factory_test-test_module");
			expect(this.factory.registerModule).wasCalledWith(className, module);
			expect(this.factory.modules[className]).toBeArray();
			expect(this.factory.modules[className].length).toEqual(1);
			expect(this.factory.modules[className][0]).toStrictlyEqual(module);
		});

	});

	describe("createModule", function() {

		ModuleFactoryTest.Foo = Modules.Base.extend();

		beforeEach(function() {
			this.factory = new ModuleFactory();
		});

		it("calls init() on the new module", function() {
			var element = document.createElement("div");
			var moduleInfo = {};
			var mockModule = new ModuleFactoryTest.Foo(element, moduleInfo.options);

			spyOn(this.factory, "getInstance").andReturn(mockModule);
			spyOn(mockModule, "init").andCallThrough();

			this.factory.createModule("ModuleFactoryTest.Foo", element, moduleInfo);

			expect(this.factory.getInstance).wasCalled();
			expect(mockModule.init).wasCalled();
		});

		it("prepends modules to the <body> by default", function() {
			var element = document.createElement("div");
			var moduleInfo = {};
			var module = this.factory.createModule("ModuleFactoryTest.Foo", element, moduleInfo);

			expect(module.element.nodeName).toEqual("DIV");
			expect(module.element).toStrictlyEqual(element);
			expect(module.element.parentNode.nodeName).toEqual("BODY");
			expect(document.body.firstChild).toStrictlyEqual(module.element);
			module.destructor();
		});

		it("appends modules to the bottom of the <body>", function() {
			var element = document.createElement("div");
			var moduleInfo = {
				insert: "bottom"
			};
			var module = this.factory.createModule("ModuleFactoryTest.Foo", element, moduleInfo);

			expect(module.element.nodeName).toEqual("DIV");
			expect(module.element).toStrictlyEqual(element);
			expect(module.element.parentNode.nodeName).toEqual("BODY");
			expect(document.body.lastChild).toStrictlyEqual(module.element);
			module.destructor();
		});

		it("appends modules based on a CSS selector", function() {
			var containerElement = document.createElement("section");
			containerElement.id = "__test__module_factory_container";
			containerElement.innerHTML = '<p>I am a teapot</p>';
			document.body.appendChild(containerElement);

			var element = document.createElement("div");
			var moduleInfo = {
				container: "section#__test__module_factory_container",
				insert: "bottom"
			};
			var module = this.factory.createModule("ModuleFactoryTest.Foo", element, moduleInfo);

			expect(module.element.parentNode).toStrictlyEqual(containerElement);
			expect(containerElement.lastChild).toStrictlyEqual(module.element);
			module.destructor();
			containerElement.parentNode.removeChild(containerElement);
		});

		it("prepends modules based on a CSS selector", function() {
			var containerElement = document.createElement("section");
			containerElement.id = "__test__module_factory_container";
			containerElement.innerHTML = '<p>I am a teapot</p>';
			document.body.appendChild(containerElement);

			var element = document.createElement("div");
			var moduleInfo = {
				container: "section#__test__module_factory_container"
			};
			var module = this.factory.createModule("ModuleFactoryTest.Foo", element, moduleInfo);

			expect(module.element.parentNode).toStrictlyEqual(containerElement);
			expect(containerElement.firstChild).toStrictlyEqual(module.element);
			module.destructor();
			containerElement.parentNode.removeChild(containerElement);
		});

		it("throws an error when the container selector returns no element", function() {
			var err;
			var element = document.createElement("div");
			var moduleInfo = {
				container: "#non_existent_id"
			};
			var module;

			try {
				module = this.factory.createModule("ModuleFactoryTest.Foo", element, moduleInfo);
			}
			catch (error) {
				err = error;
			}

			expect(err).toBeInstanceof(Error);
			expect( /Could not find module container/.test(err.message) ).toBeTrue();
		});

		it("creates the module element as any element", function() {
			var element = document.createElement("div");
			var moduleInfo = {
				element: "section"
			};
			var module = this.factory.createModule("ModuleFactoryTest.Foo", element, moduleInfo);

			expect(module.element.nodeName).toEqual("SECTION");
			module.destructor();
		});

		it("configures the new module with options", function() {
			var element = document.createElement("div");
			var moduleInfo = {
				options: {
					id: 123
				}
			};
			var module = this.factory.createModule("ModuleFactoryTest.Foo", element, moduleInfo);

			expect(module.options.id).toEqual(123);
		});

	});

	describe("createModules", function() {

		beforeEach(function() {
			this.element = document.createElement("div");
			this.factory = new ModuleFactory();
		});

		ModuleFactoryTest.Foo = Modules.Base.extend();
		ModuleFactoryTest.Bar = Modules.Base.extend();

		it("creates a single module", function() {
			var moduleInfo = {
				options: { id: 1 }
			};

			this.element.setAttribute("data-module", "ModuleFactoryTest.Foo");
			this.element.setAttribute("data-module-info", JSON.stringify(moduleInfo));

			var modules = this.factory.createModules(this.element);

			expect(modules.length).toEqual(1);
			expect(modules[0]).toBeInstanceof(ModuleFactoryTest.Foo);
			expect(modules[0].options.id).toEqual(1);
		});

		describe("creating modules in bulk", function() {

			it("gets module info based on the class name", function() {
				var moduleInfo = {
					"ModuleFactoryTest.Foo": {
						options: { id: 1 }
					},
					"ModuleFactoryTest.Bar": {
						options: { id: 2 }
					}
				};

				this.element.setAttribute("data-module", "ModuleFactoryTest.Foo ModuleFactoryTest.Bar");
				this.element.setAttribute("data-module-info", JSON.stringify(moduleInfo));

				var modules = this.factory.createModules(this.element);

				expect(modules.length).toEqual(2);
				expect(modules[0]).toBeInstanceof(ModuleFactoryTest.Foo);
				expect(modules[0].options.id).toEqual(1);
				expect(modules[1]).toBeInstanceof(ModuleFactoryTest.Bar);
				expect(modules[1].options.id).toEqual(2);

				modules[0].destructor();
				modules[1].destructor();
			});

			it("does not require module info specific to a class", function() {
				this.element.setAttribute("data-module", "ModuleFactoryTest.Foo ModuleFactoryTest.Bar");
				this.element.setAttribute("data-module-info", "{}");

				var modules = this.factory.createModules(this.element);

				expect(modules.length).toEqual(2);
				expect(modules[0]).toBeInstanceof(ModuleFactoryTest.Foo);
				expect(modules[1]).toBeInstanceof(ModuleFactoryTest.Bar);

				modules[0].destructor();
				modules[1].destructor();
			});

		});

	});

});
