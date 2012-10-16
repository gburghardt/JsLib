blog.Post = BaseModel.extend({
	prototype: {
		serializeOptions: {rootElement: "post"},
		restClientOptions: {rootElement: "post", baseUrl: "/test/app/blog/post.php"},
		localStorageKey: "blog.post.:id",
		validAttributes: ["title", "body", "publish_date", "blog_id"],
		requires: ["title"],
		validatesFormatOf: {
			publish_date: [
				/^[0-9]{4}[-\/][0-9]{2}[-\/][0-9]{2}$/, // YYYY/MM/DD
				/^[0-9]{2}[-\/][0-9]{2}[-\/][0-9]{4}$/  // MM/DD/YYYY
			]
		}
	}
});
