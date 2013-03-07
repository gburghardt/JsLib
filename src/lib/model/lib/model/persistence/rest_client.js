'@import Model.Base';
'@import Model.Validation';
'@import Model.Persistence';

Model.Persistence.RestClient = {

	included: function(Klass) {
		Klass.attempt("addCallbacks", {
			afterInitialize: "initRestClient"
		});
	},

	prototype: {

		restClientOptions: {
			ajaxHeaderName: "x-requested-with",
			ajaxHeaderValue: "XMLHTTPREQUEST",
			authorizationRequiredError: "You must be logged in to complete this operation.",
			baseUrl: null,
			create: "POST :baseUrl",
			destroy: "DELETE :baseUrl/:id",
			unmodified: "HEAD :baseUrl/:id",
			show: "GET :baseUrl/:id",
			update: "PUT :baseUrl/:id",
			generalError: "An error occurred, please try again.",
			rootElement: null,
			timeout: -1
		},

		REST_CLIENT_STATUS_OK: 200,
		REST_CLIENT_STATUS_CREATED: 201,
		REST_CLIENT_STATUS_NOT_MODIFIED: 304,
		REST_CLIENT_STATUS_NOT_AUTHORIZED: 401,
		REST_CLIENT_STATUS_NOT_FOUND: 404,
		REST_CLIENT_STATUS_TIMEOUT: 408,
		REST_CLIENT_STATUS_CONFLICT: 409,
		REST_CLIENT_STATUS_UNSUPPORTED_MEDIA_TYPE: 415,
		REST_CLIENT_STATUS_VALIDATION_FAILED: 422,

		initRestClient: function() {
			Object.defineProperty(this, "restClientOptions", {
				get: function() {
					if (!this.__proto__.hasOwnProperty("compiledRestClientOptions")) {
						this.__proto__.compiledRestClientOptions = this.mergePropertyFromPrototypeChain("restClientOptions");
					}

					return this.compiledRestClientOptions;
				}
			});
		},

		createRequest: function() {
			return new XMLHttpRequest();
		},

		createRestClientUri: function(type, data) {
			if (!this.restClientOptions[type]) {
				throw new Error("Unknown rest client URL type: " + type);
			}

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

		destroy: function(context, callbacks) {
			if (this.destroyed || !this.persisted || !this.getPrimaryKey()) {
				callbacks.notFound.call(context);
			}

			var uri = this.createRestClientUri("destroy", this.attributes);

			this.sendRestRequest(uri.method, uri.path, null, this, {
				destroyed: function(xhr) {
					this.persisted = false;
					this.destroyed = true;
					callbacks.destroyed.call(context, this, xhr);
				},
				invalid: function(xhr) {
					var errors = this.getErrorsFromResponse(xhr);

					this.valid = false;

					if (errors) {
						this.setErrorMessages(errors);
					}

					callbacks.invalid.call(context, this, xhr);
					errors = null;
				},
				notAuthorized: function(xhr) {
					this.valid = false;
					this.errors.add("base", this.restClientOptions.authorizationRequiredError);

					if (callbacks.notAuthorized) {
						callbacks.notAuthorized.call(context, this, xhr);
					}
					else if (callbacks.invalid) {
						callbacks.invalid.call(context, this, xhr);
					}
					else {
						callbacks.error.call(context, this, xhr, new Error(this.restClientOptions.authorizationRequiredError));
					}
				},
				notFound: function(xhr) {
					callbacks.notFound.call(context, this, xhr);
				},
				error: function(xhr) {
					this.errors.add("base", this.restClientOptions.generalError);
					callbacks.error.call(context, this, xhr);
				},
				complete: function(xhr) {
					if (callbacks.complete) {
						callbacks.complete.call(context, this, xhr);
					}

					context = callbacks = xhr = uri = null;
				}
			});
		},

		getErrorsFromResponse: function(xhr) {
			var errors = null;

			try {
				errors = JSON.parse(xhr.responseText).errors;
			}
			catch (error) {
				errors = null;
				// fail silently
			}

			return errors;
		},

		load: function(context, callbacks) {
			if (!this.getPrimaryKey()) {
				throw new Error("Cannot load model with no value for " + this.primaryKey);
			}

			var uri = this.createRestClientUri("show", this.attributes);

			this.sendRestRequest(uri.method, uri.path, null, this, {
				found: function(xhr) {
					var attributes = JSON.parse(xhr.responseText);
					this.attributes = (this.restClientOptions.rootElement) ? attributes[ this.restClientOptions.rootElement ] : attributes;
					this.persisted = true;
					this.destroyed = false;
					callbacks.found.call(context, this, xhr);
				},
				notAuthorized: function(xhr) {
					this.errors.add("base", this.restClientOptions.authorizationRequiredError);

					if (callbacks.notAuthorized) {
						callbacks.notAuthorized.call(context, this, xhr);
					}
					else if (callbacks.invalid) {
						callbacks.invalid.call(context, this, xhr);
					}
					else {
						callbacks.error.call(context, this, xhr, new Error(this.restClientOptions.authorizationRequiredError));
					}
				},
				notFound: function(xhr) {
					this.persisted = false;
					callbacks.notFound.call(context, this, xhr);
				},
				error: function(xhr, error) {
					this.errors.add("base", this.restClientOptions.generalError);
					callbacks.error.call(context, this, xhr, error);
				},
				complete: function(xhr) {
					if (callbacks.complete) {
						callbacks.complete.call(context, this, xhr);
					}

					context = callbacks = xhr = uri = null;
				}
			});
		},

		save: function(context, callbacks) {
			this.validate(this, {
				valid: function() {
					var uri = this.createRestClientUri((this.persisted) ? "update" : "create", this.attributes);
					var data = this.serialize();

					this.sendRestRequest(uri.method, uri.path, data, this, {
						created: function(xhr) {
							var attributes = JSON.parse(xhr.responseText);
							this.attributes = (this.restClientOptions.rootElement) ? attributes[ this.restClientOptions.rootElement ] : attributes;
							callbacks.saved.call(context, this, xhr);
						},
						updated: function(xhr) {
							var attributes = JSON.parse(xhr.responseText);
							this.attributes = (this.restClientOptions.rootElement) ? attributes[ this.restClientOptions.rootElement ] : attributes;
							callbacks.saved.call(context, this, xhr);
						},
						invalid: function(xhr) {
							var errors = this.getErrorsFromResponse(xhr);

							this.valid = false;

							if (errors) {
								this.setErrorMessages(errors);
							}

							callbacks.invalid.call(context, this, xhr);
							errors = null;
						},
						notAuthorized: function(xhr) {
							this.errors.add("base", this.restClientOptions.authorizationRequiredError);

							if (callbacks.notAuthorized) {
								callbacks.notAuthorized.call(context, this, xhr);
							}
							else if (callbacks.invalid) {
								callbacks.invalid.call(context, this, xhr);
							}
							else {
								callbacks.error.call(context, this, xhr, new Error(this.restClientOptions.authorizationRequiredError));
							}
						},
						notFound: function(xhr) {
							callbacks.notFound.call(context, this, xhr);
						},
						error: function(xhr, error) {
							this.errors.add("base", this.generalError);
							callbacks.error.call(context, this, xhr, error);
						},
						complete: function(xhr) {
							if (callbacks.complete) {
								callbacks.complete.call(context, this, xhr);
							}

							context = callbacks = xhr = uri = null;
						}
					});
				},
				invalid: function() {
					callbacks.invalid.call(context, this);
				}
			});
		},

		sendRestRequest: function(method, url, data, context, callbacks) {
			var async = true;
			var xhr = this.createRequest(), model = this;
			var timeoutTimer = null;
			var that = this;

			var startTimer = function() {
				if (that.restClientOptions.timeout > 0 && callbacks.timeout) {
					timeoutTimer = setInterval(requestTimedOut, that.restClientOptions.timeout);
				}
			};

			var cancelTimer = function() {
				clearTimeout(timeoutTimer);
				timeoutTimer = null;
			};

			var requestTimedOut = function() {
				cancelTimer();
				xhr.abort();
				callbacks.timeout.call(context, xhr);
				cleanup();
			};

			var cleanup = function() {
				cleanup = context = callbacks = xhr = xhr.onreadystatechange = data = that = null;
			};

			var onreadystatechange = function() {
				var errorDetected = false, error = null;

				if (this.readyState === 4) {
					try {
						cancelTimer();

						if (this.status === that.REST_CLIENT_STATUS_OK) {
							if (method === "GET") {
								callbacks.found.call(context, this);
							}
							else if (method === "POST") {
								callbacks.created.call(context, this);
							}
							else if (method === "PUT") {
								callbacks.updated.call(context, this);
							}
							else if (method === "DELETE") {
								callbacks.destroyed.call(context, this);
							}
							else {
								throw new Error("Invalid HTTP method detected: " + method);
							}
						}
						else if (this.status === that.REST_CLIENT_STATUS_CREATED) {
							callbacks.created.call(context, this);
						}
						else if (this.status === that.REST_CLIENT_STATUS_NOT_MODIFIED) {
							callbacks.notModified.call(context, this);
						}
						else if (this.status === that.REST_CLIENT_STATUS_NOT_AUTHORIZED) {
							// not authorized
							callbacks.notAuthorized.call(context, this);
						}
						else if (this.status === that.REST_CLIENT_STATUS_NOT_FOUND) {
							// not found
							callbacks.notFound.call(context, this);
						}
						else if (this.status === that.REST_CLIENT_STATUS_TIMEOUT && callbacks.timeout) {
							callbacks.timeout.call(context, this);
						}
						else if (this.status === that.REST_CLIENT_STATUS_CONFLICT && callbacks.conflict) {
							callbacks.conflict.call(context, this);
						}
						else if (this.status === that.REST_CLIENT_STATUS_UNSUPPORTED_MEDIA_TYPE && callbacks.unsupportedMediaType) {
							callbacks.unsupportedMediaType.call(context, this);
						}
						else if (this.status === that.REST_CLIENT_STATUS_VALIDATION_FAILED) {
							// validation failed
							callbacks.invalid.call(context, this);
						}
						else {
							// unhandled client or server error
							errorDetected = true;
							error = new Error("Unhandled rest client error " + this.status + " for " + method + " " + url);
						}
					}
					catch (e) {
						errorDetected = true;
						error = e;
					}

					if (errorDetected) {
						callbacks.error.call(context, this, error);
					}

					if (callbacks.complete) {
						callbacks.complete.call(context, this);
					}

					cleanup();
				}
			};

			if (method === "GET" || method === "DELETE") {
				url += ( url.indexOf("?") < 0 ? "?" : "&" ) + data;
				data = null;
			}

			xhr.onreadystatechange = onreadystatechange;
			xhr.open(method, url, async);

			xhr.setRequestHeader(this.restClientOptions.ajaxHeaderName, this.restClientOptions.ajaxHeaderValue);

			if (method === "POST" || method === "PUT") {
				xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
			}

			startTimer();
			xhr.send(data);
		},

		setErrorMessages: function(errors) {
			this.errors = errors;
		},

		validate: function(context, callbacks) {
			context.valid.call(context, this);
		}

	}

};

Model.Base.include(Model.Persistence.RestClient);
