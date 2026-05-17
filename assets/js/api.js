// =======================
// Configuración de API
// =======================
const API = "http://192.168.1.45:3001/api";
var token = localStorage.getItem("token") || null;
let gameSessionId = null;

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
    location.href = "./";
}

// =======================
// Funcion de envío de orden
// =======================
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

// =======================
// Funcion de libro de órdenes.
// =======================
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
        tbodyask.innerHTML = "";

        
        if (!data.asks || data.asks.length === 0) {

            tbodyask.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center">
                        There is no data.
                    </td>
                </tr>
            `;

            return;
        }

        data.asks.reverse().forEach((item) => {

            const tr = document.createElement("tr");

            // Precio
            const tdPrice = document.createElement("td");
            tdPrice.textContent = item[0];
            tr.appendChild(tdPrice);

            // Cantidad
            const tdAmount = document.createElement("td");
            tdAmount.textContent = item[1];
            tr.appendChild(tdAmount);

            tbodyask.appendChild(tr);

        });

        const tbodybid = document.getElementById("orderbook-bid-table-body");
        tbodybid.innerHTML = "";

        if (!data.bids || data.bids.length === 0) {
            tbodybid.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center">
                        There is no data.
                    </td>
                </tr>
            `;
            return;
        }
        data.bids.forEach((item) => {

            const tr = document.createElement("tr");
            // Precio
            const tdPrice = document.createElement("td");
            tdPrice.textContent = item[0];
            tr.appendChild(tdPrice);
            // Cantidad
            const tdAmount = document.createElement("td");
            tdAmount.textContent = item[1];
            tr.appendChild(tdAmount);
            tbodybid.appendChild(tr);

        });
    } catch (err) {
        console.error("Error retrieving orderbook:", err);
    }
}

// =======================
// Funcion de trades
// =======================
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
