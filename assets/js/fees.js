async function assetsFees() {
    const data = await loadAssets();
	
    if (!data) return;

    const container = document.getElementById("assets-fees-container-body");
    container.innerHTML = "";

    data.forEach(asset => {
        const row = document.createElement("div");
        row.className = "fee-row";

        if (asset.withdraw_fee ) {
			asset.withdraw_fee = parseFloat(asset.withdraw_fee).toFixed(asset.decimals);
		}
        if (asset.min_deposit ) {
			asset.min_deposit = parseFloat(asset.min_deposit).toFixed(asset.decimals);
		}
        if (asset.min_withdraw ) {
			asset.min_withdraw = parseFloat(asset.min_withdraw).toFixed(asset.decimals);
		}          

        row.innerHTML = `
            <div data-label="Ticker" style="text-transform: capitalize"><img src="${asset.icon_url}" alt="${asset.ticker}" width="20" height="20"> ${asset.ticker}</div>
			<div data-label="Name" style="text-transform: capitalize; cursor: pointer">${asset.name}</div>
			<div data-label="Withdraw Fee" style="font-weight: bold; text-transform: capitalize; cursor: pointer">${asset.withdraw_fee}</div>
            <div data-label="Minimum Deposit" style="font-weight: bold; text-transform: capitalize; cursor: pointer">${asset.min_deposit}</div>
            <div data-label="Minimum Withdraw" style="font-weight: bold; text-transform: capitalize; cursor: pointer">${asset.min_withdraw}</div>
        `;
        container.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    assetsFees();
});

setInterval(() => {
    assetsFees();
}, 5000);

