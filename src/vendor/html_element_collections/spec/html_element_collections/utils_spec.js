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

		describe("getParentsByClassName", function() {

			beforeEach(function() {
				this.root = document.createElement("div");
				this.root.innerHTML = [
					'<ul>',
						'<li class="item">',
							'<ol class="sortable">',
								'<li class="item"><strong></strong></li>',
								'<li class="item"><span></span></li>',
							'</ol>',
						'</li>',
					'</ul>'
				].join("");

				this.strong = this.root.getElementsByTagName("strong")[0];
				this.span = this.root.getElementsByTagName("span")[0];

				spyOn(this.strong, "getParentByTagName").andCallThrough();
				spyOn(this.span, "getParentByTagName").andCallThrough();

				this.elements = new TestCollection();
				this.elements.push(this.strong, this.span);
			});

			it("returns all matched elements", function() {
				var elements = this.elements.getParentsByClassName("item");
				var expectedElements = this.root.getElementsByTagName("li");
			});

			xit("returns an empty collection if there are no matches");

		});

		describe("getParentByTagName", function() {

			beforeEach(function() {
				this.root = document.createElement("div");
				this.root.innerHTML = [
					'<ul>',
						'<li>',
							'<ol>',
								'<li><strong></strong></li>',
								'<li><span></span></li>',
							'</ol>',
						'</li>',
					'</ul>'
				].join("");

				this.strong = this.root.getElementsByTagName("strong")[0];
				this.span = this.root.getElementsByTagName("span")[0];

				spyOn(this.strong, "getParentByTagName").andCallThrough();
				spyOn(this.span, "getParentByTagName").andCallThrough();

				this.elements = new TestCollection();
				this.elements.push(this.strong, this.span);
			});

			it("gets the first matched reference", function() {
				var li = this.root.firstChild.firstChild.firstChild.firstChild;
				var element = this.elements.getParentByTagName("li");

				expect(element).toStrictlyEqual(li);
				expect(this.strong.getParentByTagName).wasCalledWith("li");
				expect(this.span.getParentByTagName).wasNotCalled();
			});

			it("returns null if there are no matches", function() {
				var element = this.elements.getParentByTagName("table");

				expect(element).toBeNull();
				expect(this.strong.getParentByTagName).wasCalledWith("table");
				expect(this.span.getParentByTagName).wasCalledWith("table");
			});

		});

		describe("getParentsByTagName", function() {

			beforeEach(function() {
				this.root = document.createElement("div");
				this.root.innerHTML = [
					'<ul>',
						'<li>',
							'<ol>',
								'<li><strong></strong></li>',
								'<li><span></span></li>',
							'</ol>',
						'</li>',
					'</ul>'
				].join("");

				this.strong = this.root.getElementsByTagName("strong")[0];
				this.span = this.root.getElementsByTagName("span")[0];

				spyOn(this.strong, "getParentsByTagName").andCallThrough();
				spyOn(this.span, "getParentsByTagName").andCallThrough();

				this.elements = new TestCollection();
				this.elements.push(this.strong, this.span);
			});

			it("returns an empty HTMLArray when there are not matches", function() {
				var parents = this.elements.getParentsByTagName("table");

				expect(parents.length).toEqual(0);
			});

			it("returns all matched elements", function() {
				var parents = this.elements.getParentsByTagName("li");

				expect(parents.length).toEqual(3);
			});
		});

		describe("setInnerHTML", function() {
			beforeEach(function() {
				this.elements = new TestCollection();
				this.elements.push(document.createElement("div"), document.createElement("li"));
			});

			it("sets the inner HTML on all elements", function() {
				this.elements.setInnerHTML("<p>foo</p>");

				expect(this.elements[0].firstChild.nodeName).toEqual("P");
				expect(this.elements[1].firstChild.nodeName).toEqual("P");
			});

			describe("sets the inner HTML to an empty string", function() {
				it("when an empty string is passed", function() {
					this.elements.setInnerHTML("");

					expect(this.elements[0].innerHTML).toEqual("");
					expect(this.elements[1].innerHTML).toEqual("");
				});

				it("when a null value is passed", function() {
					this.elements.setInnerHTML(null);

					expect(this.elements[0].innerHTML).toEqual("");
					expect(this.elements[1].innerHTML).toEqual("");
				});

				it("when an undefined value is passed", function() {
					this.elements.setInnerHTML(undefined);

					expect(this.elements[0].innerHTML).toEqual("");
					expect(this.elements[1].innerHTML).toEqual("");
				});
			});

			it("sets the inner HTML to NaN when a NaN value is passed", function() {
				this.elements.setInnerHTML(NaN);

				expect(this.elements[0].innerHTML).toEqual("NaN");
				expect(this.elements[1].innerHTML).toEqual("NaN");
			});

			it("sets the innerHTML to 'false' when false is passed", function() {
				this.elements.setInnerHTML(false);

				expect(this.elements[0].innerHTML).toEqual("false");
				expect(this.elements[1].innerHTML).toEqual("false");
			});

			it("calls toString() when objects are passed", function() {
				var object = {
					toString: function() {
						return '<p>test</p>';
					}
				};

				spyOn(object, "toString").andCallThrough();
				this.elements.setInnerHTML(object);

				expect(this.elements[0].firstChild.nodeName).toEqual("P");
				expect(this.elements[1].firstChild.nodeName).toEqual("P");
				expect(object.toString.callCount).toEqual(2);
			});
		});

		describe("removeAttribute", function() {
			beforeEach(function() {
				this.elements = new TestCollection();
				this.elements.push(document.createElement("div"), document.createElement("li"));
			});

			it("throws an error if no argument is passed", function() {
				expect(function() {
					this.elements.removeAttribute();
				}).toThrowError((window.TypeError) ? TypeError : Error);
			});

			it("removes the attribute from all elements", function() {
				spyOn(this.elements[0], "removeAttribute").andCallThrough();
				spyOn(this.elements[1], "removeAttribute").andCallThrough();

				this.elements[0].setAttribute("class", "foo");
				this.elements[1].setAttribute("class", "foo");

				this.elements.removeAttribute("class");

				expect(this.elements[0].removeAttribute).wasCalledWith("class");
				expect(this.elements[0].getAttribute("class")).toBeNull();

				expect(this.elements[1].removeAttribute).wasCalledWith("class");
				expect(this.elements[1].getAttribute("class")).toBeNull();
			});
		});

		describe("removeClassName", function() {
			beforeEach(function() {
				this.elements = new TestCollection();
				this.elements.push(document.createElement("div"), document.createElement("li"));
			});

			it("removes the class name from all elements", function() {
				this.elements[0].className = 'test';
				this.elements[1].className = 'test bar';
				this.elements.removeClassName("test");

				expect(this.elements[0].className).toEqual("");
				expect(this.elements[1].className).toEqual("bar");
			});
		});

		describe("removeEventListener", function() {
			beforeEach(function() {
				this.elements = new TestCollection();
				this.elements.push(document.createElement("div"), document.createElement("li"));
			});

			it("removes the event listeners from all elements", function() {
				spyOn(this.elements[0], "removeEventListener").andCallThrough();
				spyOn(this.elements[1], "removeEventListener").andCallThrough();

				var listener = function() {};

				this.elements[0].addEventListener("click", listener, false);
				this.elements[1].addEventListener("click", listener, false);

				this.elements.removeEventListener("click", listener, false);

				expect(this.elements[0].removeEventListener).wasCalledWith("click", listener, false);
				expect(this.elements[1].removeEventListener).wasCalledWith("click", listener, false);
			});
		});

		describe("querySelector", function() {
			beforeEach(function() {
				this.elements = new TestCollection();
				this.elements.push(document.createElement("div"), document.createElement("li"));
			});

			it("returns the first matched element from the elements in the collection", function() {
				spyOn(this.elements[0], "querySelector").andCallThrough();
				spyOn(this.elements[1], "querySelector").andCallThrough();

				var selector = ".foo", element;

				this.elements[0].innerHTML = '<p class="foo"></p>';
				this.elements[1].innerHTML = '<p class="foo"></p>';

				element = this.elements.querySelector(selector);

				expect(element).toStrictlyEqual(this.elements[0].firstChild);
				expect(this.elements[0].querySelector).wasCalledWith(selector);
				expect(this.elements[1].querySelector).wasNotCalled();
			});
		});

		describe("querySelectorAll", function() {
			beforeEach(function() {
				this.elements = new TestCollection();
				this.elements.push(document.createElement("div"), document.createElement("li"));
				this.elements[0].innerHTML = '<span><span></span></span>';
				this.elements.push(this.elements[0].firstChild);
				this.elements[1].innerHTML = '<span><strong></strong></span>';
			});

			it("returns an empty HTMLArray if there are no matches", function() {
				var matches = this.elements.querySelectorAll("em.foo");

				expect(matches).toBeInstanceof(HTMLArray);
				expect(matches.length).toEqual(0);
			});

			it("returns an HTMLArray of all matched elements", function() {
				var matches = this.elements.querySelectorAll("span");

				expect(matches.length).toEqual(3);
			});
		});

		describe("setAttribute", function() {
			beforeEach(function() {
				this.elements = new TestCollection();
				this.elements.push(document.createElement("div"), document.createElement("p"));
				this.elements.forEach(function(element) {
					spyOn(element, "setAttribute").andCallThrough();
				});
			});

			it("Sets the attribute on all matched elements", function() {
				this.elements.setAttribute("data-test", "test");

				expect(this.elements[0].setAttribute).wasCalledWith("data-test", "test");
				expect(this.elements[0].getAttribute("data-test")).toEqual("test");
				expect(this.elements[1].setAttribute).wasCalledWith("data-test", "test");

				expect(this.elements[1].getAttribute("data-test")).toEqual("test");
			});
		});

	});

});
