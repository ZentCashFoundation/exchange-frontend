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

    //alert("Order canceled");
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

        const tbody = document.getElementById("my-trades-table-body");

        tbody.innerHTML = "";

        if (!data.result || data.result.length === 0) {

            const tr = document.createElement("tr");

            const td = document.createElement("td");

            td.colSpan = 3;
            td.textContent = "There is no data.";
            td.style.textAlign = "center";

            tr.appendChild(td);

            tbody.appendChild(tr);

            return;
        }

        data.result.forEach((item) => {

            const tr = document.createElement("tr");

            const tdPrice = document.createElement("td");
            tdPrice.textContent = item.price;

            tr.appendChild(tdPrice);

            const tdQuantity = document.createElement("td");
            tdQuantity.textContent = item.amount;

            tr.appendChild(tdQuantity);

            const tdTime = document.createElement("td");
            tdTime.textContent = new Date(item.created_at).toLocaleString();

            tr.appendChild(tdTime);

            tbody.appendChild(tr);
        });

    } catch (err) {

        console.error("Error retrieving trades:", err);

    } 
}

// ====================================
// Funcion de consulta de velas
// ====================================
async function loadChart(pair, timeframe) {
  const res =
    await fetch(
      API + "/exchange/market/candles?pair=" + pair + "&timeframe=" + timeframe
    );

  const data = await res.json();

  const candles = data.map(c => ({
    time: Number(c.open_time),
    open: Number(c.open_price),
    high: Number(c.high_price),
    low: Number(c.low_price),
    close: Number(c.close_price)
  }));

  const volumes = data.map(c => ({
    time: Number(c.open_time),
    value: Number(c.volume),
    color:
      Number(c.close_price) >= Number(c.open_price)
        ? "rgba(34,197,94,0.5)"
        : "rgba(239,68,68,0.5)"
  }));

  candleSeries.setData(candles);
  volumeSeries.setData(volumes);
}

// ====================================
// Funcion de actualización de last price
// ====================================
async function updateLastPrice(pair) {

  const res = await fetch(API + "/exchange/market/ticker?pair=" + pair);
  const data = await res.json();

  const price = Number(data.result.last_price);

  if (!price) return;

  lastPriceSeries.update({
    time: Math.floor(Date.now() / 1000),
    value: price
  });
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

        const tbodyask = document.getElementById("orderbook-ask-table-body");
        const tbodybid = document.getElementById("orderbook-bid-table-body");

        // ASK
        tbodyask.innerHTML = "";

        if (!data.asks || data.asks.length === 0) {
            tbodyask.innerHTML = `
                <tr>
                    <td colspan="2" style="text-align:center">
                        There are no asks
                    </td>
                </tr>
            `;
        } else {
            [...data.asks].reverse().forEach(item => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${item[0]}</td>
                    <td>${item[1]}</td>
                `;

                tbodyask.appendChild(tr);
            });
        }

        // BID
        tbodybid.innerHTML = "";

        if (!data.bids || data.bids.length === 0) {
            tbodybid.innerHTML = `
                <tr>
                    <td colspan="2" style="text-align:center">
                        There are no bids
                    </td>
                </tr>
            `;
        } else {
            data.bids.forEach(item => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${item[0]}</td>
                    <td>${item[1]}</td>
                `;

                tbodybid.appendChild(tr);
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

        const tbody = document.getElementById("trades-table-body");

        tbody.innerHTML = "";

        if (!data.result || data.result.length === 0) {

            const tr = document.createElement("tr");

            const td = document.createElement("td");

            td.colSpan = 3;
            td.textContent = "There is no data.";
            td.style.textAlign = "center";

            tr.appendChild(td);

            tbody.appendChild(tr);

            return;
        }

        data.result.forEach((item) => {

            const tr = document.createElement("tr");

            const tdPrice = document.createElement("td");
            tdPrice.textContent = item.price;

            tr.appendChild(tdPrice);

            const tdQuantity = document.createElement("td");
            tdQuantity.textContent = item.amount;

            tr.appendChild(tdQuantity);

            const tdTime = document.createElement("td");
            tdTime.textContent = new Date(item.created_at).toLocaleString();

            tr.appendChild(tdTime);

            tbody.appendChild(tr);
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
         console.log(data);
        return data.result;
    } catch (err) {
        console.error("Error retrieving pairs:", err);
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
        console.log(data);
        return data.assets;
    } catch (err) {
        console.error("Error retrieving assets:", err);
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
        console.log(data);
        return data.balances;
    } catch (err) {
        console.error("Error retrieving user balances:", err);
    }
}
