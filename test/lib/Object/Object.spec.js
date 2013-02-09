describe("Object", function() {

	describe("Callbacks", function() {

		describe("compileCallbacks", function() {

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
					includes: Object.Callbacks,
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
					includes: Object.Callbacks
				});

				var o = new TestClass();
				o.initCallbacks();

				expect(o.callbackListeners).toBeEmptyObject();
			});

			it("compiles callbacks the first time a concrete class is instantiated", function() {
				var TestClass = Object.extend({
					includes: Object.Callbacks
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
					includes: Object.Callbacks
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
					includes: Object.Callbacks,
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
					includes: Object.Callbacks
				});

				var o = new TestClass();
				spyOn(o, "setUpCallbacks").andCallThrough();
				o.initCallbacks();

				expect(o.setUpCallbacks).wasCalled();
			});

		});

		describe("listen", function() {

			var TestClass = Object.extend({
				includes: Object.Callbacks
			});

			beforeEach(function() {
				this.obj = new TestClass();
				this.obj.initCallbacks();
			});

			afterEach(function() {
				this.obj.destroyCallbacks();
			});

			it("adds a callback function", function() {
				var fn = function() {};

				this.obj.listen("foo", fn);
				var listeners = this.obj.callbackListeners;

				expect(listeners.foo[0].context).toBeNull();
				expect(listeners.foo[0].callback).toStrictlyEqual(fn);
				expect(listeners.foo[0].type).toEqual("function");
			});

			it("adds a callback function with a context", function() {
				var fn = function() {};
				var context = {};

				this.obj.listen("foo", context, fn);
				var listeners = this.obj.callbackListeners;

				expect(listeners.foo[0].context).toStrictlyEqual(context);
				expect(listeners.foo[0].callback).toStrictlyEqual(fn);
				expect(listeners.foo[0].type).toEqual("function");
			});

			it("adds a callback by object and method name", function() {
				var context = {
					bar: function() {}
				};

				this.obj.listen("foo", context, "bar");
				var listeners = this.obj.callbackListeners;

				expect(listeners.foo[0].context).toStrictlyEqual(context);
				expect(listeners.foo[0].callback).toStrictlyEqual("bar");
				expect(listeners.foo[0].type).toEqual("string");
			});

			it("throws an error if a named method does not exist on the context", function() {
				var callbackContext;
				var listener = {};
				var callbackError;

				try {
					this.obj.listen("foo", listener, "handleFoo");
				}
				catch (error) {
					callbackError = error;
				}

				expect(callbackError).toBeInstanceof(Error);
				expect( /handleFoo is not a function/.test(callbackError.message) ).toBeTrue();
			});

		});

		describe("notify", function() {

			var TestClass = Object.extend({
				includes: Object.Callbacks
			});

			beforeEach(function() {
				this.obj = new TestClass();
				this.obj.initCallbacks();
			});

			afterEach(function() {
				this.obj.destroyCallbacks();
			});

			it("executes a callback function, setting the context to the window object", function() {
				var callbackContext;
				var callbackData;
				var fn = function(data) {
					callbackContext = this;
					callbackData = data;
				};

				this.obj.listen("test", fn);
				this.obj.notify("test", 10);

				expect(callbackData).toEqual(10);
				expect(callbackContext).toStrictlyEqual(window);
			});

			it("executes a callback function with a context", function() {
				var context = {};
				var callbackContext;
				var callbackData;
				var fn = function(data) {
					callbackContext = this;
					callbackData = data;
				};

				this.obj.listen("foo", context, fn);
				this.obj.notify("foo", 10);

				expect(callbackData).toEqual(10);
				expect(callbackContext).toStrictlyEqual(context);
			});

			it("executes a named method on an object", function() {
				var callbackContext;
				var listener = {
					handleFoo: function(data) {
						callbackContext = this;
					}
				};

				spyOn(listener, "handleFoo").andCallThrough();
				this.obj.listen("foo", listener, "handleFoo");
				this.obj.notify("foo", 10);

				expect(listener.handleFoo).wasCalledWith(10);
				expect(callbackContext).toStrictlyEqual(listener);
			});

			it("returns false if there are no listeners for a message", function() {
				expect( this.obj.notify("message_with_no_listeners", 10) ).toBeFalse();
			});

			it("returns true if all the listeners did not return false", function() {
				this.obj.listen("test", function() {
					return true;
				});
				this.obj.listen("test", function() {
					// return nothing
				});
				this.obj.listen("test", function() {
					return 0;
				});
				this.obj.listen("test", function() {
					return 100;
				});
				this.obj.listen("test", function() {
					return NaN;
				});
				this.obj.listen("test", function() {
					return undefined;
				});
				this.obj.listen("test", function() {
					return [];
				});
				this.obj.listen("test", function() {
					return {};
				});

				expect( this.obj.notify("test", 10) ).toBeTrue();
			});

			it("returns false if one of the listeners returns false", function() {
				this.obj.listen("test", function() {
					return true;
				});
				this.obj.listen("test", function() {
					return false;
				});
				this.obj.listen("test", function() {
					// return nothing
				});

				expect( this.obj.notify("test", 10) ).toBeFalse();
			});

			it("notifies all listeners up to and including the callback that returns false", function() {
				var context = {
					method1: function() {
						// return nothing
					},
					method2: function() {
						return false;
					},
					method3: function() {
						return true;
					}
				};

				spyOn(context, "method1").andCallThrough();
				spyOn(context, "method2").andCallThrough();
				spyOn(context, "method3").andCallThrough();

				this.obj.listen("test", context, "method1");
				this.obj.listen("test", context, "method2");
				this.obj.listen("test", context, "method3");

				var result = this.obj.notify("test", 10);

				expect(result).toBeFalse();
				expect(context.method1).wasCalledWith(10);
				expect(context.method2).wasCalledWith(10);
				expect(context.method3).wasNotCalled();
			});

		});

		describe("ignore", function() {

			var TestClass = Object.extend({
				includes: Object.Callbacks
			});

			beforeEach(function() {
				this.obj = new TestClass();
				this.obj.initCallbacks();
			});

			afterEach(function() {
				this.obj.destroyCallbacks();
			});

			it("does nothing if you ignore a message not currently listing to", function() {
				this.obj.ignore("message_with_no_listners", this);
			});

			it("removes a callback by message name for a function with no context", function() {
				var fnCalled = false;
				var fn = function() {
					fnCalled = true;
				};

				this.obj.listen("test", fn);
				expect(this.obj.callbackListeners.test.length).toEqual(1);

				this.obj.ignore("test", fn);
				expect(this.obj.callbackListeners.test.length).toEqual(0);

				this.obj.notify("test", 10);
				expect(fnCalled).toBeFalse();
			});

			it("removes a callback by message name for a context and function", function() {
				var context = {
					foo: function() {}
				};

				spyOn(context, "foo");

				this.obj.listen("test", context, context.foo);
				expect(this.obj.callbackListeners.test.length).toEqual(1);

				this.obj.ignore("test", context, context.foo);
				expect(this.obj.callbackListeners.test.length).toEqual(0);

				this.obj.notify("test", 10);
				expect(context.foo).wasNotCalled();
			});

			it("removes a callback by message name for an object", function() {
				var context = {
					handleTest: function() {},
					handleSomethingElse: function() {}
				};

				spyOn(context, "handleTest");
				spyOn(context, "handleSomethingElse");

				this.obj.listen("test", context, "handleTest");
				this.obj.listen("test", context, "handleSomethingElse");
				expect(this.obj.callbackListeners.test.length).toEqual(2);

				this.obj.ignore("test", context, "handleTest");
				expect(this.obj.callbackListeners.test.length).toEqual(1);

				this.obj.notify("test", 10);
				expect(context.handleTest).wasNotCalled();
				expect(context.handleSomethingElse).wasCalledWith(10);
			});

			it("removes multiple callbacks from the same message for an object instance", function() {
				var context = {
					method1: function() {},
					method2: function() {}
				};

				spyOn(context, "method1");
				spyOn(context, "method2");

				this.obj.listen("test", context, "method1");
				this.obj.listen("test", context, "method2");
				expect(this.obj.callbackListeners.test.length).toEqual(2);

				this.obj.ignore("test", context);
				expect(this.obj.callbackListeners.test.length).toEqual(0);

				this.obj.notify("test", 10);

				expect(context.method1).wasNotCalled();
				expect(context.method2).wasNotCalled();
			});

		});

	});

});
