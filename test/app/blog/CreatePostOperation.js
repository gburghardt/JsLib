window.blog = window.blog || {};

blog.CreatePostOperation = InitOperation.extend({
	prototype: {
		destructor: function() {
			this.post = null;
			InitOperation.prototype.destructor.call(this);
		},

		run: function(action) {
			this.post = new blog.Post({
				blog_id: action.params.blog_id,
				title: "Just testing",
				publish_date: "2012/10/02",
				body: "Test test"
			});
			this.render("blog/posts/form", this.post);
		},

		create: function(action) {
			action.cancel();
			this.post.attributes = this.view.getFormData();
			this.post.save(this, {
				saved: function() {
					console.info("blog.CreatePostOperation#save - Saved");
					this.destroyOperationChain();
				},
				invalid: function(errors) {
					console.warn("blog.CreatePostOperation#save - Invalid");
					console.debug(errors);
					this.view.setFieldErrors(errors);
				},
				error: function(errors) {
					console.error("blog.CreatePostOperation#save - Error");
					this.view.setFieldErrors(errors);
				}
			});
		}
	}
});
