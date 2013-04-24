describe("HTMLElement", function() {

	describe("Utils", function() {

		describe("addClassName", function() {});

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

		describe("removeClassName", function() {});

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
