describe("HTMLElement", function() {

	describe("Utils", function() {

		describe("addClassName", function() {
			beforeEach(function() {
				this.element = document.createElement("div");
			});

			it("adds a class to an empty class name", function() {
				this.element.addClassName("foo");
				expect(this.element.className).toEqual("foo");
			});

			it("adds the class to the end if it does not exist", function() {
				this.element.setAttribute("class", "foo bar");
				this.element.addClassName("testing");
				expect(this.element.className).toEqual("foo bar testing");
			});

			it("does not add the class if it already exists", function() {
				this.element.setAttribute("class", "foo bar");
				this.element.addClassName("bar");
				expect(this.element.className).toEqual("foo bar");
			});

			it("adds the class if it is a partial match", function() {
				this.element.setAttribute("class", "foobar");
				this.element.addClassName("foo");
				expect(this.element.className).toEqual("foobar foo");
			});
		});

		describe("getParentByTagName", function() {

			beforeEach(function() {
				this.div = document.createElement("div");
			});

			it("returns the direct parent node if the tag name is '*'", function() {
				this.div.innerHTML = '<p><strong></strong></p>';
				var parent = this.div.firstChild.firstChild.getParentByTagName("*");

				expect(parent).toStrictlyEqual(this.div.firstChild);
			});

			it("returns a single parent node when the tag name matches", function() {
				this.div.innerHTML = '<ul><li><p><strong></strong></p></li></ul>';
				var parent = this.div.firstChild.firstChild.firstChild.firstChild.getParentByTagName("li");

				expect(parent).toStrictlyEqual(this.div.firstChild.firstChild);
			});

			it("returns null when no parent matches the tag name", function() {
				this.div.innerHTML = '<p><strong></strong></p>';
				var parent = this.div.firstChild.firstChild.getParentByTagName("span");

				expect(parent).toBeNull();
			});

		});

		describe("getParenstByTagName", function() {

			beforeEach(function() {
				this.div = document.createElement("div");
			});

			it("returns all parent nodes if the tag name is '*'", function() {
				this.div.innerHTML = '<ul><li><p><strong></strong></p></li></ul>';
				var child = this.div.getElementsByTagName("strong")[0];
				var parents = child.getParentsByTagName("*");

				expect(parents.length).toEqual(4);
				expect(parents[0]).toStrictlyEqual(this.div.firstChild.firstChild.firstChild);
				expect(parents[1]).toStrictlyEqual(this.div.firstChild.firstChild);
				expect(parents[2]).toStrictlyEqual(this.div.firstChild);
				expect(parents[3]).toStrictlyEqual(this.div);
			});

			it("returns all parent nodes matching the tag name", function() {
				this.div.innerHTML = '<ul><li><div><p><strong></strong></p></div></li></ul>';
				var child = this.div.getElementsByTagName("strong")[0];
				var parents = child.getParentsByTagName("div");

				expect(parents.length).toEqual(2);
				expect(parents[0]).toStrictlyEqual(this.div.firstChild.firstChild.firstChild);
				expect(parents[1]).toStrictlyEqual(this.div);
			});

			it("returns an empty array when no tags match", function() {
				this.div.innerHTML = '<ul><li><div><p><strong></strong></p></div></li></ul>';
				var child = this.div.getElementsByTagName("strong")[0];
				var parents = child.getParentsByTagName("span");

				expect(parents.length).toEqual(0);
			});

		});

		describe("hasClassName", function() {
			beforeEach(function() {
				this.element = document.createElement("div");
			});

			it("returns false if the class does not exist", function() {
				expect(this.element.hasClassName("testing")).toBeFalse();
			});

			it("returns true if the class is the only class", function() {
				this.element.setAttribute("class", "testing");
				expect(this.element.hasClassName("testing")).toBeTrue();
			});

			it("returns true if the class occurs at the beginning", function() {
				this.element.setAttribute("class", "foo bar");
				expect(this.element.hasClassName("foo")).toBeTrue();
			});

			it("returns true if the class occurs in the middle", function() {
				this.element.setAttribute("class", "testing foo bar");
				expect(this.element.hasClassName("foo")).toBeTrue();
			});

			it("returns true if the class occurs at the end", function() {
				this.element.setAttribute("class", "testing foo bar");
				expect(this.element.hasClassName("bar")).toBeTrue();
			});

			it("returns false when the class is a partial match", function() {
				this.element.setAttribute("class", "foo testing bar");
				expect(this.element.hasClassName("test")).toBeFalse();
			});
		});

		describe("insertAfter", function() {
			beforeEach(function() {
				this.element = document.createElement("div");
			});

			it("inserts the new element after the reference element's nextSibling", function() {
				this.element.appendChild(document.createElement("p"));
				this.element.appendChild(document.createElement("span"));
				this.element.insertAfter(document.createElement("strong"), this.element.getElementsByTagName("p")[0]);

				expect(this.element.childNodes[0].nodeName).toEqual("P");
				expect(this.element.childNodes[1].nodeName).toEqual("STRONG");
				expect(this.element.childNodes[2].nodeName).toEqual("SPAN");
			});

			it("appends the new element if the reference element has no nextSibling", function() {
				this.element.appendChild(document.createElement("p"));
				this.element.insertAfter(document.createElement("strong"), this.element.getElementsByTagName("p")[0]);

				expect(this.element.childNodes[0].nodeName).toEqual("P");
				expect(this.element.childNodes[1].nodeName).toEqual("STRONG");
			});
		});

		describe("removeClassName", function() {
			beforeEach(function() {
				this.element = document.createElement("div");
			});

			it("does nothing if the class name is empty", function() {
				this.element.removeClassName("testing");
				expect(this.element.className).toEqual("");
			});

			it("removes the class if it is the only class name", function() {
				this.element.setAttribute("class", "testing");
				this.element.removeClassName("testing");
				expect(this.element.className).toEqual("");
			});

			it("removes the class when it occurs at the beginning", function() {
				this.element.setAttribute("class", "testing foo");
				this.element.removeClassName("testing");
				expect(this.element.className).toEqual("foo");
			});

			it("removes the class when it occurs at the end", function() {
				this.element.setAttribute("class", "foo testing");
				this.element.removeClassName("testing");
				expect(this.element.className).toEqual("foo");
			});

			it("removes the class when it occurs in the middle", function() {
				this.element.setAttribute("class", "foo testing bar");
				this.element.removeClassName("testing");
				expect(this.element.className).toEqual("foo bar");
			});

			it("removes multiple occurences of the same class name", function() {
				this.element.setAttribute("class", "foo testing bar testing blah");
				this.element.removeClassName("testing");
				expect(this.element.className).toEqual("foo bar blah");
			});

			it("does not remove the class if it is a partial match", function() {
				this.element.setAttribute("class", "bar testing foo");
				this.element.removeAttribute("test");
				expect(this.element.className).toEqual("bar testing foo");
			});
		});

		describe("replaceClassName", function() {
			beforeEach(function() {
				this.element = document.createElement("div");
			});

			it("adds the class if it doesn't exist", function() {
				this.element.replaceClassName("a", "b");
				expect(this.element.className).toEqual("b");
			});

			it("replaces the class when it is the only class", function() {
				this.element.setAttribute("class", "a");
				this.element.replaceClassName("a", "b");
				expect(this.element.className).toEqual("b");
			});

			it("replaces the class when it occurs at the beginning", function() {
				this.element.setAttribute("class", "a c d");
				this.element.replaceClassName("a", "b");
				expect(this.element.className).toEqual("b c d");
			});

			it("replaces the class when it occurs at the end", function() {
				this.element.setAttribute("class", "c d a");
				this.element.replaceClassName("a", "e");
				expect(this.element.className).toEqual("c d e");
			});

			it("replaces the class when it occurs in the middle", function() {
				this.element.setAttribute("class", "a e c");
				this.element.replaceClassName("e", "b");
				expect(this.element.className).toEqual("a b c");
			});

			it("does not replace the class for a partial match", function() {
				this.element.setAttribute("class", "testing blueberry");
				this.element.replaceClassName("test", "foo");
				expect(this.element.className).toEqual("testing blueberry foo");
				this.element.replaceClassName("blue", "rasp");
				expect(this.element.className).toEqual("testing blueberry foo rasp");
			});
		});

	});

});
