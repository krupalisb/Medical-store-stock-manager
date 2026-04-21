const BASE_URL = "http://127.0.0.1:5000/api";
let stockChartInstance = null;
let valueChartInstance = null;

async function loadDashboard() {

    const res = await fetch(`${BASE_URL}/dashboard-summary`);
    const result = await res.json();
    const data = result.data;

    document.getElementById("totalProducts").innerText = data.total_products;
    document.getElementById("lowStock").innerText = data.low_stock;
    document.getElementById("expiredItems").innerText = data.expired_items;
    document.getElementById("totalValue").innerText ="₹ " + Number(data.total_value).toLocaleString("en-IN");
    createCharts(data);
    loadPurchases(data.recent_purchases);
    loadTopSelling(data.top_selling);
    loadAlerts(data.low_stock_products, data.expired_products);
}

function createCharts(data) {

    if (stockChartInstance) stockChartInstance.destroy();
    if (valueChartInstance) valueChartInstance.destroy();

    stockChartInstance = new Chart(document.getElementById("stockChart"), {
        type: "doughnut",
        data: {
            labels: ["In Stock", "Low Stock", "Expired"],
            datasets: [{
                data: [
                    data.in_stock,
                    data.low_stock,
                    data.expired_items
                ],
                backgroundColor: [
                    "#10b981",
                    "#f59e0b",
                    "#ef4444"
                ]
            }]
        }
    });

    valueChartInstance = new Chart(document.getElementById("valueChart"), {
        type: "bar",
        data: {
            labels: ["Inventory Value"],
            datasets: [{
                label: "Total Value",
                data: [data.total_value],
                backgroundColor: "#10b981"
            }]
        }
    });
}

    
function loadPurchases(purchases) {

    const table = document.getElementById("purchaseTable");
    table.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
        </tr>
    `;

    purchases.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.product_name}</td>
                <td>${p.quantity}</td>
                <td>₹ ${Number(p.total_amount).toLocaleString("en-IN")}</td>
            </tr>
        `;
    });
}

function loadTopSelling(products) {

    const table = document.getElementById("topSellingTable");
    table.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Sold</th>
        </tr>
    `;

    products.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.product_name}</td>
                <td>${p.stock}</td>
                <td>${p.quantity_sold}</td>
            </tr>
        `;
    });
}

function loadAlerts(lowStock, expired) {

    const stockDiv = document.getElementById("stockAlerts");
    const expiryDiv = document.getElementById("expiryAlerts");

    stockDiv.innerHTML = "";
    expiryDiv.innerHTML = "";

    if (lowStock.length === 0) {
        stockDiv.innerHTML = "<p style='color:green'>✅ All medicines sufficiently stocked</p>";
    } else {
        lowStock.forEach(p => {
            stockDiv.innerHTML += `<p>⚠ ${p.product_name} (Qty: ${p.quantity})</p>`;
        });
    }

    if (expired.length === 0) {
        expiryDiv.innerHTML = "<p style='color:green'>✅ No expired medicines</p>";
    } else {
        expired.forEach(p => {
            expiryDiv.innerHTML += `<p>❌ ${p.product_name} (Expired)</p>`;
        });
    }
}

loadDashboard();