/*

class Views.Base extends Object
	Public:
		constructor(String | HTMLElement id)
		init()
		destructor()
	Protected:
		id <String>
		ownerDocument <Document>
		element <HTMLElement>
		getElementBySiffux(String idSuffix) returns HTMLElement
		querySelector(String selector) returns HTMLElement or undefined
		querySelectorAll(String selector) returns HTMLCollection

*/
Views.Base = Object.extend({

	self: {

		getInstance: function(element, templateName) {
			var className = (templateName.replace(/\//g, "-") + "_view").toClassName();
			var ViewClass = className.constantize();
			var view;

			if (!ViewClass) {
				ViewClass = this;
			}

			view = new ViewClass(element, templateName);
			ViewClass = element = null;
			return view;
		}

	},

	prototype: {

// Access: Public

		initialize: function(element, templateName) {
			if (typeof element === "string") {
				if (!this.ownerDocument) {
					this.ownerDocument = document;
				}

				this.element = this.ownerDocument.getElementById(element);
			}
			else {
				this.element = element;
				this.ownerDocument = this.element.ownerDocument;
				this.id = this.element.identify();
			}

			if (templateName) {
				this.templateName = templateName;
			}

			if (!this.element.childNodes.length) {
				this.element.innerHTML = this.getDefaultHTML();
			}

			element = null;
		},

		destructor: function() {
			this.element = this.ownerDocument = null;
		},

		focus: function() {
			var firstField = this.querySelector("input,textarea,select");

			if (firstField) {
				firstField.focus();

				if (firstField.select) {
					firstField.select();
				}
			}

			firstField = null;
		},

		getDefaultHTML: function() {
			return '<div class="view-loading"></div><div class="view-content"></div>';
		},

		render: function(model) {
			this.toggleLoading(true);

			Template.fetch(this.templateName, this, function(template) {
				this.model = model;
				this.querySelector(".view-content").innerHTML = template.render(this.model);
				this.toggleLoading(false);
				template = null;
			});

			return this;
		},

		toggleLoading: function(loading) {
			if (loading) {
				this.querySelector(".view-loading").style.display = "block";
				this.querySelector(".view-content").style.display = "none";
			}
			else {
				this.querySelector(".view-loading").style.display = "none";
				this.querySelector(".view-content").style.display = "block";
			}
		},

// Access: Protected

		id: null,

		ownerDocument: null,

		element: null,

		templateName: null,

		getElementBySuffix: function(idSuffix) {
			return this.ownerDocument.getElementById(this.id + "-" + idSuffix);
		},

		querySelector: function(selector) {
			return this.element.querySelectorAll(selector)[0];
		},

		querySelectorAll: function(selector) {
			return this.element.querySelectorAll(selector);
		}

	}

});
