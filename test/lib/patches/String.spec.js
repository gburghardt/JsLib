describe("String", function() {

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

});
