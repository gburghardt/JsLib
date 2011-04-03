var Element = {
	
	init: function() {
		var div = document.createElement("div");
		document.getElementsByTagName("head")[0].appendChild(div);
		
		if (div.addEventListener) {
			delete this.methods.addEventListener;
			delete this.methods.removeEventListener;
		}
		
		if (div.getUserData) {
			delete this.methods.getUserData;
			delete this.methods.setUserData;
		}
		
		if (div.querySelector) {
			// do nothing, browser natively supports this feature
		}
		else if (window.jQuery) {
			this.methods.querySelector = this.methods.querySelectorJQuery;
			this.methods.querySelectorJQuery = null;
			delete this.methods.querySelectorJQuery;
		}
		else if (window.Sizzle) {
			this.methods.querySelector = this.methods.querySelectorSizzle;
			this.methods.querySelectorSizzle = null;
			delete this.methods.querySelectorSizzle;
		}
		
		if (typeof div.ownerDocument === "undefined") {
			this.methods.getOwnerDocument = this.methods.getOwnerDocumentMSIE;
		}
		else {
			this.methods.getOwnerDocument = this.methods.getOwnerDocumentStandard;
		}
		
		this.methods.getOwnerDocumentStandard = null;
		this.methods.getOwnerDocumentMSIE = null;
		delete this.methods.getOwnerDocumentStandard;
		delete this.methods.getOwnerDocumentMSIE;
		
		// TODO - clone a node and detect descripencies between standard and IE
		
		document.getElementsByTagName("head")[0].removeChild(div);
		
		div = null;
	},
	
	destroy: function(element, shallow) {
		this.unwrap(element);
		
		for (var key in element) {
			if (element.hasOwnProperty(key) && key.indexOf("on") === 0) {
				element[key] = null;
			}
		}
		
		if (!shallow) {
			for (var i = 0, length = element.childNodes.length; i < length; i++) {
				// ignore #text and #comment nodes
				if (element.childNodes[i].nodeName.indexOf("#") === -1) {
					this.destroy(element.childNodes[i], shallow);
				}
			}
		}
		
		element = null;
		
		return null;
	},
	
	unwrap: function(element) {
		if (!element.getAttribute("data-Element-wrapped")) {
			return element;
		}
		
		var methods = this.methods;
		
		if (typeof element === "string") {
			element = document.getElementById(element);
		}
		
		for (var key in methods) {
			if (methods.hasOwnProperty(key)) {
				if (element[key] === methods[key]) {
					element[key] = null;
					delete element[key];
				}
			}
		}
		
		element.setAttribute("data-Element-wrapped", null);
		
		methods = null;
		
		return element;
	},
	
	wrap: function(element) {
		if (element.getAttribute("data-Element-wrapped")) {
			return element;
		}
		
		var methods = this.methods;
		
		if (typeof element === "string") {
			element = document.getElementById(element);
		}
		
		for (var key in methods) {
			if (methods.hasOwnProperty(key)) {
				if (!element[key]) {
					element[key] = methods[key];
				}
			}
		}
		
		element.setAttribute("data-Element-wrapped", "true");
		
		methods = null;
		
		return element;
	}
	
};

Element.methods = {
	
	addClassName: function(className) {
		if (!this.hasClassName(className)) {
			this.className += " " + className;
		}
	},
	
	addEventListener: function(type, listener) {
		this.attachEvent("on" + type, listener); 
		listener = null;
	},
	
	cloneNodeMSIE: function(deep) {
		
	},
	
	cloneNodeStandard: function(deep) {
		
	},
	
	getAbsoluteLeft: function() {
		var left = this.offsetLeft;
		var node = this;
		
		while (node = node.offsetParent) {
			left += node.offsetLeft;
		}
		
		node = null;
		
		return left;
	},
	
	getAbsolutePosition: function() {
		var top = this.offsetTop;
		var left = this.offsetLeft;
		var node = this;
		
		while (node = node.offsetParent) {
			left += node.offsetLeft;
			top += node.offsetTop
		}
		
		node = null;
		
		return {
			bottom: top + this.offsetHeight,
			height: this.offsetHeight,
			left: left,
			right: left + this.offsetWidth,
			top: top
		};
	},
	
	getAbsoluteTop: function() {
		var top = this.offsetTop;
		var node = this;
		
		while (node = node.offsetParent) {
			top += node.offsetTop;
		}
		
		node = null;
		
		return top;
	},
	
	getChildrenByClassName: function(className) {
		var rx = new RegExp(className);
		var els = this.element.childNodes;
		var matches = [];
		
		for (var i = 0, length = els.length; i < length; i++) {
			if (rx.test(els[i].className)) {
				matches.push(els[i]);
			}
		}
		
		els = rx = null;
		
		return matches;
	},
	
	getChildrenByName: function(name) {
		var els = this.element.childNodes;
		var matches = [];
		
		for (var i = 0, length = els.length; i < length; i++) {
			if (name === els[i].name) {
				matches.push(els[i]);
			}
		}
		
		els = null;
		
		return matches;
	},
	
	getChildrenByTagName: function(tagName) {
		tagName = tagName.toUpperCase();
		var els = this.element.childNodes;
		var matches = [];
		
		for (var i = 0, length = els.length; i < length; i++) {
			if (tagName === els[i].nodeName) {
				matches.push(els[i]);
			}
		}
		
		els = null;
		
		return matches;
	},
	
	getElementById: function(id) {
		if (this.getOwnerDocument()) {
			this.getOwnerDocument().getElementById(id);
		}
		else {
			return null;
		}
	},
	
	getElementsByClassName: function(className) {
		var els = this.element.getElementsByTagName("*");
		var rx = new RegExp(className);
		var matches = [];
		
		for (var i = 0, length = els.length; i < length; i++) {
			if (rx.test(els[i].className)) {
				matches.push(els[i]);
			}
		}
		
		els = rx = null;
		
		return matches;
	},
	
	getElementsByName: function(name) {
		var els = this.element.getElementsByTagName("*");
		var matches = [];
		
		for (var i = 0, length = els.length; i < length; i++) {
			if (name === els[i].name) {
				matches.push(els[i]);
			}
		}
		
		els = null;
		
		return matches;
	},
	
	getOffsetPosition: function() {
		return {
			bottom: this.offsetTop + this.offsetHeight,
			height: this.offsetHeight,
			left: this.offsetLeft,
			right: this.offsetLeft + this.offsetWidth,
			top: this.offsetTop,
			width: this.offsetWidth
		};
	},
	
	getOwnerDocumentMSIE: function() {
		return this.contentDocument
	},
	
	getOwnerDocumentStandard: function() {
		return this.ownerDocument;
	},
	
	getParentsByClassName: function(className) {
		var matches = [];
		var parent = this;
		var rx = new RegExp(className);
		
		while (parent = parent.parentNode) {
			if (rx.test(parent.className)) {
				matches.push(parent);
			}
		}
		
		parent = rx = null;
		
		return matches;
	},
	
	getParentsByName: function(name) {
		var matches = [];
		var parent = this;
		
		while (parent = parent.parentNode) {
			if (parent.name === name) {
				matches.push(parent);
			}
		}
		
		parent = null;
		
		return matches;
	},
	
	getParentsByTagName: function(tagName) {
		tagName = tagName.toUpperCase();
		var matches = [];
		var parent = this;
		
		if (tagName === "*") {
			while (parent = parent.parentNode) {
				matches.push(parent);
			}
		}
		else {
			while (parent = parent.parentNode) {
				if (parent.nodeName === tagName) {
					matches.push(parent);
				}
			}
		}
		
		parent = null;
		
		return matches;
	},
	
	getUserData: function(key) {
		
	},
	
	hasClassName: function(className) {
		return new RegExp(className).test(this.className);
	},
	
	insertAfter: function(insertElement, adjacentElement) {
		if (adjacentElement.nextSibling) {
			this.insertBefore(insertElement, adjacentElement.nextSibling);
		}
		else {
			this.appendChild(insertElement);
		}
		
		insertElement = adjacentElement = null;
	},
	
	querySelectorJQuery: function(selectors) {
		return jQuery(this).find(selectors);
	},
	
	querySelectorSizzle: function(selectors) {
		return Sizzle(selector, this);
	},
	
	removeClassName: function(className) {
		this.className = this.className.replace(new RegExp("^\s*|\s+" + className + "(\s+)?", "");
	},
	
	removeEventListener: function(type, listener) {
		this.detachEvent("on" + type, listener);
		listener = null;
	},
	
	setUserData: function(key, value, handler) {
		
	}
	
};

Element.init();
