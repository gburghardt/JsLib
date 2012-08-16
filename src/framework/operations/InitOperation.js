InitOperation = BaseOperation.extend({

	prototype: {

		containerElement: null,

		destroyOperationChain: function() {
			this.destructor();
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

		call: function(parentOperation, action) {
			this.containerElement = this.getContainerElement(action.element);
			BaseOperation.prototype.call.call(this, parentOperation, [action]);
			action = null;
		}

	}

});
