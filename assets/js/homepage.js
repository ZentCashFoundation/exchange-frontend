function buildCard(trade) {
    const variation = parseFloat(trade.variation_24h).toFixed(2);
    const volume    = parseFloat(trade.volume_24h).toFixed(0);
    const price     = trade.last_price
        ? Number(trade.last_price).toFixed(8)
        : "0.00000000";
    const varClass = variation >= 0 ? "positive-market" : "negative-market";
    const varSign  = variation >= 0 ? "+" : "";

    const card = document.createElement("div");
    card.className = "market-row";
    card.onclick = () => window.location.href = `trade.html?pair=${trade.pair}`;
    card.innerHTML = `
        <div class="namepair">${trade.pair.replace("_", "/")}</div>
        <div class="market-price">${price}</div>
        <div class="${varClass}">${varSign}${variation}%</div>
        <div class="market-vol"><span class="volumepair">Vol</span> ${Number(volume).toLocaleString()}</div>
    `;
    return card;
}

async function markets() {
    const data = await loadPairs();
    if (!data || !data.length) return;

    const wrapper = document.getElementById("markets-in-homepage-container");
    wrapper.innerHTML = "";

    const track = document.createElement("div");
    track.className = "ticker-track";

    data.forEach(trade => track.appendChild(buildCard(trade)));
    data.forEach(trade => track.appendChild(buildCard(trade)));

    wrapper.appendChild(track);
}

markets();
