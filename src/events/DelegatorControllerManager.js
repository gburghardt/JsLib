window.events = window.events || {};

events.DelegatorControllerManager = function() {
	
	var self = this;
	var _controllers = {};
	var _delegator;
	
	function constructor(delegator) {
		_delegator = delegator;
	}
	
	function getController(id) {
		return (_controllers[id]) ? _controllers[id] : null;
	}
	
	function getControllers(element) {
		var controllers = null;
		var delegates = element.getAttribute("data-delegate");

		if (delegates) {
			delegates = delegates.split(/\s+/g);
		}

		return controllers;
	}
	
};
