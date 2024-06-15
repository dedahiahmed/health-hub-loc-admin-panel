document.addEventListener("DOMContentLoaded", () => {
  // Parse the query string parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get references to the input fields
  const nameInput = document.querySelector('input[name="name"]');
  const willayaInput = document.querySelector('select[name="willaya"]');
  const moughataaInput = document.querySelector('select[name="moughataa"]');
  const latitudeInput = document.querySelector('input[name="latitude"]');
  const longitudeInput = document.querySelector('input[name="longitude"]');
  const isOpenTonightSelect = document.querySelector(
    'select[name="isOpenTonight"]'
  );

  // Set the input values from the query parameters
  nameInput.value = urlParams.get("name") || "";
  willayaInput.value = urlParams.get("willaya") || "";
  moughataaInput.value = urlParams.get("moughataa") || "";
  latitudeInput.value = urlParams.get("latitude") || "";
  longitudeInput.value = urlParams.get("longitude") || "";
  isOpenTonightSelect.value = urlParams.get("openTonight") || "";

  // Add event listener to the update button
  const updateButton = document.querySelector("#updateButton");
  updateButton.addEventListener("click", async () => {
    try {
      const pharmacyId = urlParams.get("id");
      const isOpenTonight = isOpenTonightSelect.value === "true" ? true : false;
      const response = await fetch(
        `http://localhost:8080/api/health/pharmacies/${pharmacyId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nameInput.value,
            willaya: willayaInput.value,
            moughataa: moughataaInput.value,
            latitude: parseFloat(latitudeInput.value),
            longitude: parseFloat(longitudeInput.value),
            isOpenTonight: isOpenTonight,
          }),
        }
      );
      if (response.ok) {
        alert("Pharmacy updated successfully!");
        window.location.href = "/pharmacy";
      } else {
        const errorData = await response.json();
        console.error("Failed to update pharmacy:", errorData);
        alert(
          "Failed to update pharmacy. Please try again.",
          errorData.message
        );
      }
    } catch (error) {
      console.error("Error updating pharmacy:", error);
      alert(
        "An error occurred while updating pharmacy. Please try again later."
      );
    }
  });
});
