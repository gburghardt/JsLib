products = window.Products || {};

products.Base = Model.Base.extend({
	prototype: {
		schema: {
			name: "String",
			description: "String",
			created_at: "String",
			updated_at: "String"
		}
	}
});