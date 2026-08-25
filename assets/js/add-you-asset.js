function send() {
        const name_asset = document.getElementById('name').value;
        const ticker = document.getElementById('ticker').value;
        const type = document.getElementById('type').value;
        const decimal = document.getElementById('decimal').value;
        const network_fee = document.getElementById('network_fee').value;
        const confirmations_required = document.getElementById('confirmations_required').value;
        const website = document.getElementById('website').value;
        const icon_url = document.getElementById('icon_url').value;
        const explorer_url = document.getElementById('explorer_url').value;
        const explorer_tx_url = document.getElementById('explorer_tx_url').value;
        const explorer_address_url = document.getElementById('explorer_address_url').value;
        const github = document.getElementById('github').value;
        const coinmarketcap = document.getElementById('coinmarketcap').value;
        const coingecko = document.getElementById('coingecko').value;
        const requiresmemo = document.getElementById('requires_memo');
        const requiresmemovalor = requiresmemo.checked ? 1 : 0;
        const contractaddress = document.getElementById('contract_address').value;
    
        addAssetListingList(ticker, name_asset, type, decimal, contractaddress, requiresmemovalor, confirmations_required, explorer_url, explorer_tx_url, explorer_address_url, network_fee, icon_url, website, coinmarketcap, coingecko, github);
        window.location.href='listing.html';
}