SubOperation = BaseOperation.extend({
	prototype: {

		destroyOperationChain: function() {
			if (this.parentOperation) {
				this.parentOperation.destroyOperationChain();
			}
		}

	}
});
