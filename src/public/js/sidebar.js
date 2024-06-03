document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("default-sidebar");

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("-translate-x-full");
  });

  document.addEventListener("click", function (event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickInsideToggle = sidebarToggle.contains(event.target);

    if (!isClickInsideSidebar && !isClickInsideToggle) {
      sidebar.classList.add("-translate-x-full");
    }
  });
});
