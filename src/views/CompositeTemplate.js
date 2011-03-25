function CompositeTemplate() {
	
	var _templates;
	
	this.constructor = function(source) {
		CompositeTemplate.prototype.constructor.call(this, source);
		_templates = {};
	};
	
	this.addTemplate = function(key, template) {
		_templates[key] = template;
	};
	
	this.getTemplate = function(key) {
		return _templates[key] || null;
	};
	
	this.render = function(data) {
		if (data) {
			var s = this.getSource();
			
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					if (_templates[key]) {
						s = this.renderValue(s, key, renderSubTemplate(key, data[key]));
					}
					else {
						s = this.renderValue(s, key, data[key]);
					}
				}
			}
			
			s = this.stripUnrenderedSymbols(s);
			this.setLastRenderedSource(s);
			data = null;
		}
		
		return this.getLastRenderedSource();
	};
	
	function renderSubTemplate(key, data) {
		var s;
		var template = _templates[key];
		
		if (isArray(data)) {
			s = new Array(data.length);
			
			for (var i = 0, length = data.length; i < length; i++) {
				s[i] = template.render(data[i]);
			}
			
			s = s.join("");
		}
		else {
			s = template.render(data);
		}
		
		data = template = null;
		
		return s;
	}
	
	function isArray(x) {
		return (typeof x === "object" && x instanceof Array);
	}
	
	this.constructor.apply(this, arguments);
}

CompositeTemplate.prototype = new Template();