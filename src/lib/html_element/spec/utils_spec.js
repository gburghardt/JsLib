describe("HTMLElement", function() {

	describe("Utils", function() {

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

	});

});
