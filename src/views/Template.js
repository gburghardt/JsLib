function Template() {
	
	var _lastRenderedSource = "";
	var _source = "";
	var _valueTransformers;
	
	this.constructor = function(source) {
		this.setSource(source);
		_valueTransformers = {};
	};
	
	this.addValueTransformer = function(key, fn) {
		_valueTransformers[key] = fn;
		fn = null;
	};
	
	function compileSource(source) {
		return source
			// Recognize <!-- ${foo} --> as template tags. Allows template tags
			// to be embedded in HTML structures where the browser strips out
			// invalid tags and text, such as in tables and lists.
			.replace(/<!--\s*(\$\{.+\})\s*-->/g, "$1")
			
			// Recognize data-view-compiled-attribute="foo=${bar}" as
			// foo="${bar}" attribute with template tag value. Allows template
			// tags to be used in HTML attribute values treated in a special way
			// by the browser, such as the style attribute.
			.replace(/data-view-compiled-attribute="(\w+)\s*=\s*(\$\{[\w\-_.]+\})"/g, '$1="$2"')
		;
	}

	this.getLastRenderedSource = function() {
		return _lastRenderedSource;
	};
	
	this.getSource = function() {
		return _source;
	};
	
	this.render = function(data) {
		if (data) {
			var s = _source;
			
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					s = this.renderValue(s, key, data[key]);
				}
			}
			
			s = this.stripUnrenderedSymbols(s);
			
			_lastRenderedSource = s;
			data = null;
		}
		
		return _lastRenderedSource;
	};
	
	this.renderValue = function(source, key, value) {
		var rx = rx = new RegExp("\\$\\{" + key.replace(/\./g, "\\.") + "\\}", "g");
		
		if (_valueTransformers[key]) {
			value = _valueTransformers[key](value, key, this);
		}
		
		source = source.replace(rx, value);
		rx = null;
		return source;
	};
	
	this.setLastRenderedSource = function(source) {
		_lastRenderedSource = source;
	};
	
	this.setSource = function(source) {
		var type = typeof(source);
		
		if ("string" === type) {
			_source = compileSource(source);
		}
		else if ("object" === type) {
			_source = compileSource(source.innerHTML);
			source = null;
		}
	};
	
	this.stripUnrenderedSymbols = function(source) {
		return source.replace(/\$\{[\w\-_.]+\}/g, "");
	};
	
	this.constructor.apply(this, arguments);
}
