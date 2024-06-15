document.addEventListener("DOMContentLoaded", () => {
  // Parse the query string parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get references to the input fields
  const nomInput = document.querySelector('input[name="nom"]');
  const willayaInput = document.querySelector('select[name="willaya"]');
  const moughataaInput = document.querySelector('select[name="moughataa"]');
  const latitudeInput = document.querySelector('input[name="latitude"]');
  const longitudeInput = document.querySelector('input[name="longitude"]');

  // Set the input values from the query parameters
  nomInput.value = urlParams.get("nom") || "";
  willayaInput.value = urlParams.get("willaya") || "";
  moughataaInput.value = urlParams.get("moughataa") || "";
  latitudeInput.value = urlParams.get("latitude") || "";
  longitudeInput.value = urlParams.get("longitude") || "";

  const updateButton = document.querySelector("#updateButton");
  updateButton.addEventListener("click", async () => {
    try {
      const cabinetId = urlParams.get("id");
      const response = await fetch(
        `http://localhost:8080/api/health/cabinets/${cabinetId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom: nomInput.value,
            willaya: willayaInput.value,
            moughataa: moughataaInput.value,
            latitude: parseFloat(latitudeInput.value),
            longitude: parseFloat(longitudeInput.value),
          }),
        }
      );

      if (response.ok) {
        alert("Cabinet updated successfully!");
        window.location.href = "/cabinet";
      } else {
        const errorData = await response.json();
        console.error("Failed to update cabinet:", errorData);
        alert(
          "Failed to update cabinet. Please try again. " + errorData.message
        );
      }
    } catch (error) {
      console.error("Error updating cabinet:", error);
      alert(
        "An error occurred while updating cabinet. Please try again later."
      );
    }
  });
});
