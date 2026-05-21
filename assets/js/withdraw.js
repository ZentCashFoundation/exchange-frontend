const coinSelect =  document.getElementById("currencySelect");

const networkSelect =
  document.getElementById("networkSelect");

let assets = [];

let lastKey = null;

let depositCache = {};

// -----------------------------------
// INIT
// -----------------------------------
async function init() {

  assets = await loadAssets();

  renderCoins();

  setTickerFromUrl();

  renderNetworks();
/**
  await updateDeposit();

  **/
 recentWithdrawals();

}

// -----------------------------------
// COINS
// -----------------------------------
function renderCoins() {

  const tickers =
    [...new Set(
      assets.map(a => a.ticker)
    )];

  coinSelect.innerHTML =
    tickers.map(t => `
      <option value="${t}">
        ${t}
      </option>
    `).join("");

}

// -----------------------------------
// URL TICKER
// -----------------------------------
function setTickerFromUrl() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const ticker =
    params.get("ticker");

  if (!ticker) return;

  const exists =
    assets.some(a =>
      a.ticker.toUpperCase() ===
      ticker.toUpperCase()
    );

  if (!exists) return;

  coinSelect.value =
    ticker.toUpperCase();

}

// -----------------------------------
// NETWORKS
// -----------------------------------
function renderNetworks() {

  const ticker =
    coinSelect.value;

  const networks =
    assets.filter(a =>
      a.ticker === ticker
    );

  networkSelect.innerHTML =
    networks.map(a => `

      <option value="${a.network_default}">
        ${a.network_default}
      </option>

    `).join("");

}

// -----------------------------------
// CURRENT ASSET
// -----------------------------------
function getCurrentAsset() {

  return assets.find(a =>

    a.ticker === coinSelect.value &&
    a.network_default === networkSelect.value

  );

}

// -----------------------------------
// RECENT WITHDRAWALS
// -----------------------------------
async function recentWithdrawals() {
    const data = await recentWithdrawHistory("BTC", 10); 

    if (!data) return;

    const tableBody = document.getElementById("recentWithdrawalsTableBody");
    tableBody.innerHTML = "";

    data.history.forEach(history => {
        const row = document.createElement("tr");

		if (history.created_at) {
			history.created_at = new Date(history.created_at).toLocaleString();
		}

		if (history.address) {
			history.address = history.address.length > 20 ? history.address.slice(0, 10) + "..." + history.address.slice(-10) : history.address;
		}

		if (history.amount ) {
			history.amount = parseFloat(history.amount).toFixed(8);
		}	

        row.innerHTML = `            
			<td>${history.created_at}</td>
			<td>${history.asset_ticker}</td>
			<td>${history.amount}</td>
			<td>${history.address}</td>
			<td>${history.tx_hash}</td>
			<td style="font-weight: bold; text-transform: capitalize; color: ${history.status === 'confirmed'  ? '#2bff00':'red' }">${history.status}</td>

        `;

        tableBody.appendChild(row);
    });
}

init();