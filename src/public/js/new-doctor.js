document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch cabinets data from backend
    const response = await fetch("http://localhost:8080/api/health/cabinets");
    if (response.ok) {
      const cabinets = await response.json();
      const cabinetSelect = document.querySelector(
        'select[name="cabinet[id]"]'
      );

      // Populate select options with cabinet data
      cabinets.forEach((cabinet) => {
        const option = document.createElement("option");
        option.value = cabinet.id; // Value is the cabinet ID
        option.textContent = cabinet.nom; // Display text is the cabinet name
        cabinetSelect.appendChild(option);
      });
    } else {
      console.error("Failed to fetch cabinets:", response.status);
    }
  } catch (error) {
    console.error("Error fetching cabinets:", error);
    alert("An error occurred while fetching cabinets.");
  }

  // Form submission handling
  const doctorForm = document.querySelector("form");
  const createButton = doctorForm.querySelector('button[type="submit"]');
  const nameInput = doctorForm.querySelector('input[name="name"]');
  const specialityInput = doctorForm.querySelector('select[name="speciality"]');
  const scheduleInputs = {
    Monday: doctorForm.querySelector('input[name="schedule[Monday]"]'),
    Tuesday: doctorForm.querySelector('input[name="schedule[Tuesday]"]'),
    Wednesday: doctorForm.querySelector('input[name="schedule[Wednesday]"]'),
    Thursday: doctorForm.querySelector('input[name="schedule[Thursday]"]'),
    Friday: doctorForm.querySelector('input[name="schedule[Friday]"]'),
    Saturday: doctorForm.querySelector('input[name="schedule[Saturday]"]'),
    Sunday: doctorForm.querySelector('input[name="schedule[Sunday]"]'),
  };
  const cabinetSelect = doctorForm.querySelector('select[name="cabinet[id]"]');

  createButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Retrieve input values
    const name = nameInput.value;
    const speciality = specialityInput.value;
    const schedule = {};
    Object.keys(scheduleInputs).forEach((day) => {
      schedule[day] = scheduleInputs[day].value;
    });
    const cabinetId = cabinetSelect.value;

    // Validate inputs
    if (!name || !speciality || !cabinetId) {
      alert("Please enter all required data.");
      return;
    }

    const payload = {
      name: name,
      speciality: speciality,
      schedule: schedule,
      cabinet: {
        // Send cabinet as an object with id
        id: parseInt(cabinetId), // Ensure cabinetId is parsed as integer
      },
    };

    try {
      const response = await fetch("http://localhost:8080/api/health/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.text();
        alert(data);
        window.location.href = "/doctor"; // Redirect to doctors page
      } else {
        const errorData = await response.json();
        console.error("Doctor creation failed:", errorData);
        let errorMessage = "Doctor creation failed: ";

        // Construct error message based on response data
        if (errorData.message) {
          errorMessage += errorData.message;
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
