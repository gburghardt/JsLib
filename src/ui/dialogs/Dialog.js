function Dialog() {
	this.constructor.apply(this, arguments);
}

Dialog.prototype = {
	
	idPrefix: "dialog-",
	
	constructor: function(viewport, idPrefix) {
		if (!this.setViewport(viewport)) {
			throw new Error("A viewport object is required in Dialog.prototype.constructor");
		}
		
		if (typeof idPrefix === "string") {
			this.idPrefix = idPrefix;
		}
	},
	
	
	
	viewport: null,
	
	setViewport: function(viewport) {
		var set = false;
		
		if (viewport && typeof viewport === "object") {
			this.viewport = viewport;
			set = true;
		}
		
		viewport = null;
		
		return set;
	}
	
};