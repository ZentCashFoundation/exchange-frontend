const coinSelect =
  document.getElementById("currencySelect");

const networkSelect =
  document.getElementById("networkSelect");

const withdrawButton =
  document.getElementById("withdrawButton");

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

  await loadWithdrawData();

  await recentWithdrawals();

  // EVENTS
  coinSelect.addEventListener(
    "change",
    async () => {

      renderNetworks();

      await loadWithdrawData();

      await recentWithdrawals();

    }
  );

  networkSelect.addEventListener(
    "change",
    async () => {

      await loadWithdrawData();

    }
  );

  withdrawButton.addEventListener(
    "click",
    handleWithdraw
  );

}

// -----------------------------------
// COINS
// -----------------------------------
function renderCoins() {

  const tickers = [
    ...new Set(
      assets.map(a => a.ticker)
    )
  ];

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

  const networks = [
    ...new Set(
      assets
        .filter(a =>
          a.ticker === ticker
        )
        .map(a =>
          a.network_default
        )
    )
  ];

  networkSelect.innerHTML =
    networks.map(network => `

      <option value="${network}">
        ${network}
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
// LOAD ASSET + BALANCE
// -----------------------------------
async function getInformationAssetAndBalance(ticker) {

  const [
    assetResponse,
    balanceResponse
  ] = await Promise.all([

    loadAsset(ticker),
    loadUserBalance(ticker)

  ]);

  const assetsData =
    assetResponse.asset || [];

  const balances =
    Array.isArray(balanceResponse)
      ? balanceResponse
      : [balanceResponse];

  const balanceMap =
    new Map(
      balances.map(b => [b.asset, b])
    );

  return assetsData.map(asset => {

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
// LOAD WITHDRAW DATA
// -----------------------------------
async function loadWithdrawData() {

  const ticker =
    coinSelect.value;

  await withdrawRequeriments(ticker);

}

// -----------------------------------
// WITHDRAW REQUIREMENTS
// -----------------------------------
async function withdrawRequeriments(ticker) {

  const assetsData =
    await getInformationAssetAndBalance(ticker);

  if (!assetsData || assetsData.length === 0) {

    alert("Error retrieving asset information");

    return;

  }

  const assetInfo =
    assetsData.find(a =>

      a.ticker === ticker &&
      a.network_default === networkSelect.value

    );

  if (!assetInfo) {

    alert("Asset not found");

    return;

  }

  // UPDATE GLOBAL ASSET
  const index =
    assets.findIndex(a =>

      a.ticker === assetInfo.ticker &&
      a.network_default === assetInfo.network_default

    );

  if (index !== -1) {

    assets[index] = {
      ...assets[index],
      ...assetInfo
    };

  }

  if (assetInfo.type === "TURTLENOTE") {
  const inputPaymentID = document.getElementById("paymentID");
  inputPaymentID.style.display = "initial";
  const inputPaymentIDLabel = document.querySelector(".paymentID");
  inputPaymentIDLabel.style.display = "initial"
  } else {
    const inputPaymentID = document.getElementById("paymentID");
    inputPaymentID.style.display = "none";
    const inputPaymentIDLabel = document.querySelector(".paymentID");
    inputPaymentIDLabel.style.display = "none"
  }

  const minAmount =
    Number(assetInfo.min_withdraw)
      .toFixed(assetInfo.decimals);

  const fee =
    Number(assetInfo.withdraw_fee)
      .toFixed(assetInfo.decimals);

  const available =
    Number(assetInfo.available)
      .toFixed(assetInfo.decimals);

  document.getElementById(
    "minimum-withdraw-amount"
  ).textContent =
    `${minAmount} ${assetInfo.ticker}`;

  document.getElementById(
    "withdraw-fee"
  ).textContent =
    `${fee} ${assetInfo.ticker}`;

  document.getElementById(
    "available-balance"
  ).textContent =
    `${available} ${assetInfo.ticker}`;

  document.getElementById(
    "minimum-withdraw-confirmations"
  ).textContent =
    assetInfo.confirmations_required;

}

// -----------------------------------
// HANDLE WITHDRAW
// -----------------------------------
async function handleWithdraw() {

  const asset =
    getCurrentAsset();

  if (!asset) {

    alert("Asset not found");

    return;

  }

  const address =
    document
      .getElementById("withdrawAddress")
      .value
      .trim();

  const amount =
    parseFloat(
      document
        .getElementById("withdrawAmount")
        .value
    );

  if (!address) {

    alert("Invalid address");

    return;

  }

  if (!amount || amount <= 0) {

    alert("Invalid amount");

    return;

  }

  const fee = parseFloat(asset.withdraw_fee);
  const min = parseFloat(asset.min_withdraw);
  const available = parseFloat(asset.available || 0);

  if (amount < min) {

    alert(`Minimum withdraw is ${min}`
    );

    return;

  }

  withdrawButton.disabled = true;

  try {

    let paymentId = document.getElementById("paymentID");
    paymentId = paymentId?.value ?? null;

    const response =
      await withdraw(asset.ticker, amount, address, paymentId, null, null, null, asset.network_default);
      
    if (!response) {

      withdrawButton.disabled = false;

      return;

    }

    alert("Withdrawal submitted");

    document.getElementById("withdrawAddress").value = "";

    document.getElementById("withdrawAmount").value = "";

    document.getElementById("paymentID").value = "";



    await loadWithdrawData();

    await recentWithdrawals();

  }

  catch (err) {

    console.error(err);

    alert("Withdrawal failed");

  }

  withdrawButton.disabled = false;

}

// -----------------------------------
// RECENT WITHDRAWALS
// -----------------------------------
async function recentWithdrawals() {

  const ticker = coinSelect.value;

  const data = await recentWithdrawHistory(ticker, 10);

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

    if (history.tx_hash === null) {
      history.tx_hash = '-'
    }

    if (history.amount) {
      history.amount = parseFloat(history.amount).toFixed(8);
    }

    if (history.fee) {
      history.fee = parseFloat(history.fee).toFixed(6);
    }

    row.innerHTML = `
      <td>${history.created_at}</td>
      <td>${history.asset_ticker}</td>
      <td>${history.amount}</td>
      <td>${history.fee}
      <td>${history.address}</td>
      <td>${history.tx_hash}</td>
      <td style="font-weight: bold; text-transform: capitalize; color: ${history.status === "confirmed" ? "#2bff00" : history.status === "pending" ? "orange" : history.status === "broadcasted" ? "#00bcd4" : "red"}">
        ${history.status}
      </td>
    `;

    tableBody.appendChild(row);

  });

}

init();
