document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const loginButton = loginForm.querySelector('button[type="button"]');
  const nameInput = loginForm.querySelector('input[name="name"]');
  const willayaInput = loginForm.querySelector('select[name="willaya"]');
  const moughataaInput = loginForm.querySelector('select[name="moughataa"]');
  const latitudeInput = loginForm.querySelector('input[name="latitude"]');
  const longitudeInput = loginForm.querySelector('input[name="longitude"]');
  const isOpenTonightInput = loginForm.querySelector(
    'select[name="isOpenTonight"]'
  );

  loginButton.addEventListener("click", async () => {
    const name = nameInput.value;
    const willaya = willayaInput.value;
    const moughataa = moughataaInput.value;
    const latitude = parseFloat(latitudeInput.value);
    const longitude = parseFloat(longitudeInput.value);
    const isOpenTonight = isOpenTonightInput.value === "true" ? true : false;

    if (
      !name ||
      !moughataa ||
      isNaN(latitude) ||
      isNaN(longitude) ||
      !willaya
    ) {
      alert("Please enter the full required data");
      return;
    }

    const payload = {
      name: name,
      willaya: willaya,
      moughataa: moughataa,
      longitude: longitude,
      latitude: latitude,
      isOpenTonight: isOpenTonight,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/health/pharmacies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.text();
        alert("pharmacy added succefuly");
        window.location.href = "/pharmacy";
      } else {
        const errorData = await response.json();
        console.error("Pharmacy creation failed:", errorData);
        let errorMessage = "Pharmacy creation failed: ";

        // Check for different error properties and construct the error message
        if (errorData.message) {
          errorMessage += errorData.message;
        } else if (errorData.name) {
          errorMessage += errorData.name;
        } else if (errorData.longitude) {
          errorMessage += errorData.longitude;
        } else if (errorData.latitude) {
          errorMessage += errorData.latitude;
        } else if (errorData.willaya) {
          errorMessage += errorData.willaya;
        } else if (errorData.moughataa) {
          errorMessage += errorData.moughataa;
        } else if (errorData.img) {
          errorMessage += errorData.img;
        } else if (errorData.isOpenTonight) {
          errorMessage += errorData.isOpenTonight;
        } else {
          errorMessage += "Unknown error";
        }

        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred: " + error.message);
    }
  });
});
