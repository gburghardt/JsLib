describe("HTMLArray", function() {

	beforeEach(function() {
		this.collection = new HTMLArray();
	});

	describe("frozen", function() {

		it("defaults to false", function() {
			expect(this.collection.frozen).toBeFalse();
		});

		it("throws an error if already true and is set to false", function() {
			this.collection.frozen = true;

			expect(function() {
				this.collection.frozen = false;
			}).toThrowError();
		});

		it("can be set to true multiple times", function() {
			this.collection.frozen = true;
			this.collection.frozen = true;
		});

	});

	describe("freeze", function() {

		it("freezes the HTMLArray", function() {
			this.collection.freeze();

			expect(this.collection.frozen).toBeTrue();
		});

		it("throws an error if called more than once", function() {
			this.collection.freeze();

			expect(function() {
				this.collection.freeze();
			}).toThrowError();
		});

	});

	describe("push", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
		});

		it("adds elements to the end of an HTMLArray if not frozen", function() {
			this.collection.push(this.div);

			expect(this.collection.length).toEqual(1);
			expect(this.collection[0]).toStrictlyEqual(this.div);
		});

		it("throws an error when trying to add elements to a frozen HTMLArray", function() {
			this.collection.freeze();

			expect(function() {
				this.collection.push(this.div);
			}).toThrowError();
		});

	});

	describe("pop", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
			this.span = document.createElement("span");
			this.collection.push(this.div, this.span);
		});

		it("removes elements from the end of the HTMLArray if not frozen", function() {
			var element = this.collection.pop();

			expect(element).toStrictlyEqual(this.span);
			expect(this.collection.length).toEqual(1);
		});

		it("throws an error when trying to remove elements from a frozen HTMLArray", function() {
			this.collection.freeze();

			expect(function() {
				this.collection.pop();
			}).toThrowError();
		});

	});

	describe("unshift", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
			this.span = document.createElement("span");
		});

		it("adds elements to the beginning if not frozen", function() {
			this.collection.unshift(this.span);
			expect(this.collection.length).toEqual(1);
			expect(this.collection[0]).toStrictlyEqual(this.span);

			this.collection.unshift(this.div);
			expect(this.collection.length).toEqual(2);
			expect(this.collection[0]).toStrictlyEqual(this.div);
			expect(this.collection[1]).toStrictlyEqual(this.span);
		});

		it("throws an error when trying to add elements if frozen", function() {
			this.collection.freeze();

			expect(function() {
				this.collection.unshift(this.div);
			}).toThrowError();
		});

	});

	describe("shift", function() {

		beforeEach(function() {
			this.div = document.createElement("div");
			this.span = document.createElement("span");
			this.strong = document.createElement("strong");
			this.collection.push(this.div, this.span, this.strong);
		});

		it("removes elements from the beginning if not frozen", function() {
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

		it("throws an error when trying to remove elements if frozen", function() {
			this.collection.freeze();

			expect(function() {
				this.collection.shift();
			}).toThrowError();
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
			this.collection.freeze();

			var slicedCollection = this.collection.slice(0, 2);

			expect(this.collection).toStrictlyNotEqual(slicedCollection);
			expect(slicedCollection.frozen).toBeTrue();
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

		it("adds or removes elements if not frozen", function() {
			this.collection.splice(0, 1, this.span, this.p);

			expect(this.collection.length).toEqual(2);
			expect(this.collection[0]).toStrictlyEqual(this.span);
			expect(this.collection[1]).toStrictlyEqual(this.p);
		});

		it("throws an error when frozen", function() {
			this.collection.freeze();

			expect(function() {
				this.collection.splice(0, 1, this.span, this.p);
			}).toThrowError();
		});

	});

	describe("sort", function() {

		it("throws an error because you cannot sort HTMLArray objects", function() {
			expect(function() {
				this.collection.sort();
			}).toThrowError();
		});

	});

});
