const params = new URLSearchParams(window.location.search);
const pair = params.get("pair") ?? "ZTC_BTC";
const timeframe = params.get("timeframe") ?? "4h";

async function markets() {

    const data = await loadPairs();

    if (!data) return;

    const container = document.getElementById(
        "markets-in-trade-container"
    );

    container.innerHTML = "";

    data.forEach(trade => {

        const row = document.createElement("div");

        row.className = "market-row";

        if (trade.last_price === null) {
            trade.last_price = 0;
        }

        if (trade.bid_price === null) {
            trade.bid_price = 0;
        }

        if (trade.ask_price === null) {
            trade.ask_price = 0;
        }

        if (trade.bid_price) {
            trade.bid_price = Number(trade.bid_price).toFixed(8).toString();
        }

        if (trade.ask_price) {
            trade.ask_price = Number(trade.ask_price).toFixed(8).toString();
        }

        if (trade.last_price) {
            trade.last_price = Number(trade.last_price).toFixed(8).toString();
        }

        if (trade.low_24h) {
            trade.low_24h = Number(trade.low_24h).toFixed(8).toString();
        }

        if (trade.high_24h) {
            trade.high_24h = Number(trade.high_24h).toFixed(8).toString();
        }

        const variation = parseFloat(
            trade.variation_24h
        ).toFixed(2);

        const volume = parseFloat(
            trade.volume_24h
        ).toFixed(0);

        row.innerHTML = `
            <div onclick="window.location.href='trade.html?pair=${trade.pair}'">
                ${trade.pair.replace("_", "/")}
            </div>

            <div onclick="window.location.href='trade.html?pair=${trade.pair}'">
                ${trade.bid_price}
            </div>

            <div onclick="window.location.href='trade.html?pair=${trade.pair}'">
                ${trade.ask_price}
            </div>

            <div onclick="window.location.href='trade.html?pair=${trade.pair}'">
                ${trade.last_price}
            </div>

            <div onclick="window.location.href='trade.html?pair=${trade.pair}'">
                ${trade.low_24h}
            </div>

            <div onclick="window.location.href='trade.html?pair=${trade.pair}'">
                ${trade.high_24h}
            </div>

            <div
                class="${variation >= 0 ? 'positive-market' : 'negative-market'}"
                onclick="window.location.href='trade.html?pair=${trade.pair}'"
            >
                ${variation} %
            </div>

            <div onclick="window.location.href='trade.html?pair=${trade.pair}'">
                ${volume}
            </div>
        `;

        container.appendChild(row);

    });
}

document.addEventListener("DOMContentLoaded", () => {
    markets();
    if (token) {

    }
});

setInterval(() => {
    markets();
    if (token) {

    }
}, 5000);