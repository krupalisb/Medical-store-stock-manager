const BASE_URL = "http://127.0.0.1:5000/api";

async function loadProducts() {
    const res = await fetch(`${BASE_URL}/products`);
    const result = await res.json();

    let table = document.getElementById("productTable");

    table.innerHTML = `
        <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Expiry Date</th>
        </tr>
    `;

    result.data.forEach(p => {

        const formattedDate = p.expiry_date
            ? new Date(p.expiry_date).toLocaleDateString("en-IN")
            : "-";

        table.innerHTML += `
            <tr>
                <td>${p.product_name}</td>
                <td>${p.quantity}</td>
                <td>${formattedDate}</td>
            </tr>
        `;
    });
}

async function addProduct() {

    const product_name = document.getElementById("name").value.trim();
    const quantity = document.getElementById("quantity").value;
    const expiry_date = document.getElementById("expiry").value;

    if (!product_name || !quantity || !expiry_date) {
        alert("Please fill all fields");
        return;
    }

    await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            product_name: product_name,
            quantity: parseInt(quantity),
            expiry_date: expiry_date
        })
    });

    document.getElementById("name").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("expiry").value = "";

    loadProducts();
}

function filterProducts() {

    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const filterValue = document.getElementById("stockFilter").value;

    const rows = document.querySelectorAll("#productTable tr");

    rows.forEach((row, index) => {

        if (index === 0) return;

        const name = row.cells[0].innerText.toLowerCase();
        const quantity = parseInt(row.cells[1].innerText);

        let matchSearch = name.includes(searchValue);
        let matchFilter = true;

        if (filterValue === "in") {
            matchFilter = quantity > 10;
        }
        else if (filterValue === "low") {
            matchFilter = quantity > 0 && quantity <= 10;
        }
        else if (filterValue === "out") {
            matchFilter = quantity === 0;
        }

        row.style.display = (matchSearch && matchFilter) ? "" : "none";
    });
}

loadProducts();