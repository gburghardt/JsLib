products = window.products || {};

products.CreateModule = BaseModule.extend({

	prototype: {

		actions: {
			submit: "save",
			click: "cancel",
			change: "markDirty"
		},

		run: function() {
			this.product = new products.Base();
			this.render("products/create_view", this.product);
		},

		cancel: function(event, element, params) {
			event.stop();

			if (!this.dirty || confirm("Are you sure you want to cancel?")) {
				this.destructor();
			}
		},

		markDirty: function(event, element, params) {
			this.dirty = true;
		},

		save: function(event, element, params) {
			event.stop();

			console.info("products.CreateModule#save - Save the new product!");
			this.destructor();
		}

	}

});
