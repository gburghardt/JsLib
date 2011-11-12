function ViewController() {
	this.constructor.apply(this, arguments);
}

ViewController.prototype = {

	callbacks: null,

	flowController: null,

	name: null,

	options: null,

	visible: false,

	constructor: function(name, flowController) {
		this.name = name;
		this.callbacks = ["handleClick", "handleFormSubmit"];
		this.flowController = flowController;
		this.options = {};
		flowController = null;
	},

	destructor: function() {
		if (this.rootNode) {
			this.removeListener(this.rootNode, "click", this.handleClick);
			this.removeListener(this.rootNode, "submit", this.handleFormSubmit);
			this.rootNode = null;
		}

		this.flowController = this.options = this.callbacks = null;
	},

	init: function(rootNode, options) {
		this.rootNode = rootNode;
		this.rootNode.className = this.rootNode.className + " view-" + this.name;
		this.configure(options);
		this.initCallbacks();
		this.addListener(this.rootNode, "click", this.handleClick);

		if (this.rootNode.nodeName === "FORM") {
			this.addListener(this.rootNode, "submit", this.handleFormSubmit);
		}

		rootNode = options = null;
	},

	initCallbacks: function() {
		var i = 0, length = this.callbacks.length;

		for (i; i < length; i++) {
			this[ this.callbacks[i] ] = this.bindFunction(this, this[ this.callbacks[i] ]);
		}
	},

	activate: function(action, data) {
		this.show();
		this.focus();
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

	blur: function() {
		
	},

	configure: function() {
		var key,
		    i = 0,
		    args = arguments,
		    length = args.length,
		    options;

		for (i; i < length; i++) {
			options = args[i] || {};

			for (key in options || {}) {
				if (options.hasOwnProperty(key)) {
					this.options[key] = options[key];
				}
			}
		}

		args = options = null;
	},

	deactivate: function(action, data) {
		this.hide();
		this.blur();
		data = null;
	},

	focus: function() {
		var field = this.rootNode.getElementsByTagName("input")[0] ||
		            this.rootNode.getElementsByTagName("textarea")[0] ||
		            this.rootNode.getElementsByTagName("select")[0] || null;
		
		if (field) {
			field.focus();

			if (field.select) {
				field.select();
			}
		}
	},

	getActionData: function() {
		throw new Error("Sub classes of ViewController must implement a getActionData() method.");
	},

	invokeAction: function(node) {
		if (!node || node === this.rootNode) {
			return;
		}

		var action = node.getAttribute("data-action");

		if (action && this[action]) {
			this[action](node);
		}
		else {
			this.invokeAction(node.parentNode);
		}
	},

	handleClick: function(event) {
		this.invokeAction(event.targetElement || event.srcElement);
		return false;
	},

	handleFormSubmit: function(event) {
		this.invokeAction(event.targetElement || event.srcElement);
		return false;
	},

	hide: function() {
		if (this.visible) {
			this.visible = false;
			this.rootNode.style.display = "none";
		}
	},

	removeListener: function(node, name, callback) {
		if (node.removeEventListener) {
			node.removeEventListener(name, callback, false);
		}
		else if (node.dettachEvent) {
			node.dettachEvent("on" + name, callback);
		}
	},

	show: function() {
		if (!this.visible) {
			this.rootNode.style.display = "block";
			this.visible = true;
		}
	}

};
