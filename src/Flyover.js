function Flyover() {
	this.constructor.apply(this, arguments);
}

Flyover.prototype = {

	curtainNode: null,

	id: null,

	options: null,

	nodes: null,

	rootNode: null,

	visible: false,

	zIndex: 0,

	constructor: function(options) {
		this.id = Flyover.createId();
		this.options = {};
		this.zIndex = Flyover.getZIndex();

		this.configure({
			// settings
			autoInit       : true,
			autoShow       : true,
			classes        : "",
			clickCurtainToHide: true,
			closeOnHide    : false,
			curtainColor   : "#000000",
			curtainOpacity : 0.6,
			headingLevel   : 1,
			modal          : true,
			position       : "center",
			title          : "",

			// selectors
			closeIconSelector   : ".flyover-header-tools-close",
			contentSelector     : ".flyover-content",
			footerSelector      : ".flyover-footer",
			titleSelector       : ".flyover-title",
			headerSelector      : ".flyover-header",
			headerToolsSelector : ".flyover-header-tools",

			// event handlers
			onClose      : function() {},
			onAfterHide  : function() {},
			onBeforeHide : function() {},
			onAfterInit  : function() {},
			onBeforeInit : function() {},
			onAfterShow  : function() {},
			onBeforeShow : function() {},
			onDestroy    : function() {}
		}, options || {});

		if (this.options.autoInit) {
			this.init();
		}
	},

	init: function() {
		this.options.onBeforeInit(this);
		this.initRootNode();
		this.initNodes();
		this.initCurtain();
		this.initEventHandlers();
		this.options.onAfterInit(this);
		
		if (this.options.autoShow) {
			this.show();
		}
	},

	initCurtain: function() {
		if (!this.options.modal || this.curtainNode) {
			return;
		}

		this.curtainNode = document.createElement("div");
		this.curtainNode.className     = "flyover-curtain";
		this.curtainNode.id            = this.id + "-curtain";
		this.curtainNode.style.display = "none";
		this.curtainNode.style.zIndex  = this.zIndex - 1;

		document.getElementsByTagName("body")[0].appendChild(this.curtainNode);
	},

	initEventHandlers: function() {
		if (this.options.modal && this.options.clickCurtainToHide) {
			this.handleCurtainClick = this.bind(this.handleCurtainClick, this);
			this.addListener(this.curtainNode, "click", this.handleCurtainClick, false);
		}

		if (this.nodes.closeIcon) {
			this.handleCloseIconClick = this.bind(this.handleCloseIconClick, this);
			this.addListener(this.nodes.closeIcon, "click", this.handleCloseIconClick, false);
		}
	},

	initNodes: function(nodes) {
		var selectorRegex = /Selector$/;
		this.nodes = nodes || {};

		for (var key in this.options) {
			if (this.options.hasOwnProperty(key) && selectorRegex.test(key)) {
				this.nodes[key.replace(selectorRegex, "")] = this.rootNode.querySelector(this.options[key]);
			}
		}
	},

	initRootNode: function(rootNode) {
		this.rootNode = rootNode || this.createRootNode();
		document.getElementsByTagName("body")[0].appendChild(this.rootNode);
	},

	destructor: function() {
		if (this.options) {
			this.options.onDestroy(this);
			this.options.onDestroy =
					this.options.onAfterHide =
					this.options.onBeforeHide =
					this.options.onAfterInit =
					this.options.onBeforeInit =
					this.options.onAfterShow =
					this.options.onBeforeShow =
					null
			;
			this.options = null;
		}

		if (this.rootNode) {
			this.rootNode.parentNode.removeChild(this.rootNode);
			this.rootNode = null;
		}

		if (this.nodes) {
			for (var key in this.nodes) {
				if (this.nodes.hasOwnProperty(key)) {
					this.nodes[key] = null;
				}
			}

			this.nodes = null;
		}

		if (this.curtainNode) {
			this.removeListener(this.curtainNode, "click", this.handleCurtainClick);
			this.curtainNode = null;
		}
	},

	close: function() {
		if (this.options.onClose(this) !== false) {
			this.destructor();
		}
	},

	configure: function() {
		var key, options = null;

		for (var i = 0, length = arguments.length; i < length; i++) {
			options = arguments[i];

			for (key in options) {
				if (options.hasOwnProperty(key)) {
					this.options[key] = options[key];
				}
			}
		}

		options = null;
	},

	createRootNode: function() {
		var markup = this.getMarkup().replace(/^\s+|\s+$/g, "");
		var temp = document.createElement("div");
		var rootNode = null;

		temp.innerHTML = markup;
		rootNode = temp.childNodes[0];
		rootNode.style.zIndex = this.zIndex;
		rootNode.style.display = "none";
		temp.removeChild(rootNode);
		temp = null;

		return rootNode;
	},

	getDefaultContent: function(headingLevel) {
		return "";
	},

	getDefaultFooter: function(headingLevel) {
		return "";
	},

	getDefaultTools: function() {
		return '<li class="flyover-header-tools-close"><a href="#" title="Close">Close</a></li>';
	},

	getMarkup: function() {
		return [
			'<div class="flyover ' + this.options.classes + '" id="' + this.id + '">',
				'<div class="flyover-header">',
					'<h' + this.options.headingLevel + ' class="flyover-title">' + this.options.title + '</h' + this.options.headingLevel + '>',
					'<ul class="flyover-header-tools">' + this.getDefaultTools() + '</ul>',
				'</div>',
				'<div class="flyover-content">' + this.getDefaultContent(this.headingLevel) + '</div>',
				'<div class="flyover-footer">' + this.getDefaultFooter(this.headingLevel) + '</div>',
			'</div>'
		].join("");
	},

	handleCloseIconClick: function() {
		this.hide();
		return false;
	},

	handleCurtainClick: function() {
		this.hide();
		return false;
	},

	hide: function() {
		if (this.visible && this.options.onBeforeHide(this) !== false) {
			if (this.options.closeOnHide) {
				this.close();
			}
			else {
				this.rootNode.style.display = "none";
				this.visible = false;
				this.options.onAfterHide(this);
			}
		}
	},

	position: function() {
		var regex = /^(left|right|center|[-.\d]+[\w%]{1,3})[ ]+(bottom|top|center|[-.\d]+[\w%]{1,3})$/i;
		var position = this.options.position;
		var top = left = bottom = right = null;
		var style = this.rootNode.style;
		var marginLeft = "-" + Math.round(this.rootNode.offsetWidth / 2) + "px";
		var marginTop = "-" + Math.round(this.rootNode.offsetHeight / 2) + "px";

		if (position === "center") {
			style.top = "50%";
			style.marginTop = marginTop;
			style.left = "50%";
			style.marginLeft = marginLeft;
		}
		else {
			var x = position.replace(regex, "$1");
			var y = position.replace(regex, "$2");

			if (y === "top") {
				style.top = 0;
			}
			else if (y === "bottom") {
				style.bottom = 0;
			}
			else if (y === "center") {
				style.top = "50%";
				style.marginTop = marginTop;
			}
			else {
				style.top = y;
			}

			if (x === "left") {
				style.left = 0;
			}
			else if (x === "right") {
				style.right = 0;
			}
			else if (x === "center") {
				style.left = "50%";
				style.marginLeft = marginLeft;
			}
			else {
				style.left = x;
			}
		}

		style = null;
	},

	setContent: function(markup) {
		this.nodes.content.innerHTML = markup;
	},

	setFooter: function(markup) {
		this.nodes.footer.innerHTML = markup;
	},

	setTitle: function(title) {
		this.options.title = String(title);
		this.nodes.title.innerHTML = this.options.title;
	},

	show: function() {
		if (!this.visible && this.options.onBeforeShow(this) !== false) {
			this.rootNode.style.display = "block";
			this.position();
			this.visible = true;
			this.options.onAfterShow(this);
		}
	},



	// utility methods

	addListener: function(node, event, callback) {
		if (node.addEventListener) {
			node.addEventListener(event, callback, false);
		}
		else if (node.attachEventHandler) {
			node.attachEventHandler("on" + event, callback);
		}

		node = callback = null;
	},

	bind: function(fn, context) {
		return function() {
			return fn.apply(context, arguments);
		};
	},

	removeListener: function(node, event, callback) {
		if (node.removeEventListener) {
			node.removeEventListener(event, callback, false);
		}
		else if (node.detachEventHandler) {
			node.detachEventHandler("on" + event, callback);
		}

		node = callback = null;
	}

};

Flyover.count = 0;
Flyover.zIndex = 1000;

Flyover.getZIndex = function() {
	return this.zIndex++;
};

Flyover.createId = function() {
	var id = "flyover-" + this.count;
	this.count++;
	return id;
};
