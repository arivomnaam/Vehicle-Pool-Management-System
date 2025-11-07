document.addEventListener("DOMContentLoaded", () => {
    const updateButton = document.querySelector("button");

    updateButton.addEventListener("click", async () => {
        const mobile1 = document.querySelector("input:nth-of-type(1)").value;
        const mobile2 = document.querySelector("input:nth-of-type(2)").value;

        if (!mobile1) {
            alert("Mobile number 1 is required.");
            return;
        }

        const updateData = { mobile_no: mobile1, mobile_no2: mobile2 };

        try {
            const response = await fetch("/api/updateDriver", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error("Error updating mobile numbers:", error);
        }
    });
});
