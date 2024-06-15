document.addEventListener("DOMContentLoaded", async () => {
  // Parse the query string parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get references to the input fields
  const nameInput = document.querySelector('input[name="name"]');
  const specialityInput = document.querySelector('select[name="speciality"]');
  const cabinetSelect = document.querySelector('select[name="cabinet[id]"]');
  const mondayInput = document.querySelector('input[name="schedule[Monday]"]');
  const tuesdayInput = document.querySelector(
    'input[name="schedule[Tuesday]"]'
  );
  const wednesdayInput = document.querySelector(
    'input[name="schedule[Wednesday]"]'
  );
  const thursdayInput = document.querySelector(
    'input[name="schedule[Thursday]"]'
  );
  const fridayInput = document.querySelector('input[name="schedule[Friday]"]');
  const saturdayInput = document.querySelector(
    'input[name="schedule[Saturday]"]'
  );
  const sundayInput = document.querySelector('input[name="schedule[Sunday]"]');
  const updateButton = document.querySelector("#updateButton"); // Get reference to the update button

  try {
    // Fetch doctor details using the doctorId from query parameters
    const doctorId = urlParams.get("id");
    if (!doctorId) {
      throw new Error("Doctor ID is missing in the query parameters.");
    }

    const response = await fetch(
      `http://localhost:8080/api/health/doctors/${doctorId}`
    );
    console.log(`Doctor details fetch response status: ${response.status}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch doctor details: ${errorText}`);
      throw new Error(`Failed to fetch doctor details: ${response.status}`);
    }

    const doctorData = await response.json();
    console.log("Doctor data:", doctorData);

    // Set values from doctorData to form inputs
    nameInput.value = doctorData.name || "";
    specialityInput.value = doctorData.speciality || "";
    mondayInput.value = doctorData.schedule["Monday"] || "";
    tuesdayInput.value = doctorData.schedule["Tuesday"] || "";
    wednesdayInput.value = doctorData.schedule["Wednesday"] || "";
    thursdayInput.value = doctorData.schedule["Thursday"] || "";
    fridayInput.value = doctorData.schedule["Friday"] || "";
    saturdayInput.value = doctorData.schedule["Saturday"] || "";
    sundayInput.value = doctorData.schedule["Sunday"] || "";

    // Fetch all cabinets from backend
    const cabinetsResponse = await fetch(
      `http://localhost:8080/api/health/cabinets`
    );
    console.log(`Cabinets fetch response status: ${cabinetsResponse.status}`);
    if (!cabinetsResponse.ok) {
      const errorText = await cabinetsResponse.text();
      console.error(`Failed to fetch cabinets: ${errorText}`);
      throw new Error(`Failed to fetch cabinets: ${cabinetsResponse.status}`);
    }

    const cabinetsData = await cabinetsResponse.json();
    console.log("Cabinets data:", cabinetsData);

    // Populate cabinet select with cabinetsData
    cabinetsData.forEach((cabinet) => {
      const option = document.createElement("option");
      option.value = cabinet.id;
      option.textContent = cabinet.nom; // Assuming "nom" is the cabinet name property
      cabinetSelect.appendChild(option);
    });

    // Preselect the cabinet based on doctorData
    cabinetSelect.value = doctorData.cabinet.id;

    // Add event listener to the update button
    updateButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent the default form submission behavior

      // Create the payload
      const payload = {
        name: nameInput.value,
        speciality: specialityInput.value,
        schedule: {
          Monday: mondayInput.value,
          Tuesday: tuesdayInput.value,
          Wednesday: wednesdayInput.value,
          Thursday: thursdayInput.value,
          Friday: fridayInput.value,
          Saturday: saturdayInput.value,
          Sunday: sundayInput.value,
        },
        cabinet: {
          id: parseInt(cabinetSelect.value), // Ensure cabinetId is parsed as integer
        },
      };

      try {
        const patchResponse = await fetch(
          `http://localhost:8080/api/health/doctors/${doctorId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        console.log(
          `Update doctor fetch response status: ${patchResponse.status}`
        );
        if (patchResponse.ok) {
          alert("Doctor updated successfully!");
          window.location.href = "/doctor"; // Redirect to doctor listing page
        } else {
          const errorData = await patchResponse.json();
          console.error("Failed to update doctor:", errorData);
          alert("Failed to update doctor. Please try again.");
        }
      } catch (error) {
        console.error("Error updating doctor:", error);
        alert(
          "An error occurred while updating doctor. Please try again later."
        );
      }
    });
  } catch (error) {
    console.error("Error fetching or populating doctor details:", error);
    alert(
      "An error occurred while fetching doctor details. Please try again later."
    );
  }
});
