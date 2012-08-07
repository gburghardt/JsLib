describe("Function", function() {
	describe("include", function() {
		it("includes a mixin with instance level methods", function() {
			var Mixin = {
				prototype: {
					foo: function() {
						return "foo";
					}
				}
			};
			var Klass = function() {};
			Klass.include(Mixin);
			var instance = new Klass();

			expect(Klass.prototype.hasOwnProperty("foo")).toBeTrue();
			expect(instance.foo).toBeFunction();
			expect(instance.foo()).toEqual("foo");
		});

		it("includes a mixin with class level methods", function() {
			var Mixin = {
				self: {
					bar: function() {
						return "bar";
					}
				}
			};
			var Klass = function() {};
			Klass.include(Mixin);

			expect(Klass.hasOwnProperty("bar")).toBeTrue();
			expect(Klass.bar()).toEqual("bar");
		});

		it("includes a mixin with both instance and class level methods", function() {
			var Mixin = {
				self: {
					bar: function() {
						return "bar";
					}
				},
				prototype: {
					foo: function() {
						return "foo";
					}
				}
			};
			var Klass = function() {};
			Klass.include(Mixin);
			var instance = new Klass();
			
			expect(Klass.hasOwnProperty("bar")).toBeTrue();
			expect(Klass.bar()).toEqual("bar");
			expect(Klass.prototype.hasOwnProperty("foo")).toBeTrue();
			expect(instance.foo).toBeFunction();
			expect(instance.foo()).toEqual("foo");
		});

		it("does not override instance level methods", function() {
			var Mixin = {
				prototype: {
					foo: function() {
						return "incorrect";
					}
				}
			};
			var Klass = function() {};
			Klass.prototype.foo = function() {
				return "foo";
			};
			Klass.include(Mixin);
			var instance = new Klass();

			expect(instance.foo).toEqual(Klass.prototype.foo);
			expect(instance.foo()).toEqual("foo");
		});

		it("does not override class level methods", function() {
			var Mixin = {
				self: {
					bar: function() {
						return "incorrect"
					}
				}
			};
			var Klass = function() {};
			Klass.bar = function() {
				return "bar";
			};
			Klass.include(Mixin);

			expect(Klass.bar).toNotEqual(Mixin.self.bar);
			expect(Klass.bar()).toEqual("bar");
		});
	});

	describe("extend", function() {
		xit("does not require parameters");
		xit("does not require a prototype");
		xit("does not require a self");
		xit("defines initialize() if omitted");
		xit("defines class level methods");
		xit("defines instance level methods");
		xit("includes a single mixin");
		xit("includes multiple mixins");
		xit("inherits from the parent class");
	});
});
