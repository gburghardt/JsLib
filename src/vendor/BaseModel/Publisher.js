BaseModel.Publisher = {

	self: {

		dispatcher: null,

		publish: function(eventName, data) {
			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.publish(eventName, this, data);
			}

			data = null;
		},

		subscribe: function(eventName, instance, callback) {
			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.subscribe(eventName, instance, callback);
			}

			instance = callback = null;
		},

		unsubscribe: function(eventName, instance) {
			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.unsubscribe(eventName, instance);
			}

			instance = null;
		},

		unsubscribeAll: function(instance) {
			if (BaseModel.dispatcher) {
				BaseModel.dispatcher.unsubscribeAll(instance);
			}

			instance = null;
		}

	},

	prototype: {

		publish: function(eventName) {
			BaseModel.publish(eventName, this);
		},

		subscribe: function(eventName, instance, callback) {
			BaseModel.subscribe(eventName, instance, callback);
			instance = callback = null;
		},

		unsubscribe: function(eventName, instance, callback) {
			BaseModel.unsubscribe(eventName, instance, callback);
			instance = callback = null;
		}

	}

};

BaseModel.include(BaseModel.Publisher);
