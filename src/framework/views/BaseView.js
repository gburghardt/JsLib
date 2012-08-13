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
		}
	},

	prototype: {

// Access: Public

		initialize: function(id) {
			this.nodeCache = {};
			this.id = id;
			this.delegator = new dom.events.Delegator(this);
			this.delegator.setActionPrefix(this.delegatorActionPrefix);
			id = null;
		},

		init: function() {
			if (typeof this.id === "string") {
				if (!this.ownerDocument) {
					this.ownerDocument = document;
				}

				this.rootNode = this.ownerDocument.getElementById(this.id);
			}
			else {
				this.rootNode = this.id;
				this.ownerDocument = this.rootNode.ownerDocument;

				if (!this.rootNode.getAttribute("id")) {
					this.rootNode.setAttribute("id", BaseView.generateNodeId());
					this.id = this.rootNode.id;
				}
			}

			this.delegator.node = this.rootNode;
			this.delegator.init();
			this.delegator.addEventTypes(this.getDelegatorEventTypes());
			return this;
		},

		destructor: function() {
			if (this.delegator) {
				this.delegator.destructor();
				this.delegator = null;
			}

			this.rootNode = this.ownerDocument = null;
		},

// Access: Protected

		delegateActionPrefix: "",

		delegator: null,

		id: null,

		ownerDocument: null,

		rootNode: null,

		getDelegatorEventTypes: function() {
			return [];
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

		nodeCachingEnabled: function() {
			return BaseView.nodeCachingEnabled;
		}

	}

});
