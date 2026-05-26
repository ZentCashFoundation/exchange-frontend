// =======================
// Configuración de API
// =======================
const API = "https://superblockchain.zapto.org/example-api";
var token = localStorage.getItem("token") || null;
var tokenDate = localStorage.getItem("token-date") || null;
let gameSessionId = null;

// Verificar si el token ha expirado (2 horas)
if (Number(tokenDate) + 7200000 < Date.now()) {  
    localStorage.removeItem("token");
    localStorage.removeItem("token-date");
}

async function outSession() {
    if (Number(tokenDate) + 7200000 < Date.now()) {  
    localStorage.removeItem("token");
    localStorage.removeItem("token-date");
    }
}

// =======================
// Funcion de registro
// =======================
async function register() {
    const res = await fetch(API + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    alert("Registered");
}

// =======================
// Funcion de autenticación
// =======================
async function login() {
    const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    const data = await res.json();
    if (data.error) {
      	alert(data.error);
       	return;
    }

    token = data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("token-date", Date.now());
    location.href = "./";
}

// ==========================
// Funcion de depósito
// ==========================
async function deposit(ticker, network) {
    const res = await fetch(API + "/exchange/wallet/deposit", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ 
            ticker: `${ticker}`, 
            network: `${network}`
        })
    });
    const data = await res.json();
    if (data.error) {
      	alert(data.error);
       	return null;
    }
    return data;
}

// ==========================
// Funcion de historial de 
// depósitos recientes
// ==========================
async function recentDepositHistory(ticker, limit) {
    const res = await fetch(API + "/exchange/wallet/deposit/history", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ 
            ticker: `${ticker}`, 
            limit: Number(limit)
        })
    });
    const data = await res.json();
    if (data.error) {
      	alert(data.error);
       	return null;
    }
    return data;
}

// ==========================
// Funcion de retiro
// ==========================
async function withdraw(ticker, amount, address, payment_id = null, integrated_address= null, memo = null , tag = null, network = 'mainnet') {
    const res = await fetch(API + "/exchange/wallet/withdraw", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            ticker: `${ticker}`,
            amount: amount,
            address: `${address}`,
            payment_id: `${payment_id}`,
            integrated_address: `${integrated_address}`,
            memo: `${memo}`,
            tag: `${tag}`,
            network: `${network}`
        })
    });
    const data = await res.json();
    if (data.error) {
      	alert(data.error);
       	return null;
    }
    return data;
}

// ==========================
// Funcion de historial de 
// retiros recientes
// ==========================
async function recentWithdrawHistory(ticker, limit) {
    const res = await fetch(API + "/exchange/wallet/withdraw/history", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ 
            ticker: `${ticker}`, 
            limit: Number(limit)
        })
    });
    const data = await res.json();
    if (data.error) {
      	alert(data.error);
       	return null;
    }
    return data;
}

// ==========================
// Funcion de envío de orden
// ==========================
async function orderSend(pair, side, type, price, amount) {
    const res = await fetch(API + "/exchange/order", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            pair: pair,
            side: side,
            type: type,
            price: price,
            amount: amount
        })
    });

    const data = await res.json();
    if (data.error) {
      	alert(data.error);
       	return;
    }

    alert("Order sent");
}

// ===============================
// Funcion de consulta de ordenes
// ===============================
async function orderGet(pair, status, limit) {

    let url = API + "/exchange/order?pair=" + pair;

    if (status !== null && status !== undefined) {
        url += "&status=" + status;
    }

    if (limit) {
        url += "&limit=" + limit;
    }

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return null;
    }

    return data.result;
}

// ===============================
// Funcion de cancelación de orden
// ===============================
async function orderCancel(orderId) {
    const res = await fetch(API + "/exchange/order/" + orderId, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    });

    const data = await res.json();
    if (data.error) {
      	alert(data.error);
       	return;
    }
}

// ====================================
// Funcion de consulta de mis trades
// ====================================
async function myTrades(pair) {

    try {

        const res = await fetch(
            API + "/exchange/trade?pair=" + pair + "&limit=50",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await res.json();

        const container = document.getElementById("my-trades-container");

        container.innerHTML = "";

        if (!data.result || data.result.length === 0) {

            const emptyRow = document.createElement("div");

            emptyRow.className = "mytrade-row";

            emptyRow.innerHTML = `
                <div class="empty-trades">
                    There is no data.
                </div>
            `;

            container.appendChild(emptyRow);

            return;
        }

        data.result.forEach((item) => {

            const row = document.createElement("div");

            row.className = "mytrade-row";

            row.innerHTML = `
                <div class="${item.side === 'buy' ? 'positive' : 'negative'}">
                    ${Number(item.price).toFixed(8)}
                </div>

                <div>
                    ${Number(item.amount).toFixed(8)}
                </div>

                <div>
                    ${new Date(item.created_at).toLocaleString()}
                </div>
            `;

            container.appendChild(row);

        });

    } catch (err) {

        console.error("Error retrieving trades:", err);

    }
}

// ====================================
// Funcion de consulta de velas
// ====================================
async function loadChart(pair, timeframe) {
    try {
        const res = await fetch(
            API + "/exchange/market/candles?pair=" + pair + "&timeframe=" + timeframe
        );

        const data = await res.json();

        // Formato unificado con volumen — chart.js calcula los indicadores internamente
        const candles = data.map(c => ({
            time:   Number(c.open_time),
            open:   Number(c.open_price),
            high:   Number(c.high_price),
            low:    Number(c.low_price),
            close:  Number(c.close_price),
            volume: Number(c.volume)
        }));

        if (typeof window.setChartData === "function") {
            window.setChartData(candles);
        }

    } catch (err) {
        console.error("Error loading chart:", err);
    }
}

// ====================================
// Funcion de actualización de last price
// ====================================
async function updateLastPrice(pair) {

  const res = await fetch(API + "/exchange/market/ticker?pair=" + pair);
  const data = await res.json();

  const price = Number(data.result.last_price);

  if (!price) return;

  if (typeof window.updateLastCandle === "function") {
    window.updateLastCandle({
      time: Math.floor(Date.now() / 1000),
      open: price,
      high: price,
      low: price,
      close: price,
      volume: 0
    });
  }
}

// ====================================
// Funcion de libro de órdenes publico.
// ====================================
async function orderbook(pair) {

    try {

        const res = await fetch(
            API + "/exchange/market/orderbook?pair=" + pair,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        const data = await res.json();

        const askContainer = document.getElementById("orderbook-ask-container");
        const bidContainer = document.getElementById("orderbook-bid-container");

        // ASK

        askContainer.innerHTML = "";

        if (!data.asks || data.asks.length === 0) {

            askContainer.innerHTML = `
                <div class="orderbook-row empty-orderbook">
                    <div class="text-center">There are no asks</div>
                </div>
            `;

        } else {

            [...data.asks].reverse().forEach(item => {

                const row = document.createElement("div");

                row.className = "orderbook-row ask-row";

                row.innerHTML = `
                    <div>${item[0]}</div>
                    <div>${item[1]}</div>
                `;

                askContainer.appendChild(row);

                askContainer.scrollTop = askContainer.scrollHeight;

            });

        }

        // BID

        bidContainer.innerHTML = "";

        if (!data.bids || data.bids.length === 0) {

            bidContainer.innerHTML = `
                <div class="orderbook-row empty-orderbook">
                    <div class="text-center">There are no bids</div>
                </div>
            `;

        } else {

            data.bids.forEach(item => {

                const row = document.createElement("div");

                row.className = "orderbook-row bid-row";

                row.innerHTML = `
                    <div>${item[0]}</div>
                    <div>${item[1]}</div>
                `;

                bidContainer.appendChild(row);

            });

        }

    } catch (err) {

        console.error("Error retrieving orderbook:", err);

    }
}

// ====================================
// Funcion de trades publicos.
// ====================================
async function trades(pair) {

    try {

        const res = await fetch(
            API + "/exchange/market/trades?pair=" + pair + "&limit=50",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        const data = await res.json();

        const container = document.getElementById("trades-container");

        container.innerHTML = "";

        if (!data.result || data.result.length === 0) {

            const emptyRow = document.createElement("div");

            emptyRow.className = "alltrade-row";

            emptyRow.innerHTML = `
                <div class="empty-trades">
                    There is no data.
                </div>
            `;

            container.appendChild(emptyRow);

            return;
        }

        data.result.forEach((item) => {

            const row = document.createElement("div");

            row.className = "alltrade-row";

            row.innerHTML = `
                <div class="${item.side === 'buy' ? 'positive' : 'negative'}">
                    ${Number(item.price).toFixed(8)}
                </div>

                <div>
                    ${Number(item.amount).toFixed(8)}
                </div>

                <div>
                    ${new Date(item.created_at).toLocaleString()}
                </div>
            `;

            container.appendChild(row);

        });

    } catch (err) {

        console.error("Error retrieving trades:", err);

    }
}

// ====================================
// Funcion de consulta de pares disponibles.
// ====================================
async function loadPairs() {
    try {
        const res = await fetch(API + "/exchange/market/tickers", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        const data = await res.json();
        return data.result;
    } catch (err) {
        console.error("Error retrieving pairs:", err);
    }
}

// ====================================
// Funcion de consulta un activos.
// ====================================
async function loadAsset(ticker) {
    try {
        const res = await fetch(API + "/exchange/asset/info?ticker=" + ticker, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error retrieving assets:", err);
    }
}

// ====================================
// Funcion de consulta de activos disponibles.
// ====================================
async function loadAssets() {
    try {
        const res = await fetch(API + "/exchange/asset/getlist", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        const data = await res.json();
        return data.assets;
    } catch (err) {
        console.error("Error retrieving assets:", err);
    }
}

// ====================================
// Funcion de consulta de balance del usuario.
// ====================================
async function loadUserBalance(ticker) {
    try {
        const res = await fetch(API + "/exchange/wallet/balance?asset=" + ticker, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ` + token
            }
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error retrieving user balances:", err);
    }
}

// ====================================
// Funcion de consulta de balances del usuario.
// ====================================
async function loadUserBalances() {
    try {
        const res = await fetch(API + "/exchange/wallet/balances", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ` + token
            }
        });
        const data = await res.json();
        return data.balances;
    } catch (err) {
        console.error("Error retrieving user balances:", err);
    }
}
