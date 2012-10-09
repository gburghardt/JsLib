window.blog = window.blog || {};

blog.PostsListOperation = InitOperation.extend({
	prototype: {
		run: function(action) {
			console.info("blog.PostsListOperation#run");
			this.posts = new blog.Posts({blog_id: 1});
			this.render("blog/posts/index", this.posts);
		}
	}
});

