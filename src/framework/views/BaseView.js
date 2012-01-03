function BaseView() {
  this.constructor.apply(this, arguments);
}

BaseView.prototype = {

// Access: Protected

  rootNode: null,

  rootNodeId: null,

// Access: Public

  constructor: function(rootNodeId) {
    this.rootNodeId = rootNodeId;
  },

  init: function() {
    
  },

  getControlValue: function(name) {
    
  },

  getNode: function(idSuffix) {
    
  },

  getRootNode: function() {
    
  },

  setControlValue: function(name, value) {
    
  }

};
