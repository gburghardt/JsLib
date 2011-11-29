window.events = window.events || {};

events.Delegator = function() {
	var self = this;
	
	var _controllerManager = new events.DelegatorControllerManager(self);
	
	function constructor() {
		
	}
	
	function init() {
		
	}
	
	function destructor() {
		
	}
	
	function registerController(key, instance) {}
	
	function unregisterController(key, instance) {}
	
	self.constructor = constructor;
	self.destructor = destructor;
};