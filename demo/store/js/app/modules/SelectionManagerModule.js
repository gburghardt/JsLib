SelectionManagerModule = BaseModule.extend({

	prototype: {

		actions: {
			click: ["deselectAll", "selectAll", "toggleSelection"]
		},

		initialize: function(element, options) {
			options = {
				selectedClass: "selected"
			}.merge(options || {});

			BaseModule.prototype.initialize.call(this, element, options);
		},

		deselectAll: function(event, element, params) {
			event.stop();

			var items = this.element.getElementsByTagName("li"), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].removeClass(this.options.selectedClass);
			}
		},

		getSelectedItems: function() {
			return this.element.querySelectorAll("li." + this.options.selectedClass);
		},

		selectAll: function(event, element, params) {
			event.stop();

			var items = this.element.getElementsByTagName("li"), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].addClass(this.options.selectedClass);
			}
		},

		toggleSelection: function(event, element, params) {
			event.preventDefault();

			if (element.hasClass(this.options.selectedClass)) {
				element.removeClass(this.options.selectedClass);
			}
			else {
				element.addClass(this.options.selectedClass);
			}
		}

	}

});
