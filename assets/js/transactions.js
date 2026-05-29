async function renderTransactions(){

    /* LOAD ASSETS */

    const assetSelect = document.getElementById(
        "transaction-asset"
    );

    let assets = [];

    if(assetSelect.options.length <= 1){

        assets = await loadAssets();

        assets.forEach(asset => {

            const option = document.createElement(
                "option"
            );

            option.value = asset.ticker;

            option.textContent = `
                ${asset.ticker} - ${asset.name}
            `;

            assetSelect.appendChild(option);
        });

    } else {

        assets = await loadAssets();
    }

    /* ASSETS MAP */

    const assetsMap = {};

    assets.forEach(asset => {

        assetsMap[asset.ticker] = asset;
    });

    /* LOAD TYPES */

    const typeSelect = document.getElementById(
        "transaction-type"
    );

    if(typeSelect.options.length <= 1){

        const TRANSACTION_TYPES = [

            "deposit",
            "withdraw",
            "trade_in",
            "trade_out",
            "fee"

        ];

        TRANSACTION_TYPES.forEach(type => {

            const option = document.createElement(
                "option"
            );

            option.value = type;

            option.textContent = type
                .replaceAll("_", " ")
                .replace(/\b\w/g, l => l.toUpperCase());

            typeSelect.appendChild(option);
        });
    }

    /* FILTERS */

    const ticker = assetSelect.value;

    const type = typeSelect.value;

    const limit = document.getElementById(
        "transaction-limit"
    ).value;

    /* API */

    const data = await transactions(
        ticker || null,
        type || null,
        limit
    );

    const txs = data.result || data;

    /* CONTAINER */

    const container = document.getElementById(
        "transactions-container"
    );

    container.innerHTML = "";

    /* RENDER */

    txs.forEach(tx => {

        const assetData = assetsMap[
            tx.asset_ticker
        ];

        const positive = [

            "deposit",
            "trade_in"

        ].includes(tx.type);

        const card = document.createElement("div");

        card.className = "transaction-card";

        card.innerHTML = `

            <div class="transaction-header">

                <div>

                    <div class="transaction-ticker">
                        ${tx.asset_ticker}
                    </div>

                    <div class="transaction-type">
                        ${tx.type
                            .replaceAll("_", " ")
                            .replace(/\b\w/g, l => l.toUpperCase())
                        }
                    </div>

                </div>

                <div class="
                    transaction-amount
                    ${positive ? 'positive' : 'negative'}
                ">

                    ${positive ? '+' : '-'}

                    ${parseFloat(tx.amount).toFixed(8)}

                </div>

            </div>

            <div class="transaction-date">

                ${new Date(tx.created_at)
                    .toLocaleString()
                }

            </div>

            ${
                (
                    tx.type === "deposit" ||
                    tx.type === "withdraw"
                ) &&
                tx.reference_id
                ? `
                    <div class="transaction-reference">

                        <div>

                            <div class="transaction-reference-label">
                                Transaction Hash
                            </div>

                            <div class="transaction-reference-hash">

                                ${
                                    assetData?.explorer_tx_url
                                    ? `
                                        <a
                                            href="${assetData.explorer_tx_url}${tx.reference_id}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            ${tx.reference_id}
                                        </a>
                                    `
                                    : tx.reference_id
                                }

                            </div>

                        </div>

                        <button
                            class="transaction-reference-copy"
                            onclick="navigator.clipboard.writeText('${tx.reference_id}')"
                        >
                            Copy
                        </button>

                    </div>
                `
                : ""
            }

        `;

        container.appendChild(card);
    });
}

/* EVENTS */

document
    .getElementById("transaction-asset")
    .addEventListener("change", renderTransactions);

document
    .getElementById("transaction-type")
    .addEventListener("change", renderTransactions);

document
    .getElementById("transaction-limit")
    .addEventListener("change", renderTransactions);

/* INIT */

renderTransactions();
outSession()
setInterval(() => {
    outSession()
    renderTransactions();
}, 5000);
