window.blog = window.blog || {};

blog.NewPostInitOperation = InitOperation.extend({
	prototype: {
		run: function() {
			console.info("blog.NewPostInitOperation#run");
			console.debug(this);
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
			console.info("blog.NewPostInitOperation#create");
			console.debug(event);
			action.cancel();
		}
	}
});
