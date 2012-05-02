window.http = window.http || {};

http.Request = function(xhr, client, options) {
	this.client = client;
	this.options = options;
	this.xhr = xhr;

	this.destructor = function() {
		
	};

	this.abort = function() {
		this.xhr.abort();
	};

	this.open = function() {
		this.xhr.open(this.options.url);
	};

	this.send = function(data) {
		
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
									// TODO: top level prefix not perpetuated
									params.push(this.serializeData(data[key][i], "[" + key + "]" + keySuffix + "[", "]"));
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
};
