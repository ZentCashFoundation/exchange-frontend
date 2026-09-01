function sendAsset() {
    const ticker = document.getElementById('ticker').value;
    const name_asset = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const network_default = document.getElementById('network_default').value;
    const rpc_url = document.getElementById('rpc_url').value;
    const decimals = document.getElementById('decimals').value;
    const contract_address = document.getElementById('contract_address').value;
    const requires_memo = document.getElementById('requires_memo');
    const requiresmemovalor = requires_memo.checked ? 1 : 0;
    const confirmations_required = document.getElementById('confirmations_required').value;
    const explorer_tx_url = document.getElementById('explorer_tx_url').value;
    const explorer_address_url = document.getElementById('explorer_address_url').value;
    const deposit_enabled = document.getElementById('deposit_enabled');
    const depositenabled = deposit_enabled.checked ? 1: 0;
    const withdraw_enabled = document.getElementById('withdraw_enabled');
    const withdrawenabled = withdraw_enabled.checked ? 1: 0;
    const trade_enabled = document.getElementById('trade_enabled');
    const tradeenabled = trade_enabled.checked ? 1: 0;
    const maintenance_mode = document.getElementById('maintenance_mode');
    const maintenancemode = maintenance_mode.checked ? 1: 0;
    const min_deposit = document.getElementById('min_deposit').value;
    const min_withdraw = document.getElementById('min_withdraw').value;
    const withdraw_fee = document.getElementById('withdraw_fee').value;
    const network_fee = document.getElementById('network_fee').value;   
    const usd_value = document.getElementById('usd_value').value;
    const icon_url = document.getElementById('icon_url').value;
    const website = document.getElementById('website').value;
    const coinmarketcap = document.getElementById('coinmarketcap').value;
    const coingecko = document.getElementById('coingecko').value;
        
    addAsset(ticker, name_asset, type, network_default, rpc_url, decimals, contract_address, 
                        requiresmemovalor, confirmations_required, explorer_tx_url, explorer_address_url,
                        depositenabled, withdrawenabled, tradeenabled, maintenancemode, min_deposit, min_withdraw, 
                        withdraw_fee,  network_fee, usd_value, icon_url, website, coinmarketcap, coingecko
    );
}

function sendModifyAsset() {
    const ticker = document.getElementById('ticker_mod').value;
    const field = document.getElementById('field').value;
    const value = document.getElementById('value').value;
        
    modifyAsset(ticker, field, value);
}