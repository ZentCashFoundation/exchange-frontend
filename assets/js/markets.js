const params = new URLSearchParams(window.location.search);
const pair = params.get("pair") ?? "ZTC_BTC";
const timeframe = params.get("timeframe") ?? "4h";

async function markets() {
    const data = await loadPairs();

    if (!data) return;

    const tableBody = document.getElementById("markets-in-trade-table-body");
    tableBody.innerHTML = "";

    data.forEach(trade => {
        const row = document.createElement("tr");

        if (trade.last_price === null) {
            trade.last_price = 0;
        }

        if (trade.bid_price === null) {
            trade.bid_price = 0;
        }

        if (trade.ask_price === null) {
            trade.ask_price = 0;
        }

        row.innerHTML = `
            <td onclick="window.location.href='trade.html?pair=${trade.pair}'" style="text-transform: capitalize; cursor: pointer">${trade.pair.replace("_", "/")}</td>
            <td onclick="window.location.href='trade.html?pair=${trade.pair}'"style="text-transform: capitalize">${trade.bid_price}</td>
            <td onclick="window.location.href='trade.html?pair=${trade.pair}'" style="text-transform: capitalize">${trade.ask_price}</td>
            <td onclick="window.location.href='trade.html?pair=${trade.pair}'" style="text-transform: capitalize">${trade.last_price}</td>
        `;

        tableBody.appendChild(row);
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