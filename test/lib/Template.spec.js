describe("Template", function() {

	describe("find", function() {
		it("finds the template source in the document", function() {
			var script = document.createElement("script");
			script.setAttribute("type", "text/html");
			script.setAttribute("data-template-name", "test/find");
			script.innerHTML = '<p>I am a template!</p>';
			document.body.appendChild(script);
			var template = Template.find("test/find");
			expect(template).toBeInstanceof(Template);
			expect(Template.templates["test/find"]).toEqual(template);
		});

		it("returns null when no template source exists in the document", function() {
			expect(function() {
				Template.find("test/non_existent")
			}).toThrowError();
		});

		it("returns an existing template instance", function() {
			var mockDocument = {
				querySelector: function() {}
			};
			var realDocument = Template.document;
			Template.document = mockDocument;
			spyOn(mockDocument, "querySelector");
			Template.templates["test/existing"] = new Template("test/existing", "I am a template");
			var template = Template.find("test/existing");
			Template.document = realDocument;
			expect(template).toEqual(Template.templates["test/existing"]);
			expect(mockDocument.querySelector).wasNotCalled();
		});
	});

	describe("initialize", function() {
		it("requires a name and source", function() {
			expect(function() {
				new Template();
			}).toThrowError();

			expect(function() {
				new Template("test/name");
			}).toThrowError();

			var template = new Template("test/name", "I am a template");
			expect(template).toBeInstanceof(Template);
		});

		it("sets the source from a string", function() {
			var source = "I am a template";
			var template = new Template("test/initialize", source);
			expect(template.source).toEqual(source);
		});

		it("sets the source from a script tag", function() {
			var source = document.createElement("source");
			source.setAttribute("type", "text/html");
			source.setAttribute("data-template-name", "test/initialize_script_source");
			source.innerHTML = 'I am a template!';
			var template = new Template("abc", source);
			expect(template.source).toEqual(source.innerHTML);
		});
	});

	describe("REGEX_INCLUDE", function() {
		it("should match a template name", function() {
			var source;

			source = '#{include foo}';
			source.replace(Template.REGEX_INCLUDE, function(tag, templateName) {
				expect(tag).toEqual('#{include foo}');
				expect(templateName).toEqual('foo');
				return "";
			});

			source = '#{include foo/bar}';
			source.replace(Template.REGEX_INCLUDE, function(tag, templateName) {
				expect(tag).toEqual("#{include foo/bar}");
				expect(templateName).toEqual("foo/bar");
				return "";
			});
		});

		it("should match regardless of white space", function() {
			'#{ include   foo/bar }'.replace(Template.REGEX_INCLUDE, function(tag, templateName) {
				expect(tag).toEqual('#{ include   foo/bar }');
				expect(templateName).toEqual("foo/bar");
				return "";
			});
		});
	});

	describe("REGEX_RENDER", function() {
		it("matches a template name with no data key", function() {
			"#{render foo}".replace(Template.REGEX_RENDER, function(tag, templateName, withClause, dataKey) {
				expect(tag).toEqual("#{render foo}");
				expect(templateName).toEqual("foo");
				expect(withClause).toEqual("");
				expect(dataKey).toEqual("");
				return "";
			});
		});

		it("matches a template name and a data key", function() {
			"#{render foo with bar}".replace(Template.REGEX_RENDER, function(tag, templateName, withClause, dataKey) {
				expect(tag).toEqual("#{render foo with bar}");
				expect(templateName).toEqual("foo");
				expect(withClause).toEqual(" with bar");
				expect(dataKey).toEqual("bar");
				return "";
			});

			"#{render foo/bar with baz}".replace(Template.REGEX_RENDER, function(tag, templateName, withClause, dataKey) {
				expect(tag).toEqual("#{render foo/bar with baz}");
				expect(templateName).toEqual("foo/bar");
				expect(withClause).toEqual(" with baz");
				expect(dataKey).toEqual("baz");
				return "";
			});
		});

		it("matches regardless of white space", function() {
			"#{  render	foo/bar  	with baz }".replace(Template.REGEX_RENDER, function(tag, templateName, withClause, dataKey) {
				expect(tag).toEqual("#{  render	foo/bar  	with baz }");
				expect(templateName).toEqual("foo/bar");
				expect(withClause).toEqual("  	with baz ");
				expect(dataKey).toEqual("baz");
				return "";
			});
		});
	});

	describe("render", function() {
		it("renders variables matching properties in the data", function() {
			var data = {
				foo: "bar"
			};
			var templateSource = '<p>#{foo}</p>';
			var template = new Template("test/render/variables", templateSource);
			var renderedSource = template.render(data);
			expect(renderedSource).toEqual('<p>bar</p>');
		});

		it("renders multple instances of variables", function() {
			var data = {
				foo: "bar"
			};
			var templateSource = [
				'<p>Foo: #{foo}</p>',
				'<div class="#{foo}">#{foo}</div>'
			].join("");
			var template = new Template("test/render/all_variable_instances", templateSource);
			var renderedSource = template.render(data);
			expect(renderedSource).toEqual('<p>Foo: bar</p><div class="bar">bar</div>');
		});

		it("renders multiple variables", function() {
			var data = {
				title: "Just testing",
				type: "bar",
				id: 1
			};
			var templateSource = [
				'<section class="#{type}" id="foo-#{id}">',
					'<h1>#{title}</h1>',
				'</section>'
			].join("");
			var expectedSource = [
				'<section class="bar" id="foo-1">',
					'<h1>Just testing</h1>',
				'</section>'
			].join("");
			var template = new Template("test/render/multiple_variables", templateSource);
			var renderedSource = template.render(data);
			expect(renderedSource).toEqual(expectedSource);
		});

		it("renders variables with special characters", function() {
			var data = {
				"foo.bar": "foo.bar",
				"foo_bar": "foo_bar",
				"foo-bar": "foo-bar"
			};
			var templateSource = [
				'<ul>',
					'<li>#{foo.bar}</li>',
					'<li>#{foo_bar}</li>',
					'<li>#{foo-bar}</li>',
				'</ul>'
			].join("");
			var template = new Template("test/render/variables_with_special_chars", templateSource);
			var expectedSource = [
				'<ul>',
					'<li>foo.bar</li>',
					'<li>foo_bar</li>',
					'<li>foo-bar</li>',
				'</ul>'
			].join("");
			var renderedSource = template.render(data);
			expect(renderedSource).toEqual(expectedSource);
		});

		it("renders template includes", function() {
			var data = {
				title: "Testing"
			};
			var templateSource = [
				'#{include test/render/includes}',
				'<strong>#{title}</strong>'
			].join("");
			var includeSource = '<div>I am included!</div>';
			var template = new Template("test/render/included_templates", templateSource);
			Template.templates["test/render/includes"] = new Template("test/render/includes", includeSource);
			var expectedSource = [
				'<div>I am included!</div>',
				'<strong>Testing</strong>'
			].join("");
			var renderedSource = template.render(data);
			expect(renderedSource).toEqual(expectedSource);
		});

		it("renders sub templates with data", function() {
			var data = {
				firstName: "John",
				lastName: "Doe",
				age: 30
			};
			var templateSource = [
				'<h1>Person</h1>',
				'#{render test/render/with_data}'
			].join("");
			var subTemplateSource = '#{firstName} #{lastName}, age #{age}';
			var template = new Template("test/render/with_data_test", templateSource);
			Template.templates["test/render/with_data"] = new Template("test/render/with_data", subTemplateSource);
			var expectedSource = [
				'<h1>Person</h1>',
				'John Doe, age 30'
			].join("");

			var renderedSource = template.render(data);
			expect(renderedSource).toEqual(expectedSource);
		});

		it("renders sub templates with a data key", function() {
			var data = {
				name: "Bob",
				position: {
					name: "The Builder",
					id: 24
				}
			};
			var templateSource = [
				'Name: #{name}<br>',
				'#{render test/render/position_template with position}'
			].join("");
			var subTemplateSource = [
				'Position Name: #{name}<br>',
				'Position Id: #{id}<br>'
			].join("");
			var template = new Template("test/render/sub_templates", templateSource);
			Template.templates["test/render/position_template"] = new Template("test/render/position_template", subTemplateSource);
			var expectedSource = [
				'Name: Bob<br>',
				'Position Name: The Builder<br>',
				'Position Id: 24<br>'
			].join("");
			var renderedSource = template.render(data);
			expect(renderedSource).toEqual(expectedSource);
		});

		it("renders sub templates with an array of data", function() {
			var data = {
				name: "Bob",
				projects: [{
					name: "Golden Gate Bridge",
					budget: 10000000
				},{
					name: "The Pyramids",
					budget: 450000000
				}]
			};
			var templateSource = [
				'Name: #{name}<br>',
				'<ul>#{render test/render/projects with projects}</ul>'
			].join("");
			var subTemplateSource = '<li>#{name} (Cost: #{budget})</li>';
			var template = new Template("test/render/sub_templates_array", templateSource);
			Template.templates["test/render/projects"] = new Template("test/render/projects", subTemplateSource);
			var expectedSource = [
				'Name: Bob<br>',
				'<ul>',
					'<li>Golden Gate Bridge (Cost: 10000000)</li>',
					'<li>The Pyramids (Cost: 450000000)</li>',
				'</ul>'
			].join("");
			var renderedSource = template.render(data);
			expect(renderedSource).toEqual(expectedSource);
		});
	});

	describe("setSource", function() {
		beforeEach(function() {
			this.template = new Template("test/test", "abc")
		});

		it("sets the source from a string", function() {
			var source = "I am a template!";
			this.template.setSource(source);
			expect(this.template.source).toEqual(source);
		});

		it("sets the source from a SCRIPT tag whose type is text/html", function() {
			var source = document.createElement("script");
			source.setAttribute("type", "text/html");
			source.setAttribute("data-template-name", "test/set_source_by_script");
			source.innerHTML = "I am a template!";
			this.template.setSource(source);
			expect(this.template.source).toEqual(source.innerHTML);
		});
	});

});
