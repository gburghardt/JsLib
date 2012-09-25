window.blog = window.blog || {};

blog.CreatePostOperation = InitOperation.extend({
	prototype: {
		destructor: function() {
			this.post = null;
			InitOperation.prototype.destructor.call(this);
		},

		run: function(action) {
			this.post = new blog.Post({publish_date: "I am an invalid date"});
			this.render("blog/post/form", this.post);
		},

		create: function(action) {
			action.cancel();
			this.post.attributes = this.view.getFormData();
			this.post.save(this, {
				saved: function() {
					console.info("blog.NewPostInitOperation#save - Saved");
					this.destroyOperationChain();
				},
				invalid: function(errors) {
					console.warn("blog.NewPostInitOperation#save - Invalid");
					console.debug(errors);
					this.view.setFieldErrors(errors);
				}
			});
		}
	}
});
