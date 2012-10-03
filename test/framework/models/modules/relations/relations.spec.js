describe("BaseModel", function() {

	describe("relations", function() {

		describe("getClassReference", function() {
			window.__classReferenceTest__ = {
				foo: {
					bar: {
						Test: function() {}
					}
				}
			};

			it("gets a class reference by a String class name", function() {
				expect(BaseModel.Relations.getClassReference("__classReferenceTest__.foo.bar.Test")).toBeFunction();
			});

			it("throws an error when an invalid String class name is provided", function() {
				expect(function() {BaseModel.Relations.getClassReference("__classReferenceTest__.foo.bar.InvalidClassName");}).toThrowError();
			});
		});

		describe("getHasOneRelation", function() {
			it("returns null when there is no hasOne relation", function() {
				var store = new Store();
				expect(store.getHasOneRelation("__NON_EXISTENT__")).toBeNull();
			});

			it("returns null for relations with no attributes", function() {
				var store = new Store();
				spyOn(BaseModel.Relations, "getClassReference");
				expect(store.getHasOneRelation("destribution_center")).toBeNull();
				expect(BaseModel.Relations.getClassReference).wasNotCalled();
			});

			it("returns an already created relation", function() {
				var store = new Store();
				var distributionCenter = new DistributionCenter();
				store._relations.distribution_center = distributionCenter;
				spyOn(BaseModel.Relations, "getClassReference");
				expect(store.getHasOneRelation("distribution_center")).toEqual(distributionCenter);
				expect(BaseModel.Relations.getClassReference).wasNotCalled();
			});

			it("instantiates a new relation object", function() {
				var store = new Store({distribution_center: {id: 1234}});
				spyOn(BaseModel.Relations, "getClassReference").andReturn(DistributionCenter);
				expect(store.getHasOneRelation("distribution_center")).toBeInstanceof(DistributionCenter);
				expect(BaseModel.Relations.getClassReference).toHaveBeenCalledWith("DistributionCenter");
			});
		});

		describe("getHasManyRelation", function() {
			it("returns null when there is no hasMany relation", function() {
				var store = new Store();
				expect(store.getHasManyRelation("non_existent")).toBeNull();
			});

			it("returns null for relations with no attributes", function() {
				var store = new Store();
				expect(store.getHasManyRelation("deals")).toBeNull();
			});

			it("returns an already created relation", function() {
				var store = new Store();
				var deals = [new Deal(), new Deal()]
				store._relations.deals = deals;
				expect(store.getHasManyRelation("deals") === deals).toBeTrue();
			});

			it("creates new relations", function() {
				var store = new Store();
				store.relationsAttributes.deals = [{id: 123}];
				var deals = store.getHasManyRelation("deals");
				expect(deals.length).toEqual(1);
				expect(deals[0].id).toEqual(123);
			});
		});

		describe("hasOne", function() {
			beforeEach(function() {
				this.attributes = {
					id: 1234,
					name: "Chainsaw",
					description: "Cuts wood",
					price: 135.99,
					quantity: 8,
					category_id: 98,
					category: {
						id: 98,
						name: "Outdoors"
					}
				};
			});

			it("returns null when no attributes exist for a relation", function() {
				var model = new TestRelations();
				expect(model.category).toBeNull();
			});

			it("instantiates a relation when attributes exist", function() {
				var model = new TestRelations(this.attributes);
				expect(model.category).toBeDefined();
				expect(model.category).toBeInstanceof(Category);
				expect(model.category.name).toEqual("Outdoors");
				expect(model.category.id).toEqual(98);
			});

			it("lazily instantiates a relation when attributes exist", function() {
				var model = new TestRelations();
				expect(model.category).toBeNull();
				expect(model._relations.category).toBeUndefined();
				model.attributes = this.attributes;
				expect(model.category).toBeDefined();
				expect(model.category).toBeInstanceof(Category);
				expect(model.category.name).toEqual("Outdoors");
				expect(model.category.id).toEqual(98);
				expect(model.category_id).toEqual(model.category.id);
			});

			it("sets relationship Id attribute to null when setting relationship to null", function() {
				var model = new TestRelations(this.attributes);
				expect(model.category).toBeInstanceof(Category);
				expect(model.category.id).toEqual(model.category_id);
				expect(model.category_id).toEqual(98);
				model.category = null;
				expect(model.category).toBeNull();
				expect(model.category_id).toBeNull();
				expect(model.changedAttributes.category_id).toEqual(98);
			});

			it("assigning a relationship by object instance changes relationship Id", function() {
				var model = new TestRelations();
				var category = new Category({id: 98, name: "Outdoors"});
				expect(model.category_id).toBeNull();
				model.category = category;
				expect(model.relationsAttributes.category).toBeNull();
				expect(model.category).toEqual(category);
				expect(model.category.id).toEqual(98);
				expect(model.category_id).toEqual(category.id);
			});
		});

		describe("hasMany", function() {
			beforeEach(function() {
				this.attributes = {
					id: 1234,
					name: "Chainsaw",
					description: "Cuts wood",
					price: 135.99,
					quantity: 8,
					deals: [{
						id: 1,
						store_id: 1234,
						name: "New Year's Blowout",
						description: "Take 50% off everything in store!",
						start_date: "January 1, 2012",
						end_date: "February 1, 2012"
					},{
						id: 2,
						store_id: 1234,
						name: "Valentine's Day Sale",
						description: "45% off all chocolates",
						start_date: "February 15, 2012",
						end_date: "February 16, 2012"
					}]
				};
			});

			it("returns null when no attributes exist for a relation", function() {
				var model = new Store();
				expect(model.deals).toBeNull();
				expect(model._relations.deals).toBeUndefined();
			});

			it("instantiates a relation when attributes exist", function() {
				var model = new Store(this.attributes);
				expect(model.deals).toBeArray();
				expect(model.deals.length).toEqual(2);
				expect(model._relations.deals).toBeArray();
				expect(model.deals[0]).toBeInstanceof(Deal);
				expect(model.deals[1]).toBeInstanceof(Deal);
			});

			it("lazily instantiates a relation when attributes exist", function() {
				var model = new Store();
				expect(model.deals).toBeNull();
				expect(model._relations.deals).toBeUndefined();
				model.attributes = this.attributes;
				expect(model.deals).toBeArray();
				expect(model.deals.length).toEqual(2);
				expect(model._relations.deals).toBeArray();
				expect(model.deals[0]).toBeInstanceof(Deal);
				expect(model.deals[1]).toBeInstanceof(Deal);
			});

			it("assigns a relationship by object instance", function() {
				var model = new Store(this.attributes);
				var oldDeals = model.deals;
				var newDeals = [new Deal({id: 3, store_id: 1234})];
				model.deals = newDeals;
				expect(model.relationsAttributes.deals).toBeNull();
				expect(model.changedAttributes.deals).toBeUndefined();
				expect(model.deals).toEqual(newDeals);
				expect(model.deals.length).toEqual(1);
			});
		});

		describe("validation", function() {
			it("sets valid to false when a relationship is invalid", function() {
				var model = new Store({
					id: 1234,
					name: "Expo World",
					deals: [{
						name: "I am not valid"
					},{
						id: 5,
						store_id: 1234,
						name: "I am valid"
					}]
				});

				expect(model.validate()).toBeFalse();
				expect(model.deals[0].valid).toBeFalse();
				expect(model.deals[1].valid).toBeTrue();
				expect(model.errors.deals[0]).toEqual("has errors");
			});

			it("sets valid to true when all relations are valid", function() {
				var model = new Store({
					id: 1234,
					name: "Expo World",
					deals: [{
						id: 6,
						store_id: 1234,
						name: "I am valid"
					},{
						id: 5,
						store_id: 1234,
						name: "I am valid too"
					}]
				});

				expect(model.validate()).toBeTrue();
			});

			it("sets valid to true when there are no relations", function() {
				var model = new Store({
					id: 1234,
					name: "Expo World"
				});

				expect(model.validate()).toBeTrue();
			});

			it("sets valid to false when relations are valid, but main attributes are not", function() {
				var model = new Store({
					id: 1234,
					deals: [{
						id: 6,
						store_id: 1234,
						name: "I am valid"
					},{
						id: 5,
						store_id: 1234,
						name: "I am valid too"
					}]
				});

				expect(model.validate()).toBeFalse();
				expect(model.errors.name).toBeArray();
			});
		});

		describe("serialization", function() {
			beforeEach(function() {
				this.storeWithDealsAndDistributionCenterAttrs = {
					id: 1234,
					deals: [{
						id: 4,
						store_id: 1234,
						name: "Testing1"
					},{
						id: 78,
						store_id: 1234,
						name: "Testing2"
					}],
					distribution_center: {
						id: 9876,
						address: "123 South St",
						postal_code: "12345-1234",
						region: "NE",
						country: "United States of America"
					}
				};

				this.storeWithDealsAttrs = {
					id: 1234,
					deals: [{
						id: 4,
						store_id: 1234,
						name: "Testing1"
					}]
				};

				this.storeWithDistributionCenterAttrs = {
					id: 1234,
					distribution_center: {
						id: 9876,
						address: "123 South St",
						postal_code: "12345-1234",
						region: "NE",
						country: "United States of America"
					}
				};

				this.storeWithOnlyDealsAttrs = {
					deals: [{
						id: 4,
						store_id: 1234,
						name: "Testing1"
					},{
						id: 78,
						store_id: 1234,
						name: "Testing2"
					}]
				};
			});

			describe("queryString", function() {
				it("serializes relations into a namespaced query string", function() {
					var model = new Store(this.storeWithDealsAndDistributionCenterAttrs);
					var queryString = [
						'store[id]=1234',
						'store[deals][0][id]=4',
						'store[deals][0][store_id]=1234',
						'store[deals][0][name]=Testing1',
						'store[deals][1][id]=78',
						'store[deals][1][store_id]=1234',
						'store[deals][1][name]=Testing2',
						'store[distribution_center][id]=9876',
						'store[distribution_center][address]=123%20South%20St',
						'store[distribution_center][postal_code]=12345-1234',
						'store[distribution_center][region]=NE',
						'store[distribution_center][country]=United%20States%20of%20America'
					].sort().join("&");
					var actual = model.toQueryString({rootElement: "store"}).split(/&/g).sort().join("&");
					expect(actual).toEqual(queryString);
				});

				it("skips relations that do not exist", function() {
					var model = new Store(this.storeWithDealsAttrs);
					var queryString = [
						'store[id]=1234',
						'store[deals][0][id]=4',
						'store[deals][0][store_id]=1234',
						'store[deals][0][name]=Testing1'
					].sort().join("&");
					var actual = model.toQueryString({rootElement: "store"}).split(/&/g).sort().join("&");
					expect(actual).toEqual(queryString);
				});
			});

			describe("toXml", function() {
				beforeEach(function() {
					this.store = new Store();
				});

				it("serializes hasOne relationships", function() {
					this.store.attributes = this.storeWithDistributionCenterAttrs;

					var xml = [
						'<store>',
							'<id>1234</id>',
							'<distribution_center>',
								'<id>9876</id>',
								'<address>123 South St</address>',
								'<postal_code>12345-1234</postal_code>',
								'<region>NE</region>',
								'<country>United States of America</country>',
							'</distribution_center>',
						'</store>'
					].join("");
					var action = this.store.toXml({rootElement: "store"});
					expect(action).toEqual(xml);
				});

				it("serializes hasMany relationships", function() {
					this.store.attributes = this.storeWithOnlyDealsAttrs;

					var xml = [
						'<store>',
							'<deals>',
								'<deal>',
									'<id>4</id>',
									'<store_id>1234</store_id>',
									'<name>Testing1</name>',
								'</deal>',
								'<deal>',
									'<id>78</id>',
									'<store_id>1234</store_id>',
									'<name>Testing2</name>',
								'</deal>',
							'</deals>',
						'</store>'
					].join("");

					var actual = this.store.toXml({rootElement: "store"});
					expect(actual).toEqual(xml);
				});
			});

			describe("hasManyToJson", function() {
				// TODO: Start here. Find a more focused, repeatable version of error in "toJson serializes multiple hasMany relationships"
				it("serializes a single hasMany relation with multiple objects", function() {
					var attributes = {
						distribution_centers: [
							{
								id:425345,
								address: "123 South St",
								postal_code: "12345",
								phone: "555-555-5555"
							},{
								id: 123169,
								address: "37 Smith St",
								postal_code: "12346"
							}
						]
					};
					var expectedJson = [
						'"distribution_centers":[',
							'{',
								'"address":"123 South St",',
								'"postal_code":"12345",',
								'"phone":"555-555-5555",',
								'"id":425345',
							'},{',
								'"address":"37 Smith St",',
								'"postal_code":"12346",',
								'"id":123169',
							'}',
						']'
					].join("");
					var salesRegion = new SalesRegion(attributes);
					var actualJson = salesRegion.hasManyToJson();
					expect(actualJson).toEqual(expectedJson);
				});
			});

			describe("toJson", function() {
				it("serializes hasOne relationships", function() {
					var store = new Store(this.storeWithDistributionCenterAttrs);
					var actual = store.toJson({rootElement: "store"});
					var expected = [
						'{"store":{',
							'"id":1234,',
							'"distribution_center":{',
								'"address":"123 South St",',
								'"postal_code":"12345-1234",',
								'"region":"NE",',
								'"country":"United States of America",',
								'"id":9876',
							'}',
						'}}'
					].join("");
					expect(actual).toEqual(expected);
				});

				it("serializes hasMany relationships", function() {
					var store = new Store(this.storeWithOnlyDealsAttrs);
					var actual = store.toJson({rootElement: "store"});
					var expected = [
						'{"store":{',
							'"deals":[{',
								'"id":4,',
								'"store_id":1234,',
								'"name":"Testing1"',
							'},{',
								'"id":78,',
								'"store_id":1234,',
								'"name":"Testing2"',
							'}]',
						'}}'
					].join("");
					expect(actual).toEqual(expected);
				});

				xit("serializes multiple hasMany relationships", function() {
					var attributes = {
						id: 123,
						distribution_centers: [
							{
								id:425345,
								address: "123 South St",
								postal_code: "12345",
								phone: "555-555-5555"
							},{
								id: 123169,
								address: "37 Smith St",
								postal_code: "12346"
							}
						],
						stores: [
							{
								id: 35,
								name: "Woolworth",
								deals: [
									{
										id: 2345,
										store_id: 35,
										name: "Half off"
									}
								]
							},{
								id: 68,
								name: "Smith's Hardware",
								deals: [
									{
										id: 46467,
										store_id: 68,
										name: "25% off"
									}
								]
							}
						]
					};
					var json = [
						'{',
							'"sales_region":{',
								'"id":123,',
								'"stores":[',
									'{',
										'"id":35,',
										'"name":"Woolworth",',
										'"deals":[',
											'{',
												'"id":2345,',
												'"store_id":35,',
												'"name":"Half off"',
											'}',
										']',
									'},{',
										'"id":68,',
										'"name":"Smith\'s Hardware",',
										'"deals":[',
											'{',
												'"id":46467,',
												'"store_id":68,',
												'"name":"25% off"',
											'}',
										']',
									'}',
								'],',
								'"distribution_centers":[',
									'{',
										'"id":425345,',
										'"address":"123 South St",',
										'"postal_code":"12345",',
										'"phone":"555-555-5555"',
									'},{',
										'"id":123169,',
										'"address":"37 Smith St",',
										'"postal_code":"12346"',
									'}',
								']',
							'}',
						'}'
					].join("");
					var salesRegion = new SalesRegion(attributes);
					var actualJson = salesRegion.toJson({rootElement: "sales_region"});
					expect(actualJson).toEqual(json);
				});
			});
		});

	});

});