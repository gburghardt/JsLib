// <script type="text/html" data-template-name="blog/post_body">
// 	#{include blog/header}
// 
// 	<h1>#{title}</h1>
// 	<p>#{body}</p>
// 	<ol>
// 		<li>#{render blog/post/comments with comments}</li>
// 	</ol>
// 
// 	#{include blog/footer}
// </script>

Template = Object.extend({

	self: {

		cacheBuster: new Date().getTime(),

		document: document,

		REGEX_INCLUDE: /#\{\s*include\s+(.+?)\s*\}/g,
		REGEX_RENDER: /#\{\s*render\s+(.+?)(\s+with\s+(.*?)\s*)?\}/g,

		templates: {},

		fetch: function(name, context, callback) {
			if (Template.templates[name]) {
				callback.call(context, Template.templates[name]);
			}
			else {
				var source = Template.getTemplateSourceNode(name);
				var url = source.getAttribute("data-src");
				var xhr;

				var cleanup = function() {
					context = callback = xhr = source = cleanup = null;
				};

				if (url) {
					url = url + (/\?/.test(url) ? "&" : "?") + "cacheBuster=" + Template.cacheBuster;
					xhr = new XMLHttpRequest();
					xhr.open("GET", url);
					xhr.onreadystatechange = function() {
						if (this.readyState === 4 && this.status === 200) {
							if (this.status === 200) {
								Template.fetchSubTemplates(xhr.responseText, function() {
									Template.templates[name] = new Template(name, xhr.responseText);
									callback.call(context, Template.templates[name]);
									cleanup();
								});
							}
							else if (this.status === 403) {
								cleanup();
								throw new Error("Failed to fetch template from URL: " + url + ". Server returned 403 Not Authorized");
							}
							else if (this.status === 404) {
								cleanup();
								throw new Error("Failed to fetch template from URL: " + url + ". Server returned 404 Not Found.");
							}
							else if (this.status >= 400) {
								cleanup();
								throw new Error("Failed to fetch template from URL: " + url + ". Server returned an error (" + this.status + ")");
							}
						}
					};
					xhr.send(null);
				}
				else {
					Template.templates[name] = new Template(name, source);
					Template.fetchSubTemplates(Template.templates.source, function() {
						callback.call(context, Template.templates[name]);
						cleanup();
					});
				}
			}
		},

		fetchSubTemplates: function(source, callback) {
			var subTemplates = [], total, i = 0, count = 0;

			var handleTemplateFetched = function() {
				count++;

				if (count === total) {
					callback();
				}
			};

			source.replace(this.REGEX_RENDER, function(tag, templateName, dataKey) {
				subTemplates.push(templateName);
			}).replace(this.REGEX_INCLUDE, function(tag, templateName) {
				subTemplates.push(templateName);
			});

			total = subTemplates.length;

			if (total) {
				for (i = 0; i < total; i++) {
					Template.fetch(subTemplates[i], this, handleTemplateFetched);
				}
			}
			else {
				callback();
			}
		},

		find: function(name) {
			if (!Template.templates[name]) {
				var source = Template.getTemplateSourceNode(name);
				Template.templates[name] = new Template(name, source);
				source = null;
			}

			return Template.templates[name];
		},

		getTemplateSourceNode: function(name) {
			var source = Template.document.querySelector("script[data-template-name=" + name.replace(/\//g, "\\/") + "]");

			if (!source) {
				throw new Error('Missing template ' + name + '. Required: <script type="text/html" data-template-name="' + name + '"></script>');
			}

			return source;
		}

	},

	prototype: {

		name: null,

		source: null,

		subTemplatesFetched: false,

		initialize: function(name, source) {
			this.name = name;
			this.setSource(source);
		},

		render: function(data) {
			var key, source = this.source, regexRender = Template.REGEX_RENDER, regexInclude = Template.REGEX_INCLUDE;

			var renderReplacer = function(tag, templateName, withClause, dataKey) {
				var renderData = (!dataKey) ? data : data[ dataKey ];
				if (renderData instanceof Array) {
					var buffer = [], i = 0, length = renderData.length, template = Template.find(templateName), str;
					
					for (i; i < length; i++) {
						buffer.push( template.render( renderData[i] ) );
					}

					str = buffer.join("");

					template = buffer = null;

					return str;
				}
				else {
					return Template.find(templateName).render( renderData );
				}
			};

			var includeReplacer = function(tag, templateName) {
				return Template.find(templateName).render(data);
			};

			var doReplace = function(key) {
				var regex = new RegExp("#\\{\\s*" + key.replace(/\./g, "\\\.", "g") + "\\s*\\}", "g");

				// replace #{foo} tags with value at data[foo]
				source = source.replace(regex, data[key] || "");

				// replace #{render with foo} tags by rendering data[foo]
				if (source.match(regexRender)) {
					source = source.replace(regexRender, renderReplacer);
				}

				// replace #{include} tags
				if (source.match(Template.templates[name])) {
					source = source.replace(regexInclude, includeReplacer);
				}
			};

			if (data.getTemplateKeys) {
				var keys = data.getTemplateKeys(), i = 0, length = keys.length;

				for (i; i < length; i++) {
					doReplace(keys[i]);
				}
			}
			else {
				for (key in data) {
					if (data.hasOwnProperty(key)) {
						doReplace(key);
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
