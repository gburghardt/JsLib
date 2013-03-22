describe("HTMLElementCollections", function() {

	describe("Utils", function() {

		var TestCollection = Array.extend({
			includes: HTMLElementCollections.Utils,
			prototype: {
				forEach: HTMLElementCollections.Utils.forEach
			}
		});

		beforeEach(function() {
			this.elements = new TestCollection();
		});

		describe("addClassName", function() {

			it("does nothing when called on an empty collection", function() {
				this.elements.addClassName("testing");
			});

			it("adds the class name to all elements in the collection", function() {
				this.elements.push(document.createElement("div"), document.createElement("span"));
				this.elements.addClassName("testing");

				expect(this.elements[0].className).toEqual("testing");
				expect(this.elements[1].className).toEqual("testing");
			});

			it("method calls can be chained together", function() {
				this.elements.push(document.createElement("div"), document.createElement("span"));
				this.elements.addClassName("foo").addClassName("bar");

				expect(this.elements[0].className).toEqual("foo bar");
				expect(this.elements[1].className).toEqual("foo bar");
			});

		});

		describe("addEventListener", function() {

			beforeEach(function() {
				this.div = document.createElement("div");
				this.span = document.createElement("span");
				this.elements.push(this.div, this.span);
			});

			it("does nothing when called on an empty collection", function() {
				var elements = new TestCollection();
				elements.addEventListener("click", function() {}, false);
				expect(elements.length).toEqual(0);
			});

			it("adds event handlers on every matched element", function() {
				var callback = function() {};
				spyOn(this.div, "addEventListener").andCallThrough();
				spyOn(this.span, "addEventListener").andCallThrough();

				this.elements.addEventListener("click", callback, false);

				expect(this.div.addEventListener).wasCalledWith("click", callback, false);
				expect(this.span.addEventListener).wasCalledWith("click", callback, false);
			});

			it("method calls can be chained together", function() {
				var clickCallback = function() {};
				var blurCallback = function() {};
				spyOn(this.div, "addEventListener").andCallThrough();
				spyOn(this.span, "addEventListener").andCallThrough();

				this.elements.addEventListener("click", clickCallback, false).addEventListener("blur", blurCallback, false);

				expect(this.div.addEventListener).wasCalledWith("click", clickCallback, false);
				expect(this.div.addEventListener).wasCalledWith("blur", blurCallback, false);
				expect(this.span.addEventListener).wasCalledWith("click", clickCallback, false);
				expect(this.span.addEventListener).wasCalledWith("blur", blurCallback, false);
			});

		});

		describe("forEach", function() {

			beforeEach(function() {
				this.div = document.createElement("div");
				this.span = document.createElement("span");
				this.elements.push(this.div, this.span);
			});

			it("does not invoke the callback on an empty collection", function() {
				var elements = new TestCollection();
				var foo = {callback: function() {}};
				spyOn(foo, "callback");

				elements.forEach(foo.callback);
				expect(foo.callback).wasNotCalled();
			});

			it("iterates over the collection invoking the callback", function() {
				var foo = {callback: function() {}};
				spyOn(foo, "callback");

				this.elements.forEach(foo.callback, foo);

				expect(foo.callback).wasCalledWith(this.div, 0, this.elements);
				expect(foo.callback).wasCalledWith(this.span, 1, this.elements);
			});

			it("method calls can be chained together", function() {
				this.elements.forEach(function(element, i, elements) {
					element.setAttribute("data-foo", "test");
				}).forEach(function(element, i, elements) {
					element.setAttribute("data-bar", "test");
				});

				expect(this.div.getAttribute("data-foo")).toEqual("test");
				expect(this.div.getAttribute("data-bar")).toEqual("test");
				expect(this.span.getAttribute("data-foo")).toEqual("test");
				expect(this.span.getAttribute("data-bar")).toEqual("test");
			});

		});

		describe("getAttribute", function() {

			beforeEach(function() {
				this.div = document.createElement("div");
				this.span = document.createElement("span");

				spyOn(this.div, "getAttribute").andCallThrough();
				spyOn(this.span, "getAttribute").andCallThrough();

				this.elements.push(this.div, this.span);
			});

			it("returns the attribute value of the first element that has it", function() {
				this.div.setAttribute("data-test", "test");

				expect(this.elements.getAttribute("data-test")).toEqual("test");
				expect(this.div.getAttribute).wasCalledWith("data-test");
				expect(this.span.getAttribute).wasNotCalled();
			});

			it("returns null if no elements have the attribute", function() {
				expect(this.elements.getAttribute("data-test")).toBeNull();
			});

			it("returns null even if one or more elements have the attribute set to an empty string", function() {
				this.span.setAttribute("data-test", "");
				expect(this.elements.getAttribute("data-test")).toBeNull();
			});

		});

		describe("getElementsByTagName", function() {

			beforeEach(function() {
				this.div = document.createElement("div");
				this.div.innerHTML = '<p>Blah</p><button>Foo</button>';

				this.span = document.createElement("span");
				this.span.innerHTML = '<a>Link</a><button>Blah</button>';

				spyOn(this.div, "getElementsByTagName").andCallThrough();
				spyOn(this.span, "getElementsByTagName").andCallThrough();

				this.elements.push(this.div, this.span);
			});

			it("returns an empty HTMLArray when there are no matches", function() {
				var elements = this.elements.getElementsByTagName("strong");

				expect(this.div.getElementsByTagName).wasCalledWith("strong");
				expect(this.span.getElementsByTagName).wasCalledWith("strong");
				expect(elements).toBeInstanceof(HTMLArray);
				expect(elements.length).toEqual(0);
			});

			it("returns the matched elements", function() {
				var elements = this.elements.getElementsByTagName("button");

				expect(this.div.getElementsByTagName).wasCalledWith("button");
				expect(this.span.getElementsByTagName).wasCalledWith("button");
				expect(elements.length).toEqual(2);
				expect(elements[0]).toStrictlyEqual(this.div.childNodes[1]);
				expect(elements[1]).toStrictlyEqual(this.span.childNodes[1]);
			});

		});

		describe("getParentByTagName", function() {});

		describe("getParentsByClassName", function() {});

		describe("getParentsByTagName", function() {});

		describe("innerHTML setter property", function() {});

		describe("removeAttribute", function() {});

		describe("removeClassName", function() {});

		describe("removeEventListener", function() {});

		describe("querySelector", function() {});

		describe("querySelectorAll", function() {});

		describe("setAttribute", function() {});

	});

});
