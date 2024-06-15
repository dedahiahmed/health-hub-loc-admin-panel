document.addEventListener("DOMContentLoaded", () => {
  const cabinetForm = document.querySelector("form");
  const submitButton = cabinetForm.querySelector('button[type="button"]');
  const nomInput = cabinetForm.querySelector('input[name="nom"]');
  const willayaInput = cabinetForm.querySelector('select[name="willaya"]');
  const moughataaInput = cabinetForm.querySelector('select[name="moughataa"]');
  const latitudeInput = cabinetForm.querySelector('input[name="latitude"]');
  const longitudeInput = cabinetForm.querySelector('input[name="longitude"]');

  submitButton.addEventListener("click", async () => {
    const nom = nomInput.value;
    const willaya = willayaInput.value;
    const moughataa = moughataaInput.value;
    const latitude = parseFloat(latitudeInput.value);
    const longitude = parseFloat(longitudeInput.value);

    if (!nom || !moughataa || isNaN(latitude) || isNaN(longitude) || !willaya) {
      alert("Please enter the full required data");
      return;
    }

    const payload = {
      nom: nom,
      willaya: willaya,
      moughataa: moughataa,
      longitude: longitude,
      latitude: latitude,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/health/cabinets",
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
        alert("cabinet add succefuly");
        window.location.href = "/cabinet";
      } else {
        const errorData = await response.json();
        console.error("Cabinet creation failed:", errorData);
        let errorMessage = "Cabinet creation failed: ";

        // Check for different error properties and construct the error message
        if (errorData.message) {
          errorMessage += errorData.message;
        } else if (errorData.nom) {
          errorMessage += errorData.nom;
        } else if (errorData.longitude) {
          errorMessage += errorData.longitude;
        } else if (errorData.latitude) {
          errorMessage += errorData.latitude;
        } else if (errorData.willaya) {
          errorMessage += errorData.willaya;
        } else if (errorData.moughataa) {
          errorMessage += errorData.moughataa;
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
