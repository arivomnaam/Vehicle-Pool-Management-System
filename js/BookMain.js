/*document.addEventListener("DOMContentLoaded", () => {
    const vehicleSelect = document.getElementById("vehicleSelect");
    const driverName = document.getElementById("driver_name");
    const driverMobile = document.getElementById("driver_mobile_no");
    const driverMobile2 = document.getElementById("driver_mobile_no2");
    const bookButton = document.getElementById("bookButton");

    // Fetch available vehicles
    fetch("http://localhost:8081/api/vehicles")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(vehicles => {
        const vehicleSelect = document.getElementById("vehicleSelect");
        vehicleSelect.innerHTML = '<option value="">Select Vehicle</option>';

        vehicles.forEach(vehicle => {
            const option = document.createElement("option");
            option.value = vehicle.vehicle_id;
            option.textContent = vehicle.vehicle_license_no;
            option.dataset.driverId = vehicle.driver_id;
            vehicleSelect.appendChild(option);
        });
    })
    .catch(error => console.error("Error fetching vehicles:", error));


    // Fetch driver details when vehicle is selected
    vehicleSelect.addEventListener("change", async (event) => {
        const vehicleId = event.target.value;
        if (!vehicleId) {
            driverName.textContent = "-";
            driverMobile.textContent = "-";
            driverMobile2.textContent = "-";
            return;
        }
        try {
            const response = await fetch(`/api/drivers/${vehicleId}`);
            const driver = await response.json();
            driverName.textContent = driver.name || "-";
            driverMobile.textContent = driver.mobile_no || "-";
            driverMobile2.textContent = driver.mobile_no2 || "-";
        } catch (error) {
            console.error("Error fetching driver details:", error);
        }
    });

    // Book Vehicle
    bookButton.addEventListener("click", async () => {
        const vehicleId = vehicleSelect.value;
        const startDatetime = document.getElementById("start_datetime").value;
        const startLocation = document.getElementById("start_location").value;
        const endLocation = document.getElementById("end_location").value;

        if (!vehicleId || !startDatetime || !startLocation || !endLocation) {
            alert("Please fill all fields");
            return;
        }

        const bookingData = {
            vehicle_id: vehicleId,
            username: "Deva",  // Replace with real username from session
            user_mobile_no: "9360325198", // Replace with real user number
            dateandtime: startDatetime,
            arriving: startLocation,
            destination: endLocation
        };

        try {
            const response = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData)
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error booking vehicle:", error);
        }
    });
});*/
document.addEventListener("DOMContentLoaded", () => {
    const vehicleSelect = document.getElementById("vehicleSelect");
    const driverName = document.getElementById("driver_name");
    const driverMobile = document.getElementById("driver_mobile_no");
    const driverMobile2 = document.getElementById("driver_mobile_no2");
    const bookButton = document.getElementById("bookButton");

    // ✅ Fetch available vehicles for booking
    fetch("http://localhost:8081/api/vehicles")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(vehicles => {
        vehicleSelect.innerHTML = '<option value="">Select Vehicle</option>';
        vehicles.forEach(vehicle => {
            const option = document.createElement("option");
            option.value = vehicle.vehicle_id;
            option.textContent = `${vehicle.vehicle_license_no} - ${vehicle.vehicle_brand}`;
            option.dataset.driverId = vehicle.driver_id;
            vehicleSelect.appendChild(option);
        });
    })
    .catch(error => console.error("❌ Error fetching vehicles:", error));

    // ✅ Fetch driver details when vehicle is selected
    vehicleSelect.addEventListener("change", async (event) => {
        const vehicleId = event.target.value;
        if (!vehicleId) {
            driverName.textContent = "-";
            driverMobile.textContent = "-";
            driverMobile2.textContent = "-";
            return;
        }
        try {
            const response = await fetch(`http://localhost:8081/api/drivers/${vehicleId}`);
            const driver = await response.json();
            driverName.textContent = driver.name || "-";
            driverMobile.textContent = driver.mobile_no || "-";
            driverMobile2.textContent = driver.mobile_no2 || "-";
        } catch (error) {
            console.error("❌ Error fetching driver details:", error);
        }
    });

    // ✅ Book Vehicle
    bookButton.addEventListener("click", async () => {
        const vehicleId = vehicleSelect.value;
        const startDatetime = document.getElementById("start_datetime").value;
        const startLocation = document.getElementById("start_location").value;
        const endLocation = document.getElementById("end_location").value;

        if (!vehicleId || !startDatetime || !startLocation || !endLocation) {
            alert("Please fill all fields");
            return;
        }

        const bookingData = {
            vehicle_id: vehicleId,
            username: "Deva",  // Replace with real username from session
            user_mobile_no: "9360325198", // Replace with real user number
            dateandtime: startDatetime,
            arriving: startLocation,
            destination: endLocation
        };

        try {
            const response = await fetch("http://localhost:8081/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData)
            });
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("❌ Error booking vehicle:", error);
        }
    });
});
