SelectionManagerModule = Modules.Base.extend({

	prototype: {

		actions: {
			click: ["deselectAll", "selectAll", "toggleSelection"]
		},

		callbacks: {
			selectionSizeChanged: "updateCount"
		},

		options: {
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
