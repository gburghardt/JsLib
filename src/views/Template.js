function Template() {
	
	var _lastRenderedSource = "";
	var _source = "";
	
	this.constructor = function(source) {
		this.setSource(source);
	};
	
	function compileSource(source) {
		return source.replace(/<!--\s*(\$\{.+\})\s*-->/g, "$1");
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
		return source.replace(/\$\{.+\}/g, "");
	};
	
	this.constructor.apply(this, arguments);
}
