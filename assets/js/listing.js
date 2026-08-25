async function listing() {

    const data = await loadListingList();

    if (!data) return;

    const container = document.getElementById(
        "listing-in-trade-container"
    );

    container.innerHTML = "";

    data.forEach(listingAsset => {

        const row = document.createElement("div");

        row.className = "listing-row";

        if (listingAsset.total_revenue) {
            listingAsset.total_revenue = Number(listingAsset.total_revenue).toFixed(8).toString();
        }
        
        if (listingAsset.total_outstanding) {
            listingAsset.total_outstanding = Number(listingAsset.total_outstanding).toFixed(8).toString();
        }

        if (listingAsset.total_cost) {
            listingAsset.total_cost = Number(listingAsset.total_cost).toFixed(8).toString();
        }


        row.innerHTML = `
            <div>${listingAsset.name}</div>
            <div>${listingAsset.ticker}</div>
            <div>${listingAsset.type}</div>
            <div>${listingAsset.payment_address_per_listing}</div>
            <div>${listingAsset.total_revenue}</div>
            <div>${listingAsset.total_outstanding}</div>
            <div>${listingAsset.total_cost}</div>
            <div>${new Date(listingAsset.updated_at).toLocaleString()}</div>
            <div class="capitalize">${listingAsset.status}</div>
            <div><p class="column"><a target="_blank" href="${listingAsset.website}"> Website</a> <a target="_blank" href="${listingAsset.explorer_url}"> Explorer</a><a target="_blank" href="${listingAsset.github}"> Github</a><a target="_blank" href="https://www.coingecko.com/en/coins/${listingAsset.coinmarketcap}"> CoinMarketCap</a> <a target="_blank" href="https://www.coingecko.com/en/coins/${listingAsset.coingecko}"> Coingecko</a></p></div>          
        `;

        container.appendChild(row);

    });
}

document.addEventListener("DOMContentLoaded", () => {
    listing();
});

setInterval(() => {
    listing();
}, 5000);