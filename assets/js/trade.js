const params = new URLSearchParams(window.location.search);
const pair = params.get("pair") ?? "ZTC_BTC";
const timeframe = params.get("timeframe") ?? "4h";

const orderbuyprice = document.getElementById("order-buy-price");
const orderbuyamount = document.getElementById("order-buy-amount");
const orderbuyfee = document.getElementById("order-buy-fee");
const orderbuytotal = document.getElementById("order-buy-total");

const ordersellprice = document.getElementById("order-sell-price");
const ordersellamount = document.getElementById("order-sell-amount");
const ordersellfee = document.getElementById("order-sell-fee");
const orderselltotal = document.getElementById("order-sell-total");
const pairName = document.getElementById("chart-pair-name");
pairName.textContent = pair.replace("_", "/");

function updateTotals() {
    const buyPrice = parseFloat(orderbuyprice.value) || 0;
    const buyAmount = parseFloat(orderbuyamount.value) || 0;

    const sellPrice = parseFloat(ordersellprice.value) || 0;
    const sellAmount = parseFloat(ordersellamount.value) || 0;

    orderbuytotal.value = (buyPrice * buyAmount);
    orderselltotal.value = (sellPrice * sellAmount);
}

function buyOrderLimit() {
	orderSend(pair, "buy", "limit", orderbuyprice.value, orderbuyamount.value);
}

function sellOrderLimit() {
	orderSend(pair, "sell", "limit", ordersellprice.value, ordersellamount.value);
}

function buyOrderMarket() {
	orderSend(pair, "buy", "market", null, orderbuyamount.value);
}

function sellOrderMarket() {
	orderSend(pair, "sell", "market", null, ordersellamount.value);
}

async function historicalOrders() {
    const data = await orderGet(pair, null, 100);

    if (!data) return;

    const tableBody = document.getElementById("my-orders-history-table-body");
    tableBody.innerHTML = "";

    data.forEach(trade => {
        const row = document.createElement("tr");

        if (trade.price === null) {
            trade.price = "Market Price";
        }

        row.innerHTML = `
            <td style="text-transform: capitalize">${trade.id}</td>
            <td style="text-transform: capitalize">${trade.side}</td>
            <td style="text-transform: capitalize">${trade.type}</td>
            <td style="text-transform: capitalize">${trade.price}</td>
            <td style="text-transform: capitalize">${trade.amount}</td>
            <td style="text-transform: capitalize">${trade.filled}</td>
            <td style="text-transform: capitalize">${trade.status}</td>
            <td style="text-transform: capitalize">${new Date(trade.created_at).toLocaleString()}</td>
        `;

        tableBody.appendChild(row);
    });
    
}

async function openOrders() {
    const openData = await orderGet(pair, "open", 100);
    const partialData = await orderGet(pair, "partial", 100);
    const data = [...openData, ...partialData];

    if (!data) return;

    const tableBody = document.getElementById("open-orders-table-body");
    tableBody.innerHTML = "";

    data.forEach(trade => {
        const row = document.createElement("tr");

        if (trade.price === null) {
            trade.price = "Market Price";
        }

        row.innerHTML = `
            <td style="text-transform: capitalize">${trade.id}</td>
            <td style="text-transform: capitalize">${trade.side}</td>
            <td style="text-transform: capitalize">${trade.type}</td>
            <td style="text-transform: capitalize">${trade.price}</td>
            <td style="text-transform: capitalize">${trade.amount}</td>
            <td style="text-transform: capitalize">${trade.filled}</td>
            <td style="text-transform: capitalize">${trade.status}</td>
            <td style="text-transform: capitalize">${new Date(trade.created_at).toLocaleString()}</td>
            <td><button class="btn btn-sm btn-danger" onclick="orderCancel('${trade.id}')">Cancel</button></td>
        `;

        tableBody.appendChild(row);
    });  
}

async function marketsinTrades() {
    const data = await loadPairs();

    if (!data) return;

    const tableBody = document.getElementById("markets-in-trade-table-body");
    tableBody.innerHTML = "";

    data.forEach(trade => {
        const row = document.createElement("tr");

        if (trade.last_price === null) {
            trade.last_price = 0;
        }

        const variation = parseFloat(trade.variation_24h).toFixed(2);
        const volume = parseFloat(trade.volume_24h).toFixed(0);

        row.innerHTML = `
            <td onclick="window.location.href='trade.html?pair=${trade.pair}'" style="text-transform: capitalize">${trade.pair.replace("_", "/")}</td>
            <td onclick="window.location.href='trade.html?pair=${trade.pair}'" style="text-transform: capitalize">${trade.last_price}</td>
            <td onclick="window.location.href='trade.html?pair=${trade.pair}'" style="text-transform: capitalize">${variation} %</td>
            <td onclick="window.location.href='trade.html?pair=${trade.pair}'" style="text-transform: capitalize">${volume}</td>

        `;

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {
	orderbuyprice.addEventListener("input", updateTotals);
	orderbuyamount.addEventListener("input", updateTotals);
	ordersellprice.addEventListener("input", updateTotals);
	ordersellamount.addEventListener("input", updateTotals);
    trades(pair);
    orderbook(pair);
    loadChart(pair, timeframe);
    marketsinTrades();
    updateTotals();
    if (token) {
        openOrders();
        historicalOrders();
        myTrades();
    }
});

setInterval(() => {
    trades(pair);
    orderbook(pair);
    loadChart(pair, timeframe);
    marketsinTrades();
    updateTotals();
    if (token) {
        openOrders();
        historicalOrders();
        myTrades(pair);
    }
}, 5000);