/**
 * class FlowController
 *
 * This class encapsulates the logic of switching between multiple forms.
 **/
function FlowController() {
	this.constructor.apply(this, arguments);
}

FlowController.prototype = {

	/**
	 * FlowController#activeController -> ViewController
	 **/
	activeController: null,

	/**
	 * FlowController#controllers -> Object
	 **/
	controllers: null,

	/**
	 * FlowController#options -> Object
	 **/
	options: null,

	/**
	 * FlowController#rootNode -> HTMLElement
	 **/
	rootNode: null,

	/**
	 * FlowController#visible -> Boolean
	 **/
	visible: false,

	/**
	 * new FlowController([options])
	 * - options (Object): Config options
	 **/
	constructor: function(options) {
		this.options = {
			onFinish: function() {}
		};

		this.configure(options);
		options = null;
	},

	/**
	 * FlowController#init(rootNode)
	 * - rootNode (HTMLElement): DOM node in which this flow controller lives
	 **/
	init: function(rootNode) {
		this.rootNode = (typeof rootNode === "string") ? document.getElementById(rootNode) : rootNode;
		this.createControllers();
		this.initControllers();
		rootNode = null;
	},

	/**
	 * FlowController#initControllers()
	 * 
	 * Initialize all view controllers
	 **/
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

	/**
	 * FlowController#beforeClose() -> Undefined | Boolean
	 *
	 * Called before this flow controller is closed and destroyed. Returning
	 * false prevents the closing of this flow controller.
	 **/
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

	/**
	 * FlowController#createControllers()
	 *
	 * Abstract method so sub classes can create the view controllers needed for
	 * this flow.
	 **/
	createControllers: function() {
		throw new Error("Sub classes of FlowController must implement a createControllers() method.");
	},

	/**
	 * FlowController#finish(data)
	 * - data (Object): Data from the view controllers passed to the onFinish
	 *                  handler.
	 **/
	finish: function(data) {
		this.options.onFinish(data);
		this.close();
	},

	focus: function() {
		if (this.activeController) {
			this.activeController.focus();
		}
	},

	/**
	 * FlowController#getNextActiveController(name, action[, data]) -> ViewController | null
	 * - name (String): Name of the controller ceding control
	 * - action (String): Name of the last action performed on the controller
	 * - data (Object): The data from the controller ceding control
	 *
	 * Get the controller that should be activated next after an action has been
	 * performed. Sub classes must implement their own version of this method.
	 **/
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

	/**
	 * FlowController#processAction(name, action[, data])
	 * - name (String): Name of the controller ceding control
	 * - action (String): Name of the last action performed on the controller
	 * - data (Object): The data from the controller ceding control
	 *
	 * Process an action performed in this flow where one controller is ceding
	 * control to another controller. If no next controller is found, an error
	 * is thrown.
	 *
	 * throws Error
	 **/
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
