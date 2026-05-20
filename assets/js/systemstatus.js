async function assets() {
    const data = await loadAssets();
	
    if (!data) return;

    const tableBody = document.getElementById("assets-in-system-status-table-body");
    tableBody.innerHTML = "";

    data.forEach(asset => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td style="text-transform: capitalize; cursor: pointer">${asset.ticker}</td>
			<td style="text-transform: capitalize; cursor: pointer">${asset.name}</td>
			<td style="font-weight: bold; text-transform: capitalize; cursor: pointer; color: ${asset.maintenance_mode == 1 ? 'red' : '#00ff22'}"">${asset.maintenance_mode == 1 ? 'Yes' : 'No'}</td>
			<td style="font-weight: bold; text-transform: capitalize; cursor: pointer; color: ${asset.deposit_enabled == 1 ? '#00ff22' : 'red'}">${asset.deposit_enabled == 1 ? 'Active' : 'Disable'}</td>
			<td style="font-weight: bold; text-transform: capitalize; cursor: pointer; color: ${asset.withdraw_enabled == 1 ? '#00ff22' : 'red'}">${asset.withdraw_enabled == 1 ? 'Active' : 'Disable'}</td>
        `;

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    assets();
});

setInterval(() => {
    assets();
}, 5000);