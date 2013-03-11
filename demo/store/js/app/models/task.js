Task = Model.Base.extend({
	prototype: {
		schema: {
			name: "String",
			created_at: "Date",
			updated_at: "Date"
		},
		requires: [
			"name"
		]
	}
});
