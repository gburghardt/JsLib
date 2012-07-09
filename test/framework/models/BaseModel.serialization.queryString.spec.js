describe("BaseModel", function() {

	describe("modules", function() {

		describe("serialization", function() {

			describe("toQueryString", function() {
				beforeEach(function() {
					this.model = new TestValidation({
						id: 1234,
						name: "Paint",
						description: "Red<br>matte",
						price: 15.99,
						notes: "Per gallon",
						phone: null
					});
				});

				it("serializes attributes", function() {
					var queryString = [
							'id=1234',
							'name=Paint',
							'description=Red%3Cbr%3Ematte',
							'price=15.99',
							'notes=Per%20gallon'
					].join("&");

					expect(this.model.toQueryString()).toEqual(queryString);
				});

				it("serializes attributes as namespaced parameters", function() {
					var queryString = [
							'test_validation[id]=1234',
							'test_validation[name]=Paint',
							'test_validation[description]=Red%3Cbr%3Ematte',
							'test_validation[price]=15.99',
							'test_validation[notes]=Per%20gallon'
					].join("&");

					expect(this.model.toQueryString({rootElement: "test_validation"})).toEqual(queryString);
				});

				it("serializes changed attributes", function() {
					var queryString = [
						'name=Stain',
						'id=1234'
					].join("&");
					this.model.name = "Stain";
					expect(this.model.toQueryString({changedAttributesOnly: true})).toEqual(queryString);
				});
			});

		});

	});

});
