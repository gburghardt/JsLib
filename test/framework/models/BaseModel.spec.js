describe("BaseModel", function() {

	describe("extend", function() {
		it("gives child classes their own instances hash", function() {
			var ChildModel = BaseModel.extend();
			expect(ChildModel.instances).toStrictlyNotEqual(BaseModel.instances);
		});

		it("adds callbacks around method calls", function() {
			var ChildModel = BaseModel.extend({
				callbacks: {
					addCallbackTest: function() {
						
					}
				}
			});
			expect(BaseModel.callbacks.addCallbackTest.length).toEqual(1);
		});
	});

	describe("include", function() {
		it("extends the prototype of BaseModel", function() {
			var module = {
				prototype: {
					foo: function() {
						return 'bar';
					}
				}
			};
			BaseModel.include(module);
			expect(BaseModel.prototype.hasOwnProperty('foo')).toBeTrue();
			expect(BaseModel.prototype.foo).toEqual(module.prototype.foo);
			expect(BaseModel.prototype.foo()).toEqual('bar');
		});

		it("adds callbacks around method calls", function() {
			var module = {
				callbacks: {
					foo: function() {
						return 'foo';
					}
				}
			};
			BaseModel.include(module);
			expect(BaseModel.callbacks.hasOwnProperty("foo")).toBeTrue();
			expect(BaseModel.callbacks.foo).toBeInstanceof(Array);
			expect(BaseModel.callbacks.foo.length).toEqual(1);
		});
	});

	describe("applyModuleCallbacks", function() {
		xit("should be tested");
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
			spyOn(this.model, "publish");
			this.model.setAttribute("firstName", "Bob");
			this.model.setAttribute("firstName", "Jane");
			expect(this.model.publish).toHaveBeenCalledWith("attribute:firstName:changed");
		});

		it("sets newRecord to false when setting the primary key for the first time", function() {
			expect(this.model.newRecord).toBeTrue();
			this.model.setAttribute("id", 1234);
			expect(this.model.newRecord).toBeFalse();
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

	describe("valid attributes", function() {
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
		});

		it("publishes attributes:changed", function() {
			var o = new TestModelAttributes();
			spyOn(o, "publish");
			o.attributes = {firstName: "Joey"};
			expect(o.publish).wasNotCalled();
			o.attributes = {firstName: "Billy"};
			expect(o.publish).toHaveBeenCalledWith("attribute:firstName:changed");
			expect(o.publish).toHaveBeenCalledWith("attributes:changed");
		});

		it("sets newRecord to false when the primary key is added", function() {
			var o = new TestModelAttributes();
			expect(o.newRecord).toBeTrue();
			o.attributes = {id: 1234};
			expect(o.newRecord).toBeFalse();
		});
	});

	describe("mergePropertyChain", function() {
		it("does not require arguments", function() {
			
		});
	});

	describe("subscribe", function() {
		beforeEach(function() {
			this.model = new TestModelAttributes();

			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.destructor();
			}

			BaseModel.dispatcher = new events.Dispatcher();
		});

		it("accepts an event name, an object, and the name of a method to call", function() {
			var called = false;
			var test = this;
			var subscriber = {
				callback: function(event, model) {
					expect(event).toBeInstanceof(events.Event);
					expect(model).toEqual(test.model);
				}
			};
			spyOn(subscriber, "callback");
			this.model.subscribe("test", subscriber, "callback");
			this.model.publish("test");
			expect(subscriber.callback).toHaveBeenCalled();
		});

		it("allows the same subscriber to subscribe more than once", function() {
			var subscriber = {
				callback: function() {
					
				}
			};
			spyOn(subscriber, "callback");
			this.model.subscribe("test", subscriber, "callback");
			this.model.subscribe("test", subscriber, "callback");
			this.model.publish("test");
			expect(subscriber.callback.callCount).toEqual(2);
		});

		it("subscribes to handleEvent if not callback is provided", function() {
			var subscriber = {
				handleEvent: function() {}
			};
			spyOn(subscriber, "handleEvent");
			var model = this.model;
			this.model.subscribe("test", subscriber);
			expect(BaseModel.dispatcher.subscribers.test.length).toEqual(1);
			this.model.publish("test");
			expect(subscriber.handleEvent).toHaveBeenCalled();
		});
	});

	describe("unsubscribe", function() {
		beforeEach(function() {
			this.model = new TestModelAttributes();

			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.destructor();
			}

			BaseModel.dispatcher = new events.Dispatcher();
		});

		it("removes a subscriber matching event name and callback function", function() {
			var callback = function() {};
			this.model.subscribe("test", callback);
			expect(BaseModel.dispatcher.subscribers.test.length).toEqual(1);
			this.model.unsubscribe("test", callback);
			expect(BaseModel.dispatcher.subscribers.test.length).toEqual(0);
		});

		it("removes a subscriber matching event name, object instance, and callback function", function() {
			var subscriber = {
				callback: function() {}
			};
			this.model.subscribe("test", subscriber, subscriber.callback);
			expect(BaseModel.dispatcher.subscribers.test.length).toEqual(1);
			this.model.unsubscribe("test", subscriber, subscriber.callback);
			expect(BaseModel.dispatcher.subscribers.test.length).toEqual(0);
		});

		it("removes a subscriber matching event name, object instance and callback method name", function() {
			var subscriber = {
				callback: function() {}
			};
			this.model.subscribe("test", subscriber, "callback");
			expect(BaseModel.dispatcher.subscribers.test.length).toEqual(1);
			this.model.unsubscribe("test", subscriber, "callback");
			expect(BaseModel.dispatcher.subscribers.test.length).toEqual(0);
		});
	});

});
