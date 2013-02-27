describe("Model", function() {

	describe("Persistence", function() {

		describe("included", function() {
			it("Adds options for persistence", function() {
				var Klass = function() {};
				Klass.include(Model.Persistence);
				expect(Klass.persistence).toBeObject();
				expect(Klass.persistence.types).toBeArray();
				expect(Klass.persistence.types.length).toEqual(0);
			});
		});

		describe("destroy", function() {
			it("calls the 'notFound' callback when already destroyed", function() {
				var model = new Model.Base();
				var callbacks = {
					notFound: function() {},
					destroyed: function() {}
				};

				model.destroyed = true;
				spyOn(callbacks, "notFound");
				spyOn(callbacks, "destroyed");
				spyOn(model, "doDestroy");
				model.destroy(this, callbacks);

				expect(model.doDestroy).wasNotCalled();
				expect(callbacks.notFound).wasCalled();
				expect(callbacks.destroyed).wasNotCalled();
			});

			it("calls destroyed", function() {
				var model = new Model.Base();
				var callbacks = {
					notFound: function() {},
					destroyed: function() {}
				};

				spyOn(callbacks, "notFound");
				spyOn(callbacks, "destroyed");
				spyOn(model, "doDestroy");
				model.destroy(this, callbacks);

				expect(model.doDestroy).wasCalled();
				expect(callbacks.notFound).wasNotCalled();
			});
		});

		describe("doDestroy", function() {});

		describe("save", function() {
			beforeEach(function() {
				this.model = new Model.Base();
			});

			it("invokes the invalid callback after being destroyed", function() {
				var callbacks = {
					saved: function() {},
					invalid: function() {}
				};
				spyOn(callbacks, "invalid");
				this.model.destroyed = true;
				this.model.save(this, callbacks);

				expect(callbacks.invalid).wasCalled();
			});

			it("validates locally before saving", function() {
				var callbacks = {
					saved: function() {},
					invalid: function() {}
				};
				spyOn(callbacks, "invalid");
				spyOn(this.model, "validate").andReturn(true);
				spyOn(this.model, "doSave");
				this.model.save(this, callbacks);

				expect(this.model.validate).wasCalled();
				expect(callbacks.invalid).wasNotCalled();
				expect(this.model.doSave).wasCalled();
			});

			it("invokes the invalid callback when local validation fails", function() {
				var errors = {id: ["is required"]};
				var errorMessages = {
					id: ["Id is required"]
				};
				var callbacks = {
					saved: function() {},
					invalid: function() {}
				};
				spyOn(callbacks, "invalid");
				spyOn(this.model, "validate").andReturn(false);
				spyOn(this.model, "doSave");
				spyOn(this.model, "getErrorMessages").andReturn(errorMessages);
				this.model.errors = errors;
				this.model.save(this, callbacks);

				expect(this.model.validate).wasCalled();
				expect(this.model.getErrorMessages).wasCalled();
				expect(callbacks.invalid).wasCalledWith(errorMessages);
				expect(this.model.doSave).wasNotCalled();
			});
		});

		describe("doSave", function() {});

	});

});
