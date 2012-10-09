/*

class BaseView extends Object
	Public:
		static disableNodeCaching()
		static enableNodeCaching()
		constructor(String | HTMLElement id)
		init()
		destructor()
	Protected:
		delegator <dom.events.Delegator>
		id <String>
		ownerDocument <Document>
		rootNode <HTMLElement>
		getDelegatorEventTypes() returns Array
		getNode(String idSuffix) returns HTMLElement
		handleNodeEvent(Event event)
		purgeNodeCache()
		querySelector(String selector) returns HTMLElement or undefined
		querySelectorAll(String selector) returns HTMLCollection
	Private:
		static generateNodeId() returns String
		nodeCache <Object>
		getNodesFromCache(String key) returns HTMLElement or HTMLCollection or null
		nodeCachingEnabled() returns Boolean

*/
BaseView = Object.extend({

	self: {

		nodeCachingEnabled: false,

		nodeIdIndex: 0,

		disableNodeCaching: function() {
			this.nodeCachingEnabled = false;
		},

		enableNodeCaching: function() {
			this.nodeCachingEnabled = true;
		},

		generateNodeId: function() {
			return "anonymous-node-" + (BaseView.nodeIdIndex++);
		},

		getInstance: function(rootNode, delegate, templateName) {
			var className = templateName.replace(/\//g, "-").toClassName();
			var ViewClass = className.constantize();
			var view;

			if (!ViewClass) {
				ViewClass = BaseView;
			}

			view = new ViewClass(rootNode, delegate, templateName);
			ViewClass = rootNode = delegate = null;
			return view;
		}

	},

	prototype: {

// Access: Public

		initialize: function(rootNode, delegate, templateName) {
			this.nodeCache = {};

			if (typeof rootNode === "string") {
				if (!this.ownerDocument) {
					this.ownerDocument = document;
				}

				this.rootNode = this.ownerDocument.getElementById(rootNode);
			}
			else {
				this.rootNode = rootNode;
				this.ownerDocument = this.rootNode.ownerDocument;

				if (!this.rootNode.getAttribute("id")) {
					this.rootNode.setAttribute("id", BaseView.generateNodeId());
					this.id = this.rootNode.getAttribute("id");
				}
			}

			if (templateName) {
				this.templateName = templateName;
			}

			this.delegator = new dom.events.Delegator(delegate, this.rootNode, this.delegatorActionPrefix);
			rootNode = delegate = null;
		},

		init: function() {
			this.delegator.addEventTypes(this.getDelegatorEventTypes());
			this.delegator.init();
			return this;
		},

		destructor: function() {
			if (this.delegator) {
				this.delegator.destructor();
				this.delegator = null;
			}

			this.rootNode = this.ownerDocument = null;
		},

		render: function(model) {
			Template.fetch(this.templateName, this, function(template) {
				if (this.model && this.model.unsubscribe) {
					this.model.unsubscribe("attributes:changed", this);
				}

				this.model = model;
				this.rootNode.innerHTML = template.render(this.model);

				if (this.model.subscribe) {
					this.model.subscribe("attributes:changed", this, "handleAttributesChanged");
				}

				template = null;
			});

			return this;
		},

// Access: Protected

		delegateActionPrefix: "",

		delegatorEventTypes: "",

		delegator: null,

		id: null,

		ownerDocument: null,

		rootNode: null,

		templateName: null,

		getDelegatorEventTypes: function() {
			return this.delegatorEventTypes.split(/[ ,]+/g);
		},

		getNode: function(idSuffix) {
			return this.ownerDocument.getElementById(this.id + "-" + idSuffix);
		},

		purgeNodeCache: function() {
			this.nodeCache = {};
		},

		querySelector: function(selector) {
			if (this.nodeCachingEnabled()) {
				var node = this.getNodesFromCache("selector-" + selector);

				if (!node) {
					node = this.rootNode.querySelector(selector);
					this.nodeCache["selector-" + selector] = node;
				}

				return node;
			}
			else {
				return this.rootNode.querySelector(selector);
			}
		},

		querySelectorAll: function(selector) {
			var nodes = [];

			if (this.nodeCachingEnabled()) {
				nodes = this.getNodesFromCache("selectorAll-" + selector);

				if (!nodes) {
					nodes = this.rootNode.querySelectorAll(selector);
					this.nodeCache["selectorAll-" + selector] = nodes;
				}
			}
			else {
				nodes = this.rootNode.querySelectorAll(selector);
			}

			return nodes;
		},

// Access: Private

		nodeCache: null,

		getNodesFromCache: function(key) {
			return (this.nodeCache[key]) ? this.nodeCache[key] : null;
		},

		handleAttributesChanged: function(model) {
			console.info("FormView#handleAttributesChanged");
		},

		nodeCachingEnabled: function() {
			return BaseView.nodeCachingEnabled;
		}

	}

});
