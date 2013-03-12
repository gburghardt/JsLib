TaskListModule = Modules.Base.extend({

	prototype: {

		actions: {
			submit: "save"
		},

		elements: {
			taskField: ".task-text-field"
		},

		selectionManager: null,

		tasks: null,

		template: "tasks/form",

		run: function() {
			this.tasks = [
				new Task({id: 1, name: "Buy groceries", created_at: new Date(), updated_at: new Date()}),
				new Task({id: 2, name: "Fix the sink", created_at: new Date(), updated_at: new Date()}),
				new Task({id: 3, name: "Cut the grass", created_at: new Date(), updated_at: new Date()})
			];

			this.render(this.template, {tasks: this.tasks});
			
			this.createModuleProperty("selectionManager");
			this.selectionManager.listen("beforeRemoveItem", this, "destroy");
		},

		destroy: function(item) {
			console.info("TaskListModule#destroy");
			console.debug(item);
		},

		save: function(event, element, params) {
			event.stop();
			var data = this.view.getFormData();
			var task = new Task(data);

			task.created_at = new Date();
			task.updated_at = new Date();
			task.id = task.created_at.getTime();

			this.selectionManager.renderNewItem(task, this, function(newItem) {
				this.taskField.value = "";
				this.taskField.focus();
				this.tasks.push(task);
				newItem = null;
			});

			task = event = element = params = null;
		}

	}

});
