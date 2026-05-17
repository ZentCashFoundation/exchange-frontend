const params = new URLSearchParams(window.location.search);
const pair = params.get("pair") ?? "ZTC_BTC";

const orderbuyprice = document.getElementById("order-buy-price");
const orderbuyamount = document.getElementById("order-buy-amount");
const orderbuyfee = document.getElementById("order-buy-fee");
const orderbuytotal = document.getElementById("order-buy-total");

const ordersellprice = document.getElementById("order-sell-price");
const ordersellamount = document.getElementById("order-sell-amount");
const ordersellfee = document.getElementById("order-sell-fee");
const orderselltotal = document.getElementById("order-sell-total");

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

document.addEventListener("DOMContentLoaded", () => {
	orderbuyprice.addEventListener("input", updateTotals);
	orderbuyamount.addEventListener("input", updateTotals);
	ordersellprice.addEventListener("input", updateTotals);
	ordersellamount.addEventListener("input", updateTotals);
    trades(pair);
    orderbook(pair);
    updateTotals();
});

setInterval(() => {
    trades(pair);
    orderbook(pair);
    updateTotals();
}, 5000);