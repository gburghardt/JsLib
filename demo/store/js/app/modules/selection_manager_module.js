SelectionManagerModule = Modules.Base.extend({

	prototype: {

		actions: {
			click: ["deselectAll", "selectAll", "removeItem", "toggleSelection"]
		},

		callbacks: {
			selectionSizeChanged: "updateCount"
		},

		options: {
			confirmRemoveMessage: "Are you sure you want to remove this item?",
			removalBehavior: "hide",
			selectedClass: "selected"
		},

		selectionSize: 0,

// Access: Public

		deselectAll: function(event, element, params) {
			event.stop();

			var items = this.element.getElementsByTagName("li"), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].removeClass(this.options.selectedClass);
			}

			this.selectionSize = 0;
			this.notify("selectionSizeChanged");
		},

		selectAll: function(event, element, params) {
			event.stop();

			var items = this.element.getElementsByTagName("li"), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].addClass(this.options.selectedClass);
			}

			this.selectionSize = items.length;
			this.notify("selectionSizeChanged");
		},

		removeItem: function(event, element, params) {
			event.stop();
			var item = element.parentNode;

			if (confirm(this.options.confirmRemoveMessage) && this.notify("beforeRemoveItem", {item: item}) !== false) {
				if (this.options.removalBehavior === "hide") {
					this.removeItemByHiding(item);
				}
				else {
					this.removeItemFromDocumentTree(item);
				}

				this.notify("afterRemoveItem", {item: item});

				if (item.hasClass(this.options.selectedClass)) {
					this.notify("selectionSizeChanged");
				}
			}
		},

		toggleSelection: function(event, element, params) {
			event.preventDefault();

			if (element.hasClass(this.options.selectedClass)) {
				element.removeClass(this.options.selectedClass);
				this.selectionSize--;
			}
			else {
				element.addClass(this.options.selectedClass);
				this.selectionSize++;
			}

			this.notify("selectionSizeChanged");
		},

// Access: Private

		getSelectedItems: function() {
			return this.element.querySelectorAll("li." + this.options.selectedClass) || [];
		},

		removeItemByHiding: function(item) {
			item.style.display = "none";

			var inputs = item.getElementsByTagName("input");
			var regex = /_destroy\]$/, i = 0, length = inputs.length;

			for (i; i < length; i++) {
				if ( regex.test( inputs[0].name ) ) {
					inputs[i].value = "1";
				}
			}

			item = inputs = null;
		},

		removeItemFromDocumentTree: function(item) {
			if (item.parentNode) {
				item.parentNode.removeChild(item);
			}

			item = null;
		},

		updateCount: function(forceRecount) {
			var counter = this.element.querySelectorAll(".selection-manager-counter")[0];

			if (forceRecount) {
				this.selectionSize = this.getSelectedItems().length;
			}

			if (counter) {
				counter.innerHTML = this.selectionSize;
				counter = null;
			}
		}

	}

});
