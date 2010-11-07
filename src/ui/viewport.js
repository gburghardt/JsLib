/**
 * @class A singleton object used to get information about the browser viewport
 * dimensions and scroll position.
 * 
 * @extends Object
 */
var viewport = {
	
	/**
	 * @property {HTMLBODYElement} A static reference to the <body> element
	 */
	body: null,
	
	/**
	 * @property {HTMLHTMLElement} A static reference to the <html> element
	 */
	html: null,
	
	/**
	 * Gets a reference to the body tag.
	 * 
	 * @returns {HTMLBODYElement}
	 */
	getBody: function() {
		if (this.body === null) {
			this.body = document.getElementsByTagName("body")[0];
		}
		
		return this.body;
	},
	
	/**
	 * Gets the height of the viewport
	 * 
	 * @returns {Number}
	 */
	getHeight: function() {
		var html = this.getHtml();
		var body = this.getBody();
		var height = 0;
		
		if (html.clientHeight <= html.offsetHeight) {
			// html has the viewport height
			height = html.clientHeight;
		}
		else if (body.clientHeight <= body.offsetHeight) {
			// body has the viewport height
			height = body.clientHeight;
		}
		else {
			// unknown viewport height
		}
		
		body = null;
		html = null;
		
		return height;
	},
	
	/**
	 * Gets a reference to the html tag.
	 * 
	 * @returns {HTMLHTMLElement}
	 */
	getHtml: function() {
		if (this.html === null) {
			this.html = document.getElementsByTagName("html")[0];
		}
		
		return this.html;
	},
	
	/**
	 * Gets how far left the user has scrolled on the page
	 * 
	 * @returns {Number}
	 */
	getScrollLeft: function() {
		var html = this.getHtml();
		var body = this.getBody();
		var scrollLeft = 0;
		
		if ( html.scrollLeft > 0 ) {
			// Gecko puts scrollTop on HTML element
			scrollLeft = html.scrollLeft;
		}
		else if ( body.scrollLeft > 0 ) {
			// Webkit puts scrollTop on BODY element
			scrollLeft = body.scrollLeft;
		}
		else {
			// Most likely we are at the left side of the page already
		}
		
		html = null;
		body = null;
		
		return scrollLeft;
	},
	
	/**
	 * Gets how far down the page
	 * 
	 * @returns {Number}
	 */
	getScrollTop: function() {
		var html = this.getHtml();
		var body = this.getBody();
		var scrollTop = 0;
		
		if ( html.scrollTop > 0 ) {
			// Gecko puts scrollTop on HTML element
			scrollTop = html.scrollTop;
		}
		else if ( body.scrollTop > 0 ) {
			// Webkit puts scrollTop on BODY element
			scrollTop = body.scrollTop;
		}
		else {
			// Most likely we are at the top of the page already
		}
		
		html = null;
		body = null;
		
		return scrollTop;
	},
	
	/**
	 * Gets the width of the viewport
	 * 
	 * @returns {Number}
	 */
	getWidth: function() {
		var html = this.getHtml();
		var body = this.getBody();
		var width = 0;
		
		if (html.clientWidth <= html.offsetWidth) {
			// html has the viewport width
			width = html.clientWidth;
		}
		else if (body.clientWidth <= body.offsetWidth) {
			// body has the viewport width
			width = body.clientWidth;
		}
		else {
			// unknown viewport width
		}
		
		body = null;
		html = null;
		
		return width;
	}
	
};