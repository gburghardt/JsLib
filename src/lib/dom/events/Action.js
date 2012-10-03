window.dom = window.dom || {};
dom.events = dom.events || {};

dom.events.Action = Object.extend({
	prototype: {
		name: null,
		params: null,
		event: null,
		element: null,

		initialize: function(event, element, params, name) {
			this.event = event;
			this.element = element;
			this.params = params;
			this.name = name;
			event = element = params = null;
		},

		destructor: function() {
			this.params = this.event = this.element = null;
		},

		cancel: function() {
			this.event.preventDefault();
			this.event.stopPropagation();
		}
	}
});
