const BASE_URL = "http://127.0.0.1:5000/api";

async function loadSuppliers() {

    const res = await fetch(`${BASE_URL}/suppliers`);
    const result = await res.json();

    const table = document.getElementById("supplierTable");

    table.innerHTML = `
        <tr>
            <th>Supplier Name</th>
            <th>Contact</th>
            <th>Email</th>
        </tr>
    `;

    result.data.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>${s.supplier_name || "-"}</td>
                <td>${s.phone || "-"}</td>
                <td>${s.email || "-"}</td>
            </tr>
        `;
    });
}

async function addSupplier() {

    const name = document.getElementById("supplierName").value;
    const phone = document.getElementById("contact").value;
    const email = document.getElementById("email").value;

    if (!name || !phone || !email) {
        alert("Please fill all fields");
        return;
    }

    await fetch(`${BASE_URL}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            supplier_name: name,
            phone: phone,
            email: email
        })
    });

    document.getElementById("supplierName").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("email").value = "";

    loadSuppliers();
}

function filterSuppliers() {

    const searchInput = document.getElementById("supplierSearch");
    if (!searchInput) return;

    const searchValue = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#supplierTable tr");

    rows.forEach((row, index) => {

        if (index === 0) return;

        const supplierName = row.cells[0].innerText.toLowerCase();

        row.style.display = supplierName.includes(searchValue) ? "" : "none";

    });
}

loadSuppliers();