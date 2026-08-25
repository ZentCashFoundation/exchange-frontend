function send() {
    const data = {
        name: document.getElementById('name').value,
        ticker: document.getElementById('ticker').value,
        type: document.getElementById('type').value,
        decimal: document.getElementById('decimal').value,
        network_fee: document.getElementById('network_fee').value,
        confirmations_required: document.getElementById('confirmations_required').value,
        website: document.getElementById('website').value,
        icon_url: document.getElementById('icon_url').value,
        explorer_url: document.getElementById('explorer_url').value,
        explorer_tx_url: document.getElementById('explorer_tx_url').value,
        explorer_address_url: document.getElementById('explorer_address_url').value,
        github: document.getElementById('github').value,
        coinmarketcap: document.getElementById('coinmarketcap').value,
        coingecko: document.getElementById('coingecko').value
    };

    console.log(data);
}
