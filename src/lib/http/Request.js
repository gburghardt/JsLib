window.http = window.http || {};

http.Request = function(transport, client, options) {
	var that = this;
	this.params = null;
	this.client = client;
	this.options = options;
	this.timer = null;
	this.transport = transport;

	this.destructor = function() {
		if (this.transport) {
			this.client.releaseTransport(this.transport);
			this.transport = null;
		}

		this.client = this.params = this.options = that = null;
	};

	this.abort = function() {
		clearTimeout(this.timer);
		this.transport.abort();
	};

	this.getRequestHeader = function(header) {
		this.transport.getRequestHeader(header);
	};

	this.handleReadyStateChange = function() {
		var readyState = this.readyState, status = this.status;

		if (readyState === 0) {
			return;
		}
		else if (readyState === 1) {
			that.client.handleRequestOpened(this, that);
		}
		else if (readyState === 2) {
			that.client.handleRequestHeadersReceived(this, that);
		}
		else if (readyState === 3) {
			that.client.handleRequestLoading(this, that);
		}
		else if (status === 201) {
			that.client.handleResourceCreated(this, that);
		}
		else if (status >= 200 && status < 300) {
			that.client.handleRequestSuccess(this, that);
		}
		else if (status === 304) {
			that.client.handleResourceNotModified(this, that);
		}
		else if (status === 401) {
			that.client.handleRequestUnauthorized(this, that);
		}
		else if (status === 404) {
			that.client.handleResourceNotFound(this, that);
		}
		else if (status === 409) {
			that.client.handleResourceConflict(this, that);
		}
		else if (status === 408 || status === 504) {
			that.client.handleRequestTimeout(this, that);
		}
		else if (status === 412) {
			that.client.handleResourcePreconditionFailed(this, that);
		}
		else if (status === 415) {
			that.client.handleUnsupportedMediaType(this, that);
		}
		else if (status === 429) {
			that.client.handleRequestLimitExceeded(this, that);
		}
		else if (status < 500) {
			that.client.handleClientError(this, that);
		}
		else {
			that.client.handleInternalServerError(this, that);
		}
	};

	this.handleTimeout = function() {
		that.abort();
		that.client.handleRequestTimeout();
	};

	this.open = function() {
		if (!this.transport.onreadystatechange) {
			this.transport.onreadystatechange = this.handleReadyStateChange;
			this.transport.setRequestHeader("X-Requested-With", "XMLHTTPRequest");
			this.transport.open(this.options.method, this.options.url, this.options.async, this.options.user, this.options.password);
		}
	};

	this.resend = function() {
		this.send(this.params);
	};

	this.send = function(params) {
		this.params = this.serializeData(params);

		if (this.options.timeout) {
			this.timer = setTimeout(this.handleTimeout, this.options.timeout);
		}

		this.transport.send(this.params);
	};

	this.serializeData = function(data, keyPrefix, keySuffix) {
		var params = null;

		if (data instanceof Array) {
			params = data.join("&");
		}
		else if (data.serialize) {
			params = data.serialize();
		}
		else if (data instanceof Object) {
			var key, i, length, paramKey;
			keyPrefix = keyPrefix || "";
			keySuffix = keySuffix || "";
			params = [];

			for (key in data) {
				if (data.hasOwnProperty(key)) {
					if (typeof data[key] === "object" && data[key]) {
						if (data[key] instanceof Array) {
							for (i = 0, length = data[key].length; i < length; i++) {
								keySuffix = "[" + i + "]";

								if (data[key][i] instanceof Object) {
									if (!keyPrefix) {
										params.push(this.serializeData(data[key][i], key + keySuffix + "[", "]"));
									}
									else {
										params.push(this.serializeData(data[key][i], keyPrefix + key + "]" + keySuffix + "[", "]"));
									}
								}
								else if (data[key][i]) {
									params.push(keyPrefix + escape(key) + keySuffix + "=" + escape(data[key][i]));
								}
							}
						}
						else {
							if (!keyPrefix) {
								params.push(this.serializeData(data[key], keyPrefix + key + "[", "]"));
							}
							else {
								params.push(this.serializeData(data[key], keyPrefix + key + "][", "]"));
							}
						}
					}
					else {
						params.push(keyPrefix + escape(key) + keySuffix + "=" + escape(data[key]));
					}
				}
			}

			params = params.join("&");
		}

		return params;
	};

	this.setRequestHeader = function(header, value) {
		this.transport.setRequestHeader(header, value);
	};

};
