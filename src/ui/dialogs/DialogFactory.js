function DialogFactor() {
	this.constructor.apply(this, arguments);
}

DialogFactory.prototype = {
	
	viewport: null,
	
	constructor: function(viewport) {
		this.viewport = viewport;
	},
	
	getInstance: function(type, options) {
		if (arguments.length === 1) {
			options = type;
			type = "dialog";
		}
		
		var dialog = null;
		var setter = "";
		
		if (!options) {
			options = {};
		}
		
		switch(type) {
			case "dialog":
			default:
				dialog = new Dialog(this.viewport, options.idPrefix || null);
				break;
		}
		
		for (var key in options) {
			if (!options.hasOwnProperty(key)) {
				continue;
			}
			
			setter = "set" + this.capitalize(key);
			
			if (dialog[setter]) {
				dialog[setter](options[key]);
			}
			else {
				dialog[key] = options[key];
			}
		}
		
		options = null;
		
		return dialog;
	},
	
	
	
	// utility methods
	
	capitalize: function(s) {
		return s.charAt(0).toUpperCase() + s.substring(1, s.length);
	}
	
};