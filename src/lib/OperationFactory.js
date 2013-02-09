OperationFactory = Object.extend({

	prototype: {

		eventDispatcher: null,

		destructor: function() {
			this.eventDispatcher = null;
		},

		getOperation: function(name) {
			var Klass = null, KlassName;
			
			try {
        KlassName = (name + "_operation").toClassName();
				Klass = KlassName.constantize();
			}
			catch (e) {
				Klass = null;
			}

			return Klass ? new Klass(this, this.eventDispatcher) : null;
		},

		setEventDispatcher: function(eventDispatcher) {
			this.eventDispatcher = eventDispatcher;
			eventDispatcher = null;
		}

	}

});
