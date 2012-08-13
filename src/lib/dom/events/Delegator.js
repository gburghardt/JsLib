window.dom = window.dom || {};
window.dom.events = window.dom.events || {};

dom.events.Delegator = function() {

// Access: Public

	this.constructor = function(delegate, node, actionPrefix) {
		this.delegate = delegate;
		this.node = node;
		this.setActionPrefix(actionPrefix || "");
		this.eventTypes = [];
		this.eventTypesAdded = {};
	};

	this.destructor = function() {
		if (this.node) {
			this.removeEventTypes(this.eventTypes);
			this.node = null;
		}

		this.delegate = self = null;
	};

	this.init = function() {
		if (typeof this.node === "string") {
			this.node = document.getElementById(this.node);
		}

		return this;
	};

	this.addEventType = function(eventType) {
		if (!this.eventTypesAdded[eventType]) {
			this.eventTypes.push(eventType);
			this.node.addEventListener(eventType, handleEvent, false);
			this.eventTypesAdded[eventType] = true;
		}
	};

	this.addEventTypes = function(eventTypes) {
		var i = 0, length = eventTypes.length;

		for (i; i < length; ++i) {
			this.addEventType(eventTypes[i]);
		}
	};

	this.removeEventType = function(eventType) {
		if (this.eventTypesAdded[eventType]) {
			this.node.removeEventListener(eventType, handleEvent, false);
			this.eventTypesAdded[eventType] = false;
		}
	};

	this.removeEventTypes = function(eventTypes) {
		var i = 0, length = eventTypes.length;

		for (i; i < length; ++i) {
			this.removeEventType(eventTypes[i]);
		}
	};

	this.setActionPrefix = function(actionPrefix) {
		if (!actionPrefix) {
			return;
		}

		if (!actionPrefix.match(/\.$/)) {
			actionPrefix += ".";
		}

		this.actionPrefix = actionPrefix;
		this.actionRegex = new RegExp("^" + this.actionPrefix.replace(/\./g, '\\.'));
	};

// Access: Private

	var self = this;

	this.node = null;

	this.eventTypes = null;

	this.eventTypesAdded = null;

	this.delegate = null;

	function stopPropagationPatch() {
		this._stopPropagation();
		this.propagationStopped = true;
	}

	function handleEvent(event) {
		if (!event._stopPropagation) {
			event._stopPropagation = event.stopPropagation;
			event.stopPropagation = stopPropagationPatch;
			event.propagationStopped = false;
		}

		if (!event.actionTarget) {
			event.actionTarget = event.target;
		}

		var action = null, actionName = null, method;
		
		if (event.actionTarget.getAttribute) {
			// DOM node
			actionName = event.actionTarget.getAttribute("data-action-" + event.type) ||
							     event.actionTarget.getAttribute("data-action");
		}
		else if (event.actionTarget.documentURI) {
			// document object
			actionName = event.actionTarget["data-action-" + event.type] ||
							     event.actionTarget["data-action"];
		}

		if (actionName) {
			actionName = actionName.replace(self.actionRegex, "");
			method = self.delegate[actionName] ? actionName : "handleAction";
		}

		if (self.delegate[method]) {
			try {
				action = new dom.events.Action();
				action.name = actionName;
				// TODO: support params
				action.params = {};
				action.event = event;
				action.element = event.actionTarget;
				self.delegate[method](action);
			}
			catch (error) {
				event.preventDefault();
				event.stopPropagation();

				if (self.delegate.handleActionError) {
					action = new dom.events.Action();
					action.name = actionName;
					action.event = event;
					action.element = action.actionTarget;
					action.params = {error: error};
					self.delegate.handleActionError(action);
				}
				else if (window.console && window.console.error) {
					window.console.error(error);
				}
				else {
					// prevent links and forms from submitting
					// Give up. Throw the error and let the developer fix this.
					throw error;
				}
			}
		}

		if (!event.propagationStopped && event.actionTarget !== self.node && event.actionTarget.parentNode) {
			event.actionTarget = event.actionTarget.parentNode;
			handleEvent(event);
		}
		else {
			// Finished calling actions. Return event object to its normal state. Let
			// event continue bubbling up the DOM.
			event.actionTarget = null;
			event.stopPropagation = event._stopPropagation;
			event._stopPropagation = null;
			event.propagationStopped = null;
		}

		event = null;
	}

	this.constructor.apply(this, arguments);
};
