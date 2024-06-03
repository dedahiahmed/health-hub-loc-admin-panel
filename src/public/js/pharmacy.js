document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:8080/api/health/pharmacies");

    if (response.ok) {
      const pharmacies = await response.json();
      const pharmacyContainer = document.getElementById("pharmacyContainer");

      pharmacies.forEach((pharmacy) => {
        const card = `
                      <section class="mt-12 mx-auto px-4 max-w-screen-xl md:px-8">
                          <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              <!-- Card Component -->
                              <article class="max-w-md mx-auto mt-4 shadow-lg border rounded-md">
                                  <div class="min-w-[15rem]">
                                      <img src="https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" loading="lazy" alt="What is SaaS? Software as a Service Explained" class="w-full h-48 rounded-t-md" />
                                      <div class="flex items-center pt-3 ml-4 mr-2"></div>
                                      <div class="pt-3 ml-4 mr-2 mb-3">
                                          <h3 class="text-sm font-bold text-gray-900">${pharmacy.name}</h3>
                                      </div>
                                      <div class="flex justify-between m-[1rem]">
                                          <style>
                                              .icon-btn img {
                                                  width: 16px;
                                                  height: 16px;
                                                  transition: width 0.3s, height 0.3s;
                                              }
                                              .icon-btn:hover img {
                                                  width: 20px;
                                                  height: 20px;
                                              }
                                          </style>
                                          <div>
                                              <button class="text-blue-400 icon-btn">
                                                  <img src="../public/assets/icons/pencil.svg" />
                                              </button>
                                              <button class="text-red-500 icon-btn">
                                                  <img src="../public/assets/icons/delete.svg" />
                                              </button>
                                          </div>
                                          <div>
                                              <a href="https://www.google.com/maps/dir/?api=1&destination=${pharmacy.longitude},${pharmacy.latitude}" target="_blank" class="underline text-blue-400">voir map</a>
                                          </div>
                                      </div>
                                  </div>
                              </article>
                          </div>
                      </section>
                  `;
        pharmacyContainer.innerHTML += card;
      });
    } else {
      console.error("Failed to fetch pharmacies:", await response.json());
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
