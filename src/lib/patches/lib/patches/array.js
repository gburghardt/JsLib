Patches.Array = {
	prototype: {

		every: function(callback, context) {
			var result = true;

			for (var i = 0, length = this.length; i < length; i++) {
				if (!callback.call(context, this[i], i, this)) {
					result = false;
					break;
				}
			}

			callback = context = null;

			return result;
		},

		filter: function(callback, context) {
			var newArray = [];

			for (var i = 0, length = this.length; i < length; i++) {
				if (callback.call(context, this[i], i, this)) {
					newArray.push( this[i] );
				}
			}

			callback = context = null;

			return newArray;
		},

		forEach: function(callback, context) {
			for (var i = 0, length = this.length; i < length; i++) {
				callback.call(context, this[i], i, this);
			}
		},

		indexOf: function(value) {
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
		},

		map: function(callback, context) {
			var newArray = new Array(this.length);

			for (var i = 0, length = this.length; i < length; i++) {
				newArray[i] = callback.call(context, this[i], i, this);
			}

			callback = context = null;

			return newArray;
		},

		merge: function(arr) {
			for (var i = 0, length = arr.length; i < length; i++) {
				this.push(arr[i]);
			}

			return this;
		},

		// taken from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/Reduce
		reduce: function reduce(accumulator){
			if (this === null || this === undefined) {
				throw new TypeError("Object is null or undefined");
			}

			var i = 0, l = this.length >> 0, curr;
 
			if (typeof accumulator !== "function") {
				// ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
				throw new TypeError("First argument is not callable");
			}
 
			if (arguments.length < 2) {
				if (l === 0) {
					throw new TypeError("Array length is 0 and no second argument");
				}

				curr = this[0];
				i = 1; // start accumulating at the second element
			}
			else {
				curr = arguments[1];
			}
 
			while (i < l) {
				if (i in this) {
					curr = accumulator.call(undefined, curr, this[i], i, this);
				}

				++i;
			}
 
			return curr;
		},

		// taken from https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/ReduceRight
		reduceRight: function(callbackfn) {
	    "use strict";
 
	    if (this == null) {
	      throw new TypeError();
			}
 
	    var t = Object(this);
	    var len = t.length >>> 0;

	    if (typeof callbackfn != "function") {
	      throw new TypeError();
			}
 
	    // no value to return if no initial value, empty array
	    if (len === 0 && arguments.length === 1) {
	      throw new TypeError();
			}
 
	    var k = len - 1;
	    var accumulator;

	    if (arguments.length >= 2) {
	      accumulator = arguments[1];
	    }
	    else {
	      do {
	        if (k in this) {
	          accumulator = this[k--];
	          break;
	        }
 
	        // if array contains no values, no initial value to return
	        if (--k < 0) {
	          throw new TypeError();
					}
	      }
	      while (true);
	    }
 
	    while (k >= 0) {
	      if (k in t) {
	        accumulator = callbackfn.call(undefined, accumulator, t[k], k, t);
				}

	      k--;
	    }
 
	    return accumulator;
	  },

		some: function(callback, context) {
			var falseCount = 0;

			for (var i = 0, length = this.length; i < length; i++) {
				if (!callback.call(context, this[i], i, this)) {
					falseCount++;
				}
			}

			callback = context = null;

			return falseCount < length;
		}

	}
};

Array.include(Patches.Array);
