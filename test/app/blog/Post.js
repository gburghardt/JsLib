blog.Post = BaseModel.extend({
	prototype: {
		validAttributes: ["title", "body", "publish_date"]
	}
});
