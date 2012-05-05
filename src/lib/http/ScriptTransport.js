window.http = window.http || {};

http.ScriptTransport = function() {
	this.script = http.ScriptTransport.getScriptNode();
	this.headers = {
		"content-type": "text/json"
	};

	if (!this.script) {
		throw new Error("Too many pending ScriptTransports exist. Only " + http.ScriptTransport.scriptNodeQueueSize + " allowed and " + http.ScriptTransport.scriptNodeQueue.length + " detected.");
	}
};

http.ScriptTransport.prototype = {

	headers: null,

	lastResponse: null,

	lastResponseDecoded: null,

	method: null,

	password: null,

	_readyState: 0,

	responseType: "",

	script: null,

	status: null,

	url: "",

	user: null,

	abort: function() {
		
	},

	getRequestHeader: function(header) {
		return (this.headers.hasOwnProperty(header)) ? this.headers[header] : null;
	},

	getResponseHeader: function(header) {
		// this is not supported for script transports
		return null;
	},

	onreadystatechange: function() {
		// http.Request will inject this method
	},

	open: function(method, url, async, user, password) {
		if (this.readyState === 0) {
			this.method = method;
			this.url = url;
			this.user = user;
			this.password = password;
			this.readyState = 1;
		}
	},

	get readyState() {
		return this._readyState;
	},

	set readyState(readyState) {
		this._readyState = readyState;
		this.onreadystatechange();
	},

	get response() {
		if (this.lastResponseDecoded === null) {
			if (this.responseType === "" || this.responseType === "text") {
				this.lastReponseDecoded = this.lastResponse;
			}
			else if (this.responseType === "json") {
				if (!this.lastResponseDecoded) {
					try {
						this.lastResponseDecoded = JSON.parse(this.lastResponse);
					}
					catch (error) {
						this.lastResponseDecoded = null;
					}
				}
			}
			else if (this.responseType === "document") {
				var parser;

				if (this.getRequestHeader("content-type") === "text/xml") {
					parser = new DOMParser();

					try {
						this.lastResponseDecoded = parser.parseFromString(this.lastResponse, "text/xml");
					}
					catch (error) {
						this.lastResponseDecoded = null;
					}
				}
				else {
					var i, length, nodes;
					parser = document.createElement("div");
					parser.innerHTML = this.lastResponse.replace(/^\s+|\s+$/g, "");

					if (parser.childNodes.length === 1) {
						this.lastResponseDecoded = parser.childNodes[0];
						parser.removeChild(parser.childNodes[0]);
					}
					else {
						i = parser.childNodes.length;
						nodes = [];

						while (i--) {
							nodes.push(parser.childNodes[i]);
							parser.removeChild(parser.childNodes[i]);
						}

						this.lastResponseDecoded = nodes;
						nodes = null;
					}

				}

				parser = null;
			}
			else {
				throw new Error("The " + this.responseType + " is not supported for ScriptTransport requests");
			}
		}

		return this.lastResponseDecoded;
	},

	get responseText() {
		if (this.responseType == "" || this.responseType == "text") {
			return this.response;
		}
		else {
			return null;
		}
	},

	get responseXML() {
		if (this.responseType === "document") {
			return this.response;
		}
		else {
			return null;
		}
	},

	send: function(params) {
		if (this.readyState === 1) {
			this.readyState = 3;
			this.script.src = this.url + (this.url.indexOf("?") > -1) ? "&" + params : "?" + params;
		}
	},

	setRequestHeader: function(header, value) {
		this.headers[header.toLowerCase()] = value;
	}

};

http.ScriptTransport.scriptNodeQueueSize = -1;
http.ScriptTransport.scriptNodeQueue = [];

http.ScriptTransport.getScriptNode = function() {
	var script = null, i = 0, length;

	if (this.scriptNodeQueueSize < 0) {
		script = document.createElement("script");
		script.type = "text/javascript";
	}
	else if (this.scriptNodeQueue.length < this.scriptNodeQueueSize) {
		for (i = 0, length = this.scriptNodeQueue.length; i < length; i++) {
			if ("true" !== this.scriptNodeQueue[i].getAttribute("data-http-scriptTransport-pending")) {
				script = this.scriptNodeQueue[i];
				script.setAttribute("data-http-scriptTransport-pending", "true");
			}
		}

		if (!script) {
			script = document.createElement("script");
			script.type = "text/javascript";
			script.setAttribute("data-http-scriptTransport-pending", "true");
			this.scriptNodeQueue.push(script);
		}
	}

	return script;
};

http.ScriptTransport.releaseScriptNode = function(script) {
	script.setAttribute("data-http-scriptTransport-pending", "");
	script = null;
};
