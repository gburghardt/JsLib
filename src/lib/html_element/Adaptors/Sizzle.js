HTMLElement.Adaptors.Sizzle = {
	prototype: {

		querySelectorAll: document.querySelectorAll = function(selector) {
			return Sizzle(selector, this);
		}

	}
};

HTMLElement.include(HTMLElement.Adaptors.Sizzle);

document.querySelectorAll = document.querySelectorAll || HTMLElement.Adaptors.Sizzle.prototype.querySelectorAll;
document.querySelector = document.querySelector || HTMLElement.Adaptors.Sizzle.prototype.querySelector;
