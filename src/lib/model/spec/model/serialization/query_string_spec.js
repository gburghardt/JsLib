describe("Model", function() {

	var Product = Model.Base.extend({
		prototype: {
			schema: {
				name: "String",
				description: "String",
				price: "Number",
				notes: "String",
				phone: "String"
			}
		}
	});

	describe("Serialization", function() {

		describe("QueryString", function() {

			describe("toQueryString", function() {

				beforeEach(function() {
					Model.Base.eventDispatcher = new events.Dispatcher();

					this.model = new Product({
						id: 1234,
						name: "Paint",
						description: "Red<br>matte",
						price: 15.99,
						notes: "Per gallon",
						phone: null
					});
				});

				afterEach(function() {
					Model.Base.eventDispatcher.destructor();
					Model.Base.eventDispatcher = null;
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
							'product[id]=1234',
							'product[name]=Paint',
							'product[description]=Red%3Cbr%3Ematte',
							'product[price]=15.99',
							'product[notes]=Per%20gallon'
					].join("&");

					expect(this.model.toQueryString({rootElement: "product"})).toEqual(queryString);
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
