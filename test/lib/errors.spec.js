describe("BaseError", function() {
	it("inherits from Error", function() {
		var e = new BaseError("Test");
		expect(e).toBeInstanceof(Error);
		expect(e.message).toEqual("Test");
	});

	it("is throwable and catchable",  function() {
		try {
			throw new BaseError("Test");
		}
		catch (e) {
			expect(e.message).toEqual("Test");
			expect(e).toBeInstanceof(BaseError);
			expect(e).toBeInstanceof(Error);
		}
	});

	it("can be subclassed via Function#extend", function() {
		var ChildError = BaseError.extend();

		try {
			new ChildError("Child error test");
		}
		catch (e) {
			expect(e.message).toEqual("Child error test");
			expect(e).toBeInstanceof(ChildError);
			expect(e).toBeInstanceof(BaseError);
			expect(e).toBeInstanceof(Error);
		}
	});
});
