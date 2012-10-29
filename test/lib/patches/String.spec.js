describe("String", function() {

	describe("capitalize", function() {
		it("returns the string unaltered if already capitalized", function() {
			expect("Foo".capitalize()).toEqual("Foo");
		});

		it("makes the first letter upper-case", function() {
			expect("foo".capitalize()).toEqual("Foo");
		});

		it("does not alter strings that do not begin with letters", function() {
			expect("123 abc".capitalize()).toEqual("123 abc");
		});

		it("Capitalizes the first letter of the first line", function() {
			expect("line 1\nline 2".capitalize()).toEqual("Line 1\nline 2");
		});
	});

	describe("constantize", function() {
		it("throws an error if not defined", function() {
			expect(function() {
				"non.existent.ClassName".constantize();
			}).toThrowError();
		});

		it("returns a reference to a class", function() {
			expect("Array".constantize()).toEqual(Array);
		});

		it("requires the string start with an alphbetic character", function() {
			expect("document".constantize()).toEqual(document);

			expect("Object".constantize()).toEqual(Object);

			expect(function() {
				"9Test".constantize()
			}).toThrowError();
		});

		it("throws an error when the string is an expression", function() {
			var expressions = [
				"hacked();",
				"var a = 1;",
				"document.body.style.display = 'none';"
			], length = expressions.length, i = 0;

			for (i; i < length; i++) {
				expect(function() {
					expressions[i].constantize()
				}).toThrowError();
			}
		});
	});

	describe("singularize", function() {
		it("drops the s when the string ends with a consonant, followed by 's'", function() {
			expect("sails".singularize()).toEqual("sail");
		});

		it("converts 'es' to e", function() {
			expect("sales".singularize()).toEqual("sale");
		});

		it("changes 'ies' to 'y'", function() {
			expect("dailies".singularize()).toEqual("daily");
		});
	});

	describe("toClassName", function() {
		it("converts a non name space string to a class name", function() {
			expect("foo".toClassName()).toEqual("Foo");
			expect("foo_bar".toClassName()).toEqual("FooBar");
		});

		it("converts a namespaced string to a namespaced class name", function() {
			expect("foo-bar".toClassName()).toEqual("foo.Bar");
			expect("foo-bar-baz-bee_bop".toClassName()).toEqual("foo.bar.baz.BeeBop");
		});
	});

});
