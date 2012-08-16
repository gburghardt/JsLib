TestModel = BaseModel.extend();

TestModelPrimaryKeyOverride = BaseModel.extend({
	prototype: {
		primaryKey: "foo_id"
	}
});

TestModelAttributes = BaseModel.extend({
	prototype: {
		validAttributes: ["firstName", "lastName"]
	}
});

TestValidation = BaseModel.extend({
	prototype: {
		validAttributes: [
			"name",
			"description",
			"price",
			"notes",
			"phone"
		],
		requires: [
			"price",
			"name",
			"description",
			"notes",
			"phone"
		],
		validatesNumeric: [
			"price"
		],
		validatesMaxLength: {
			name: 40,
			description: 256
		},
		validatesFormatOf: {
			name: /^testing.*$/,
			phone: /^\s*\d{3}\s*[-.]*\s*\d{3}\s*[-.]*\s*\d{4}\s*$/
		}
	}
});

TestMaxLengthValidation = BaseModel.extend({
	prototype: {
		validAttributes: ["name", "description", "notes"],
		validatesMaxLength: {name: 10, description: 8, notes: 4}
	}
});

TestNumericValidation = BaseModel.extend({
	prototype: {
		validAttributes: ["price"],
		validatesNumeric: ["price"]
	}
});

TestFormatValidation = BaseModel.extend({
	prototype: {
		validAttributes: ["phone", "address"],
		validatesFormatOf: {
			phone: [
				/^\d{3}-\d{3}-\d{4}$/,
				/^\(\d{3}\) \d{3}-\d{4}$/
			],
			address: /^\d+ \w+( [.\w]+)?, \w+, [A-Z]{2} \d{5}$/
		}
	}
});

TestRelations = BaseModel.extend({
	prototype: {
		validAttributes: ['name', 'description', 'price', 'quantity', 'category_id'],
		hasOne: {
			category: {className: 'Category'}
		}
	}
});

Store = BaseModel.extend({
	prototype: {
		validAttributes: ["id", "name"],
		requires: ["id", "name"],
		hasMany: {
			deals: {className: "Deal", foreignKey: "store_id"}
		},
		hasOne: {
			distribution_center: {className: "DistributionCenter"}
		}
	}
});

Category = BaseModel.extend({
	prototype: {
		validAttributes: ['id', 'name']
	}
});

Deal = BaseModel.extend({
	prototype: {
		validAttributes: ['id', 'store_id', 'name', 'description', 'start_date', 'end_date'],
		requires: ['id', 'store_id']
	}
});

DistributionCenter = BaseModel.extend({
	prototype: {
		validAttributes: [
			'address',
			'address2',
			'postal_code',
			'region',
			'country',
			'phone'
		]
	}
});
