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
		cancel: function(event) {
			console.info("blog.NewPostInitOperation#cancel");
			console.debug(event);
			event.data.action.cancel();
		},
		create: function(event) {
			console.info("blog.newPostInitOperation#create");
			console.debug(event);
			event.data.action.cancel();
		}
	}
});
