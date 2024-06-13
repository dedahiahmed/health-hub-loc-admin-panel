document.addEventListener("DOMContentLoaded", () => {
    // Parse the query string parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
  
    // Get references to the input fields
    const nomInput = document.querySelector('input[name="nom"]');
    const willayaInput = document.querySelector('input[name="willaya"]');
    const moughataaInput = document.querySelector('input[name="moughataa"]');
    const latitudeInput = document.querySelector('input[name="latitude"]');
    const longitudeInput = document.querySelector('input[name="longitude"]');
    const doctorsInput = document.querySelector('input[name="doctors"]');
  
    // Set the input values from the query parameters
    nomInput.value = urlParams.get("nom") || "";
    willayaInput.value = urlParams.get("willaya") || "";
    moughataaInput.value = urlParams.get("moughataa") || "";
    latitudeInput.value = urlParams.get("latitude") || "";
    longitudeInput.value = urlParams.get("longitude") || "";
    doctorsInput.value = urlParams.get("doctors") || "";
  });
  