async function assetsFees() {
    const data = await loadAssets();
	
    if (!data) return;

    const tableBody = document.getElementById("assets-fees-table-body");
    tableBody.innerHTML = "";

    data.forEach(asset => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td style="text-transform: capitalize"><img src="${asset.icon_url}" alt="${asset.ticker}" width="20" height="20"> ${asset.ticker}</td>
			<td style="text-transform: capitalize; cursor: pointer">${asset.name}</td>
			<td style="font-weight: bold; text-transform: capitalize; cursor: pointer">${asset.withdraw_fee}</td>
            <td style="font-weight: bold; text-transform: capitalize; cursor: pointer">${asset.min_deposit}</td>
            <td style="font-weight: bold; text-transform: capitalize; cursor: pointer">${asset.min_withdraw}</td>
        `;

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    assetsFees();
});

setInterval(() => {
    assetsFees();
}, 5000);

