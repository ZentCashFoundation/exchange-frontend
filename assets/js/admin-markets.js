async function marketsListFull() {
    const data = await getMarketList();
	
    if (!data) return;

    const container = document.getElementById("markets-list-full-container-body");
    container.innerHTML = "";

    data.forEach(market => {
        if (market.pair) {
            market.pair = market.pair.replace("_", "/")
        }

        if (market.maker_fee) {
            market.maker_fee = `${market.maker_fee * 100} %`
        }  
        if (market.taker_fee) {
            market.taker_fee = `${market.taker_fee * 100} %`
        }
        if (market.min_order_size) {
            market.min_order_size = parseFloat(market.min_order_size).toFixed(market.amount_precision)
        }
        
        if (market.min_order_price) {
            market.min_order_price = parseFloat(market.min_order_price).toFixed(market.price_precision)
        } 
        
        if (market.last_price) {
            market.last_price = parseFloat(market.last_price).toFixed(market.price_precision)
        }
        
        if (market.bid_price) {
            market.bid_price = parseFloat(market.bid_price).toFixed(market.price_precision)
        } 

        if (market.ask_price) {
            market.ask_price = parseFloat(market.ask_price).toFixed(market.price_precision)
        }
        
        if (market.spread) {
            market.spread = parseFloat(market.spread).toFixed(market.price_precision)
        }
        
        if (market.low_24h) {
            market.low_24h = parseFloat(market.low_24h).toFixed(market.price_precision)
        }
        
        if (market.high_24h) {
            market.high_24h = parseFloat(market.high_24h).toFixed(market.price_precision)
        }
        
        if (market.variation_24h) {
            market.variation_24h = parseFloat(market.variation_24h).toFixed(market.price_precision)
        }

        if (market.volume_24h) {
            market.volume_24h = parseFloat(market.volume_24h).toFixed(market.price_precision)
        }
        const row = document.createElement("div");
        row.className = "markets-list-full-row";
        row.innerHTML = `
            <div data-label="Pair" style="text-transform: capitalize">${market.pair}</div>
			<div data-label="Base Asset" style="text-transform: capitalize">${market.base_asset}</div>
            <div data-label="Quote Asset" style="text-transform: capitalize">${market.quote_asset}</div>
            <div data-label="Is Active">${market.is_active}</div>
            <div data-label="Maker Fee">${market.maker_fee}</div>
            <div data-label="Taker Fee">${market.taker_fee}</div>
            <div data-label="Min Order Size">${market.min_order_size}</div>
            <div data-label="Min Order Price">${market.min_order_price}</div>
			<div data-label="Price Precision">${market.price_precision}</div>
			<div data-label="Amount Precision">${market.amount_precision}</div>
			<div data-label="Bid Price">${market.bid_price}</div>
            <div data-label="Ask Price">${market.ask_price}</div>
            <div data-label="Last Price">${market.last_price}</div>
            <div data-label="Spread">${market.spread}</div>
            <div data-label="Low 24h">${market.low_24h}</div>
            <div data-label="High 24h">${market.high_24h}</div>
            <div data-label="Variation 24h">${market.variation_24h}</div>
            <div data-label="Volume 24h">${market.volume_24h}</div>
            `;

        container.appendChild(row);
    });
}

function sendMarket() {
    const pair = document.getElementById('pair').value;
    const base_asset = document.getElementById('base_asset').value;
    const quote_asset = document.getElementById('quote_asset').value;
    const is_active = document.getElementById('is_active').value;
    const maker_fee = document.getElementById('maker_fee').value;
    const taker_fee = document.getElementById('taker_fee').value;
    const min_order_size = document.getElementById('min_order_size').value;
    const min_order_price = document.getElementById('min_order_price').value;
    const price_precision = document.getElementById('price_precision').value;
    const amount_precision = document.getElementById('amount_precision').value;

    const pair_mod = pair.replace("/", "_");

    addMarket(pair_mod, base_asset, quote_asset, is_active, maker_fee, taker_fee, min_order_size, min_order_price, price_precision, amount_precision);
}

function sendModifyMarket() {
    const pair = document.getElementById('pair_mod').value;
    const field = document.getElementById('field').value;
    const value = document.getElementById('value').value;
    
    const pair_mod = pair.replace("/", "_");
    
    modifyMarket(pair_mod, field, value);
}

setInterval(() => {
    marketsListFull();
}, 5000);