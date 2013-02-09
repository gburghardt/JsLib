window.blog = window.blog || {};

blog.BlogsListOperation = InitOperation.extend({
	prototype: {
		run: function(action) {
			console.info("blog.BlogsListOperation#run");

			this.blogs = blog.Blog.fetchAll(this, {
				found: function() {
					this.render("blog/index", this.blogs);
				},
				notFound: function() {
					this.render("blog/index", this.blogs);
				}
			});

		}
	}
});
