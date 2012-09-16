window.blog = window.blog || {};

blog.NewPostInitOperation = InitOperation.extend({
	prototype: {
		operationMap: {
			"blog-create_post": "create",
			"blog-cancel_new_post": "cancel"
		},

		destructor: function() {
			if (this.postView) {
				this.postView.destructor();
				this.postView = null;
			}

			this.post = null;

			InitOperation.prototype.destructor.call(this);
		},

		run: function(action) {
			this.post = new blog.Post();
			this.postView = new FormView(this.element, "blog/post/form").render(this.post);
		},

		create: function(event, action) {
			action.cancel();
			this.post.attributes = this.postView.getFormData();
			this.post.save(this, {
				saved: function() {
					this.destructor();
				},
				invalid: function(errors) {
					this.postView.setFieldErrors(errors);
				}
			});
		}
	}
});
