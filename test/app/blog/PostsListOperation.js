window.blog = window.blog || {};

blog.PostsListOperation = InitOperation.extend({
	prototype: {
		run: function(action) {
			this.posts = new blog.Posts({blog_id: 1});
			this.render("blog/list", this.posts);
		}
	}
});

