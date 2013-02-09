window.blog = window.blog || {};

blog.CreateBlogOperation = InitOperation.extend({
	prototype: {
		destructor: function() {
			this.blog = null;
			InitOperation.prototype.destructor.call(this);
		},

		run: function(action) {
			this.blog = new blog.Blog();
			this.render("blog/create", {blog: this.blog});
		},

		create: function(action) {
			action.cancel();
			this.blog.attributes = this.view.getFormData();
			this.blog.save(this, {
				saved: function() {
					console.info("blog.CreateBlogOperation#save - Saved");
					this.destroyOperationChain();
				},
				invalid: function(errors) {
					console.warn("blog.CreateBlogOperation#save - Invalid");
					console.debug(errors);
					this.view.setFieldErrors(errors);
				},
				error: function(errors) {
					console.error("blog.CreateBlogOperation#save - Error");
					this.view.setFieldErrors(errors);
				}
			});
		}
	}
});
