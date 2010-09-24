function CrossDomainConnection() {
	this.constructor.apply( this, arguments );
}

CrossDomainConnection.superClass = Delegator.prototype;
CrossDomainConnection.prototype = function() {};
CrossDomainConnection.prototype.prototype = CrossDomainConnection.superClass;
CrossDomainConnection.prototype = new CrossDomainConnection.prototype;
