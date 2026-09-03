async function addAsset(ticker, name_asset, type, network_default, rpc_url, decimals, facial_decimals, contract_address, requires_memo, confirmations_required, explorer_tx_url, explorer_address_url, deposit_enabled, withdraw_enabled, trade_enabled, maintenance_mode, min_deposit, min_withdraw, withdraw_fee, network_fee, usd_value, icon_url, website, coinmarketcap, coingecko) {
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
                facial_decimals: Number(decimals),
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
        if (data.error) {
            showToast(data.error, "error");
        };
        return data.result;

}   

async function modifyAsset(ticker, field, value) {
        const res = await fetch(API + "/exchange/admin/asset/modify", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + token
            },
            body: JSON.stringify({ 
                ticker: `${ticker}`, 
                field: `${field}`,
                value: `${value}`
            })    
        });

        const data = await res.json();
        if (data.error) {
            showToast(data.error, "error");
        };
        return data.result;

} 

async function getAssetList() {
        const res = await fetch(API + "/exchange/admin/asset/getlist", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + token
            }
        });
        const data = await res.json();
        if (data.error) {
            showToast(data.error, "error");
        };
        return data.assets;
}

async function addMarket(pair, base_asset, quote_asset, is_active, maker_fee, taker_fee, min_order_size, min_order_price, price_precision, amount_precision) {
        const res = await fetch(API + "/exchange/admin/market/add", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + token
            },
            body: JSON.stringify({ 
                pair: `${pair}`,
                base_asset: `${base_asset}`,
                quote_asset: `${quote_asset}`,
                is_active: Number(is_active),
                maker_fee: Number(maker_fee),
                taker_fee: Number(taker_fee),
                min_order_size: Number(min_order_size),
                min_order_price: Number(min_order_price),
                price_precision: Number(price_precision),
                amount_precision: Number(amount_precision)
            })    
        });

        const data = await res.json();
        showToast("Add Market", "success");

        if (data.error) {
            showToast(data.error, "error");
        };
        return data.result;

} 

async function modifyMarket(pair, field, value) {
        const res = await fetch(API + "/exchange/admin/market/modify", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + token
            },
            body: JSON.stringify({ 
                pair: `${pair}`, 
                field: `${field}`,
                value: `${value}`
            })    
        });

        const data = await res.json();
        if (data.error) {
            showToast(data.error, "error");
        };
        return data.result;

}

async function getMarketList() {
        const res = await fetch(API + "/exchange/admin/market/getlist", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + token
            }
        });
        const data = await res.json();
        if (data.error) {
            showToast(data.error, "error");
        };
        return data.markets;
}