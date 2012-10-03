BaseModel.Persistence.RestClient = {

	included: function(Klass) {
		Klass.persistence.types.push("restClient");
	},

	prototype: {
		attributeRoot: "",
		baseUrl: null,
		createMethod: "POST",
		createUrl: ":baseUrl",
		destroyMethod: "DELETE",
		destroyUrl: ":baseUrl/:id",
		showMethod: "GET",
		showUrl: ":baseUrl/:id",
		updateMethod: "PUT",
		updateUrl: ":baseUrl/:id",

		authorizationRequiredError: "You must be logged in to complete this operation.",
		generalError: "An error occurred, please try again.",

		createRequest: function() {
			return new XMLHttpRequest();
		},

		createRestClientUrl: function(url, data) {
			return url.replace(/:(\w+)/g, function(match, key) {
				return data[key];
			});
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
			var method, url;

			if (this.persisted) {
				method = this.updateMethod;
				url = this.createRestClientUrl(this.updateUrl, {
					baseUrl: this.baseUrl,
					id: this.getPrimaryKey()
				});
			}
			else {
				method = this.createMethod;
				url = this.createRestClientUrl(this.createUrl, {
					baseUrl: this.baseUrl
				});
			}

			this.sendRequest(method, url, this, {
				created: function(xhr) {
					var attributes = JSON.parse(xhr.responseText);
					this.attributes = (this.attributeRoot) ? attributes[this.attributeRoot] : attributes;
					callbacks.saved.call(context);
				},
				updated: function(xhr) {
					var attributes = JSON.parse(xhr.responseText);
					this.attributes = (this.attributeRoot) ? attributes[this.attributeRoot] : attributes;
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
				url += ( url.indexOf("?") > -1 ? "?" : "&" ) + data;
				data = null;
			}

			xhr.onreadystatechange = onreadystatechange;
			xhr.open(method, url, async);
			xhr.setRequestHeader("X-REQUESTED-WITH", "XMLHTTPREQUEST");
			xhr.send(data);
		}

	}

};

BaseModel.include(BaseModel.Persistence.RestClient);