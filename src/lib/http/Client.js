window.http = window.http || {};

http.Client = function() {
	
};

http.Cient.prototype = {

	maxTries: 2,

	tries: 0,

	get: function() {
		
	},

	put: function() {
		
	},

	post: function() {
		
	},

	destroy: function() {
		
	},

	head: function() {
		
	},

	send: function() {
		
	},

	handleClientError: function(transport, request) {
		
	},

	handleInternalServerError: function(transport, request) {
		
	},

	handleRequestHeadersReceived: function(transport, request) {
		
	},

	handleRequestLimitExceeded: function(transport, request) {
		// too many API requests
	},

	handleRequestLoading: function(transport, request) {
		
	},

	handleRequestOpened: function(transport, request) {
		
	},

	handleRequestSuccess: function(transport, request) {
		
	},

	handleRequestTimeout: function(transport, request) {
		if (this.tries < this.maxTries) {
			this.tries++;
			request.resend();
		}
		else {
			// delegate this timeout
		}
	},

	handleRequestUnauthorized: function(transport, request) {
		
	},

	handleResourceConflict: function(transport, request) {
		
	},

	handleResourceCreated: function(transport, request) {
		
	},

	handleResourceNotFound: function(transport, request) {
		
	},

	handleResourceNotModified: function(transport, request) {
		
	},

	handleResourcePreconditionFailed: function(transport, request) {
		
	},

	handleUnsupportedMediaType: function(transport, request) {
		
	}

};
