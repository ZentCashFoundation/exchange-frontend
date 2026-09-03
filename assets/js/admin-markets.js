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
    
    modifyAsset(pair_mod, field, value);
}