document.getElementById("addVehicleButton").addEventListener("click", async () => {
    const vehicleNo = document.getElementById("vehicleNo").value;
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const inDate = document.getElementById("inDate").value;
    const ownerName = document.getElementById("ownerName").value;
    const ownerMob1 = document.getElementById("ownerMob1").value;
    const ownerMob2 = document.getElementById("ownerMob2").value;

    if (!vehicleNo || !brand || !model || !inDate || !ownerName || !ownerMob1) {
        alert("Please fill all required fields.");
        return;
    }

    const vehicleData = { vehicleNo, brand, model, inDate, ownerName, ownerMob1, ownerMob2 };

    try {
        const response = await fetch("http://localhost:8081/api/vehicle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicleData)
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error adding vehicle:", error);
    }
});
