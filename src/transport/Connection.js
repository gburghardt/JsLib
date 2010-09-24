/**
 * @extends Delegator
 */
function Connnection() {
	this.constructor.apply( this, arguments );
}

Connection.superClass = Delegator.prototype;
Connection.prototype = function() {};
Connection.prototype.prototype = Connection.superClass;
Connection.prototype = new Connection.prototype;

Connection.prototype.xhr = null;

Connection.prototype.constructor = function() {
	Connection.superClass.constructor.call( this );
	this.xhr = new XMLHttpRequest();
};