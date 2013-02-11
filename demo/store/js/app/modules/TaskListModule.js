TaskListModule = BaseModule.extend({

	prototype: {

		actions: {
			submit: "save",
			click: ["removeTask", "removeSelected"]
		},

		selectionManager: null,

		run: function() {
			this.view = new BaseView(this.element);
			this.createModuleProperty("selectionManager");
		},

		removeSelected: function(event, element, params) {
			event.stop();
			var items= this.selectionManager.getSelectedItems(), i = 0, length = items.length;

			for (i; i < length; i++) {
				items[i].parentNode.removeChild(items[i]);
			};

			this.selectionManager.updateCount(true);

			event = element = params = items = null;
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
			newItem.innerHTML = Template.find("tasks/item").render(data);
			this.element.getElementsByTagName("ol")[0].appendChild(newItem);
			document.getElementById("task-text").value = "";
			document.getElementById("task-text").focus();
		}

	}

});
