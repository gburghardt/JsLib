BaseModel.Persistence.RestClient = {

	included: function(Klass) {
		Klass.persistence.types.push("restClient");
		Klass = null;
	},

	callbacks: {
		initialize: function(attributes) {
			var defaultOptions = BaseModel.Persistence.RestClient.prototype.restClientOptions;
			var options = {};

			if (this.restClientOptions !== defaultOptions) {
				this.restClientOptions = options.merge(defaultOptions, this.restClientOptions);
			}
			else {
				this.restClientOptions = options.merge(defaultOptions);
			}

			options = defaultOptions = attributes = null;
		}
	},

	prototype: {

		restClientOptions: {
			authorizationRequiredError: "You must be logged in to complete this operation.",
			baseUrl: null,
			create: "POST :baseUrl",
			destroy: "DELETE :baseUrl/:id",
			show: "GET :baseUrl/:id",
			update: "PUT :baseUrl/:id",
			generalError: "An error occurred, please try again.",
			rootElement: null
		},

		createRequest: function() {
			return new XMLHttpRequest();
		},

		createRestClientUri: function(type, data) {
			var uri, method, path, uriString = this.restClientOptions[type];

			uriString = uriString.replace(/:baseUrl/, this.restClientOptions.baseUrl);
			uriString = uriString.replace(/:(\w+)/g, function(match, key) {
				return data[key];
			});

			uri = uriString.split(" ");
			method = uri[0];
			path = uri[1];
			data = null;

			return {method: method, path: path};
		},

		getErrorsFromResponse: function(xhr) {
			var errors = null;

			try {
				errors = JSON.parse(xhr.responseBody);
			}
			catch (error) {
				// fail silently
			}

			return errors;
		},

		saveToRestClient: function(context, callbacks) {
			var uri = this.createRestClientUri((this.persisted) ? "update" : "create", this.attributes);

			this.sendRequest(uri.method, uri.path, this, {
				created: function(xhr) {
					var attributes = JSON.parse(xhr.responseText);
					this.attributes = (this.restClientOptions.rootElement) ? attributes[ this.restClientOptions.rootElement ] : attributes;
					callbacks.saved.call(context);
				},
				updated: function(xhr) {
					var attributes = JSON.parse(xhr.responseText);
					this.attributes = (this.restClientOptions.rootElement) ? attributes[ this.restClientOptions.rootElement ] : attributes;
					callbacks.saved.call(context);
				},
				invalid: function(xhr) {
					this.errors = this.getErrorsFromResponse(xhr);
					callbacks.invalid.call(context, this.errors);
					errors = null;
				},
				notAuthorized: function(xhr) {
					this.addError("base", this.authorizationRequiredError);
					callbacks.invalid.call(context, this.errors);
				},
				notFound: function(xhr) {
					callbacks.notFound.call(context);
				},
				error: function(xhr) {
					this.addError("base", this.generalError);
					callbacks.error.call(context, this.errors);
				}
			});
		},

		sendRequest: function(method, url, context, callbacks) {
			var onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status === 200) {
						if (method === "DELETE") {
							callbacks.destroyed.call(context, this);
						}
						else {
							callbacks.updated.call(context, this);
						}
					}
					else if (this.status === 201) {
						callbacks.created.call(context, this);
					}
					else if (this.status === 403) {
						// not authorized
						callbacks.notAuthorized.call(context, this);
					}
					else if (this.status === 404) {
						// not found
						callbacks.notFound.call(context, this);
					}
					else if (this.status === 412) {
						// validation failed
						callbacks.invalid.call(context, this);
					}
					else if (this.status > 399) {
						// unhandled client or server error
						callbacks.error.call(context, this);
					}
				}
			};
			var async = true;
			var data = this.serialize();
			var xhr = this.createRequest(), model = this;

			if (method === "GET" || method === "DELETE") {
				url += ( url.indexOf("?") < 0 ? "?" : "&" ) + data;
				data = null;
			}

			xhr.onreadystatechange = onreadystatechange;
			xhr.open(method, url, async);
			xhr.setRequestHeader("x-requested-with", "XMLHTTPREQUEST");
			xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
			xhr.send(data);
		}

	}

};

BaseModel.include(BaseModel.Persistence.RestClient);