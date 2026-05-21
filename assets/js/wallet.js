if (!token) {
  window.location.href = "auth.html";
}

async function getPortfolio() {

  // -----------------------------------
  // LOAD DATA
  // -----------------------------------

  const [
    assets,
    balances
  ] = await Promise.all([

    loadAssets(),
    loadUserBalances()

  ]);

  // -----------------------------------
  // BALANCE MAP
  // -----------------------------------

  const balanceMap =
    new Map(
      balances.map(b => [b.asset, b])
    );

  // -----------------------------------
  // MERGE
  // -----------------------------------

  return assets.map(asset => {

    const balance =
      balanceMap.get(asset.ticker);

    return {

      ...asset,

      available:
        balance?.available || "0",

      locked:
        balance?.locked || "0",

      total:
        balance?.total || "0"
    };
  });
}

async function renderWallet() {
  const portfolio = await getPortfolio();
  
  const tableBody = document.getElementById("assets-in-wallet-table-body");
    tableBody.innerHTML = "";
	  portfolio.forEach(asset => {
		    const row = document.createElement("tr");

        if (asset.available) {
          asset.available = parseFloat(asset.available).toFixed(asset.decimals);
        }
        if (asset.locked) {
          asset.locked = parseFloat(asset.locked).toFixed(asset.decimals);
        }

        row.innerHTML = `
          <td style="text-transform: capitalize"><img src="${asset.icon_url}" alt="${asset.ticker}" width="20" height="20"> ${asset.ticker}</td>
          <td style="text-transform: capitalize">${asset.name}</td>
          <td style="text-transform: capitalize">${asset.available}</td>
          <td style="text-transform: capitalize">${asset.locked}</td>
          <td>
            <button onclick="window.location.href='deposit.html?ticker=${asset.ticker}'" class="btn btn-success btn-sm">Deposit</button>
            <button onclick="window.location.href='withdraw.html?ticker=${asset.ticker}'" class="btn btn-danger btn-sm">Withdraw</button>
          </td>
        `;

        tableBody.appendChild(row);
    });
} 
 
renderWallet()