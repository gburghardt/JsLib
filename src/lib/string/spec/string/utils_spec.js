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
		it("returns null if class name is not defined", function() {
			expect( "non.existent.ClassName".constantize() ).toBeNull();
		});

		it("returns a reference to a class", function() {
			expect( "Array".constantize() ).toEqual(Array);
			expect( "Object".constantize() ).toEqual(Object);
			expect( "window.XMLHttpRequest".constantize() ).toEqual(window.XMLHttpRequest);
		});

		it("returns a reference to an object", function() {
			expect( "document".constantize() ).toEqual(document);
		});

		it("returns null if the string does not start with an alphbetic character", function() {
			expect( "9Test".constantize() ).toBeNull();
			expect( "$Foo".constantize() ).toBeNull();
		});

		it("returns null when the string is an expression", function() {
			var expressions = [
				"hacked();",
				"var a = 1;",
				"document.body.style.display = 'none';"
			], length = expressions.length, i = 0;

			for (i; i < length; i++) {
				expect( expressions[i].constantize() ).toBeNull();
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
