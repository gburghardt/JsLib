window.blog = window.blog || {};

blog.NewPostInitOperation = BaseOperation.extend({
	prototype: {
		run: function() {
			console.info("blog.NewPostInitOperation#run");
			this.map({
				"blog-create_post": "create",
				"blog-cancel_new_post": "cancel"
			});
		},
		cancel: function(event, action) {
			console.info("blog.NewPostInitOperation#cancel");
			console.debug(event);
			action.cancel();
		},
		create: function(event, action) {
			console.info("blog.newPostInitOperation#create");
			console.debug(event);
			action.cancel();
		}
	}
});
