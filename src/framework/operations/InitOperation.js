InitOperation = BaseOperation.extend({

	prototype: {

		containerElement: null,

		containerOptions: {
			className: "init",
			location: "bottom"
		},

		element: null,

		operationMap: null,

		destructor: function() {
			if (this.element) {
				this.element.parentNode.removeChild(this.element);
			}

			this.element = null;
		},

		destroyOperationChain: function() {
			this.destructor();
		},

		call: function(parentOperation, action) {
			this.containerElement = this.getContainerElement(action.element);
			this.createElement();

			if (this.operationMap) {
				this.map(this.operationMap);
			}

			BaseOperation.prototype.call.call(this, parentOperation, [action]);
			parentOperation = action = null;
		},

		cancel: function(event, action) {
			action.cancel();
			this.destructor();
		},

		createElement: function() {
			this.element = this.getDocument().createElement("div");
			this.element.setAttribute("class", this.containerOptions.className);

			if (this.containerOptions.location === "top") {
				if (this.containerElement.childNodes[0]) {
					this.containerElement.insertBefore(this.containerElement.childNodes[0], this.element);
				}
				else {
					this.containerElement.appendChild(this.element);
				}
			}
			else {
				this.containerElement.appendChild(this.element);
			}
		},

		getContainerElement: function(element) {
			var containerElement = element;

			if (containerElement.getAttribute("data-operation-container")) {
				containerElement = document.getElementById( containerElement.getAttribute("data-operation-container") );
			}
			else {
				while (containerElement && containerElement.getAttribute("data-layout-role") != "container") {
					containerElement = containerElement.parentNode;
				}
			}

			event = null;

			return containerElement;
		},

		getDocument: function() {
			return this.containerElement ? this.containerElement.ownerDocument : null;
		}

	}

});
