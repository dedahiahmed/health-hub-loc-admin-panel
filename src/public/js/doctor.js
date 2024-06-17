document.addEventListener("DOMContentLoaded", async () => {
  const translateDay = {
    Monday: "Lundi",
    Tuesday: "Mardi",
    Wednesday: "Mercredi",
    Thursday: "Jeudi",
    Friday: "Vendredi",
    Saturday: "Samedi",
    Sunday: "Dimanche",
  };

  try {
    const response = await fetch("http://localhost:8080/api/health/doctors");
    if (response.ok) {
      const doctors = await response.json();
      const doctorContainer = document.getElementById("doctorContainer");
      const itemsPerPage = 3;
      let currentPage = 1;

      // Fetch cabinet details for each doctor
      const fetchCabinetDetails = async (cabinetId) => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/health/cabinets/${cabinetId}`
          );
          if (response.ok) {
            return await response.json();
          } else {
            console.error("Failed to fetch cabinet details:", response.status);
            return null;
          }
        } catch (error) {
          console.error("Error fetching cabinet details:", error);
          return null;
        }
      };

      const displayDoctors = async (page) => {
        doctorContainer.innerHTML = "";
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedDoctors = doctors.slice(startIndex, endIndex);

        for (const doctor of displayedDoctors) {
          const cabinet = await fetchCabinetDetails(doctor.cabinet.id);
          const cabinetName = cabinet ? cabinet.nom : "Unknown Cabinet";

          const scheduleHtml = Object.entries(doctor.schedule)
            .map(([day, time]) => {
              return `<p>${translateDay[day]}: ${time}</p>`;
            })
            .join("");

          const card = `
              <article class="max-w-md mx-auto shadow-lg border rounded-md mt-12 bg-white">
                <div class="min-w-[15rem]">
                  <img src="../public/images/image.png" loading="lazy" alt="doctor" class="w-full h-48 rounded-t-md" />
                  <div class="pt-3 ml-4 mr-2 mb-3 flex flex-col">
                    <h3 class="text-sm font-bold text-gray-900">${doctor.name}</h3>
                    <span class="text-sm font-semibold text-gray-900">${doctor.speciality}</span>
                    <span class="text-sm font-semibold text-gray-900">Cabinet: ${cabinetName}</span>
                    <div class="mt-2">${scheduleHtml}</div>
                  </div>
                  <div class="flex justify-between m-[1rem]">
                    <div>
                      <button class="text-blue-400 hover:text-blue-600 transition-colors duration-300 pencilBtn" data-doctor-id="${doctor.id}">
                        <img src="../public/assets/icons/pencil.svg" alt="Edit" class="w-4 h-4 hover:w-5 hover:h-5 transition-all duration-300" />
                      </button>
                      <button class="text-red-500 hover:text-red-700 transition-colors duration-300 deleteBtn" data-doctor-id="${doctor.id}">
                        <img src="../public/assets/icons/delete.svg" alt="Delete" class="w-4 h-4 hover:w-5 hover:h-5 transition-all duration-300" />
                      </button>
                    </div>
                
                  </div>
                </div>
              </article>
            `;
          doctorContainer.innerHTML += card;
        }

        addEventListeners();
      };

      const totalItems = doctors.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const paginationContainer = document.getElementById(
        "paginationContainer"
      );

      const updatePaginationUI = () => {
        paginationContainer.innerHTML = `
            <button id="prevBtn" class="text-gray-500 hover:text-blue-600 focus:outline-none ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <span class="text-sm text-gray-700">${currentPage} / ${totalPages}</span>
            <button id="nextBtn" class="text-gray-500 hover:text-blue-600 focus:outline-none ${
              currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
            }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          `;

        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");

        prevBtn.addEventListener("click", () => {
          if (currentPage > 1) {
            currentPage--;
            displayDoctors(currentPage);
            updatePaginationUI();
          }
        });

        nextBtn.addEventListener("click", () => {
          if (currentPage < totalPages) {
            currentPage++;
            displayDoctors(currentPage);
            updatePaginationUI();
          }
        });
      };

      const addEventListeners = () => {
        // Add event listeners for delete buttons
        const deleteBtns = document.querySelectorAll(".deleteBtn");
        deleteBtns.forEach((btn) => {
          btn.addEventListener("click", async () => {
            const doctorId = btn.dataset.doctorId;
            const confirmDelete = window.confirm(
              "Are you sure you want to delete this doctor?"
            );
            if (confirmDelete) {
              try {
                const deleteResponse = await fetch(
                  `http://localhost:8080/api/health/doctors/${doctorId}`,
                  {
                    method: "DELETE",
                  }
                );
                if (deleteResponse.ok) {
                  // If deletion is successful, refresh the page
                  location.reload();
                } else {
                  console.error(
                    "Failed to delete doctor:",
                    await deleteResponse.json()
                  );
                }
              } catch (error) {
                console.error("Error deleting doctor:", error);
              }
            }
          });
        });

        // Add event listeners for edit buttons
        const pencilBtns = document.querySelectorAll(".pencilBtn");
        pencilBtns.forEach((btn) => {
          btn.addEventListener("click", async () => {
            const doctorId = btn.dataset.doctorId;
            try {
              const response = await fetch(
                `http://localhost:8080/api/health/doctors/${doctorId}`
              );
              if (response.ok) {
                const doctorData = await response.json();
                // Redirect to the "new-doctor.ejs" page with prefilled data
                const queryString = Object.keys(doctorData)
                  .map((key) => key + "=" + encodeURIComponent(doctorData[key]))
                  .join("&");
                window.location.href = `/doctor/update-doctor?${queryString}`;
              } else {
                console.error(
                  "Failed to fetch doctor details:",
                  response.status
                );
              }
            } catch (error) {
              console.error("Error fetching doctor details:", error);
            }
          });
        });
      };

      displayDoctors(currentPage);
      updatePaginationUI();
    } else {
      console.error("Failed to fetch doctors:", await response.json());
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
