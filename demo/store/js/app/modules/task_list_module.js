TaskListModule = Modules.Base.extend({

	prototype: {

		actions: {
			submit: [
				"create",
				"update"
			],
			click: [
				"cancel",
				"edit"
			]
		},

		elements: {
			createForm: ".task-create_form-container",
			createTaskField: ".task-create_form-container .task-text-field",
			updateForm: ".task-update_form-container",
			updateTaskField: ".task-update_form-container .task-text-field"
		},

		selectionManager: null,

		tasks: null,

		template: "tasks/index",

		run: function() {
			this.tasks = [
				new Task({id: 1, name: "Buy groceries", created_at: new Date(), updated_at: new Date()}),
				new Task({id: 2, name: "Fix the sink", created_at: new Date(), updated_at: new Date()}),
				new Task({id: 3, name: "Cut the grass", created_at: new Date(), updated_at: new Date()})
			];

			var task = new Task();

			this.render(this.template, {task: task, tasks: this.tasks}, this, function() {
				this.createModuleProperty("selectionManager");
				this.selectionManager.listen("beforeRemoveItem", this, "destroy");
				task = null;
			});
		},

		cancel: function(event, element, params) {
			event.stop();
			this.switchCreateMode();
		},

		destroy: function(item) {
			console.info("TaskListModule#destroy");
			console.debug(item);
			this.switchCreateMode();
		},

		edit: function(event, element, params) {
			event.stop();

			var itemElement = element.parentNode;
			var data = this.view.getFormData(itemElement).tasks[params.key];
			var task = this.getTaskById(data.id);

			if (task) {
				Template.render("tasks/update_form", task, this, function(source, template) {
					this.expireElementCache();
					this.updateForm.innerHTML = source;
					this.switchEditMode();
				});
			}
			else {
				alert("Failed to find task with Id " + data.id + "(key: " + params.key + ")");
			}
		},

		create: function(event, element, params) {
			event.stop();
			this.switchCreateMode();

			var data = this.view.getFormData();
			var task = new Task(data.task);

			task.created_at = new Date();
			task.updated_at = new Date();
			task.id = task.created_at.getTime();

			this.selectionManager.renderNewItem(task, this, function(newItem) {
				newItem.setAttribute("data-selection-item-id", task.id);
				this.taskField.value = "";
				this.taskField.focus();
				this.tasks.push(task);

				newItem = null;
			});

			data = task = event = element = params = null;
		},

		update: function(event, element, params) {
			event.stop();

			var data = this.view.getFormData();
			var task = this.getTaskById(data.task.id);

			task.attributes = data.task;
			task.updated_at = new Date();

			Template.render("tasks/item", task, this, function(source, template) {
				var item = this.selectionManager.getItemElementById(task.id);
				item.innerHTML = source;
				this.switchCreateMode();
				item = task = template = null;
			});

			data = event = element = params = null;
		},

// Protected

		getTaskById: function(id) {
			var i = 0, length = this.tasks.length;
			var task = null;
			id = Number(id);

			for (i; i < length; i++) {
				if (this.tasks[i].id === id) {
					task = this.tasks[i];
					break;
				}
			}

			return task;
		},

		switchCreateMode: function() {
			this.updateForm.style.display = "none";
			this.createForm.style.display = "block";
			this.createTaskField.focus();
			this.createTaskField.select();
		},

		switchEditMode: function() {
			this.createForm.style.display = "none";
			this.updateForm.style.display = "block";
			this.updateTaskField.focus();
			this.updateTaskField.select();
		}

	}

});
