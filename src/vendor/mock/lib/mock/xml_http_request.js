Mock.XMLHttpRequest = function() {
	this._requestHeaders = {};
	this._responseHeaders = {};
};

Mock.XMLHttpRequest.prototype = {

	_async: true,

	_body: "",

	_status: 200,

	_responseXML: null,

	_method: null,

	_requestHeaders: null,

	_responseHeaders: null,

	_data: null,

	_waitTime: null,

	_url: null,

	// Test setup methods

	andWaits: function(waitTime) {
		this.waitTime = waitTime;
		return this;
	},

	returnsStatus: function(endingStatus) {
		this._status = endingStatus;
		return this;
	},

	returnsBody: function(body) {
		this._body = body;
		return this;
	},

	returnsHeaders: function(headers) {
		this._responseHeaders.merge(headers);
		return this;
	},

	sendsHeaders: function(headers) {
		this._requestHeaders.merge(headers);
		return this;
	},

	_changeState: function(readyState, status) {
		this.readyState = readyState;
		this.status = status;
		this.onreadystatechange();
	},

	_resetRequest: function() {
		this.readyState = 0;
		this.status = 0;

		if (this.hasOwnProperty("_responseXML")) {
			this._responseXML = null;
			delete this._responseXML;
		}
	},

	_sendMockRequest: function() {
		this._changeState(1, this.status);
		this._changeState(2, this.status);
		this._changeState(3, this.status);
		this._changeState(4, this._status);
	},

	// Standard XMLHttpRequest interface

	readyState: 0,

	status: 0,

	onreadystatechange: function() {},

	abort: function() {
		this._resetRequest();
		this._changeStatus(0, 0);
	},

	getResponseHeader: function(name) {
		return this._responseHeaders[name] || null;
	},

	getRequestHeader: function(name) {
		return this._requestHeaders[name] || null;
	},

	setRequestHeader: function(name, value) {
		this._requestHeaders[name] = value;
	},

	open: function(method, url, async) {
		this._method = method;
		this._url = url;
		this._async = async;
	},

	send: function(data) {
		this._data = data;
		this._sendMockRequest();
	},

	get responseText() {
		return this._body;
	},

	get responseXML() {
		if (!this.hasOwnProperty("_responseXML")) {
			try {
				var parser = new DOMParser();
				this._responseXML = parser.parseFromString(this._body, "applicaion/xml");
			}
			catch (error) {
				this._responseXML = null;
			}
		}

		return this._responseXML;
	}

};
