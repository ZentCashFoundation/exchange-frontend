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

    const container = document.getElementById("assets-in-wallet-container");

    container.innerHTML = "";

    portfolio.forEach(asset => {

        const row = document.createElement("div");
        row.className = "wallet-row";

        if (asset.available) {
            asset.available = parseFloat(asset.available).toFixed(asset.decimals);
        }

        if (asset.locked) {
            asset.locked = parseFloat(asset.locked).toFixed(asset.decimals);
        }

        row.innerHTML = `
            <div class="wallet-asset">
                <img src="${asset.icon_url}" alt="${asset.ticker}">
                <span>${asset.ticker}</span>
            </div>

            <div>${asset.name}</div>

            <div>${asset.available}</div>

            <div>${asset.locked}</div>

            <div class="wallet-actions">
                <button onclick="window.location.href='deposit.html?ticker=${asset.ticker}'" class="wallet-btn deposit">
                    Deposit
                </button>

                <button onclick="window.location.href='withdraw.html?ticker=${asset.ticker}'" class="wallet-btn withdraw">
                    Withdraw
                </button>
            </div>
        `;

        container.appendChild(row);
    });
}
 
renderWallet()