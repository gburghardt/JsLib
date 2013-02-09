blog.Blog = BaseModel.extend({
	prototype: {
		serializeOptions: {rootElement: "blog"},
		restClientOptions: {rootElement: "blog", baseUrl: "/test/app/blog/blog.php"},
		localStorageKey: "blog.:id",
		validAttributes: ["title", "author", "updated_at", "created_at"],
		requires: ["title"]
	}
});
