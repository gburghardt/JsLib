describe("http.ScriptTransport", function() {
	beforeEach(function() {
		this.transport = new http.ScriptTransport();
	});

	describe("to support the XMLHTTPRequest interface", function() {
		it("sets request headers", function() {
			this.transport.setRequestHeader("foo", "bar");
			expect(this.transport.getRequestHeader("foo")).toEqual("bar");
		});

		it("has a responseText property", function() {
			expect(this.transport.hasOwnProperty("responseText")).toBeTrue();
		});

		it("has a responseXML property", function() {
			expect(this.transport.hasOwnProperty("responseXML")).toBeTrue();
		});

		it("has a response property", function() {
			expect(this.transport.hasOwnProperty("response")).toBeTrue();
		});
	});

	it("sets the content-type header to text/json by default", function() {
		expect(this.transport.getRequestHeader("content-type")).toEqual("text/json");
	});

	it("gets the request headers, case insensitive", function() {
		expect(this.transport.getRequestHeader("Content-Type")).toEqual(this.transport.getRequestHeader("content-type"));
	});

	it("sets the request header, case insensitive", function() {
		this.transport.setRequestHeader("Foo", "bar");
		expect(this.transport.getRequestHeader("foo")).toEqual("bar");
	});

	describe("getRequestURL", function() {
		xit("adds a callback parameter");
		xit("replaces the callback parameter");
		xit("adds a query string");
		xit("appends the params to a URL with a query string");
	});
});
