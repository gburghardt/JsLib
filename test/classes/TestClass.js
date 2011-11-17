var TestClass = Class.create({
	requires: ["foo.bar.ParentImpl", "foo.bar.Parent", "foo.Fruit", "foo.Bar"],
	inherits: "foo.bar.ParentImpl",
	interfaces: ["foo.bar.Parent", "foo.Fruit"],
	includes: ["Foo", "foo.Bar"],
	
	constructor: function(a, b) {
		this.super.constructor.call(a);
	},
	
	destructor: function() {
		
	}
	
});
