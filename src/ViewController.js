/**
 * abstract class ViewController
 *
 * This class provides a base class for controller objects that manage an
 * individual form within a flow.
 **/
function ViewController() {
	this.constructor.apply(this, arguments);
}

ViewController.prototype = {

	/**
	 * ViewController#callbacks -> Array
	 *
	 * An array of method names on this view controller that should be
	 * automatically bound to "this" when used as callbacks.
	 **/
	callbacks: null,

	/**
	 * ViewController#flowController -> FlowController
	 *
	 * The flow controller for this view.
	 **/
	flowController: null,

	/**
	 * ViewController#name -> String
	 *
	 * Name of this controller within the flow. This name matches this
	 * controller's key in the flow controller's "controllers" object.
	 **/
	name: null,

	options: null,

	visible: false,

	/**
	 * new ViewController(name, flowController)
	 * - name (String): Name of this view controller, given by the flow controller
	 * - flowController (FlowController): The flow controller for this view.
	 **/
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

	/**
	 * ViewController#init(rootNode[, options])
	 * - rootNode (HTMLElement): The DOM node in which this controller lives
	 * - options (Object): Optional config options.
	 **/
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

	/**
	 * ViewController#initCallbacks()
	 *
	 * Bind methods in this controller to "this".
	 **/
	initCallbacks: function() {
		var i = 0, length = this.callbacks.length;

		for (i; i < length; i++) {
			this[ this.callbacks[i] ] = this.bindFunction(this, this[ this.callbacks[i] ]);
		}
	},

	/**
	 * ViewController#activate(action, data)
	 * - action (String): Name of the last action performed in the view
	 *                    controller ceding control to this controller.
	 * - data (Object): Data from the last active view controller.
	 *
	 * Activate this view controller and make it usable to the user.
	 **/
	activate: function(action, data) {
		this.show();
		this.focus();
		data = null;
	},

	/**
	 * ViewController#addListener(node, name, callback)
	 * - node (HTMLElement): The DOM node on which to add the listener
	 * - name (String): Name of the event to listen to
	 * - callback (Function): Callback to execute when event occurs.
	 **/
	addListener: function(node, name, callback) {
		if (node.addEventListener) {
			node.addEventListener(name, callback, false);
		}
		else if (node.attachEvent) {
			node.attachEvent("on" + name, callback);
		}

		node = callback = null;
	},

	/**
	 * ViewController#bindFunction(context, fn) -> Function
	 * - context (Object): The object that "this" should point to when fn is
	 *                     executed.
	 * - fn (Function): The function to bind
	 *
	 * Bind a function to a certain object so DOM event callbacks execute in the
	 * correct context.
	 **/
	bindFunction: function(context, fn) {
		return function() {
			return fn.apply(context, arguments);
		};
	},

	/**
	 * ViewController#blur()
	 *
	 * Focus has moved elsewhere, but this view controller may still be visible
	 * to the user, and the user may still be able to interact with it.
	 **/
	blur: function() {

	},

	/**
	 * ViewController#configure()
	 *
	 * Configure this instance. Every argument can be an object of config
	 * overrides.
	 **/
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
	 * ViewController#deactivate(action, data)
	 * - action (String): Name of the last action performed on this controller
	 *                    before it ceded control to another view controller.
	 * - data (Object): Data from this controller after last action was
	 *                  performed.
	 *
	 * Deactivate this view controller and make it unusable to the user.
	 **/
	deactivate: function(action, data) {
		this.hide();
		this.blur();
		data = null;
	},

	/**
	 * ViewController#focus()
	 *
	 * Set focus to this controller. It may or may not have been just activated.
	 **/
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

	/**
	 * ViewController#getActionData() -> Object
	 *
	 * Abstract method to gather the data from this controller in order to pass
	 * it along to the next active view controller in this flow.
	 **/
	getActionData: function() {
		throw new Error("Sub classes of ViewController must implement a getActionData() method.");
	},

	invokeAction: function(node) {
		if (!node) {
			return;
		}

		var propagate = (node !== this.rootNode);
		var action = node.getAttribute("data-action");

		if (action && this[action]) {
			propagate = (this[action](node) !== false && propagate);
		}

		if (propagate) {
			this.invokeAction(node.parentNode);
		}
	},

	handleClick: function(event) {
		this.invokeAction(event.targetElement || event.srcElement);
		return false;
	},

	handleFormSubmit: function(event) {
		console.info("ViewController#handleFormSubmit - Called");
		console.debug({event: event});
		this.invokeAction(event.target || event.srcElement);
		event.preventDefault();
		return false;
	},

	hide: function() {
		if (this.visible) {
			this.visible = false;
			this.rootNode.style.display = "none";
		}
	},

	/**
	 * ViewController#removeListener(node, name, callback)
	 * - node (HTMLElement): The DOM node on which to remove the listener
	 * - name (String): Name of the event to stop listening to
	 * - callback (Function): Callback executed when event occurred.
	 **/
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
