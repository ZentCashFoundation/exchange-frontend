async function addAsset(ticker, name_asset, type, network_default, rpc_url, decimals, contract_address, requires_memo, confirmations_required, explorer_tx_url, explorer_address_url, deposit_enabled, withdraw_enabled, trade_enabled, maintenance_mode, min_deposit, min_withdraw, withdraw_fee, network_fee, usd_value, icon_url, website, coinmarketcap, coingecko) {
    try {
        const res = await fetch(API + "/exchange/admin/asset/add", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + token
            },
            body: JSON.stringify({ 
                ticker: `${ticker}`, 
                name: `${name_asset}`,
                type: `${type}`,
                network_default: `${network_default}`,
                rpc_url: `${rpc_url}`,
                decimals: Number(decimals),
                contract_address: `${contract_address}`,
                requires_memo: Number(requires_memo),
                confirmations_required: Number(confirmations_required),
                explorer_tx_url: `${explorer_tx_url}`,
                explorer_address_url: `${explorer_address_url}`,
                deposit_enabled: Number(deposit_enabled),
                withdraw_enabled: Number(withdraw_enabled),
                trade_enabled: Number(trade_enabled),
                maintenance_mode: Number(maintenance_mode),
                min_deposit: Number(min_deposit),
                min_withdraw: Number(min_withdraw),
                withdraw_fee: Number(withdraw_fee),
                network_fee: Number(network_fee),
                usd_value: Number(usd_value),
                icon_url: `${icon_url}`,
                website: `${website}`,
                coinmarketcap: `${coinmarketcap}`,
                coingecko: `${coingecko}`
            })
        });
        const data = await res.json();
        return data.result;
    } catch (err) {
        console.error("Error:", err);
    }
}

async function getAssetList() {
    try {
        const res = await fetch(API + "/exchange/admin/asset/getlist", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + token
            }
        });
        const data = await res.json();
        return data.assets;
    } catch (err) {
        console.error("Error retrieving listing list:", err);
    }
}