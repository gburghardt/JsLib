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
		this.eventActionMapping = null;
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

	this.setEventActionMapping = function(mapping) {
		var actionName;

		if (this.eventActionMapping) {
			for (actionName in this.eventActionMapping) {
				if (this.eventActionMapping.hasOwnProperty(actionName)) {
					this.removeEventType( this.eventActionMapping[actionName] );
				}
			}
		}

		this.eventActionMapping = mapping;

		for (actionName in this.eventActionMapping) {
			if (this.eventActionMapping.hasOwnProperty(actionName)) {
				this.addEventType( this.eventActionMapping[actionName] );
			}
		}

		mapping = null;
	};

	this.triggerEvent = function(type) {
		var event = getDocument().createEvent("CustomEvent");
		event.initCustomEvent(type, true, false, null);
		this.node.dispatchEvent(event);
		event = null;
	};

// Access: Private

	var self = this;

	this.node = null;

	this.eventTypes = null;

	this.eventTypesAdded = null;

	this.delegate = null;

	function getActionParams(element, eventType) {
		var paramsAttr = element.getAttribute("data-actionParams-" + eventType) ||
		                 element.getAttribute("data-actionParams") ||
										 "{}";

		element = null;

		return JSON.parse(paramsAttr);
	}

	function getDocument() {
		return self.node.ownerDocument;
	}

	function stopPropagationPatch() {
		this._stopPropagation();
		this.propagationStopped = true;
	}

	function patchEvent(event) {
		if (!event._stopPropagation) {
			event._stopPropagation = event.stopPropagation;
			event.stopPropagation = stopPropagationPatch;
			event.propagationStopped = false;
			event.stop = function() {
				this.preventDefault();
				this.stopPropagation();
			};
		}

		return event;
	}

	function handleEvent(event) {
		event = patchEvent(event);

		if (!event.actionTarget) {
			// This event has not been delegated yet. Start the delegation at the target
			// element for the event. Note that event.target !== self.node. The
			// event.target object is the element that got clicked, for instance.
			event.actionTarget = event.target;
		}

		// The default method to call on the delegate is "handleAction". This will only
		// get called if the delegate has defined a "handleAction" method.
		var action = null, actionName = null, method = "handleAction", params;

		// Try inferring the action from the data-action attribute specific to this event...
		actionName = event.actionTarget.getAttribute("data-action-" + event.type);
		
		if (!actionName) {
			// No event specifc data-action attribute was found. Try the generic one...
			actionName = event.actionTarget.getAttribute("data-action");

			if (actionName && self.eventActionMapping && self.eventActionMapping[ actionName ] !== event.type) {
				// An action-to-event mapping was found, but not for this action + event combo. Do nothing.
				// For instance, the action is "foo", and the event is "click", but eventActionMapping.foo
				// is either undefined or maps to a different event type.
				actionName = null;
			}
		}

		if (actionName) {
			// We found an action, so set that as the method name to call on the delegate object.
			// FIXME: if the action prefix doesn't match, the method gets fired anyhow
			actionName = actionName.replace(self.actionRegex, "");
			method = actionName;
		}

		if (self.delegate[method]) {
			// The method exists on the delegate object. Try calling it...
			try {
				params = getActionParams(event.actionTarget, event.type);
				self.delegate[method](event, event.actionTarget, params, actionName);
			}
			catch (error) {
				// The delegate method threw an error. Try to recover gracefully...
				event.preventDefault();
				event.stopPropagation();

				if (self.delegate.handleActionError) {
					// The delegate has a generic error handler, call that, passing in the error object.
					self.delegate.handleActionError(event, event.actionTarget, {error: error}, actionName);
				}
				else if (self.constructor.errorDelegate) {
					// A master error delegate was found (for instance, and application object). Call "handleActionError"
					// so this one object can try handling errors gracefully.
					self.constructor.errorDelegate.handleActionError(event, event.actionTarget, {error: error}, actionName);
				}
				else {
					// Give up. Throw the error and let the developer fix this.
					throw error;
				}
			}
		}

		if (!event.propagationStopped && event.actionTarget !== self.node && event.actionTarget.parentNode) {
			// The delegate has not explicitly stopped the event, so keep looking for more data-action
			// attributes on the next element up in the document tree.
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
