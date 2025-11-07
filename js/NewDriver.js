/*document.addEventListener("DOMContentLoaded", async () => {
    const addDriverButton = document.getElementById("addDriverButton");
    const vehicleSelect = document.getElementById("availableVehicleSelect");

    // Fetch available vehicles and populate dropdown
    try {
        const response = await fetch("http://localhost:8081/api/vehicle"); // Ensure API exists
        const vehicles = await response.json();

        vehicles.forEach(vehicle => {
            const option = document.createElement("option");
            option.value = vehicle.vehicle_id;
            option.textContent = `${vehicle.vehicle_no} - ${vehicle.brand} ${vehicle.model}`;
            vehicleSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
    }

    addDriverButton.addEventListener("click", async () => {
        const driverName = document.getElementById("driverName").value;
        const driverMobile = document.getElementById("driverMobile").value;
        const driverMobile2 = document.getElementById("driverMobile2").value;
        const inDate = document.getElementById("inDate").value;
        const vehicleId = vehicleSelect.value; // Get selected vehicle_id

        if (!driverName || !driverMobile || !inDate) {
            alert("Please fill all required fields.");
            return;
        }

        const driverData = {
            name: driverName,
            mobile_no: driverMobile,
            mobile_no2: driverMobile2,
            in_date: inDate,
            vehicle_id: vehicleId
        };

        try {
            const response = await fetch("http://localhost:8081/api/drivers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(driverData)
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error adding driver:", error);
        }
    });
});*/

document.addEventListener("DOMContentLoaded", async () => {
    const addDriverButton = document.getElementById("addDriverButton");
    const vehicleSelect = document.getElementById("availableVehicleSelect");

    // Fetch available vehicles and populate dropdown
    try {
        const response = await fetch("http://localhost:8081/api/available-vehicles");
        const vehicles = await response.json();

        vehicles.forEach(vehicle => {
            const option = document.createElement("option");
            option.value = vehicle.vehicle_id;
            option.textContent = `${vehicle.vehicle_license_no} - ${vehicle.brand}`;
            vehicleSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
    }

    addDriverButton.addEventListener("click", async () => {
        const driverName = document.getElementById("driverName").value;
        const driverMobile = document.getElementById("driverMobile").value;
        const driverMobile2 = document.getElementById("driverMobile2").value;
        const inDate = document.getElementById("inDate").value;
        const vehicleId = vehicleSelect.value;

        if (!driverName || !driverMobile || !inDate || !vehicleId) {
            alert("Please fill all required fields.");
            return;
        }

        const driverData = { name: driverName, mobile_no: driverMobile, mobile_no2: driverMobile2, in_date: inDate, vehicle_id: vehicleId };

        try {
            const response = await fetch("http://localhost:8081/api/drivers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(driverData)
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error adding driver:", error);
        }
    });
});
