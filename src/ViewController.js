function ViewController() {
	this.constructor.apply(this, arguments);
}

ViewController.prototype = {

	flowController: null,

	name: null,

	constructor: function(name, flowController) {
		this.name = name;
		this.flowController = flowController;
		this.handleClick = this.bindFunction(this, this.handleClick);
		flowController = null;
	},

	destructor: function() {
		if (this.rootNode) {
			this.removeListener(this.rootNode, "click", this.handleClick);
			this.rootNode = null;
		}

		this.flowController = null;
	},

	init: function(rootNode) {
		this.rootNode = rootNode;
		this.addListener("click", this.handleClick);
		rootNode = null;
	},

	activate: function(action, data) {
		data = null;
	},

	addListener: function(node, name, callback) {
		if (node.addEventListener) {
			node.addEventListener(name, callback, false);
		}
		else if (node.attachEvent) {
			node.attachEvent("on" + name, callback);
		}
	},

	bindFunction: function(context, fn) {
		return function() {
			return fn.apply(context, arguments);
		};
	},

	deactivate: function(action, data) {
		data = null;
	},

	handleClick: function(event) {
		var node = event.targetElement || event.foo;
		var action = node.getAttribute("data-action") || node.getAttribute("action");

		if (action && this[action]) {
			this[action]();
		}
	},

	removeListener: function(node, name, callback) {
		if (node.removeEventListener) {
			node.removeEventListener(name, callback, false);
		}
		else if (node.dettachEvent) {
			node.dettachEvent("on" + name, callback);
		}
	}

};
