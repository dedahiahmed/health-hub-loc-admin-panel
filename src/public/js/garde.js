// update-pharmacy.js

// Function to fetch all pharmacies and populate the dropdown
async function fetchPharmacies() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/health/pharmacies/all"
    );
    const data = await response.json();

    const selectPharmacies = document.getElementById("pharmacies");

    data.forEach((pharmacy) => {
      const option = document.createElement("option");
      option.value = pharmacy.id;
      option.textContent = pharmacy.name;
      selectPharmacies.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
  }
}

// Function to update pharmacy isOpenTonight status
async function updatePharmacyStatus() {
  const form = document.getElementById("pharmacyStatusForm");
  const formData = new FormData(form);
  const pharmacies = formData.getAll("pharmacies");
  const isOpenTonight = formData.get("isOpenTonight");

  const updateData = pharmacies.map((id) => ({
    id: parseInt(id),
    isOpenTonight: isOpenTonight === "true" ? true : false,
  }));

  try {
    const response = await fetch(
      "http://localhost:8080/api/health/pharmacies/isOpenTonight",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update pharmacy status");
    }

    alert("Pharmacy status updated successfully");
    window.location.href = "/pharmacy";
    // Optionally, handle any UI updates or redirects here
  } catch (error) {
    console.error("Error updating pharmacy status:", error);
    alert("Failed to update pharmacy status");
  }
}

// Fetch pharmacies when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchPharmacies();
});
