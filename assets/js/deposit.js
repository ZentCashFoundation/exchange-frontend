const coinSelect =
  document.getElementById("currencySelect");

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

  await updateDeposit();

  recentDeposits();

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
// UPDATE DEPOSIT
// -----------------------------------
async function updateDeposit() {

  const asset =
    getCurrentAsset();

  if (!asset) return;

  const key =
    `${asset.ticker}-${asset.network_default}`;

  if (
    key === lastKey &&
    depositCache[key]
  ) {

    renderDeposit(
      depositCache[key]
    );

    return;

  }

  lastKey = key;

  const depositData =
    await deposit(
      asset.ticker,
      asset.network_default
    );

  const fullData = {
    ...asset,
    ...depositData
  };

  depositCache[key] =
    fullData;

  renderDeposit(fullData);
}


// -----------------------------------
// RENDER DEPOSIT
// -----------------------------------
function renderDeposit(data) {

  if (data.type === "TURTLENOTE") {

    paymentidtitleActive = document.querySelector(".depositPaymentID");
    paymentidtitleActive.style.display = "initial";
    paymentidActive = document.getElementById("depositPaymentID");
    paymentidActive.style.display = "initial";
    depositIntegratedtitleAddressActive = document.querySelector(".depositIntegratedAddress");
    depositIntegratedtitleAddressActive.style.display = "initial";
    depositIntegratedAddressActive = document.getElementById("depositIntegratedAddress");
    depositIntegratedAddressActive.style.display = "initial";

  }

  if (data.type != "TURTLENOTE") {

    paymentidtitleActive = document.querySelector(".depositPaymentID");
    paymentidtitleActive.style.display = "none";
    paymentidActive = document.getElementById("depositPaymentID");
    paymentidActive.style.display = "none";
    depositIntegratedtitleAddressActive = document.querySelector(".depositIntegratedAddress");
    depositIntegratedtitleAddressActive.style.display = "none";
    depositIntegratedAddressActive = document.getElementById("depositIntegratedAddress");
    depositIntegratedAddressActive.style.display = "none";

  }

  document.getElementById(
    "qrcode-address"
  ).innerHTML =
    `<img alt="QR Code ${data.name}" loading="lazy" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.address}" width="200">`;

  document.getElementById(
    "depositAddress"
  ).value =
    data.address ?? "";

  document.getElementById(
    "depositPaymentID"
  ).value =
    data.payment_id ?? "";

  document.getElementById(
    "depositIntegratedAddress"
  ).value =
    data.integrated_address ?? "";

  document.getElementById(
    "depositMemo"
  ).value =
    data.memo ?? "";

  document.getElementById(
    "minimum-deposit-amount"
  ).innerText =
    Number(data.min_deposit || 0).toFixed(data.decimals || 0) ?? "0";

  document.getElementById(
    "minimum-deposit-confirmations"
  ).innerText =
    data.confirmations_required ?? "0";

}


// -----------------------------------
// EVENTS
// -----------------------------------
coinSelect.addEventListener(
  "change",
  async () => {

    renderNetworks();

    await updateDeposit();

  }
);

networkSelect.addEventListener(
  "change",
  updateDeposit
);

// -----------------------------------
// RECENT DEPOSIT HISTORY
// -----------------------------------
async function recentDeposits() {
    const data = await recentDepositHistory("BTC", 10);

    if (!data) return;

    const tableBody = document.getElementById("recentDepositsTableBody");
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
          <td>${history.confirmations}</td>
          <td style="font-weight: bold; text-transform: capitalize; color: ${history.status === 'confirmed'  ? '#2bff00':'red' }">${history.status}</td>
        `;

        tableBody.appendChild(row);
    });
}



// -----------------------------------
// START
// -----------------------------------
init();

