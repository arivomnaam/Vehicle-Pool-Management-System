const backendUrl = "http://localhost:8081"; // Backend URL

// **Show Signup Form**
function showSignup() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
}

// **Show Login Form**
function showLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

// **User Login**
async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
        document.getElementById("message").innerText = "Please fill in all fields.";
        return;
    }

    try {
        let response = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        let data = await response.json();
        document.getElementById("message").innerText = data.message;

        if (data.success) {
            localStorage.setItem("userToken", data.token); // Store token for authentication
            window.location.href = "/html/User_html/Home.html"; // Redirect to dashboard
        }
    } catch (error) {
        console.error("Login Error:", error);
        document.getElementById("message").innerText = "Login failed. Try again.";
    }
}

// **User Signup**
async function signup() {
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const mob_no1 = document.getElementById("mob_no1").value;
    const mob_no2 = document.getElementById("mob_no2").value;
    const emp_no = document.getElementById("signup-emp_no").value;
    const emp_name = document.getElementById("signup-name").value;
    const division = document.getElementById("signup-division").value;

    if (!username || !email || !password || !mob_no1|| !emp_no || !emp_name || !division) {
        document.getElementById("message").innerText = "Please fill in all fields.";
        return;
    }

    try {
        let response = await fetch(`${backendUrl}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password,mob_no1,mob_no2, emp_no, emp_name, division })
        });

        let data = await response.json();
        document.getElementById("message").innerText = data.message;

        if (data.success) {
            showLogin(); // Switch to login form after successful signup
        }
    } catch (error) {
        console.error("Signup Error:", error);
        document.getElementById("message").innerText = "Signup failed. Try again.";
    }
}

// **Admin Login**
async function adminLogin() {
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    if (!email || !password) {
        document.getElementById("admin-message").innerText = "Please fill in all fields.";
        return;
    }

    try {
        let response = await fetch(`${backendUrl}/api/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        let data = await response.json();
        document.getElementById("admin-message").innerText = data.message;

        if (data.success) {
            localStorage.setItem("adminToken", data.token); // Store token for authentication
            window.location.href = "../html/home.html"; // Redirect admin on successful login
        }
    } catch (error) {
        console.error("Admin Login Error:", error);
        document.getElementById("admin-message").innerText = "Admin login failed. Try again.";
    }
}

// **Fetch Available Vehicles**
/*async function fetchAvailableVehicles() {
    try {
        let response = await fetch(`${backendUrl}/api/vehicles/available`);
        let data = await response.json();

        let selectBox = document.getElementById("vehicleSelect");
        selectBox.innerHTML = "<option value=''>Select a vehicle</option>"; // Default option

        data.forEach(vehicle => {
            let option = document.createElement("option");
            option.value = vehicle.vehicle_register_no;
            option.textContent = vehicle.vehicle_register_no;
            selectBox.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
    }
}*/

// **Logout Function**
function logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    window.location.href = "../html/index.html"; // Redirect to login
}

// **Ensure Functions Are Accessible Globally**
window.signup = signup;
window.login = login;
window.adminLogin = adminLogin;
window.showSignup = showSignup;
window.showLogin = showLogin;
window.logout = logout;
window.fetchAvailableVehicles = fetchAvailableVehicles;
/*
// **Call fetchAvailableVehicles() When Page Loads**
document.addEventListener("DOMContentLoaded", function () {
    fetchAvailableVehicles();
});*/
