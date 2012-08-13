InitOperation = BaseOperation.extend({

	prototype: {

		containerElement: null,

		destroyOperationChain: function() {
			// "init" operations do nothing here. Just here to break the chain of destruction.
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

		call: function(parentOperation, triggerElement) {
			this.containerElement = this.getContainerElement(triggerElement);
			BaseOperation.prototype.call.call(this, parentOperation);
		}

	}

});
