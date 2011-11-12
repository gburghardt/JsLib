function FlowController() {
	this.constructor.apply(this, arguments);
}

FlowController.prototype = {

	activeController: null,

	controllers: null,

	options: null,

	rootNode: null,

	constructor: function(options) {
		this.options = {
			onFinish: function() {}
		};

		for (var key in options || {}) {
			if (options.hasOwnProperty(key)) {
				this.options[key] = options[key];
			}
		}

		options = null;
	},

	init: function(rootNode) {
		this.rootNode = (typeof rootNode === "string") ? document.getElementById(rootNode) : rootNode;
		this.createControllers();

		for (var name in this.controllers) {
			if (this.controllers.hasOwnProperty(name)) {
				this.controllers[name].init(this.getNode(name));
				this.controllers[name] = null;
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

	createControllers: function() {
		throw new Error("Subclasses of FlowController must implement a createControllers() method.");
	},

	getNextActiveController: function(name, action, data) {
		throw new Error("Subclasses of FlowController must implement a getNextActiveController() method.");
	},

	getNode: function(suffix) {
		return document.getElementById(this.rootNode.id + suffix);
	},

	processAction: function(name, action, data) {
		var controller = self.getNextActiveController(name, action, data);

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
	}

};
