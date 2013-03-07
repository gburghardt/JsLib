describe("Model", function() {

	describe("Persistence", function() {

		describe("RestClient", function() {

			var MockModel = Model.Base.extend({
				prototype: {
					restClientOptions: {
						baseUrl: "/mock_model",
						rootElement: "mock_model"
					},
					schema: {
						name: "String",
						price: "Number"
					}
				}
			});

			it("creates RESTfull URIs", function() {
				var Klass = Model.Base.extend({
					prototype: {
						restClientOptions: { baseUrl: "/test" }
					}
				});
				var uri, model = new Klass({id: 123});

				uri = model.createRestClientUri("create", model.attributes);
				expect(uri.method).toEqual("POST");
				expect(uri.path).toEqual("/test");

				uri = model.createRestClientUri("update", model.attributes);
				expect(uri.method).toEqual("PUT");
				expect(uri.path).toEqual("/test/123");

				uri = model.createRestClientUri("destroy", model.attributes);
				expect(uri.method).toEqual("DELETE");
				expect(uri.path).toEqual("/test/123");

				uri = model.createRestClientUri("show", model.attributes);
				expect(uri.method).toEqual("GET");
				expect(uri.path).toEqual("/test/123");
			});

			it("allows for custom RESTfull URIs", function() {
				var Post = Model.Base.extend({
					prototype: {
						restClientOptions: {
							baseUrl: "/blog",
							create: "POST :baseUrl/:blog_id/posts",
							destroy: "DELETE :baseUrl/:blog_id/posts/:id",
							show: "GET :baseUrl/:blog_id/posts/:id",
							update: "PUT :baseUrl/:blog_id/posts/:id"
						},
						validAttributes: ['blog_id', 'title', 'body']
					}
				});
				var model = new Post({blog_id: 1, id: 23, name: "Testing"});
				var uri;

				uri = model.createRestClientUri("create", model.attributes);
				expect(uri.method).toEqual("POST");
				expect(uri.path).toEqual("/blog/1/posts");

				uri = model.createRestClientUri("update", model.attributes);
				expect(uri.method).toEqual("PUT", model.attributes);
				expect(uri.path).toEqual("/blog/1/posts/23");

				uri = model.createRestClientUri("destroy", model.attributes);
				expect(uri.method).toEqual("DELETE");
				expect(uri.path).toEqual("/blog/1/posts/23");

				uri = model.createRestClientUri("show", model.attributes);
				expect(uri.method).toEqual("GET");
				expect(uri.path).toEqual("/blog/1/posts/23");
			});

			describe("sendRestRequest", function() {

				beforeEach(function() {
					this.callbacks = {
						found: function() {},
						updated: function() {},
						created: function() {},
						destroyed: function() {},
						notModified: function() {},
						notAuthorized: function() {},
						notFound: function() {},
						timeout: function() {},
						conflict: function() {},
						unsupportedMediaType: function() {},
						invalid: function() {},
						error: function() {},
						complete: function() {}
					};

					for (var key in this.callbacks) {
						if (this.callbacks.hasOwnProperty(key)) {
							spyOn(this.callbacks, key);
						}
					}

					this.model = new MockModel();
					this.request = new Mock.XMLHttpRequest();
					spyOn(this.model, "createRequest").andReturn(this.request);
				});

				describe("for 200 OK responses", function() {

					beforeEach(function() {
						this.request.returnsStatus(200).returnsBody("OK");
					});

					it("executes the 'found' callback for a GET request", function() {
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(this.callbacks.found).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'updated' callback for a PUT request", function() {
						this.model.sendRestRequest("PUT", "/", null, null, this.callbacks);
						expect(this.callbacks.updated).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'created' callback for a POST request", function() {
						this.model.sendRestRequest("POST", "/", null, null, this.callbacks);
						expect(this.callbacks.created).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'destroyed' callback for a DELETE request", function() {
						this.model.sendRestRequest("DELETE", "/", null, null, this.callbacks);
						expect(this.callbacks.destroyed).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

				});

				describe("for 201 CREATED responses", function() {

					beforeEach(function() {
						this.request.returnsStatus(201).returnsBody("CREATED");
					});

					it("executes the 'created' callback for a POST", function() {
						this.model.sendRestRequest("POST", "/", null, null, this.callbacks);
						expect(this.callbacks.created).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'created' callback for a PUT", function() {
						this.model.sendRestRequest("PUT", "/", null, null, this.callbacks);
						expect(this.callbacks.created).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'created' callback for a GET", function() {
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(this.callbacks.created).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

				});

				describe("for 304 NOT MODIFIED responses", function() {

					beforeEach(function() {
						this.request.returnsStatus(304).returnsBody("NOT MODIFIED");
					});

					it("executes the 'notModified' callback", function() {
						this.model.sendRestRequest("HEAD", "/", null, null, this.callbacks);
						expect(this.callbacks.notModified).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

				});

				describe("for 4xx responses", function() {

					beforeEach(function() {
						this.request.returnsBody("CLIENT ERROR");
					});

					it("executes the 'notAuthorized' callback", function() {
						this.request.returnsStatus(401);
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(this.callbacks.notAuthorized).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'notFound' callback", function() {
						this.request.returnsStatus(404);
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(this.callbacks.notFound).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'timeout' callback if one exists", function() {
						this.request.returnsStatus(408);
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(this.callbacks.timeout).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("does not execute the 'timeout' callback if it doesn't exist", function() {
						this.request.returnsStatus(404);
						var callback = this.callbacks.timeout;
						this.callbacks.timeout = null;
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(callback).wasNotCalled();
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'conflict' callback if one exists", function() {
						this.request.returnsStatus(409);
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(this.callbacks.conflict).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("does not execute the 'timeout' callback if it doesn't exist", function() {
						this.request.returnsStatus(409);
						var callback = this.callbacks.conflict;
						this.callbacks.conflict = null;
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(callback).wasNotCalled();
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'unsupportedMediaType' callback if one exists", function() {
						this.request.returnsStatus(415);
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(this.callbacks.unsupportedMediaType).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("does not execute the 'unsupportedMediaType' callback if it doesn't exist", function() {
						this.request.returnsStatus(415);
						var callback = this.callbacks.unsupportedMediaType;
						this.callbacks.unsupportedMediaType = null;
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);
						expect(callback).wasNotCalled();
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

					it("executes the 'invalid' callback", function() {
						this.request.returnsStatus(422);
						this.model.sendRestRequest("POST", "/", null, null, this.callbacks);
						expect(this.callbacks.invalid).wasCalledWith(this.request);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});

				});

				describe("for 5xx responses", function() {

					it("executes the 'error' callback", function() {
						var error = null;
						this.callbacks.error = function(xhr, e) {
							error = e;
						};
						this.request.returnsStatus(500);

						spyOn(this.callbacks, "error").andCallThrough();
						this.model.sendRestRequest("GET", "/", null, null, this.callbacks);

						expect(this.callbacks.error).wasCalledWith(this.request, error);
						expect(this.callbacks.complete).wasCalledWith(this.request);
					});
					
				});

				it("executes the 'error' callback when another callback throws an error", function() {
					var error = new Error("Fake error");
					this.request.returnsStatus(200);
					this.callbacks.found = function(xhr) {
						throw error;
					};
					spyOn(this.callbacks, "found").andCallThrough();
					this.model.sendRestRequest("GET", "/", null, null, this.callbacks);

					expect(this.callbacks.found).wasCalledWith(this.request);
					expect(this.callbacks.error).wasCalledWith(this.request, error);
				});

			});

			describe("save", function() {

				beforeEach(function() {
					this.callbacks = {
						error: function() {},
						invalid: function() {},
						notAuthorized: function() {},
						notFound: function() {},
						saved: function() {},
						complete: function() {}
					};

					for (var key in this.callbacks) {
						if (this.callbacks.hasOwnProperty(key)) {
							spyOn(this.callbacks, key);
						}
					}

					this.model = new MockModel();
					this.request = new Mock.XMLHttpRequest();
					spyOn(this.model, "createRequest").andReturn(this.request);
				});

				it("calls the 'saved' callback", function() {
					this.request.returnsStatus(201);
					this.request.returnsBody('{"mock_model":{"id":1234}}');
					this.model.save(this, this.callbacks);

					expect(this.callbacks.saved).wasCalledWith(this.model, this.request);
					expect(this.model.id).toEqual(1234);
				});

				it("calls the 'invalid' callback", function() {
					this.request.returnsStatus(422);
					this.request.returnsBody('{"errors":{"name":["Name is required"]}}');

					this.model.save(this, this.callbacks);
					expect(this.callbacks.invalid).wasCalledWith(this.model, this.request);
					expect(this.model.errors.get("name")).toBeArray();
					expect(this.model.errors.get("name")[0]).toEqual("Name is required");
				});

				it("calls the 'notFound' callback", function() {
					this.request.returnsStatus(404);
					this.request.returnsBody("Not Found");

					this.model.save(this, this.callbacks);
					expect(this.callbacks.notFound).wasCalledWith(this.model, this.request);
				});

				describe("when authorization is required", function() {

					beforeEach(function() {
						this.request.returnsStatus(401);
					});

					it("calls the 'notAuthorized' callback if one exists", function() {
						this.model.save(this, this.callbacks);

						expect(this.callbacks.notAuthorized).wasCalledWith(this.model, this.request);
						expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
						expect(this.model.errors.length).toEqual(1);
						expect(this.model.errors.get("base")[0]).toBeString();
					});

					it("calls the 'invalid' callback if one exists", function() {
						this.callbacks.notAuthorized = null;
						this.model.save(this, this.callbacks);

						expect(this.callbacks.invalid).wasCalledWith(this.model, this. request);
						expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
						expect(this.model.errors.length).toEqual(1);
						expect(this.model.errors.get("base")[0]).toBeString();
					});

					it("calls the 'error' callback if neither the 'notAuthorized' nor 'invalid' callbacks exist", function() {
						var e;
						this.callbacks.error = function(model, xhr, error) {
							e = error;
						};
						spyOn(this.callbacks, "error").andCallThrough();
						this.callbacks.notAuthorized = null;
						this.callbacks.invalid = null;
						this.model.save(this, this.callbacks);

						expect(this.callbacks.error).wasCalledWith(this.model, this. request, e);
						expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
						expect(this.model.errors.length).toEqual(1);
						expect(this.model.errors.get("base")[0]).toBeString();
					});

				});

				it("calls the 'error' callback when something catastrophic goes wrong", function() {
					this.request.returnsStatus(500);
					this.request.returnsBody("Boom goes the dynamite!");

					this.callbacks.error = function(model, xhr, error) {
						expect(model).toStrictlyEqual(this.model);
						expect(xhr).toStrictlyEqual(this.request);
						expect(error).toBeInstanceof(Error);
						expect( (/^Unhandled rest client error 500/).test(error.message) ).toBeTrue();
					};

					spyOn(this.callbacks, "error").andCallThrough();

					this.model.save(this, this.callbacks);

					expect(this.callbacks.error).wasCalled();
				});

				it("calls the 'error' callback when another callback throws an error", function() {
					this.error = new Error("Just testing");
					this.request.returnsStatus(200);
					this.request.returnsBody('{"mock_model":{"id":234}}');

					this.callbacks.saved = function(model, xhr) {
						throw this.error;
					};

					this.model.save(this, this.callbacks);
					expect(this.callbacks.error).wasCalledWith(this.model, this.request, this.error);
				});

			});

			describe("destroy", function() {

				beforeEach(function() {
					this.callbacks = {
						error: function() {},
						invalid: function() {},
						notFound: function() {},
						destroyed: function() {},
						complete: function() {},
						notAuthorized: function() {}
					};

					for (var key in this.callbacks) {
						if (this.callbacks.hasOwnProperty(key)) {
							spyOn(this.callbacks, key);
						}
					}

					this.model = new MockModel();
					this.request = new Mock.XMLHttpRequest();
					spyOn(this.model, "createRequest").andReturn(this.request);
				});

				it("calls the 'destroyed' callback when destroying a resource that exists", function() {
					this.request.returnsStatus(200);
					this.model.destroy(this, this.callbacks);

					expect(this.callbacks.destroyed).wasCalledWith(this.model, this.request);
					expect(this.model.destroyed).toBeTrue();
					expect(this.model.persisted).toBeFalse();
				});

				describe("when authorization is required", function() {

					beforeEach(function() {
						this.request.returnsStatus(401);
					});

					it("calls the 'notAuthorized' callback if one exists", function() {
						this.model.destroy(this, this.callbacks);

						expect(this.callbacks.notAuthorized).wasCalledWith(this.model, this.request);
						expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
						expect(this.model.valid).toBeFalse();
						expect(this.model.errors.length).toEqual(1);
						expect(this.model.errors.get("base")[0]).toEqual("You must be logged in to complete this operation.");
					});

					it("calls the 'invalid' callback if one exists", function() {
						this.callbacks.notAuthorized = null;
						this.model.destroy(this, this.callbacks);

						expect(this.callbacks.invalid).wasCalledWith(this.model, this.request);
						expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
						expect(this.model.valid).toBeFalse();
						expect(this.model.errors.length).toEqual(1);
						expect(this.model.errors.get("base")[0]).toEqual("You must be logged in to complete this operation.");
					});

					it("calls the 'error' callback if neither the 'notAuthorized' nor 'invalid' callbacks exist.", function() {
						var e;
						this.callbacks.notAuthorized = null;
						this.callbacks.invalid = null;
						this.callbacks.error = function(model, xhr, error) {
							e = error;
						};
						spyOn(this.callbacks, "error").andCallThrough();
						this.model.destroy(this, this.callbacks);

						expect(this.callbacks.error).wasCalledWith(this.model, this.request, e);
						expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
						expect(this.model.valid).toBeFalse();
						expect(this.model.errors.length).toEqual(1);
						expect(this.model.errors.get("base")[0]).toEqual("You must be logged in to complete this operation.");
					});

				});

				it("calls the 'invalid' callback and sets errors", function() {
					this.request.returnsStatus(422);
					this.request.returnsBody('{"errors":{"id":["Id is missing"]}}');
					this.model.destroy(this, this.callbacks);

					expect(this.callbacks.invalid).wasCalledWith(this.model, this.request);
					expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
					expect(this.model.valid).toBeFalse();
					expect(this.model.errors.length).toEqual(1);
					expect(this.model.errors.get("id")[0]).toEqual("Id is missing");
				});

				it("calls the 'notFound' callback when destroying a resource that doesn't exist", function() {
					this.request.returnsStatus(404);
					this.model.destroy(this, this.callbacks);

					expect(this.callbacks.notFound).wasCalledWith(this.model, this.request);
					expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
				});

				it("calls the 'error' callback when a catestrophic error occurs and adds an error to 'base'", function() {
					this.request.returnsStatus(500);
					this.model.destroy(this, this.callbacks);

					expect(this.callbacks.error).wasCalledWith(this.model, this.request);
					expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
				});

			});

			describe("load", function() {

				beforeEach(function() {
					this.callbacks = {
						found: function() {},
						error: function() {},
						invalid: function() {},
						notFound: function() {},
						complete: function() {},
						notAuthorized: function() {}
					};

					for (var key in this.callbacks) {
						if (this.callbacks.hasOwnProperty(key)) {
							spyOn(this.callbacks, key);
						}
					}

					this.model = new MockModel({id: 1234});
					this.request = new Mock.XMLHttpRequest();
					spyOn(this.model, "createRequest").andReturn(this.request);
				});

				it("calls the 'found' callback and sets attributes if the resource was found", function() {
					this.request.returnsStatus(200);
					this.request.returnsBody('{"mock_model":{"name":"Test","price":12.99}}');
					this.model.load(this, this.callbacks);

					expect(this.callbacks.found).wasCalledWith(this.model, this.request);
					expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
					expect(this.model.persisted).toBeTrue();
					expect(this.model.destroyed).toBeFalse();
					expect(this.model.name).toEqual("Test");
					expect(this.model.price).toEqual(12.99);
				});

				it("throws an error if no primary key exists", function() {
					this.model.id = null;
					spyOn(this.request, "send").andCallThrough();

					expect(function() {
						this.model.load(this, this.callbacks);
					}).toThrowError();

					expect(this.request.send).wasNotCalled();
					expect(this.callbacks.complete).wasNotCalled();
				});

				it("calls the 'notFound' callback if the resource was not found", function() {
					this.request.returnsStatus(404);
					this.model.load(this, this.callbacks);

					expect(this.callbacks.notFound).wasCalledWith(this.model, this.request);
					expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
					expect(this.model.persisted).toBeFalse();
				});

				describe("when authentication is required", function() {

					beforeEach(function() {
						this.request.returnsStatus(401);
					});

					it("calls the 'notAuthorized' callback if one exists", function() {
						this.model.load(this, this.callbacks);

						expect(this.callbacks.notAuthorized).wasCalledWith(this.model, this.request);
						expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
					});

					it("calls the 'invalid' callback if one exists", function() {
						this.callbacks.notAuthorized = null;
						this.model.load(this, this.callbacks);

						expect(this.callbacks.invalid).wasCalledWith(this.model, this.request);
						expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
					});

					it("calls the 'error' callback if neither the 'notAuthorized' nor 'invalid' callbacks exist", function() {
						var e;
						this.callbacks.notAuthorized = null;
						this.callbacks.invalid = null;
						this.callbacks.error = function(model, xhr, error) {
							e = error;
						};
						spyOn(this.callbacks, "error").andCallThrough();
						this.model.load(this, this.callbacks);

						expect(this.callbacks.error).wasCalledWith(this.model, this.request, e);
						expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
					});

				});

				it("calls the 'error' callback if something catestrophic goes wrong", function() {
					var e;

					this.callbacks.error = function(model, xhr, error) {
						e = error;
					};
					spyOn(this.callbacks, "error").andCallThrough();
					this.request.returnsStatus(500);
					this.model.load(this, this.callbacks);

					expect(this.callbacks.error).wasCalledWith(this.model, this.request, e);
					expect(this.callbacks.complete).wasCalledWith(this.model, this.request);
				});

			});

		});

	});

});
