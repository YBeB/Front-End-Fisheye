// Je créer une fonction qui fait appel a mon json avec un fetch
async function getPhotographers() {
  const url = "/data/photographers.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Impossible de chargé les données");
    }
    const data = await response.json();
    return data.photographers;
  } catch (error) {
    console.error("Une erreur est survenue lors du chargement du JSON", error);
    return [];
  }
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  try {
    const photographers = await getPhotographers();
    if (photographers.length > 0) {
      displayData(photographers);
    }
  } catch (error) {
    console.error("Failed to initialize data", error);
  }
}

init();
