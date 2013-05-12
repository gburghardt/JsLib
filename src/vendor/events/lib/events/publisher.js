Events.Publisher = {

	prototype: {

		dispatcher: null,
		
		initEventPublishing: function() {
			if (this.dispatcher) {
				return;
			}

			this.dispatcher = new Events.Dispatcher();
		},
		
		destroyEventPublishing: function() {
			if (!this.dispatcher) {
				return;
			}

			this.dispatcher.destructor();
			this.dispatcher = null;
		},
		
		publish: function(type, data) {
			this.dispatcher.publish(type, this, data);
		},
		
		subscribe: function(type, instance, method) {
			this.dispatcher.subscribe(type, instance, method);
		},
		
		unsubscribe: function(type, instance) {
			this.dispatcher.unsubscribe(type, instance);
		}

	}

};
