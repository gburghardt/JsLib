MockModule = Modules.Base.extend({

	prototype: {

		actions: {
			click: ["add", "remove", "confirmDestroy"],
			submit: "save",
			change: "markDirty"
		},

		callbacks: {
			afterSave: "hideValidationErrors",
			afterDestroy: "clearform",
			beforeSave: ["prepareStuff", "doSomethingElse"]
		},

		add: function(event, element, params) {
			
		},

		remove: function(event, element, params) {
			
		},

		confirmDestroy: function(event, element, params) {
			
		},

		save: function(event, element, params) {
			
		},

		clearForm: function() {
			this.element.reset();
		},

		markDirty: function(event, element, params) {
			
		},

		prepareStuff: function() {
			
		},

		doSomethingElse: function() {
			
		}

	}

});
