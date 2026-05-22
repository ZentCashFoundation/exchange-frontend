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

async function getInformationAssetAndBalance(ticker) {

  // -----------------------------------
  // LOAD DATA
  // -----------------------------------

  const [
    assetResponse,
    balanceResponse
  ] = await Promise.all([

    loadAsset(ticker),
    loadUserBalance(ticker)

  ]);

  // -----------------------------------
  // EXTRACT DATA
  // -----------------------------------

  const assets =
    assetResponse.asset || [];

  const balances =
    Array.isArray(balanceResponse)
      ? balanceResponse
      : [balanceResponse];

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

// -----------------------------------
// WITHDRAW REQUERIMENTS
// -----------------------------------
async function withdrawRequeriments(ticker) {

  const assets =
    await getInformationAssetAndBalance(ticker);

  if (!assets || assets.length === 0) {

    alert("Error retrieving asset information");
    return;
  }

  const assetInfo = assets[0];

  const minAmount =
    Number(assetInfo.min_withdraw).toFixed(assetInfo.decimals).toString();

  const fee =
    Number(assetInfo.withdraw_fee).toFixed(assetInfo.decimals).toString();

  const available =
    Number(assetInfo.available).toFixed(assetInfo.decimals).toString();

  minimumWithdrawAmount = document.getElementById("minimum-withdraw-amount");  
  minimumWithdrawAmount.textContent = minAmount + " " + assetInfo.ticker;

  withdrawFee = document.getElementById("withdraw-fee");  
  withdrawFee.textContent = fee + " " + assetInfo.ticker;

  availableBalance = document.getElementById("available-balance");  
  availableBalance.textContent = available + " " + assetInfo.ticker;

  totalConfirmations = document.getElementById("minimum-withdraw-confirmations");  
  totalConfirmations.textContent = assetInfo.confirmations_required;

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

    if (history.tx_hash) {
      history.tx_hash = history.tx_hash.length > 20 ? history.tx_hash.slice(0, 10) + "..." + history.tx_hash.slice(-10) : history.tx_hash;
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