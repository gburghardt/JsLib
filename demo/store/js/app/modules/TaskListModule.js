TaskListModule = BaseModule.extend({

	prototype: {

		actions: {
			submit: "save",
			click: ["removeTask", "removeSelected"]
		},

		elements: {
			taskField: "#task-text"
		},

		selectionManager: null,

		run: function() {
			this.createModuleProperty("selectionManager");
		},

		removeSelected: function(event, element, params) {
			event.stop();

			if (confirm("Are you sure you want to remove these items?")) {
				var items= this.selectionManager.getSelectedItems(), i = 0, length = items.length;

				for (i; i < length; i++) {
					items[i].parentNode.removeChild(items[i]);
				};

				this.selectionManager.updateCount(true);
				items = null;
			}

			event = element = params = null;
		},

		removeTask: function(event, element, params) {
			event.stop();
			var listItem = element.parentNode;

			if (confirm("Are you sure you want to remove this task?")) {
				listItem.parentNode.removeChild(listItem);
			}

			this.selectionManager.updateCount(true);

			event = element = params = listItem = null;
		},

		save: function(event, element, params) {
			event.stop();
			var data = this.view.getFormData();
			var newItem = document.createElement("li");
			newItem.setAttribute("data-action", "toggleSelection");
			Template.render("tasks/item", data, this, function(source) {
				newItem.innerHTML = source;
				this.element.getElementsByTagName("ol")[0].appendChild(newItem);
				this.taskField.value = "";
				this.taskField.focus();
			});
		}

	}

});
