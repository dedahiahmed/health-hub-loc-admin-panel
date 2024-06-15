document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/health/pharmacies/all"
    );
    if (response.ok) {
      const pharmacies = await response.json();
      const pharmacyContainer = document.getElementById("pharmacyContainer");
      const itemsPerPage = 8;
      let currentPage = 1;

      const displayPharmacies = (page) => {
        pharmacyContainer.innerHTML = "";
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedPharmacies = pharmacies.slice(startIndex, endIndex);

        displayedPharmacies.forEach((pharmacy) => {
          const openTonight = pharmacy.openTonight ? "Open" : "Closed";
          const card = `
            <article class="max-w-md mx-auto shadow-lg border rounded-md mt-12 bg-white">
              <div class="min-w-[15rem]">
                <img src="../public/images/image.png" loading="lazy" alt="Pharmacy" class="w-full h-48 rounded-t-md" />
                <div class="pt-3 ml-4 mr-2 mb-3 flex flex-col">
                  <h3 class="text-sm font-bold text-gray-900">${
                    pharmacy.name
                  }</h3>
                  <span class="text-sm font-semibold text-gray-900">${formatEnumValue(
                    pharmacy.willaya
                  )}-${formatEnumValue(pharmacy.moughataa)}</span>
                  <h3 class="text-sm font-bold ${
                    openTonight === "Open" ? "text-green-600" : "text-red-600"
                  }">${openTonight}</h3>
                </div>
                <div class="flex justify-between m-[1rem]">
                  <div>
                    <button class="text-blue-400 hover:text-blue-600 transition-colors duration-300 pencilBtn" data-pharmacy-id="${
                      pharmacy.id
                    }">
                      <img src="../public/assets/icons/pencil.svg" alt="Edit" class="w-4 h-4 hover:w-5 hover:h-5 transition-all duration-300" />
                    </button>
                    <button class="text-red-500 hover:text-red-700 transition-colors duration-300 deleteBtn" data-pharmacy-id="${
                      pharmacy.id
                    }">
                      <img src="../public/assets/icons/delete.svg" alt="Delete" class="w-4 h-4 hover:w-5 hover:h-5 transition-all duration-300" />
                    </button>
                  </div>
                  <div>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${
                      pharmacy.latitude
                    },${
            pharmacy.longitude
          }" target="_blank" class="text-blue-400 hover:text-blue-600 underline transition-colors duration-300">View on map</a>
                  </div>
                </div>
              </div>
            </article>
          `;
          pharmacyContainer.innerHTML += card;
        });
      };

      const totalItems = pharmacies.length;
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
            displayPharmacies(currentPage);
            updatePaginationUI();
          }
        });

        nextBtn.addEventListener("click", () => {
          if (currentPage < totalPages) {
            currentPage++;
            displayPharmacies(currentPage);
            updatePaginationUI();
          }
        });

        // Add event listeners for delete buttons
        const deleteBtns = document.querySelectorAll(".deleteBtn");
        deleteBtns.forEach((btn) => {
          btn.addEventListener("click", async () => {
            const pharmacyId = btn.dataset.pharmacyId;
            const confirmDelete = window.confirm(
              "Are you sure you want to delete this pharmacy?"
            );
            if (confirmDelete) {
              try {
                const deleteResponse = await fetch(
                  `http://localhost:8080/api/health/pharmacies/${pharmacyId}`,
                  {
                    method: "DELETE",
                  }
                );
                if (deleteResponse.ok) {
                  // If deletion is successful, refresh the page
                  location.reload();
                } else {
                  console.error(
                    "Failed to delete pharmacy:",
                    await deleteResponse.json()
                  );
                }
              } catch (error) {
                console.error("Error deleting pharmacy:", error);
              }
            }
          });
        });

        // Add event listeners for edit buttons
        const pencilBtns = document.querySelectorAll(".pencilBtn");
        pencilBtns.forEach((btn) => {
          btn.addEventListener("click", async () => {
            const pharmacyId = btn.dataset.pharmacyId;
            try {
              const response = await fetch(
                `http://localhost:8080/api/health/pharmacies/${pharmacyId}`
              );
              if (response.ok) {
                const pharmacyData = await response.json();
                // Redirect to the edit page with prefilled data
                const queryString = Object.keys(pharmacyData)
                  .map((key) => key + "=" + pharmacyData[key])
                  .join("&");
                window.location.href = `/pharmacy/update-pharmacy?${queryString}`;
              } else {
                console.error(
                  "Failed to fetch pharmacy details:",
                  response.status
                );
              }
            } catch (error) {
              console.error("Error fetching pharmacy details:", error);
            }
          });
        });
      };

      displayPharmacies(currentPage);
      updatePaginationUI();
    } else {
      console.error("Failed to fetch pharmacies:", await response.json());
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

function formatEnumValue(value) {
  return value
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/(?:^|-)([a-z])/g, (_, c) => c.toUpperCase());
}
