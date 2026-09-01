async function assets() {
    const data = await loadAssets();
	
    if (!data) return;

    const container = document.getElementById("assets-in-system-status-container-body");
    container.innerHTML = "";

    data.forEach(asset => {
        const row = document.createElement("div");
        row.className = "systemstatus-row";
        row.innerHTML = `
            <div data-label="Ticker" style="text-transform: capitalize; cursor: pointer"><img src="${asset.icon_url}" alt="${asset.ticker}" width="20" height="20"> ${asset.ticker}</div>
			<div data-label="Name" style="text-transform: capitalize; cursor: pointer">${asset.name}</div>
			<div data-label="Maintenance Mode" style="font-weight: bold; text-transform: capitalize; cursor: pointer; color: ${asset.maintenance_mode == 1 ? 'red' : '#00ff22'}"">${asset.maintenance_mode == 1 ? 'Yes' : 'No'}</div>
			<div data-label="Deposit Enabled" style="font-weight: bold; text-transform: capitalize; cursor: pointer; color: ${asset.deposit_enabled == 1 ? '#00ff22' : 'red'}">${asset.deposit_enabled == 1 ? 'Active' : 'Disable'}</div>
			<div data-label="Withdraw Enabled" style="font-weight: bold; text-transform: capitalize; cursor: pointer; color: ${asset.withdraw_enabled == 1 ? '#00ff22' : 'red'}">${asset.withdraw_enabled == 1 ? 'Active' : 'Disable'}</div>
        `;

        container.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    assets();
});

setInterval(() => {
    assets();
}, 5000);