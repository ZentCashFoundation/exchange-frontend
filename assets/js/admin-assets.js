async function assetsListFull() {
    const data = await getAssetList();
	
    if (!data) return;

    const container = document.getElementById("assets-list-full-container-body");
    container.innerHTML = "";

    data.forEach(asset => {

        if (asset.withdraw_fee ) {
			asset.withdraw_fee = parseFloat(asset.withdraw_fee).toFixed(asset.facial_decimals);
		}

        if (asset.network_fee ) {
			asset.network_fee = parseFloat(asset.network_fee).toFixed(asset.facial_decimals);
		}

        if (asset.min_deposit ) {
			asset.min_deposit = parseFloat(asset.min_deposit).toFixed(asset.facial_decimals);
		}
        if (asset.min_withdraw ) {
			asset.min_withdraw = parseFloat(asset.min_withdraw).toFixed(asset.facial_decimals);
		} 

        const row = document.createElement("div");
        row.className = "assets-list-full-row";
        row.innerHTML = `
            <div data-label="Ticker" style="text-transform: capitalize"><img src="${asset.icon_url}" alt="${asset.ticker}" width="20" height="20"> ${asset.ticker}</div>
			<div data-label="Name" style="text-transform: capitalize">${asset.name}</div>
            <div data-label="Type" style="text-transform: capitalize">${asset.type}</div>
            <div data-label="Network Default" style="text-transform: capitalize">${asset.network_default}</div>
            <div data-label="Decimals" style="text-transform: capitalize">${asset.decimals}</div>
            <div data-label="Contract Address" style="text-transform: capitalize">${asset.contract_address == null ? 'No, Token' : asset.contract_address}</div>
            <div data-label="Requires Memo" style="text-transform: capitalize">${asset.requires_memo == 1 ? 'Yes' : 'No'}</div>
            <div data-label="Confirmations Required" style="text-transform: capitalize">${asset.confirmations_required}</div>
			<div data-label="Maintenance Mode" style="font-weight: bold; text-transform: capitalize; color: ${asset.maintenance_mode == 1 ? 'red' : '#00ff22'}"">${asset.maintenance_mode == 1 ? 'Yes' : 'No'}</div>
			<div data-label="Deposit Enabled" style="font-weight: bold; text-transform: capitalize; color: ${asset.deposit_enabled == 1 ? '#00ff22' : 'red'}">${asset.deposit_enabled == 1 ? 'Active' : 'Disable'}</div>
			<div data-label="Withdraw Enabled" style="font-weight: bold; text-transform: capitalize; color: ${asset.withdraw_enabled == 1 ? '#00ff22' : 'red'}">${asset.withdraw_enabled == 1 ? 'Active' : 'Disable'}</div>
            <div data-label="Trade Enabled" style="font-weight: bold; text-transform: capitalize; color: ${asset.trade_enabled == 1 ? '#00ff22' : 'red'}">${asset.trade_enabled == 1 ? 'Active' : 'Disable'}</div>
            <div data-label="Min Deposit" style="text-transform: capitalize">${asset.min_deposit}</div>
            <div data-label="Min Withdraw" style="text-transform: capitalize">${asset.min_withdraw}</div>
            <div data-label="Network Fee" style="text-transform: capitalize">${asset.network_fee}</div>
            <div data-label="Withdraw Fee" style="text-transform: capitalize">${asset.withdraw_fee}</div>
            <div data-label="CoinMarketCap">${asset.coinmarketcap == null ? 'Not Available' : asset.coinmarketcap}</div>
            <div data-label="Coingecko">${asset.coingecko == null ? 'Not Available' : asset.coingecko}</div>
            `;

        container.appendChild(row);
    });
}

function sendAsset() {
    const ticker = document.getElementById('ticker').value;
    const name_asset = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const network_default = document.getElementById('network_default').value;
    const rpc_url = document.getElementById('rpc_url').value;
    const decimals = document.getElementById('decimals').value;
    const facial_decimals = document.getElementById('facial_decimals').value;
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
        
    addAsset(ticker, name_asset, type, network_default, rpc_url, decimals, facial_decimals, contract_address, 
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

setInterval(() => {
    assetsListFull();
}, 5000);