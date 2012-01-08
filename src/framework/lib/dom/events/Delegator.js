window.dom = window.dom || {};
window.dom.events = window.dom.events || {};

dom.events.Delegator = function(node, types, delegate) {
	this.node = node;
	this.types = types = types.split(/[\s,]+/g);
	this.delegate = delegate;

	this.destructor = function() {
		var i = 0, length = types.length;
		
		for (i; i < length; ++i) {
			node.removeEventListener(types[i], handleEvent, false);
		}

		node = this.node = delegate = this.delegate = null;
	};

	this.init = function() {
		var i = 0, length = types.length;

		if (typeof node === "string") {
			node = document.getElementById(node);
		}

		for (i; i < length; ++i) {
			node.addEventListener(types[i], handleEvent, false);
		}

		return this;
	};

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

		var action = null;
		
		if (event.actionTarget.getAttribute) {
			// DOM node
			action = event.actionTarget.getAttribute("data-action-" + event.type) ||
			         event.actionTarget.getAttribute("data-action");
		}
		else if (event.actionTarget.documentURI) {
			// document object
			action = event.actionTarget["data-action-" + event.type] ||
			         event.actionTarget["data-action"];
		}

		if (action && delegate[action]) {
			try {
				delegate[action](event, event.actionTarget);
			}
			catch (error) {
				event.preventDefault();
				event.stopPropagation();

				if (delegate.onActionError) {
					delegate.onActionError(event, event.actionTarget, action, error);
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

		if (!event.propagationStopped && event.actionTarget !== node && event.actionTarget.parentNode) {
			event.actionTarget = event.actionTarget.parentNode;
			handleEvent(event);
		}
		else {
			// Finished calling actions. Return event object to its normal state.
			event.actionTarget = null;
			event.stopPropagation = event._stopPropagation;
			event._stopPropagation = null;
			event.propagationStopped = null;
		}

		event = null;
	}

};
