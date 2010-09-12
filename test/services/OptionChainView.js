function OptionChainView() {
	this.constructor.apply( this, arguments );
}

OptionChainView.prototype = {
	
	rootNode: null,
	
	rootNodeId: null,
	
	nodes: null,
	
	constructor: function( rootNodeId ) {
		this.rootNodeId = rootNodeId;
		this.nodes = {};
		this.rows = {};
	},
	
	init: function() {
		this.rootNode = document.getElementById( this.rootNodeId );
		this.rootNode.innerHTML = this.getMarkup();
	},
	
	getMarkup: function() {
		return [
			'<table cellpadding="3" cellspacing="0" border="1" class="chain">',
				'<caption>Options for <span id="' + this.rootNodeId + '-symbol">--</span></caption>',
				'<thead>',
					'<tr class="callOrPut">',
						'<th colspan="5">Call</th>',
						'<th colspan="5">Put</th>',
					'</tr>',
					'<tr>',
						'<th>Last</th>',
						'<th>Bid</th>',
						'<th>Bid Size</th>',
						'<th>Ask</th>',
						'<th>Ask Size</th>',
						
						'<th>Last</th>',
						'<th>Bid</th>',
						'<th>Bid Size</th>',
						'<th>Ask</th>',
						'<th>Ask Size</th>',
					'</tr>',
				'</thead>',
				'<tbody id="' + this.rootNodeId + '-tbody">',
				'</tbody>',
			'</table>'
		].join("");
	},
	
	getNode: function( idSuffix ) {
		if ( !this.nodes[ idSuffix ] ) {
			this.nodes[ idSuffix ] = document.getElementById( this.rootNodeId + "-" + idSuffix );
		}
		
		return this.nodes[ idSuffix ];
	},
	
	render: function( chain ) {
		var key = "";
		var quote = null;
		var row = null;
		var call = null;
		var put = null;
		
		this.getNode( "symbol" ).innerHTML = chain.symbol;
		
		for ( var i = 0, length = chain.call.length; i < length; i++ ) {
			call = chain.call[ i ];
			put = chain.put[ i ];
			key = call.securityKey + "-" + put.securityKey;
			row = this.getRow( key );
			
			row.cells[ 0 ].innerHTML = call.last;
			row.cells[ 1 ].innerHTML = call.bid;
			row.cells[ 2 ].innerHTML = call.bidSize;
			row.cells[ 3 ].innerHTML = call.ask;
			row.cells[ 4 ].innerHTML = call.askSize;
			
			row.cells[ 5 ].innerHTML = put.last;
			row.cells[ 6 ].innerHTML = put.bid;
			row.cells[ 7 ].innerHTML = put.bidSize;
			row.cells[ 8 ].innerHTML = put.ask;
			row.cells[ 9 ].innerHTML = put.askSize;
		}
		
		row = null;
		chain = null;
		quote = null;
	},
	
	
	
	rows: null,
	
	createRow: function() {
		var row = document.createElement( "tr" );
		
		for ( var i = 0, length = 10; i < length; i++ ) {
			row.insertCell( i );
		}
		
		this.getNode( "tbody" ).appendChild( row );
		
		return row;
	},
	
	getRow: function( key ) {
		if ( !this.rows[ key ] ) {
			this.rows[ key ] = this.createRow();
		}
		
		return this.rows[ key ];
	}
	
};