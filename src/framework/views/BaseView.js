/*

class BaseView extends Object
  Public:
    static disableNodeCaching()
    static enableNodeCaching()
    constructor(String | HTMLElement id)
    init()
    destructor()
    addEventListener(String type, Function listener)
    removeEventListener(String type, Function listener)
  Protected:
    id <String>
    ownerDocument <Document>
    rootNode <HTMLElement>
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
function BaseView() {
  this.constructor.apply(this, arguments);
}

BaseView.prototype = {

// Access: Public

  constructor: function(id) {
    this.nodeCache = {};
    this.id = id;
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
      }
    }
  },

  destructor: function() {
    this.rootNode = this.ownerDocument = null;
  },

  addEventListener: function(type, listener) {
    
  },

  removeEventListener: function(type, listener) {
    
  },

// Access: Protected

  id: null,

  ownerDocument: null,

  rootNode: null,

  getNode: function(idSuffix) {
    return this.ownerDocument.getElementById(this.id + "-" + idSuffix);
  },

  handleNodeEvent: function(event) {
    
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

};

BaseNode.nodeCachingEnabled = false;

BaseNode.disableNodeCaching = function() {
  this.nodeCachingEnabled = false;
};

BaseNode.enableNodeCaching = function() {
  this.nodeCachingEnabled = true;
};

BaseNode.nodeIdIndex = 0;

BaseNode.generateNodeId = function() {
  return "anonymous-node-" + (++BaseNode.nodeIdIndex);
};
