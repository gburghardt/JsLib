if (!String.prototype.capitalize) {
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1, this.length);
	};
}

if (!String.prototype.singularize) {
	String.prototype.singularize = function() {
		if (/ies$/.test(this)) {
			// e.g. "dailies" becomes "daily"
			return this.replace(/(ies)$/, "y");
		}
		else if (/[^aeiou]s$/.test(this)) {
			// e.g. "cars" becomes "car"
			return this.replace(/([^aeiou])s$/, "$1");
		}
		else if (/es$/.test(this)) {
			// e.g. "sales" becomes "sale"
			return this.replace(/es$/, "e");
		}
		else {
			// return a direct duplicate of this string
			return this + "";
		}
	};
}

String.prototype.constantize = function() {
	var className = this.toClassName();
	return className ? eval(className) : null;
};

String.prototype.toClassName = function() {
	if (this.match(/[^-_a-zA-Z0-9]/)) {
		return "";
	}

	var pieces = this.split(/-/g);
	var className = pieces[pieces.length - 1];
	pieces = pieces.slice(0, pieces.length - 1);

	className = className.replace(/(^[a-z])|(_[a-z])/g, function($1) {
		return $1.replace(/^_/, "").toUpperCase();
	});

	return pieces.length ? pieces.join(".") + "." + className : className;
};
