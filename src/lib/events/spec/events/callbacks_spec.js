describe("Object", function() {

	describe("Callbacks", function() {

		describe("compileCallbacks", function() {

			it("creates an empty compiled callbacks object if a class does not define a callbacks object", function() {
				var TestClass = Object.extend({
					includes: Application.Callbacks
				});

				expect(TestClass.prototype).toNotHaveProperty("compiledCallbacks");

				var o = new TestClass();
				expect(TestClass.prototype).toNotHaveProperty("compiledCallbacks");

				o.initCallbacks();

				expect(TestClass.prototype).toHaveProperty("compiledCallbacks");
				expect(TestClass.prototype.compiledCallbacks).toBeEmptyObject();
			});

			it("compiles callbacks defined in a class", function() {
				var TestClass = Object.extend({
					includes: Application.Callbacks,
			
					prototype: {
						callbacks: {
							foo: ["add", "check"],
							bar: "validate"
						},
						add: function() {},
						check: function() {},
						validate: function() {}
					}
				});
			
				var o = new TestClass();
				o.initCallbacks();
				var callbacks = TestClass.prototype.compiledCallbacks;

				expect(TestClass.prototype).toHaveProperty("compiledCallbacks");
				expect( callbacks.foo.join() ).toEqual("add,check");
				expect( callbacks.bar.join() ).toEqual("validate");
			});

			it("merges the callbacks from the class hierarchy", function() {
				var ParentClass = Object.extend({
					includes: Application.Callbacks,
					prototype: {
						callbacks: {
							beforeSave: ["checkRequired", "checkSpelling"],
							afterSave: "clearForm"
						},
						checkRequired: function() {},
						checkSpelling: function() {},
						clearForm: function() {}
					}
				});

				var ChildClass = ParentClass.extend({
					prototype: {
						callbacks: {
							beforeSave: "generateTitle",
							afterSave: ["sendEmail", "showConfirmation"],
							beforeDestroy: "confirm"
						},
						generateTitle: function() {},
						sendEmail: function() {},
						showConfirmation: function() {},
						confirm: function() {}
					}
				});

				var obj1 = new ChildClass();
				var obj2 = new ParentClass();
				var callbacks1, callbacks2;

				expect(ParentClass.prototype).toNotHaveProperty("compiledCallbacks");
				expect(ChildClass.prototype).toNotHaveProperty("compiledCallbacks");

				obj1.initCallbacks();
				callbacks1 = obj1.compiledCallbacks;

				expect(ParentClass.prototype).toNotHaveProperty("compiledCallbacks");
				expect(ChildClass.prototype).toHaveProperty("compiledCallbacks");

				obj2.initCallbacks();
				callbacks2 = obj2.compiledCallbacks;

				expect(ParentClass.prototype).toHaveProperty("compiledCallbacks");
				expect(ChildClass.prototype).toHaveProperty("compiledCallbacks");

				expect( callbacks1.beforeSave.join()    ).toEqual("checkRequired,checkSpelling,generateTitle");
				expect( callbacks1.afterSave.join()     ).toEqual("clearForm,sendEmail,showConfirmation");
				expect( callbacks1.beforeDestroy.join() ).toEqual("confirm");

				expect( callbacks2.beforeSave.join() ).toEqual("checkRequired,checkSpelling");
				expect( callbacks2.afterSave.join()  ).toEqual("clearForm");
				expect( callbacks2.beforeDestroy     ).toBeUndefined();
			});

		});

		describe("initCallbacks", function() {

			it("sets up an empty listeners property", function() {
				var TestClass = Object.extend({
					includes: Application.Callbacks
				});

				var o = new TestClass();
				o.initCallbacks();

				expect(o.callbackListeners).toBeEmptyObject();
			});

			it("compiles callbacks the first time a concrete class is instantiated", function() {
				var TestClass = Object.extend({
					includes: Application.Callbacks
				});

				expect(TestClass.prototype).toNotHaveProperty("compiledCallbacks");

				var o = new TestClass();
				spyOn(o, "compileCallbacks").andCallThrough();
				o.initCallbacks();

				expect(o.compileCallbacks).wasCalled();
				expect(TestClass.prototype).toHaveProperty("compiledCallbacks");
			});

			it("does not recompile callbacks after the first instance is instantiated", function() {
				var TestClass = Object.extend({
					includes: Application.Callbacks
				});

				var obj1 = new TestClass();
				var obj2 = new TestClass();

				spyOn(obj1, "compileCallbacks").andCallThrough();
				spyOn(obj2, "compileCallbacks").andCallThrough();

				obj1.initCallbacks();
				obj2.initCallbacks();

				expect(obj1.compileCallbacks).wasCalled();
				expect(obj2.compileCallbacks).wasNotCalled();
			});

			it("adds callback listeners from the compiled callbacks", function() {
				var TestClass = Object.extend({
					includes: Application.Callbacks,
					prototype: {
						callbacks: {
							beforeSave: "foo",
							afterSave: ["bar", "baz"]
						},
						foo: function() {},
						bar: function() {},
						baz: function() {}
					}
				});

				var o = new TestClass();
				spyOn(o, "listen").andCallThrough();
				o.initCallbacks();

				expect(o.listen).wasCalledWith("beforeSave", o, "foo");
				expect(o.listen).wasCalledWith("afterSave", o, "bar");
				expect(o.listen).wasCalledWith("afterSave", o, "baz");
			});

			it("calls setUpCallbacks", function() {
				var TestClass = Object.extend({
					includes: Application.Callbacks
				});

				var o = new TestClass();
				spyOn(o, "setUpCallbacks").andCallThrough();
				o.initCallbacks();

				expect(o.setUpCallbacks).wasCalled();
			});

		});

	});

});
