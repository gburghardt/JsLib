products = window.Products || {};

products.Base = BaseModel.extend({
	prototype: {
		validAttributes: ["id", "name", "description", "created_at", "updated_at"]
	}
});