function StockQuoteService() {
	this.constructor.apply( this, arguments );
}

StockQuoteService.superClass = PollingService.prototype;
StockQuoteService.prototype = function() {};
StockQuoteService.prototype.prototype = StockQuoteService.superClass;
StockQuoteService.prototype = new StockQuoteService.prototype;

StockQuoteService.prototype.handleTimerExpired = function() {
	StockQuoteService.superClass.handleTimerExpired.call( this );
	
	var quote = {
		symbol : "GE",
		last   : "12.45",
		bid    : "12.57",
		ask    : "12.48"
	};
	
	this.publish( "quoteUpdated", {
		quote: quote
	}, "GE" );
	
	quote = null;
};