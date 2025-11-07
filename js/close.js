/*document.addEventListener("DOMContentLoaded", async () => {
    const cancelVehicleSelect = document.getElementById("cancelVehicleSelect");
    const cancelBookingButton = document.getElementById("cancelBookingButton");

    // Fetch booked vehicles and populate the dropdown
    try {
        const response = await fetch("http://localhost:8081/api/bookedVehicles");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const vehicles = await response.json();

        // Populate dropdown
        cancelVehicleSelect.innerHTML = '<option value="">Select Vehicle</option>';
        vehicles.forEach(vehicle => {
            const option = document.createElement("option");
            option.value = vehicle.vehicle_id;
            option.textContent = `${vehicle.vehicle_license_no} - ${vehicle.driver_name}`;
            cancelVehicleSelect.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error fetching booked vehicles:", error);
    }

    // Handle Cancel/Close booking
    cancelBookingButton.addEventListener("click", async () => {
        const vehicleId = cancelVehicleSelect.value;
        const selectedAction = document.querySelector("input[name='C']:checked")?.value;
        const closeDateTime = document.getElementById("closeDateTime").value;

        if (!vehicleId || !selectedAction) {
            alert("Please select a vehicle and an action.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/api/cancel/${vehicleId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: selectedAction, closeDateTime })
            });

            const result = await response.json();
            alert(result.message);
            location.reload(); // Refresh page to update dropdown
        } catch (error) {
            console.error("❌ Error canceling/closing booking:", error);
        }
    });
});*/
document.addEventListener("DOMContentLoaded", async () => {
    const cancelVehicleSelect = document.getElementById("cancelVehicleSelect");
    const cancelBookingButton = document.getElementById("cancelBookingButton");

    try {
        const response = await fetch("http://localhost:8081/api/bookedVehicles");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const vehicles = await response.json();
        console.log("🚗 Received booked vehicles:", vehicles); // Debugging log

        cancelVehicleSelect.innerHTML = '<option value="">Select Vehicle</option>'; // Default option

        vehicles.forEach(vehicle => {
            console.log(`📌 Adding to dropdown: vehicle_id=${vehicle.vehicle_id}, license=${vehicle.vehicle_license_no}`);

            const option = document.createElement("option");
            option.value = vehicle.vehicle_id; // Ensure this is being set correctly
            option.textContent = `${vehicle.vehicle_license_no} - ${vehicle.driver_name}`;
            cancelVehicleSelect.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Error fetching booked vehicles:", error);
    }

    // Handle Cancel/Close booking
    cancelBookingButton.addEventListener("click", async () => {
        const vehicleId = cancelVehicleSelect.value; // Get selected vehicle ID
        const selectedAction = document.querySelector("input[name='C']:checked")?.value;
        const closeDateTime = document.getElementById("closeDateTime").value;

        // ✅ Debugging logs
        console.log("🔹 Selected vehicle_id:", vehicleId);
        console.log("🔹 Selected action:", selectedAction);
        console.log("🔹 Close DateTime:", closeDateTime);

        if (!vehicleId || vehicleId === "" || isNaN(vehicleId)) {
            alert("⚠️ Please select a valid vehicle.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/api/cancel/${vehicleId}`, { // Ensure the URL is correct
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: selectedAction, closeDateTime })
            });

            const result = await response.json();
            alert(result.message);
            location.reload();
        } catch (error) {
            console.error("❌ Error canceling/closing booking:", error);
        }
    });
});
