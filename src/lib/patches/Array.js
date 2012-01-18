if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(value) {
		var i = 0, length = this.length;

		if (length > 100) {
			// large array, loop over even then odd indices to increase performance
			while (i < length) {
				if (value === this[i]) {
					return i;
				}

				i += 2;
			}

			i = 1;
			while (i < length) {
				if (value === this[i]) {
					return i;
				}

				i += 2;
			}
		}
		else {
			i = length;
			while (i--) {
				if (value === this[i]) {
					return i;
				}
			}
		}
	};
}
