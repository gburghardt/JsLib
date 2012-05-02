describe("http.Request", function() {
	describe("serializeData", function() {
		beforeEach(function() {
			this.request = new http.Request();
		});

		it("joins an array", function() {
			var array = ["id=3","name=Dave"];
			var expectedValue = array.join("&");
			expect(this.request.serializeData(array)).toEqual(expectedValue);
		});

		it("calls serialize() when an object supports this method", function() {
			var o = {
				serialize: function() {
					return "abc";
				}
			};
			var serialize = spyOn(o, "serialize").andCallThrough();
			expect(this.request.serializeData(o)).toEqual("abc");
			expect(serialize).toHaveBeenCalled();
		});

		it("converts an object to a query string", function() {
			var o = {
				id: 123,
				name: "Dave"
			};
			var expected = ["id=123", "name=Dave"].sort().join("&");
			var actual = this.request.serializeData(o).split(/&/g).join("&");
			expect(actual).toEqual(expected);
		});

		it("converts an object into a namespaced query string", function() {
			var o = {
				employee: {
					id: 123,
					name: "Dave",
					position: {
						id: 3,
						title: "Handyman"
					}
				}
			};
			var expected = [
				'employee[id]=123',
				'employee[name]=Dave',
				'employee[position][id]=3',
				'employee[position][title]=Handyman'
			].sort().join("&");
			var actual = this.request.serializeData(o).split(/&/g).sort().join("&");

			expect(actual).toEqual(expected);
		});

		it("converts arrays to a query string", function() {
			var o = {
				colors: ["green", "blue"]
			};

			var expected = [
				'colors[0]=green',
				'colors[1]=blue'
			].sort().join("&");

			var actual = this.request.serializeData(o);

			expect(actual).toEqual(expected);
		});

		it("converts an array of objects into a namespaced query string", function() {
			var o = {
				history: [
					{
						id: 1,
						description: "Started work",
						date: "1/1/2003"
					},{
						id: 2,
						description: "Vacation",
						date: "3/5/2004"
					}
				]
			};

			var expected = [
				'history[0][id]=1',
				'history[0][description]=Started%20work',
				'history[0][date]=1/1/2003',
				'history[1][id]=2',
				'history[1][description]=Vacation',
				'history[1][date]=3/5/2004'
			].sort().join("&");

			var actual = this.request.serializeData(o).split(/&/g).sort().join("&");

			expect(actual).toEqual(expected);
		});

		it("converts an array multiple levels deep into a namespaced query string", function() {
			var o = {
				employee: {
					history: [
						{
							id: 1,
							description: "Started work",
							date: "1/1/2003"
						},{
							id: 2,
							description: "Vacation",
							date: "3/5/2004"
						}
					]
				}
			};

			var expected = [
				'employee[history][0][id]=1',
				'employee[history][0][description]=Started%20work',
				'employee[history][0][date]=1/1/2003',
				'employee[history][1][id]=2',
				'employee[history][1][description]=Vacation',
				'employee[history][1][date]=3/5/2004'
			].sort().join("&");

			var actual = this.request.serializeData(o).split(/&/g).sort().join("&");

			expect(actual).toEqual(expected);
		});

		it("converts an arbitrarily deep object into a namespaced query string", function() {
			var o = {
				employee: {
					id: 123,
					name: "Dave",
					position: {
						id: 3,
						title: "Handyman"
					},
					history: [
						{
							id: 1,
							description: "Started work",
							date: "1/1/2003"
						},{
							id: 2,
							description: "Vacation",
							date: "3/5/2004"
						}
					]
				}
			};

			var expected = [
				'employee[id]=123',
				'employee[name]=Dave',
				'employee[position][id]=3',
				'employee[position][title]=Handyman',
				'employee[history][0][id]=1',
				'employee[history][0][description]=Started%20work',
				'employee[history][0][date]=1/1/2003',
				'employee[history][1][id]=2',
				'employee[history][1][description]=Vacation',
				'employee[history][1][date]=3/5/2004'
			].sort().join("&");

			var actual = this.request.serializeData(o).split(/&/g).sort().join("&");

			expect(actual).toEqual(expected);
		});

		it("appends [] to the end of query string keys when duplicates exist", function() {
			var o = {
				id: 123,
				name: "Dave",
				colors: ["blue", "green"]
			};
			var expected = "id=123&name=Dave&colors[0]=blue&colors[1]=green";
			expect(this.request.serializeData(o)).toEqual(expected);
		});
	});
});
