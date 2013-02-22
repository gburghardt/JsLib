describe("BaseView", function() {
	describe("generateNodeId", function() {
		it("should generate an Id when a node does not have one", function() {
			var expectedIds = ["anonymous-node-0", "anonymous-node-1"];
			expect([BaseView.generateNodeId(), BaseView.generateNodeId()].join(",")).toEqual(expectedIds.join(","));
		});
	});
});