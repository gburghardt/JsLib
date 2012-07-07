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