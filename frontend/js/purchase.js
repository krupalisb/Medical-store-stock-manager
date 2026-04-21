const BASE_URL = "http://127.0.0.1:5000/api";

async function loadPurchases() {

    const res = await fetch(`${BASE_URL}/purchases`);
    const result = await res.json();

    const table = document.getElementById("purchaseTable");

    table.innerHTML = `
        <tr>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Amount</th>
        </tr>
    `;

    result.data.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.product_id}</td>
                <td>${p.quantity}</td>
                <td>₹ ${p.total_amount}</td>
            </tr>
        `;
    });
}

async function createPurchase() {

    const productInput = document.getElementById("productId");
    const quantityInput = document.getElementById("quantity");
    const amountInput = document.getElementById("totalAmount");

    if (!productInput || !quantityInput || !amountInput) {
        console.error("Input fields not found");
        return;
    }

    const product_id = productInput.value;
    const quantity = quantityInput.value;
    const total_amount = amountInput.value;

    if (!product_id || !quantity || !total_amount) {
        alert("Please fill all fields");
        return;
    }

    await fetch(`${BASE_URL}/purchase`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            product_id,
            quantity: parseInt(quantity),
            total_amount: parseFloat(total_amount)
        })
    });

    productInput.value = "";
    quantityInput.value = "";
    amountInput.value = "";

    loadPurchases();
}

function filterPurchases() {

    const searchInput = document.getElementById("purchaseSearch");
    if (!searchInput) return;

    const searchValue = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#purchaseTable tr");

    rows.forEach((row, index) => {

        if (index === 0) return;

        const productId = row.cells[0].innerText.toLowerCase();

        row.style.display = productId.includes(searchValue) ? "" : "none";

    });
}

loadPurchases();