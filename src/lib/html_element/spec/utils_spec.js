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

		describe("appendHTML", function() {
			beforeEach(function() {
				this.element = document.createElement("div");
			});

			it("appends new nodes as HTML and returns an HTMLArray of those new nodes", function() {
				var html = '<div></div><p></p>';
				var nodes = this.element.appendHTML(html);

				expect(this.element.childNodes.length).toEqual(2);
				expect(nodes).toBeInstanceof(HTMLArray);
				expect(nodes.length).toEqual(2);
				expect(nodes[0]).toStrictlyEqual(this.element.childNodes[0]);
				expect(nodes[1]).toStrictlyEqual(this.element.childNodes[1]);
			});

			it("appends nothing and returns an empty HTMLArray if the HTML is blank", function() {
				var html = '   	';
				var nodes = this.element.appendHTML(html);

				expect(this.element.childNodes.length).toEqual(0);
				expect(nodes).toBeInstanceof(HTMLArray);
				expect(nodes.length).toEqual(0);
			});
		});

		describe("getData", function() {

			beforeEach(function() {
				this.div = document.createElement("div");
			});

			it("throws an error if no key is provided", function() {
				expect(function() {
					this.div.getData();
				}).toThrowError();

				expect(function() {
					this.div.getData("");
				}).toThrowError();

				expect(function() {
					this.div.getData(null);
				}).toThrowError();

				expect(function() {
					this.div.getData(undefined);
				}).toThrowError();
			});

			it("returns null if the attribute does not exist", function() {
				expect(this.div.getAttribute("data-testing")).toBeNull();
				expect(this.div.getData("testing")).toBeNull();
			});

			it("returns null if there is invalid JSON", function() {
				this.div.setAttribute("data-testing", "I am invalid {JSON!");
				expect(this.div.getData("testing")).toBeNull();
			});

			it("returns the value of a JavaScript primative", function() {
				this.div.setAttribute("data-testing", 1);
				expect(this.div.getData("testing")).toEqual(1);

				this.div.setAttribute("data-testing", true);
				expect(this.div.getData("testing")).toBeTrue();

				this.div.setAttribute("data-testing", false);
				expect(this.div.getData("testing")).toBeFalse();

				this.div.setAttribute("data-testing", null);
				expect(this.div.getData("testing")).toBeNull();
			});

			it("returns the parsed JSON as an object", function() {
				this.div.setAttribute("data-testing", '{"foo":"bar"}');
				expect(this.div.getData("testing")).toEqual({foo: "bar"});
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

		describe("setData", function() {

			beforeEach(function() {
				this.div = document.createElement("div");
			});

			it("throws an error if no key is provided", function() {
				expect(function() {
					this.div.setData();
				}).toThrowError();

				expect(function() {
					this.div.setData("");
				}).toThrowError();

				expect(function() {
					this.div.setData(null);
				}).toThrowError();

				expect(function() {
					this.div.setData(undefined);
				}).toThrowError();
			});

			it("throws an error if no data is provided", function() {
				expect(function() {
					this.div.setData("testing");
				});
				expect(function() {
					this.div.setData("testing", "");
				});
				expect(function() {
					this.div.setData("testing", null);
				});
				expect(function() {
					this.div.setData("testing", undefined);
				});
			});

			it("sets a string value", function() {
				this.div.setData("testing", '{"foo":"bar"}');
				expect(this.div.getAttribute("data-testing")).toEqual('{"foo":"bar"}');
			});

			it("converts an object into JSON", function() {
				this.div.setData("testing", {foo:"bar"});
				expect(this.div.getAttribute("data-testing")).toEqual('{"foo":"bar"}');
			});

			it("converts the key to lower case", function() {
				this.div.setData("TestingSetData", {foo:"bar"});
				expect(this.div.getAttribute("data-testingsetdata")).toEqual('{"foo":"bar"}');
			});

			it("allows invalid JSON strings to be set", function() {
				this.div.setData("testing", "I am an invalid JSON string}");
				expect(this.div.getAttribute("data-testing")).toEqual('I am an invalid JSON string}');
			});

			it("allows primative JavaScript values to be set", function() {
				this.div.setData("test-1", 1);
				this.div.setData("test-2", null);
				this.div.setData("test-3", true);

				expect(this.div.getAttribute("data-test-1")).toEqual("1");
				expect(this.div.getAttribute("data-test-2")).toEqual("null");
				expect(this.div.getAttribute("data-test-3")).toEqual("true");
			});

		});

	});

});
