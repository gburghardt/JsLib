function OptionQuoteService() {
	this.constructor.apply( this, arguments );
}

OptionQuoteService.superClass = PollingService.prototype;
OptionQuoteService.prototype = function() {};
OptionQuoteService.prototype.prototype = OptionQuoteService.superClass;
OptionQuoteService.prototype = new OptionQuoteService.prototype();

OptionQuoteService.currentYear = ( new Date() ).getFullYear();

OptionQuoteService.random = function( multiplier, decimals ) {
	return ( Math.random() * multiplier ).toFixed( decimals );
};

OptionQuoteService.chain = null;

/**
 * This method leaks about 200k of memory each time it is called in
 * Firefox.
 */
OptionQuoteService.getChain = function( symbol ) {
	// if ( OptionQuoteService.chain ) {
	// 	return OptionQuoteService.chain;
	// }
	
	var year = this.currentYear;
	var yearMax = year + 2;
	var securityKey = "";
	var chainLength = ( yearMax - year ) * 12 * 5;
	var i = 0;
	var strikePrice = 0;
	var chain = {
		symbol: symbol,
		call: new Array( chainLength ),
		put: new Array( chainLength )
	};
	
	for ( year; year < yearMax; year++ ) {
		for ( var month = 1, monthMax = 13; month < monthMax; month++ ) {
			for ( var day = 6, dayMax = 31; day < dayMax; day+= 6 ) {
				strikePrice = 100;
				securityKey = symbol + "/" + year + month + day + "/" + strikePrice;
				
				chain.call[ i ] = {
					securityKey : symbol + "/" + year + month + day + "/C/" + strikePrice,
					last        : this.random(100, 2),
					bid         : this.random(100, 2),
					bidSize     : this.random(1000, 0),
					ask         : this.random(100, 2),
					askSize     : this.random(1000, 0)
				};
				
				chain.put[ i ] = {
					securityKey : symbol + "/" + year + month + day + "/P/" + strikePrice,
					last        : this.random(100, 2),
					bid         : this.random(100, 2),
					bidSize     : this.random(1000, 0),
					ask         : this.random(100, 2),
					askSize     : this.random(1000, 0)
				};
				
				i++;
			}
		}
	}
	
	// OptionQuoteService.chain = chain;

	return chain;
};

OptionQuoteService.prototype.handleTimerExpired = function() {
	OptionQuoteService.superClass.handleTimerExpired.call( this );
	
	var chain = null;
	
	for ( var symbol in this.subscriptions.optionQuoteUpdated ) {
		if ( !this.subscriptions.optionQuoteUpdated.hasOwnProperty( symbol ) ) {
			continue;
		}
		
		chain = OptionQuoteService.getChain( symbol );
		
		this.publish( "optionQuoteUpdated", {
			chain: chain
		}, symbol );
	}
	
	this.stopTimer();
	this.startTimer();
	
	chain = null;
};