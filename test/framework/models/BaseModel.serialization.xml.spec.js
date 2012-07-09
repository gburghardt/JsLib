describe("BaseModel", function() {

	describe("modules", function() {

		describe("serialization", function() {

			describe("toXML", function() {
				beforeEach(function() {
					this.model = new TestValidation({
						id: 1234,
						name: "Paint",
						description: "Red<br>\"matte\"",
						price: 15.99,
						notes: "Per gallon",
						phone: null
					});
				});

				it("converts attributes to XML with no root element", function() {
					var xml = [
						'<id>1234</id>',
						'<name>Paint</name>',
						'<description>Red&lt;br&gt;&quot;matte&quot;</description>',
						'<price>15.99</price>',
						'<notes>Per gallon</notes>'
					].join("");

					expect(this.model.toXML()).toEqual(xml);
				});

				it("converts attributes to XML with a root element", function() {
					var xml = [
						'<test_validation>',
							'<id>1234</id>',
							'<name>Paint</name>',
							'<description>Red&lt;br&gt;&quot;matte&quot;</description>',
							'<price>15.99</price>',
							'<notes>Per gallon</notes>',
						'</test_validation>'
					].join("");

					expect(this.model.toXML({rootElement: "test_validation"})).toEqual(xml);
				});

				it("converts attributes to XML using shorthand syntax", function() {
					var xml = '<test_validation id="1234" name="Paint" description="Red&lt;br&gt;&quot;matte&quot;" price="15.99" notes="Per gallon" />';

					expect(this.model.toXML({rootElement: 'test_validation', shorthand: true})).toEqual(xml);
				});

				it("converts changed attributes to xml", function() {
					var xml = [
						'<name>Stain</name>',
						'<id>1234</id>'
					].join("");
					this.model.name = "Stain";
					expect(this.model.toXML({changedAttributesOnly: true})).toEqual(xml);
				});
			});
		});

	});

});