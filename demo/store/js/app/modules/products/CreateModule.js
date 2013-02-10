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
			this.product.attributes = this.view.getFormData();
			this.view.toggleLoading(true);

			// TODO: The model should make this Ajax call
			var xhr = new XMLHttpRequest(), that = this;
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					var data = eval("(" + this.responseText + ")");
					that.product.attributes = data.product;
					console.info("Finished saving product", that.product);
					that.destructor();
					that = data = xhr = null;
				}
				else if (this.status >= 400) {
					console.error("Network error " + this.status);
					xhr = that = null;
				}
			};
			xhr.open("GET", "/demo/store/js/mocks/products/create.json?_=" + new Date().getTime());
			xhr.send(null);
		}

	}

});
