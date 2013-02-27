describe("BaseModel", function() {

	describe("Persistence", function() {

		describe("RestClient", function() {

			it("creates RESTfull URIs", function() {
				var Klass = BaseModel.extend({
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
				var Post = BaseModel.extend({
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

		});

	});

});
