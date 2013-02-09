describe("Object", function() {

	describe("Callbacks", function() {

		describe("initCallbacks", function() {

			it("creates an empty compiled callbacks object if a class does not define a callbacks object", function() {
				var TestClass = Object.extend({
					includes: Object.Callbacks
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
					includes: Object.Callbacks,
			
					prototype: {
						callbacks: {
							foo: ["add", "check"],
							bar: "validate"
						}
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
					includes: Object.Callbacks,
					prototype: {
						callbacks: {
							beforeSave: ["checkRequired", "checkSpelling"],
							afterSave: "clearForm"
						}
					}
				});

				var ChildClass = ParentClass.extend({
					prototype: {
						callbacks: {
							beforeSave: "generateTitle",
							afterSave: ["sendEmail", "showConfirmation"],
							beforeDestroy: "confirm"
						}
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

	});

});
