function HttpRequest() {
	
	function constructor() {
		
	}
	
	function destructor() {
		
	}
	
	function abort() {
		
	}
	
	function get() {
		
	}
	
	function post() {
		
	}
	
	function send() {
		
	}
	
	this.constructor = constructor;
	this.destructor = destructor;
	this.abort = abort;
	this.get = get;
	this.post = post;
	this.send = send;
}

HttpRequest.handlers = {
	complete: [],
	error: [],
	success: []
};

HttpRequest.addHandler = function(name, callback) {
	if (this.handlers[name]) {
		this.handlers[name].push(callback);
	}
};

HttpRequest.create = function(url, options) {
	
};

HttpRequest.get = function(url, options) {
	
};

HttpRequest.notifyHandlers = function(name, data) {
	
};

HttpRequest.post = function(url, options) {
	
};

HttpRequest.send = function(url, options) {
	
};

HttpRequest.removeHandler = function(name, callback) {
	if (this.handlers[name]) {
		for (var i = 0, length = this.handlers[name].length; i < length; i++) {
			if (callback === this.handlers[name][i]) {
				this.handlers[name].splice(i, 1);
				break;
			}
		}
	}

	callback = null;
};
