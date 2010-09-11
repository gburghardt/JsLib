function StockQuoteService() {
	this.constructor.apply( this, arguments );
}

StockQuoteService.superClass = PollingService.prototype;
StockQuoteService.prototype = function() {};
StockQuoteService.prototype.prototype = StockQuoteService.superClass;
StockQuoteService.prototype = new StockQuoteService.prototype;

StockQuoteService.prototype.handleTimerExpired = function() {
	StockQuoteService.superClass.handleTimerExpired.call( this );
	
	var random = function() {
		return ( Math.random() * 100 ).toFixed( 2 );
	};
	
	var quote = null;
	
	for ( var symbol in this.subscriptions.quoteUpdated ) {
		if ( !this.subscriptions.quoteUpdated.hasOwnProperty( symbol ) ) {
			continue;
		}
		
		quote = {
			symbol : symbol,
			last   : random(),
			bid    : random(),
			ask    : random()
		};

		this.publish( "quoteUpdated", {
			quote: quote
		}, symbol );
	}
	
	this.stopTimer();
	this.startTimer();
	
	quote = null;
};