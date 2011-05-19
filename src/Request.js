function Request() {
	
	var _lastParams;
	
	var _options = {
		async: true,
		dataType: null,
		method: "get",
		password: null,
		timeout: 30000,
		url: "",
		username: null,
		
		// callbacks
		onComplete: function() {},
		onError: function() {},
		onSuccess: function() {},
		onTimeout: function() {}
	};
	
	var _ready = true;
	var _script;
	var _xhr;
	
	function constructor(options) {
		configure(options);
	}
	
	function destructor() {
		
	}
	
	function abort() {
		if (_xhr) {
			_xhr.abort();
		}
		else {
			
		}
	}
	
	function configure() {
		var options;
		
		for (var i = 0, length = arguments.length; i < length; i++) {
			options = arguments[i] || {};
			
			for (var key in options) {
				if (options.hasOwnProperty(key)) {
					_options[key] = options[key];
				}
			}
		}
		
		options = null;
		
		return this;
	}
	
	function sameDomain(url) {
		url = url.replace(/#.*$/, "");
		return Request.urlTests.nonRelative.test(url) || Request.urlTests.absolute.test(url);
	}
	
	function ready() {
		return _ready;
	}
	
	function resend() {
		return this;
	}
	
	function send(params) {
		if (sameDomain(_options.url)) {
			if (!_xhr) {
				_xhr = new XMLHttpRequest();
				_xhr.open(_options.method, _options.url, _options.async, _options.username, _options.password);
			}
			
			_xhr.setRequestHeader("X-REQUESTED-WITH", "XMLHttpRequest");
		}
		else {
			// JSONP
		}
		
		return this;
	}
	
	this.constructor = constructor;
	this.destructor = destructor;
	this.abort = abort;
	this.configure = configure;
	this.ready = ready;
	this.resend = resend;
	this.send = send;
	
	this.constructor.apply(this, arguments);
};

Request.urlTests = {
	absolute: new RegExp("^http(s?):\\/\\/" + window.location.hostname.replace(/\./g, "\\.") + "(\\/|$)"),
	nonRelative: /^http:\/\//
};


/*


var rxSource = "^http(s?):\\/\\/"
						 + window.location.hostname.replace(/\./g, "\\.")
						 + "(\\/|$)"
;
var absolute = new RegExp(rxSource);
var nonRelative = /^http/;
var validUrls = [
		"/foo/bar",
		"/foo/bar?asdfb#asdfadsf",
		"http://core.p2p.local",
		"https://core.p2p.local",
		"http://core.p2p.local/",
		"http://core.p2p.local#foo",
		"http://core.p2p.local/#foo",
		"http://core.p2p.local/?abc=123#foo",
		"http://core.p2p.local/foo/bar/?abc=123#adsfad"
];

var invalidUrls = [
		"foo/bar",
		"htts://core.p2p.local",
		"http://content.p2p.local",
		"http://core.p2p.local.com",
		"http://core.p2p.local.com/"
];

console.clear();
console.debug("Valid URLS");
console.debug(rxSource);

for (var i = 0, length = validUrls.length; i < length; i++) {
		if (!nonRelative.test(validUrls[i]) || absolute.test(validUrls[i])) {
				console.info("Passed! " + validUrls[i]);
		}
		else {
				console.warn("Failed! " + validUrls[i]);
		}
}

console.debug("Invalid URLS");

for (var i = 0, length = invalidUrls.length; i < length; i++) {
		if (nonRelative.test(validUrls[i]) || !absolute.test(validUrls[i])) {
				console.info("Passed! " + invalidUrls[i]);
		}
		else {
				console.warn("Failed! " + invalidUrls[i]);
		}
}










*/