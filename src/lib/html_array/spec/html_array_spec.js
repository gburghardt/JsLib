describe("HTMLArray", function() {

	beforeEach(function() {
		this.collection = new HTMLArray();
	});

	describe("parseHTML", function() {
		it("parses HTML and adds the new nodes, trimming whitespace from the beginning and end", function() {
			var html = '			 <div></div><p></p> ';
			var returnValue = this.collection.parseHTML(html);

			expect(returnValue).toStrictlyEqual(this.collection);
			expect(this.collection.length).toEqual(2);
			expect(this.collection[0].nodeName).toStrictlyEqual("DIV");
			expect(this.collection[1].nodeName).toStrictlyEqual("P");
		});

		it("does not add nodes when the HTML is blank or only white space characters exist", function() {
			var html = '						';
			this.collection.parseHTML(html);

			expect(this.collection.length).toEqual(0);
		});
	});

	describe("push", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
		});

		it("adds elements to the end of an HTMLArray", function() {
			this.collection.push(this.div);

			expect(this.collection.length).toEqual(1);
			expect(this.collection[0]).toStrictlyEqual(this.div);
		});

		it("does not add duplicates", function() {
			this.collection.push(this.div);
			this.collection.push(this.div);
			expect(this.collection.length).toEqual(1);
		});
	});

	describe("pop", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
			this.span = document.createElement("span");
			this.collection.push(this.div, this.span);
		});

		it("removes elements from the end of the HTMLArray", function() {
			var element = this.collection.pop();

			expect(element).toStrictlyEqual(this.span);
			expect(this.collection.length).toEqual(1);
		});

	});

	describe("unshift", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
			this.span = document.createElement("span");
		});

		it("adds elements to the beginning", function() {
			this.collection.unshift(this.span);
			expect(this.collection.length).toEqual(1);
			expect(this.collection[0]).toStrictlyEqual(this.span);

			this.collection.unshift(this.div);
			expect(this.collection.length).toEqual(2);
			expect(this.collection[0]).toStrictlyEqual(this.div);
			expect(this.collection[1]).toStrictlyEqual(this.span);
		});

	});

	describe("shift", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
			this.span = document.createElement("span");
			this.strong = document.createElement("strong");
			this.collection.push(this.div, this.span, this.strong);
		});

		it("removes elements from the beginning", function() {
			var element = this.collection.shift();
			expect(element).toStrictlyEqual(this.div);
			expect(this.collection.length).toEqual(2);

			element = this.collection.shift();
			expect(element).toStrictlyEqual(this.span);
			expect(this.collection.length).toEqual(1);

			element = this.collection.shift();
			expect(element).toStrictlyEqual(this.strong);
			expect(this.collection.length).toEqual(0);
		});

	});

	describe("slice", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
			this.span = document.createElement("span");
			this.strong = document.createElement("strong");
			this.collection.push(this.div, this.span, this.strong);
		});

		it("slices the HTMLArray and returns a new one", function() {
			var slicedCollection = this.collection.slice(0, 2);

			expect(this.collection).toStrictlyNotEqual(slicedCollection);
			expect(slicedCollection.length).toEqual(2);
			expect(slicedCollection[0]).toStrictlyEqual(this.div);
			expect(slicedCollection[1]).toStrictlyEqual(this.span);
		});

	});

	describe("splice", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
			this.span = document.createElement("span");
			this.p = document.createElement("p");
			this.collection.push(this.div);
		});

		it("adds or removes elements", function() {
			this.collection.splice(0, 1, this.span, this.p);

			expect(this.collection.length).toEqual(2);
			expect(this.collection[0]).toStrictlyEqual(this.span);
			expect(this.collection[1]).toStrictlyEqual(this.p);
		});

	});

	describe("sort", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
			this.span = document.createElement("span");
			this.p = document.createElement("p");
			this.collection.push(this.div, this.span, this.p);
		});

		it("sorts an HTMLArray", function() {
			this.collection.sort(function(a, b) {
				if (a.nodeName > b.nodeName) {
					return 1;
				}
				else if (a.nodeName < b.nodeName) {
					return -1;
				}
				else {
					return 0;
				}
			});

			expect(this.collection[0]).toStrictlyEqual(this.div);
			expect(this.collection[1]).toStrictlyEqual(this.p);
			expect(this.collection[2]).toStrictlyEqual(this.span);
		});

	});

});
