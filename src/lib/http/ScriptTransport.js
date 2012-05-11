window.http = window.http || {};

http.ScriptTransport = function() {

	var _headers = {
		"content-type": "text/json"
	};

	var _lastResponse = null;

	var _lastResponseDecoded = null;

	var _method = null;

	var _password = null;

	var _readyState = 0;

	var _responseType = "";

	var _script = null;

	var _status = null;

	var _url = "";

	var _user = null;

	var self = this;

	this.abort = function abort() {
		
	};

	this.getRequestHeader = function getRequestHeader(header) {
		return (_headers.hasOwnProperty(header)) ? _headers[header] : null;
	};


	this.open = function open(method, url, async, user, password) {
		if (_readyState === 0) {
			_method = method;
			_url = url;
			_user = user;
			_password = password;
			http.ScriptTransport.addCallback(handleScriptLoaded);
			self.readyState = 1;
		}
	};

	// getter/setter for this.readyState
	Object.defineProperty(this, "readyState", {
		get: function() {
			return _readyState;
		},
		set: function(readyState) {
			_readyState = readyState;
			this.onreadystatechange();
		}
	});

	function getResponse() {
		if (_lastResponseDecoded === null) {
			if (_responseType === "" || _responseType === "text") {
				_lastReponseDecoded = _lastResponse;
			}
			else if (_responseType === "json") {
				if (!_lastResponseDecoded) {
					try {
						_lastResponseDecoded = JSON.parse(_lastResponse);
					}
					catch (error) {
						_lastResponseDecoded = null;
					}
				}
			}
			else if (_responseType === "document") {
				var parser;

				if (getRequestHeader("content-type") === "text/xml") {
					parser = new DOMParser();

					try {
						_lastResponseDecoded = parser.parseFromString(_lastResponse, "text/xml");
					}
					catch (error) {
						_lastResponseDecoded = null;
					}
				}
				else {
					var i, length, nodes;
					parser = document.createElement("div");
					parser.innerHTML = _lastResponse.replace(/^\s+|\s+$/g, "");

					if (parser.childNodes.length === 1) {
						_lastResponseDecoded = parser.childNodes[0];
						parser.removeChild(parser.childNodes[0]);
					}
					else {
						i = parser.childNodes.length;
						nodes = [];

						while (i--) {
							nodes.push(parser.childNodes[i]);
							parser.removeChild(parser.childNodes[i]);
						}

						_lastResponseDecoded = nodes;
						nodes = null;
					}

				}

				parser = null;
			}
			else {
				throw new Error("The " + _responseType + " is not supported for ScriptTransport requests");
			}
		}

		return _lastResponseDecoded;
	}

	// getter for this.response
	Object.defineProperty(this, "response", {get: getReponse});

	function getResponseText() {
		if (_responseType == "" || _responseType == "text") {
			return _response;
		}
		else {
			return null;
		}
	}

	// getter for this.responseText
	Object.defineProperty(this, "responseText", {get: getResponseText});

	function getResponseXML() {
		if (_responseType === "document") {
			return getReponse();
		}
		else {
			return null;
		}
	}

	// getter for this.responseXML
	Object.defineProperty(this, "responseXML", {get: getResponseXML});

	function handleScriptLoaded(data) {
		_lastResponse = data;
		data = null;
		self.readyState = 4;
	}

	this.send = function send(params) {
		if (_readyState === 1) {
			this.readyState = 3;
			_script.setAttribute("src", _url + (_url.indexOf("?") > -1) ? "&" + params : "?" + params);
		}
	};

	this.setRequestHeader = function setRequestHeader(header, value) {
		_headers[header.toLowerCase()] = value;
	};

};

http.ScriptTransport.prototype = {
	getResponseHeader: function(header) {
		// this is not supported for script transports
		return null;
	},

	onreadystatechange: function() {
		// http.Request will inject this method
	}
};

http.ScriptTransport.callbacks = {};
http.ScriptTransport.callbackCount = 0;

http.ScriptTransport.addCallback = function(fn) {
	var name = "_" + (this.callbackCount++);
	this.callbacks[name] = function(data) {
		fn(data);
		this.callbacks[name] = null;
		delete this.callbacks[name];
		fn = data = null;
	};
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
