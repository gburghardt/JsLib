function FlowController() {
	this.constructor.apply(this, arguments);
}

FlowController.prototype = {

	activeController: null,

	controllers: null,

	options: null,

	rootNode: null,

	visible: false,

	constructor: function(options) {
		this.options = {
			onFinish: function() {}
		};

		this.configure(options);
		options = null;
	},

	init: function(rootNode) {
		this.rootNode = (typeof rootNode === "string") ? document.getElementById(rootNode) : rootNode;
		this.createControllers();
		this.initControllers();
		rootNode = null;
	},

	initControllers: function() {
		for (var name in this.controllers) {
			if (this.controllers.hasOwnProperty(name)) {
				this.controllers[name].init(this.getNode(name));
			}
		}
	},

	destructor: function() {
		if (this.controllers) {
			for (var name in this.controllers) {
				if (this.controllers.hasOwnProperty(name)) {
					this.controllers[name].destructor();
					this.controllers[name] = null;
				}
			}

			this.controllers = null;
		}

		this.activeController = this.options = null;
	},

	beforeClose: function() {
		
	},

	blur: function() {
		if (this.activeController) {
			this.activeController.blur();
		}
	},

	close: function() {
		if (this.beforeClose() !== false) {
			this.hide();
			this.destructor();
		}
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

	createControllers: function() {
		throw new Error("Sub classes of FlowController must implement a createControllers() method.");
	},

	finish: function(data) {
		this.options.onFinish(data);
		this.close();
	},

	focus: function() {
		if (this.activeController) {
			this.activeController.focus();
		}
	},

	getNextActiveController: function(name, action, data) {
		throw new Error("Sub classes of FlowController must implement a getNextActiveController() method.");
	},

	getNode: function(suffix) {
		return document.getElementById(this.rootNode.id + suffix);
	},

	hide: function() {
		if (this.visible) {
			this.visible = false;
			this.rootNode.style.display = "none";
		}
	},

	processAction: function(name, action, data) {
		var controller = this.getNextActiveController(name, action, data);

		if (controller) {
			if (this.activeController) {
				this.activeController.deactivate(action, data);
			}

			this.activeController = controller;
			this.activeController.activate(action, data);
		}
		else {
			throw new Error("No view controller was found for name '" + name + "', and action '" + action + "'.");
		}
	},

	show: function() {
		if (!this.visible) {
			this.rootNode.style.display = "block";
			this.visible = true;
		}
	}

};
