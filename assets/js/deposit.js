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
    data.min_deposit ?? "0";

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
// START
// -----------------------------------
init();

