/*

<script type="text/html" data-template-name="blog/post_body">
	#{include blog/header}

	<h1>#{title}</h1>
	<p>#{body}</p>
	<ol>
		<li>#{render blog/post/comments with comments}</li>
	</ol>

	#{include blog/footer}
</script>

*/
Template = Object.extend({

	self: {

		document: document,

		templates: {},

		find: function(name) {
			if (!Template.templates.hasOwnProperty(name)) {
				var source = Template.document.querySelector("script[data-template-name=" + name.replace(/\//g, "\\/") + "]");
				Template.templates[name] = (source) ? new Template(name, source) : null;
				source = null;
			}

			return Template.templates[name];
		}

	},

	prototype: {

		REGEX_INCLUDE: /#\{\s*include\s+(.+?)\s*\}/g,
		REGEX_RENDER: /#\{\s*render\s+(.+?)\s+with\s+(.*?)\s*\}/g,

		name: null,

		source: null,

		initialize: function(name, source) {
			this.name = name;
			this.setSource(source);
		},

		render: function(data) {
			var key, source = this.source, regexRender = this.REGEX_RENDER, regexInclude = this.REGEX_INCLUDE;

			var renderReplacer = function(tag, templateName, dataKey) {
				if (data[ dataKey ] instanceof Array) {
					var buffer = [], i = 0, length = data[ dataKey ].length, template = Template.find(templateName), str;
					
					for (i; i < length; i++) {
						buffer.push(template.render(data[dataKey][i]));
					}

					str = buffer.join("");

					template = buffer = null;

					return str;
				}
				else {
					return Template.find(templateName).render( data[ dataKey ] );
				}
			};

			var includeReplacer = function(tag, templateName) {
				return Template.find(templateName).render(data);
			};

			for (key in data) {
				if (data.hasOwnProperty(key)) {
					regex = new RegExp("#\\{\\s*" + key.replace(/\./g, "\\\.", "g") + "\\s*\\}", "g");

					// replace #{foo} tags with value at data[foo]
					source = source.replace(regex, data[key]);

					// replace #{render} tags
					if (source.match(regexRender)) {
						source = source.replace(regexRender, renderReplacer);
					}

					// replace #{include} tags
					if (source.match(Template.templates[name])) {
						source = source.replace(regexInclude, includeReplacer);
					}
				}
			}

			// clean up unmatched template tags
			source = source.replace(/#\{.+?\}/g, "");

			data = regexRender = regexInclude = renderReplacer = renderInclude = null;

			return source;
		},

		setSource: function(source) {
			if (typeof source === "string") {
				this.source = source;
			}
			else {
				this.source = source.innerHTML;
				this.name = source.getAttribute("data-template-name");
			}

			source = null;
		}

	}

});
