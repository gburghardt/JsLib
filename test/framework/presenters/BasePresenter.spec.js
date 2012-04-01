describe("BasePresenter", function() {
	describe("setModelToViewMap", function() {
		beforeEach(function() {
			this.presenter = new BasePresenter();
		});

		it("maps an array of property names", function() {
			var map = ["id", "title", "body"];

			this.presenter.setModelToViewMap(map);

			expect(this.presenter.modelToViewMap.id).toEqual("id");
			expect(this.presenter.modelToViewMap.title).toEqual("title");
			expect(this.presenter.modelToViewMap.body).toEqual("body");

			expect(this.presenter.viewToModelMap.id).toEqual("id");
			expect(this.presenter.viewToModelMap.title).toEqual("title");
			expect(this.presenter.viewToModelMap.body).toEqual("body");
		});

		it("maps an object of view keys to model keys", function() {
			var map = {
				id: "blog[id]",
				title: "blog[title]",
				body: "blog[body]"
			};

			this.presenter.setModelToViewMap(map);

			expect(this.presenter.modelToViewMap.id).toEqual(map.id);
			expect(this.presenter.modelToViewMap.title).toEqual(map.title);
			expect(this.presenter.modelToViewMap.body).toEqual(map.body);

			expect(this.presenter.viewToModelMap["blog[id]"]).toEqual("id");
			expect(this.presenter.viewToModelMap["blog[title]"]).toEqual("title");
			expect(this.presenter.viewToModelMap["blog[body]"]).toEqual("body");
		});
	});
});
