document.addEventListener("DOMContentLoaded", () => {
  // Parse the query string parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Get references to the input fields
  const nameInput = document.querySelector('input[name="name"]');
  const willayaInput = document.querySelector('input[name="willaya"]');
  const moughataaInput = document.querySelector('input[name="moughataa"]');
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
  isOpenTonightSelect.value = urlParams.get("isOpenTonight") || "";
});
