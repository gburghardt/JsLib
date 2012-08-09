window.dom = window.dom || {};
dom.events = dom.events || {};

dom.events.Action = function() {};
dom.events.Action.prototype = {
	name: null,
	params: null,
	event: null,
	element: null,

	destructor: function() {
		this.params = this.event = this.element = null;
	},

	cancel: function() {
		this.event.preventDefault();
		this.event.stopPropagation();
	}

};