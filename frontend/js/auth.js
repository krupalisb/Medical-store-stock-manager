const BASE_URL = "http://127.0.0.1:5000/api";

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        localStorage.setItem("user", JSON.stringify(result.data));
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("error").innerText = result.message;
    }
}