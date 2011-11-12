function ViewController() {
	this.constructor.apply(this, arguments);
}

ViewController.prototype = {

	flowController: null,

	constructor: function(name, flowController) {
		
	},

	init: function(name, rootNode) {
		this.name = name;
		this.rootNode = rootNode;
		rootNode = null;
	},

	activate: function(action, data) {
		data = null;
	},

	deactivate: function(action, data) {
		data = null;
	}

};
