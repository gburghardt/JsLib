window.http = window.http || {};

http.Response = function(client, request) {
	this.client = client;
	this.request = request;
};

http.Response.prototype = {
	client: null,
	request: null
};
