Events.Event = function(type, publisher, data) {
	this.type = type;
	this.publisher = publisher;
	this.data = data || {};
	this.dateStarted = (this.INCLUDE_DATE) ? new Date() : null;
	publish = data = null;
};

Events.Event.prototype = {

	INCLUDE_DATE: true,

	cancelled: false,
	data: null,
	dateStarted: null,
	publisher: null,
	type: null,

	destructor: function() {
		this.publisher = this.data = this.dateStarted = null;
	},

	cancel: function() {
		this.cancelled = true;
	}

};
