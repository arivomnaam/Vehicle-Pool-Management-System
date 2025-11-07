/*document.addEventListener("DOMContentLoaded", async () => {
    const bookedVehiclesTable = document.getElementById("booked-vehicles-body");

    try {
        const response = await fetch("/api/bookedVehicles");
        const vehicles = await response.json();
        bookedVehiclesTable.innerHTML = vehicles.map((vehicle, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${vehicle.vehicle_license_no}</td>
                <td>${vehicle.driver_name}</td>
                <td>${vehicle.dateandtime}</td>
                <td>${vehicle.user_mobile_no}</td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error fetching booked vehicles:", error);
    }
});*/
document.addEventListener("DOMContentLoaded", async () => {
    const bookedVehiclesTable = document.getElementById("booked-vehicles-body");

    try {
        const response = await fetch("http://localhost:8081/api/bookedVehicles"); // Ensure API URL is correct
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const vehicles = await response.json();

        // Populate the table with booked vehicles
        bookedVehiclesTable.innerHTML = vehicles.map((vehicle, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${vehicle.vehicle_license_no}</td>
                <td>${vehicle.driver_name}</td>
                <td>${vehicle.dateandtime}</td>
                <td>${vehicle.user_mobile_no}</td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("❌ Error fetching booked vehicles:", error);
        bookedVehiclesTable.innerHTML = `<tr><td colspan="5">Failed to load booked vehicles</td></tr>`;
    }
});
