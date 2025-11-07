/*document.addEventListener("DOMContentLoaded", async () => {
    const historyTable = document.getElementById("vehicles-history-body");

    try {
        const response = await fetch("/api/history");
        const history = await response.json();
        historyTable.innerHTML = history.map((record, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${record.vehicle_license_no}</td>
                <td>${record.driver_name}</td>
                <td>${record.dateandtime}</td>
                <td>${record.username}</td>
                <td>${record.user_mobile_no}</td>
                <td>${record.status}</td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error fetching history:", error);
    }
});*/
document.addEventListener("DOMContentLoaded", async () => {
    const historyTable = document.getElementById("vehicles-history-body");

    try {
        const response = await fetch("http://localhost:8081/api/history");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const history = await response.json();

        if (history.length === 0) {
            historyTable.innerHTML = `<tr><td colspan="7">No history available.</td></tr>`;
            return;
        }

        historyTable.innerHTML = history.map((record, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${record.vehicle_license_no}</td>
                <td>${record.driver_name}</td>
                <td>${new Date(record.dateandtime).toLocaleString()}</td>
                <td>${record.username}</td>
                <td>${record.user_mobile_no}</td>
                <td class="${record.status === 'booked' ? 'status-booked' : record.status === 'cancel' ? 'status-cancel' : 'status-closed'}">
                    ${record.status.toUpperCase()}
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("❌ Error fetching history:", error);
        historyTable.innerHTML = `<tr><td colspan="7">Error loading history.</td></tr>`;
    }
});

