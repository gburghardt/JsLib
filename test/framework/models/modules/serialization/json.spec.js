describe("BaseModel", function() {

	describe("modules", function() {

		describe("serialization", function() {

			describe("toJson", function() {
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

				it("serializes attributes into an anonymous object", function() {
					var json = [
						'{',
							'"name":"Paint",',
							'"description":"Red<br>matte",',
							'"price":15.99,',
							'"notes":"Per gallon",',
							'"phone":null,',
							'"id":1234',
						'}'
					].join("");

					expect(this.model.toJson()).toEqual(json);
				});

				it("serializes attributes into a named object", function() {
					var json = [
						'{',
							'"test_validation":{',
								'"name":"Paint",',
								'"description":"Red<br>matte",',
								'"price":15.99,',
								'"notes":"Per gallon",',
								'"phone":null,',
								'"id":1234',
							'}',
						'}'
					].join("");

					expect(this.model.toJson({rootElement: "test_validation"})).toEqual(json);
				});

				it("serializes changed attributes", function() {
					var json = [
						'{',
							'"name":"Stain",',
							'"id":1234',
						'}'
					].join("");
					this.model.name = "Stain";
					expect(this.model.changedAttributes.name).toEqual("Paint");
					expect(this.model.toJson({changedAttributesOnly: true})).toEqual(json);
				});

				it("serializes only the primary key when no changed attributes exist", function() {
					var json = '{"id":1234}';
					expect(this.model.toJson({changedAttributesOnly: true})).toEqual(json);
				});
			});

		});

	});

});
