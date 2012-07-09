
function TestModel(attributes) {
	this.constructor(attributes);
}
TestModel.prototype = {
	__proto__: BaseModel.prototype
};

function TestModelPrimaryKeyOverride(attributes) {
	this.constructor(attributes);
}
TestModelPrimaryKeyOverride.prototype = {
	__proto__: BaseModel.prototype,
	primaryKey: "foo_id"
};

function TestModelAttributes(attributes) {
	this.constructor(attributes);
}
TestModelAttributes.prototype = {
	__proto__: BaseModel.prototype,
	validAttributes: ["firstName", "lastName"]
};

function TestValidation(attributes) {
	this.constructor(attributes);
}
TestValidation.prototype = {
	__proto__: BaseModel.prototype,
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
};

function TestMaxLengthValidation(attributes) {
	this.constructor(attributes);
}
TestMaxLengthValidation.prototype = {
	__proto__: BaseModel.prototype,
	validAttributes: ["name", "description", "notes"],
	validatesMaxLength: {name: 10, description: 8, notes: 4}
};

function TestNumericValidation(attributes) {
	this.constructor(attributes);
}
TestNumericValidation.prototype = {
	__proto__: BaseModel.prototype,
	validAttributes: ["price"],
	validatesNumeric: ["price"]
};

function TestFormatValidation(attributes) {
	this.constructor(attributes);
}
TestFormatValidation.prototype = {
	__proto__: BaseModel.prototype,
	validAttributes: ["phone", "address"],
	validatesFormatOf: {
		phone: [
			/^\d{3}-\d{3}-\d{4}$/,
			/^\(\d{3}\) \d{3}-\d{4}$/
		],
		address: /^\d+ \w+( [.\w]+)?, \w+, [A-Z]{2} \d{5}$/
	}
};

function TestRelations(attributes) {
	this.constructor(attributes);
}
TestRelations.prototype = {
	__proto__: BaseModel.prototype,
	validAttributes: ['name', 'description', 'price', 'quantity', 'category_id'],
	hasOne: {
		category: {className: 'Category'}
	}
};

function Store(attributes) {
	this.constructor(attributes);
}
Store.prototype = {
	__proto__: BaseModel.prototype,
	validAttributes: ["id", "name"],
	requires: ["id", "name"],
	hasMany: {
		deals: {className: "Deal", foreignKey: "store_id"}
	},
	hasOne: {
		distribution_center: {className: "DistributionCenter"}
	}
};

function Category(attributes) {
	this.constructor(attributes);
}
Category.prototype = {
	__proto__: BaseModel.prototype,
	validAttributes: ['id', 'name']
};

function Deal(attributes) {
	this.constructor(attributes);
}
Deal.prototype = {
	__proto__: BaseModel.prototype,
	validAttributes: ['id', 'store_id', 'name', 'description', 'start_date', 'end_date'],
	requires: ['id', 'store_id']
};

function DistributionCenter(attributes) {
	this.constructor(attributes);
}
DistributionCenter.prototype = {
	__proto__: BaseModel.prototype,
	validAttributes: [
		'address',
		'address2',
		'postal_code',
		'region',
		'country',
		'phone'
	]
};
