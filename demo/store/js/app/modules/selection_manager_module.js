SelectionManagerModule = Modules.Base.extend({

	prototype: {

		actions: {
			click: [
				"deselectAll",
				"selectAll",
				"removeItem",
				"removeSelectedItems",
				"toggleSelection"
			]
		},

		callbacks: {
			afterAddItem: "updateEmptyListIndicator",
			afterRemoveItem: "updateEmptyListIndicator",
			selectionSizeChanged: "updateCount"
		},

		elements: {
			emptyListElement: "p.empty-list",
			listElement: "ol.items",
			listSizeElement: ".selection-manager-counter",
			removedListElement: "ol.removed-items"
		},

		options: {
			confirmRemoveMessage: "Are you sure you want to remove this item?",
			confirmRemoveSelectedMessage: "Are you sure you want to remove these items?",
			newItemTemplate: null,
			removalBehavior: "hide",
			selectedClass: "selected"
		},

		selectionSize: 0,

// Access: Public

		deselectAll: function(event, element, params) {
			event.stop();

			var items = this.getItems(), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].removeClass(this.options.selectedClass);
			}

			this.selectionSize = 0;
			this.notify("selectionSizeChanged");
		},

		getItemElementById: function(id) {
			id = String(id);
			var items = this.getItems(), i = 0, length = items.length;
			var item = null;

			for (i; i < length; i++) {
				if (id === items[i].getAttribute("data-selection-item-id")) {
					item = items[i];
					break;
				}
			}

			items = null;

			return item;
		},

		getItems: function() {
			return this.listElement.getElementsByTagName("li");
		},

		selectAll: function(event, element, params) {
			event.stop();

			var items = this.getItems(), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].addClass(this.options.selectedClass);
			}

			this.selectionSize = items.length;
			this.notify("selectionSizeChanged");
		},

		getItemCount: function() {
			return this.getItems().length;
		},

		getSelectedItemCount: function() {
			return this.getSelectedItems().length;
		},

		getSelectedItems: function() {
			return this.listElement.querySelectorAll("li." + this.options.selectedClass) || [];
		},

		removeItem: function(event, element, params) {
			event.stop();
			var item = element.getParentByTagName("li");

			if (confirm(this.options.confirmRemoveMessage) && this.notify("beforeRemoveItem", {item: item}) !== false) {
				if (this.removeItemFromList(item)) {
					this.notify("selectionSizeChanged");
				}

				this.notify("afterRemoveItem", {item: item});
			}

			event = element = params = null;
		},

		removeSelectedItems: function(event, element, params) {
			event.stop();

			if (confirm(this.options.confirmRemoveSelectedMessage)) {
				var items = this.getSelectedItems(), i = 0, length = items.length;
				var selectionSizeChanged = true;

				for (i; i < length; i++) {
					if (this.notify("beforeRemoveItem", {item: items[i]}) !== false) {
						selectionSizeChanged = selectionSizeChanged && this.removeItemFromList(items[i]) ? true : false;
					}
				}
			}

			if (selectionSizeChanged) {
				this.notify("selectionSizeChanged");
			}

			event = element = params = null;
		},

		renderNewItem: function(data, context, callback) {
			if (!this.options.newItemTemplate) {
				throw new Error("You must specify options.newItemTemplate before rendering a new item");
			}

			Template.render(this.options.newItemTemplate, data, this, function(html, template) {
				var newItem = Template.parseHTML(html)[0];
				this.listElement.appendChild(newItem);
				callback.call(context, newItem);
				this.notify("afterAddItem");
				newItem = data = template = null;
			});
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

		removeItemFromList: function(item) {
			var selectionSizeChanged = false;

			if (this.options.removalBehavior === "hide") {
				this.removeItemByHiding(item);
			}
			else {
				this.removeItemFromDocumentTree(item);
			}

			if (item.hasClass(this.options.selectedClass)) {
				this.selectionSize--;
				selectionSizeChanged = true;
			}

			this.notify("afterRemoveItem", {item: item});

			item = null;

			return selectionSizeChanged;
		},

		removeItemByHiding: function(item) {
			item.style.display = "none";

			var inputs = item.getElementsByTagName("input");
			var regex = /_destroy\]$/, i = 0, length = inputs.length;

			for (i; i < length; i++) {
				if ( regex.test( inputs[i].name ) ) {
					inputs[i].value = "1";
					break;
				}
			}

			this.listElement.removeChild(item);
			this.removedListElement.appendChild(item);

			item = inputs = null;
		},

		removeItemFromDocumentTree: function(item) {
			if (item.parentNode) {
				item.parentNode.removeChild(item);
			}

			item = null;
		},

		updateCount: function() {
			this.listSizeElement.innerHTML = this.selectionSize;
		},

		updateEmptyListIndicator: function() {
			var itemCount = this.getItemCount();

			if (itemCount === 0) {
				this.emptyListElement.style.display = "";
				this.listElement.style.display = "none";
			}
			else {
				this.emptyListElement.style.display = "none";
				this.listElement.style.display = "";
			}
		}

	}

});
