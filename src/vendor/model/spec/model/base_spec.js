describe("Model", function() {

	describe("Base", function() {

		TestModel = Model.Base.extend();

		TestModelPrimaryKeyOverride = Model.Base.extend({
			prototype: {
				primaryKey: "foo_id"
			}
		});

		TestModelAttributes = Model.Base.extend({
			prototype: {
				schema: {
					firstName: "String",
					lastName: "String",
					typeId: "Number",
					employed: "Boolean",
					createdAt: "Date"
				}
			}
		});

		describe("extend", function() {
			it("gives child classes their own instances hash", function() {
				var ChildModel = Model.Base.extend();
				expect(ChildModel.instances).toStrictlyNotEqual(Model.Base.instances);
			});
		});

		describe("include", function() {
			it("extends the prototype of Model.Base", function() {
				var module = {
					prototype: {
						foo: function() {
							return 'bar';
						}
					}
				};
				Model.Base.include(module);
				expect(Model.Base.prototype.hasOwnProperty('foo')).toBeTrue();
				expect(Model.Base.prototype.foo).toEqual(module.prototype.foo);
				expect(Model.Base.prototype.foo()).toEqual('bar');
			});
		});

		it("defines a primary key by default", function() {
			var o = new TestModel();
			expect(o.isValidAttributeKey("id")).toEqual(true);
			expect(o.id).toBeNull();
		});

		it("allows sub classes to override the primary key", function() {
			var o = new TestModelPrimaryKeyOverride();
			expect(o.isValidAttributeKey("foo_id")).toEqual(true);
			expect(o.foo_id).toBeNull();
		});

		it("sets newRecord to true when instantiated with no primary key", function() {
			var model = new TestModelAttributes();
			expect(model.newRecord).toBeTrue();
		});

		describe("getAttribute", function() {
			beforeEach(function() {
				this.model = new TestModelAttributes();
			});

			it("returns null when the key is undefined", function() {
				expect(this.model.firstName).toBeNull();
			});

			it("returns null when the key is null", function() {
				this.model.firstName = null;
				expect(this.model.firstName).toBeNull();
			});

			it("returns the attribute value at the given key", function() {
				this.model.firstName = "Joe";
				expect(this.model.firstName).toEqual("Joe");
			});
		});

		describe("setAttribute", function() {

			beforeEach(function() {
				this.model = new TestModelAttributes();
			});

			it("sets a null value", function() {
				this.model.setAttribute("firstName", null);
				expect(this.model.getAttribute("firstName")).toBeNull();
				expect(this.model.changedAttributes.firstName).toBeUndefined();
			});

			it("sets a non null value", function() {
				this.model.setAttribute("firstName", "Joey");
				expect(this.model.getAttribute("firstName")).toEqual("Joey");
				expect(this.model.changedAttributes.firstName).toBeUndefined();
			});

			it("sets the changed attributes for non null values", function() {
				this.model.setAttribute("firstName", "Joey");
				this.model.setAttribute("firstName", "Eddy");
				expect(this.model.getAttribute("firstName")).toEqual("Eddy");
				expect(this.model.changedAttributes.firstName).toEqual("Joey");
			});

			it("sets the changed attributes to null", function() {
				this.model.setAttribute("firstName", null);
				this.model.setAttribute("firstName", "Billy");
				expect(this.model.changedAttributes.firstName).toBeNull();
			});

			it("publishes attribute:<key>:changed", function() {
				spyOn(this.model, "publish").andCallThrough();
				this.model.setAttribute("firstName", "Bob");
				this.model.setAttribute("firstName", "Jane");
				expect(this.model.publish).wasCalledWith("attribute.firstName.changed");
			});

			it("sets newRecord to false when setting the primary key for the first time", function() {
				expect(this.model.newRecord).toBeTrue();
				this.model.setAttribute("id", 1234);
				expect(this.model.newRecord).toBeFalse();
			});

			it("converts values to numbers for Number attributes", function() {
				this.model.typeId = "42";
				expect(this.model.typeId).toStrictlyEqual(42);

				this.model.typeId = "42.5";
				expect(this.model.typeId).toStrictlyEqual(42.5);

				this.model.typeId = NaN;
				expect(isNaN(this.model.typeId)).toBeTrue();

				this.model.typeId = "42.5 million";
				expect(isNaN(this.model.typeId)).toBeTrue();
			});

			it("converts values to strings for String attributes", function() {
				this.model.setAttribute("firstName", 39);
				expect(this.model.firstName).toStrictlyEqual("39");

				this.model.setAttribute("firstName", NaN);
				expect(this.model.firstName).toStrictlyEqual("NaN");

				this.model.setAttribute("firstName", true);
				expect(this.model.firstName).toStrictlyEqual("true");
			});

			it("converts boolean-like strings and values to true or false", function() {
				var values =         ["true", "false", "foo", "0",   "1",  "TruE", "TRUE", NaN,   0,     1];
				var expectedValues = [ true,   false,   false, false, true, true,   true,  false, false, true];

				for (var i = 0, length = values.length; i < length; i++) {
					this.model.setAttribute("employed", values[i]);
					expect(this.model.employed).toStrictlyEqual(expectedValues[i]);
				}
			});

			it("converts date strings to Date objects", function() {
				this.model.createdAt = "2013/02/20";
				expect(this.model.createdAt).toBeInstanceof(Date);
			});

			it("keeps Date objects as Date objects", function() {
				var date = new Date();
				this.model.createdAt = date;
				expect(this.model.createdAt).toStrictlyEqual(date);
			});

			it("maintains null values for all attribute types", function() {
				this.model.attributes = {typeId: 23, firstName: "Test", lastName: "Test", employed: true};

				expect(this.model.typeId).toEqual(23);
				expect(this.model.firstName).toEqual("Test");
				expect(this.model.lastName).toEqual("Test");
				expect(this.model.employed).toBeTrue();

				this.model.setAttribute("typeId", null);
				this.model.setAttribute("firstName", null);
				this.model.setAttribute("lastName", null);
				this.model.setAttribute("employed", null);

				expect(this.model.typeId).toBeNull();
				expect(this.model.firstName).toBeNull();
				expect(this.model.lastName).toBeNull();
				expect(this.model.employed).toBeNull();

				this.model.setAttribute("typeId", undefined);
				this.model.setAttribute("firstName", undefined);
				this.model.setAttribute("lastName", undefined);
				this.model.setAttribute("employed", undefined);

				expect(this.model.typeId).toBeNull();
				expect(this.model.firstName).toBeNull();
				expect(this.model.lastName).toBeNull();
				expect(this.model.employed).toBeNull();
			});

			it("converts unknown data types to strings", function() {
				var BadClass = Model.Base.extend({
					prototype: {
						schema: {
							bad: "Yada"
						}
					}
				});

				var o = new BadClass();
				o.setAttribute("bad", 12);
				expect(o.bad).toEqual("12");
				o.setAttribute("bad", NaN);
				expect(o.bad).toEqual("NaN");
			});

		});

		describe("setAttributes", function() {

			beforeEach(function() {
				this.model = new TestModelAttributes();
			});

			it("publishes attributes.changed", function() {
				spyOn(this.model, "publish").andCallThrough();
				this.model.setAttributes({firstName: "Test", lastName: "Foo"});
				expect(this.model.publish).wasNotCalled();

				this.model.setAttributes({firstName: "Jane", lastName: "Doe"});
				expect(this.model.publish).wasCalledWith( "attributes.changed", { attributes: [ "firstName", "lastName" ] } );
			});

		});

		describe("valueIsEmpty", function() {
			beforeEach(function() {
				this.model = new TestModel();
			});

			it("returns true for null values", function() {
				expect(this.model.valueIsEmpty(null)).toEqual(true);
			});

			it("returns true for undefined values", function() {
				var foo;
				expect(this.model.valueIsEmpty(foo)).toEqual(true);
			});

			it("returns false for NaN values", function() {
				expect(this.model.valueIsEmpty(NaN)).toBeFalse();
			});

			it("returns true for empty strings", function() {
				expect(this.model.valueIsEmpty("")).toEqual(true);
			});

			it("returns true for strings containing only white space characters", function() {
				expect(this.model.valueIsEmpty("	\t	")).toEqual(true);
			});

			it("returns true for empty arrays", function() {
				expect(this.model.valueIsEmpty( [] )).toEqual(true);
			});

			it("returns false for everything else", function() {
				expect(this.model.valueIsEmpty( "abc" )).toEqual(false);
				expect(this.model.valueIsEmpty( 0 )).toEqual(false);
				expect(this.model.valueIsEmpty( -1 )).toEqual(false);
				expect(this.model.valueIsEmpty( 1 )).toEqual(false);
				expect(this.model.valueIsEmpty( {} )).toEqual(false);
				expect(this.model.valueIsEmpty( function() {} )).toEqual(false);
				expect(this.model.valueIsEmpty( true )).toEqual(false);
				expect(this.model.valueIsEmpty( false )).toEqual(false);
			});
		});

		describe("isValidAttributeKey", function() {
			it("returns false for invalid attributes", function() {
				var o = new TestModelAttributes();
				expect(o.isValidAttributeKey("non_existent")).toEqual(false);
				expect(o.isValidAttributeKey("Name")).toEqual(false);
			});

			it("returns true for valid attributes", function() {
				var o = new TestModelAttributes();
				expect(o.isValidAttributeKey("firstName")).toEqual(true);
				expect(o.isValidAttributeKey("lastName")).toEqual(true);
				expect(o.isValidAttributeKey("id")).toEqual(true);
			});
		});

		describe("initAttributes", function() {

			var Klass = Model.Base.extend({
				prototype: {
					schema: { name: "String" }
				}
			});

			it("compiles the schema when first instantiated", function() {
				expect(Klass.attributesInitialized).toBeFalse();
				expect(Klass.prototype.hasOwnProperty("compiledSchema")).toBeFalse();

				var instance = new Klass();

				expect(Klass.attributesInitialized).toBeTrue();
				expect(Klass.prototype.hasOwnProperty("compiledSchema")).toBeTrue();
			});

			it("does not recompile the schema with subsequent instances", function() {
				var compiledSchema = Klass.prototype.compiledSchema;
				var instance = new Klass();

				expect(Klass.prototype.compiledSchema).toStrictlyEqual(compiledSchema);
			});

		});

		describe("initialize", function() {
			it("assigns attributes", function() {
				var o = new TestModelAttributes({id: 123, firstName: "John", lastName: "Doe"});
				expect(o.id).toEqual(123);
				expect(o.firstName).toEqual("John");
				expect(o.lastName).toEqual("Doe");
			});

			it("ignores invalid attributes", function() {
				var o = new TestModelAttributes({id: 123, invalidAttr: "foo"});
				expect(o.hasOwnProperty("invalidAttr")).toEqual(false);
				expect(o.invalidAttr).toBeUndefined();
			});

			it("does not require attributes", function() {
				expect(function() {
					var o = new TestModelAttributes();
				}).not.toThrow(Error);
			});
		});

		describe("attributes", function() {

			describe("getters", function() {
				it("return null when no attribute was given", function() {
					var o = new TestModelAttributes();
					expect(o.id).toBeNull();
					expect(o.firstName).toBeNull();
					expect(o.lastName).toBeNull();
				});

				it("return the value", function() {
					var o = new TestModelAttributes({id: 123});
					expect(o.id).toEqual(123);
					expect(o.firstName).toBeNull();
					expect(o.lastName).toBeNull();
				});
			});

			describe("setters", function() {

				it("put entries in the changedAttributes", function() {
					var o = new TestModelAttributes({firstName: "Fred"});
					expect(o.changedAttributes.id).toBeUndefined();
					expect(o.changedAttributes.firstName).toBeUndefined();
					o.id = 123;
					o.firstName = "Joe";
					expect(o.id).toEqual(123);
					expect(o.firstName).toEqual("Joe");
					expect(o.changedAttributes.id).toBeUndefined();
					expect(o.changedAttributes.firstName).toEqual("Fred");
				});

				it("publishes attributes.changed", function() {
					var o = new TestModelAttributes();
					spyOn(o, "publish");
					o.attributes = {firstName: "Joey", lastName: "Smith"};
					expect(o.publish).wasNotCalled();
					o.firstName = "Billy";
					o.lastName = "Bob";

					expect(o.publish).wasCalledWith( "attribute.firstName.changed" );
					expect(o.publish).wasCalledWith( "attribute.lastName.changed");
					expect(o.publish).wasCalledWith( "attributes.changed", { attributes: [ "firstName" ] } );
					expect(o.publish).wasCalledWith( "attributes.changed", { attributes: [ "lastName" ] } );
				});

			});

			it("sets newRecord to false when the primary key is added", function() {
				var o = new TestModelAttributes();
				expect(o.newRecord).toBeTrue();
				o.attributes = {id: 1234};
				expect(o.newRecord).toBeFalse();
			});
		});

		describe("child classes", function() {

			it("combines the schemas of all parent classes", function() {
				var ParentClass = Model.Base.extend({
					prototype: {
						schema: {name: "String", description: "String"}
					}
				});

				var ChildClass = ParentClass.extend({
					prototype: {
						schema: {price: "Number", quantity: "Number"}
					}
				});

				expect(ChildClass.prototype.hasOwnProperty("compiledAttributes")).toBeFalse();

				var child = new ChildClass({name: "Testing", description: "Just a test", price: 33.99, quantity: 10});

				expect(ParentClass.prototype.hasOwnProperty("compiledSchema")).toBeFalse();
				expect(ChildClass.prototype.hasOwnProperty("compiledSchema")).toBeTrue();
				expect(ChildClass.prototype.hasOwnProperty("name")).toBeTrue();
				expect(ChildClass.prototype.hasOwnProperty("description")).toBeTrue();
				expect(ChildClass.prototype.hasOwnProperty("price")).toBeTrue();
				expect(ChildClass.prototype.hasOwnProperty("quantity")).toBeTrue();
				expect(ChildClass.prototype.hasOwnProperty("id")).toBeTrue();
				expect(child.name).toEqual("Testing");
				expect(child.description).toEqual("Just a test");
				expect(child.price).toEqual(33.99);
				expect(child.quantity).toEqual(10);
			});

		});

	});

});
